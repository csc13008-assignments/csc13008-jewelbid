export interface TokenValidationRequest {
    idToken: string;
}

export interface TokenValidationResponse {
    users: Array<{
        localId: string;
        email: string;
        emailVerified: boolean;
        displayName: string;
        providerUserInfo: any[];
        photoUrl: string;
        passwordHash: string;
        passwordUpdatedAt: number;
        validSince: string;
        disabled: boolean;
        lastLoginAt: string;
        createdAt: string;
        customAuth: boolean;
    }>;
}

export interface ValidatedTokenPayload {
    firebaseUid: string;
    email?: string;
    emailVerified?: boolean;
    displayName?: string;
    photoUrl?: string;
}
