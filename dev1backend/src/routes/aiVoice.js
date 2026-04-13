const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } = require('@google/generative-ai');

// Fix for new yahoo-finance2 version
const YahooFinance = require('yahoo-finance2').default;
const yahooFinance = new YahooFinance();

// Initialise Gemini client using the API key stored in .env
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const safetySettings = [
    { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
    { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
    { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
    { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE }
];

module.exports = (pool) => {
    // -------------------------------------------------
    // POST /api/voice/ask
    // -------------------------------------------------
    // Expected body:
    // {
    //   mode: "present" | "past",
    //   spoken_text: "Why did my stock fall?",
    //   stock_symbol: "TATAMOTORS.NS"
    // }
    router.post('/ask', async (req, res) => {
        try {
            const { spoken_text, stock_symbol, preferred_language = 'en-US' } = req.body;
            let marketContext = '';

            // ---------- 1️⃣ Pure Voice NLU (Multi-Entity JSON Extraction) ----------
            const extractionModel = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-lite', safetySettings });
            const extractPrompt = `Extract ALL companies, stock names, or financial entities the user is asking about. Return ONLY a valid JSON array of strings containing the company names (e.g. ["Netflix", "LG Electronics"]). EVEN IF the user also asks for general financial advice, YOU MUST STILL EXTRACT any companies they explicitly mention. If absolutely NO companies are mentioned anywhere, return []. Do not return any other text. MUST NOT FAIL AND MUST ALWAYS RETURN AN ARRAY.\n\nUser spoken text: "${spoken_text}"`;
            let companies = [];
            try {
                const extractResult = await extractionModel.generateContent(extractPrompt);
                let jsonStr = extractResult.response.text().trim();
                if (jsonStr.startsWith("```json")) jsonStr = jsonStr.replace(/```json|```/g, "").trim();
                else if (jsonStr.startsWith("```")) jsonStr = jsonStr.replace(/```/g, "").trim();
                companies = JSON.parse(jsonStr);
            } catch (e) {
                console.log("Extraction NLU bypassed (Safety/Parsing):", e.message);
            }

            // ---------- 2️⃣ Multi-Stock Market Data (RAG) ----------
            let marketContextArray = [];
            if (companies.length > 0) {
                try {
                    const exchangeRateData = await yahooFinance.quote('INR=X'); // 1 USD = X INR
                    const usdToInrRate = exchangeRateData.regularMarketPrice;

                    for (let company of companies) {
                        try {
                            const searchRes = await yahooFinance.search(company);
                            if (searchRes && searchRes.quotes && searchRes.quotes.length > 0) {
                                const realSymbol = searchRes.quotes[0].symbol;
                                const quote = await yahooFinance.quote(realSymbol);
                                
                                let priceInr, priceUsd;
                                if (quote.currency === 'INR') {
                                    priceInr = quote.regularMarketPrice.toFixed(2);
                                    priceUsd = (quote.regularMarketPrice / usdToInrRate).toFixed(2);
                                } else if (quote.currency === 'USD') {
                                    priceUsd = quote.regularMarketPrice.toFixed(2);
                                    priceInr = (quote.regularMarketPrice * usdToInrRate).toFixed(2);
                                } else {
                                    // Dynamic fallback for any other global currency (e.g., KRW, EUR, GBP)
                                    try {
                                        const toInr = await yahooFinance.quote(`${quote.currency}INR=X`);
                                        const toUsd = await yahooFinance.quote(`${quote.currency}USD=X`);
                                        priceInr = (quote.regularMarketPrice * toInr.regularMarketPrice).toFixed(2);
                                        priceUsd = (quote.regularMarketPrice * toUsd.regularMarketPrice).toFixed(2);
                                    } catch (e) {
                                        priceInr = quote.regularMarketPrice.toFixed(2) + ` ${quote.currency}`;
                                        priceUsd = "N/A";
                                    }
                                }
                                marketContextArray.push(`Company: ${quote.shortName || realSymbol} | Single Share Price: ₹${priceInr} INR ($${priceUsd} USD) | Market State: ${quote.marketState}.`);
                            }
                        } catch (e) {
                            marketContextArray.push(`Could not fetch data for ${company}.`);
                        }
                    }
                } catch (e) {
                    console.log('Error fetching base exchange rate:', e.message);
                }
            }

            marketContext = marketContextArray.length > 0 
                ? `Live Financial Data Retrieved:\n` + marketContextArray.join('\n') 
                : `No specific stock data pulled. Provide general educational guidance.`;

            // ---------- 3️⃣ Universal Omniscient AI Persona ----------
            // The AI acts as BOTH the dashboard advisor and the sandbox tutor simultaneously based on context!
            const systemPrompt = `You are a top-tier Quantitative Financial AI Advisor, built for a Gen-Z SuperApp. 
The user's spoken input is: "${spoken_text}".
INSTRUCTIONS:
1. QUANTITATIVE, NOT STORIES: When advising a user on an investment strategy (e.g. investing 2 lakh rupees), DO NOT act friendly, use conversational filler, or write storytelling essays (e.g. no "Hey there!"). Output direct, highly professional, conceptual math. Break it down strictly by quantitative numbers and logical allocations (e.g. invest 50k here for X reason). You are speaking to an investor who expects straight numbers and high-level strategy.
2. LIVE MARKETS: If the user asks for a company's price and it is provided in "Market data" below, you MUST state the exact price precisely in both INR and USD.
3. If "Market data" is empty but they asked for a stock, inform them their query couldn't connect, then firmly answer their strategic questions conceptually.
4. TEXT-TO-SPEECH (TTS) RULES: Speak perfectly in strict, robust ENGLISH. CRITICAL: NEVER output an asterisk (*) character explicitly. DO NOT use markdown. DO NOT write long generic paragraphs; keep sentences firm, concise, analytical, and spoken without unnatural pauses or bullet points so it reads flawlessly via voice.

Market data: ${marketContext}`;

            // ---------- 4️⃣ Gemini LLM ----------
            const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-lite', safetySettings });
            let aiResponse = "I apologize, but I couldn't process that specific financial query at this moment.";
            try {
                const result = await model.generateContent(systemPrompt);
                let rawText = result.response.text();
                // Destroy any remaining asterisks that cause TTS stuttering
                aiResponse = rawText.replace(/\*/g, ''); 
            } catch (safeguardError) {
                console.error("Gemini Generation Error:", safeguardError.message);
                aiResponse = "I have analyzed your query but hit a complex processing layer. As an AI financial advisor, please rephrase your investment strategy questions slightly.";
            }

            // ---------- 5️⃣ Return ----------
            res.json({ success: true, answer: aiResponse });
        } catch (err) {
            console.error('AI Voice error:', err);
            res.status(500).json({ success: false, error: 'Failed to process voice request.', details: err.message, stack: err.stack });
        }
    });

    return router;
};
