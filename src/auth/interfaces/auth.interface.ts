export interface AuthMessage {
    message: string;
    nonce: string;
}

export interface AuthToken {
    token: string;
}

export interface AuthTestResponse {
    message: string;
    walletAddress: string;
}
