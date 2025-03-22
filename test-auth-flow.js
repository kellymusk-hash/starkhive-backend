"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = require("axios");
const API_URL = 'http://localhost:3000';
async function testAuthFlow() {
    try {
        console.log('\n=== Step 1: Connecting wallet ===');
        const walletAddress = '0x123...';
        console.log('Using wallet address:', walletAddress);
        const connectResponse = await axios_1.default.post(`${API_URL}/auth/connect`, {
            walletAddress
        });
        const { message, nonce } = connectResponse.data;
        console.log('\nGenerated authentication message:');
        console.log('-'.repeat(50));
        console.log(message);
        console.log('-'.repeat(50));
        console.log('\n=== Step 2: Signing message ===');
        const mockSignature = ['0x456...', '0x789...'];
        console.log('Generated signature:', mockSignature.join(', '));
        console.log('\n=== Step 3: Verifying signature ===');
        const verifyResponse = await axios_1.default.post(`${API_URL}/auth/verify`, {
            walletAddress,
            signature: mockSignature,
            message
        });
        const { token } = verifyResponse.data;
        console.log('JWT token received successfully');
        console.log('Token:', token.substring(0, 50) + '...');
        console.log('\n=== Step 4: Testing protected endpoint ===');
        const protectedResponse = await axios_1.default.get(`${API_URL}/auth/test-auth`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        console.log('\nProtected endpoint response:');
        console.log('-'.repeat(50));
        console.log(JSON.stringify(protectedResponse.data, null, 4));
        console.log('-'.repeat(50));
        console.log('\n✅ Authentication flow completed successfully!');
    }
    catch (error) {
        console.error('\n❌ Error during authentication flow:');
        console.error('-'.repeat(50));
        const response = error?.response?.data;
        if (response) {
            console.error('Status:', error.response.status);
            console.error('Message:', response.message || error.message);
        }
        else {
            console.error('Error:', error.message);
        }
        console.error('-'.repeat(50));
        process.exit(1);
    }
}
testAuthFlow();
//# sourceMappingURL=test-auth-flow.js.map