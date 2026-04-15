// src/testAuth.js
// A simple script to test our new Registration system without needing Postman!

async function testRegistration() {
    console.log("⏳ Testing User Registration...");
    
    try {
        const response = await fetch('https://fintechapp-cljw.onrender.com/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: 'hacker1@example.com',
                password: 'superstrongpassword'
            })
        });

        const data = await response.json();
        
        if (response.ok) {
            console.log("\n✅ SUCCESS! Here is the server response:");
            console.log(data);
            console.log("\n🎟️ Notice the 'token' above? That is your JWT! Authentication works!");
        } else {
            console.log("\n❌ FAILED. The server said:");
            console.log(data);
        }
    } catch (error) {
        console.error("\n❌ Could not connect. Is the Render server awake? Try again or check onrender.com.");
    }
}

testRegistration();
