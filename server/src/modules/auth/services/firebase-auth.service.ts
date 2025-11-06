import {
    Injectable,
    UnauthorizedException,
    Logger,
    OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as admin from 'firebase-admin';

@Injectable()
export class FirebaseAuthService implements OnModuleInit {
    private readonly logger = new Logger(FirebaseAuthService.name);

    constructor(private configService: ConfigService) {}

    onModuleInit() {
        this.initializeFirebase();
    }

    private initializeFirebase() {
        try {
            if (admin.apps.length > 0) {
                this.logger.log('Firebase Admin SDK already initialized');
                return;
            }

            const serviceAccountPath = this.configService.get<string>(
                'FIREBASE_SERVICE_ACCOUNT_PATH',
            );
            let credential;

            if (serviceAccountPath) {
                credential = admin.credential.cert(serviceAccountPath);
            } else {
                throw new Error('FIREBASE_SERVICE_ACCOUNT_PATH is not set');
            }

            admin.initializeApp({
                credential,
                projectId: this.configService.get<string>(
                    'FIREBASE_PROJECT_ID',
                ),
            });

            this.logger.log('Firebase Admin SDK initialized successfully');
        } catch (error) {
            this.logger.error(
                'Failed to initialize Firebase Admin SDK:',
                error,
            );
            throw error;
        }
    }

    async verifyIdToken(idToken: string): Promise<admin.auth.DecodedIdToken> {
        try {
            const decodedToken = await admin.auth().verifyIdToken(idToken);
            this.logger.log(`Token verified for user: ${decodedToken.uid}`);
            return decodedToken;
        } catch (error) {
            this.logger.error('Firebase token verification failed:', error);
            throw new UnauthorizedException('Invalid Firebase token');
        }
    }

    async createUser(
        userProperties: admin.auth.CreateRequest,
    ): Promise<admin.auth.UserRecord> {
        try {
            const userRecord = await admin.auth().createUser(userProperties);
            this.logger.log(`Firebase user created: ${userRecord.uid}`);
            return userRecord;
        } catch (error) {
            this.logger.error('Failed to create Firebase user:', error);
            throw error;
        }
    }

    async getUserByUid(uid: string): Promise<admin.auth.UserRecord> {
        try {
            const userRecord = await admin.auth().getUser(uid);
            return userRecord;
        } catch (error) {
            this.logger.error(`Failed to get Firebase user ${uid}:`, error);
            throw new UnauthorizedException('Firebase user not found');
        }
    }

    async getUserByEmail(email: string): Promise<admin.auth.UserRecord> {
        try {
            const userRecord = await admin.auth().getUserByEmail(email);
            return userRecord;
        } catch (error) {
            this.logger.error(
                `Failed to get Firebase user by email ${email}:`,
                error,
            );
            throw new UnauthorizedException('Firebase user not found');
        }
    }

    async setCustomUserClaims(uid: string, claims: object): Promise<void> {
        try {
            await admin.auth().setCustomUserClaims(uid, claims);
            this.logger.log(`Custom claims set for user ${uid}`);
        } catch (error) {
            this.logger.error(`Failed to set custom claims for ${uid}:`, error);
            throw error;
        }
    }

    async deleteUser(uid: string): Promise<void> {
        try {
            await admin.auth().deleteUser(uid);
            this.logger.log(`Firebase user deleted: ${uid}`);
        } catch (error) {
            this.logger.error(`Failed to delete Firebase user ${uid}:`, error);
            throw error;
        }
    }

    async generateCustomToken(
        uid: string,
        additionalClaims?: object,
    ): Promise<string> {
        try {
            const customToken = await admin
                .auth()
                .createCustomToken(uid, additionalClaims);
            return customToken;
        } catch (error) {
            this.logger.error(
                `Failed to generate custom token for ${uid}:`,
                error,
            );
            throw error;
        }
    }

    async revokeRefreshTokens(uid: string): Promise<void> {
        try {
            await admin.auth().revokeRefreshTokens(uid);
            this.logger.log(
                `Revoked all refresh tokens for Firebase user: ${uid}`,
            );
        } catch (error) {
            this.logger.error(
                `Failed to revoke refresh tokens for Firebase user ${uid}:`,
                error,
            );
            throw error;
        }
    }

    extractUserInfo(decodedToken: admin.auth.DecodedIdToken) {
        return {
            uid: decodedToken.uid,
            email: decodedToken.email,
            emailVerified: decodedToken.email_verified || false,
            name: decodedToken.name,
            picture: decodedToken.picture,
            phoneNumber: decodedToken.phone_number,
            provider: this.determineProvider(decodedToken),
            customClaims: decodedToken,
        };
    }

    private determineProvider(decodedToken: admin.auth.DecodedIdToken): string {
        if (decodedToken.firebase?.sign_in_provider) {
            return decodedToken.firebase.sign_in_provider;
        }

        // Check provider data
        if (decodedToken.firebase?.identities) {
            const identities = decodedToken.firebase.identities;
            if (identities['google.com']) return 'google.com';
            if (identities['facebook.com']) return 'facebook.com';
        }

        return 'firebase';
    }
}
