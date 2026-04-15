// src/testEventBus.js

async function testEventBus() {
    const transactions = [
        { amount: 5.00, type: 'debit', description: 'Bought Coffee' },
        { amount: 1200.00, type: 'debit', description: 'Bought Apple iPhone 15' },
        { amount: 25000.00, type: 'debit', description: 'Bought Hyundai Car' },
        { amount: 2.50, type: 'debit', description: 'Lays Chips Packet' },
        { amount: 15000000.00, type: 'debit', description: 'Bought Private Jet' }
    ];

    console.log("⏳ Simulating 5 different dynamic purchases across the SuperApp...\n");
    
    for (const tx of transactions) {
        // Formats large numbers cleanly with commas, e.g., '15,000,000'
        console.log(`🛒 User is buying: ${tx.description} for $${tx.amount.toLocaleString()}...`);
        
        try {
            const response = await fetch('https://fintechapp-cljw.onrender.com/transaction', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user_id: 1, 
                    amount: tx.amount,
                    type: tx.type,
                    description: tx.description
                })
            });

            // Wait 1.5 seconds between transactions so you can easily read the terminal logs
            await new Promise(resolve => setTimeout(resolve, 1500)); 
            console.log("----------------------------------------------------------------");
        } catch (error) {
            console.error("\n❌ Could not connect. Is your server running (`npm run dev`)?");
            return;
        }
    }
    
    console.log("\n✅ All purchases sent! Scroll up your Server Terminal to see how the Workers reacted uniquely to each item! 🚀");
}

testEventBus();
