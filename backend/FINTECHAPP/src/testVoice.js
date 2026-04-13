// testVoice.js
async function testVoiceAgent() {
    const defaultSymbol = "RELIANCE.NS";
    console.log(`🗣️  Asking the AI Voice Agent about ${defaultSymbol}...`);

    try {
        const response = await fetch('http://localhost:3000/api/voice/ask', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                mode: "present",
                spoken_text: "What is Reliance Industries doing today?",
                stock_symbol: "RELIANCE.NS"
            })
        });

        const data = await response.json();
        
        console.log("\n==================================================");
        console.log("🤖 AI AGENT SAYS:");
        console.log("==================================================");
        console.log(data.answer || data);
        console.log("==================================================\n");

    } catch (error) {
        console.error("❌ Failed to connect. Make sure your server is running with 'npm run dev'!");
    }
}

testVoiceAgent();
