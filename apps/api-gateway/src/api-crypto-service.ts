import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

@Injectable()
export class ApiCryptoService {
    private readonly algorithm = 'aes-256-cbc';
    private readonly key: Buffer;
  
    constructor() {
      // Use ENCRYPTION_PASSWORD from the environment or a default value.
      const password = process.env.X_ACCESS_TOKEN_ENCRYPTION_PASSWORD;
      // Derive a 32-byte key from the password (ensure you use a secure salt in production).
      this.key = crypto.scryptSync(password, 'salt', 32);
    }


    /**
   * Encrypts a given string.
   * @param text - The plaintext to encrypt.
   * @returns The IV and encrypted text combined.
   */
    encrypt(text: string): string {
        // Generate a random Initialization Vector (IV)
        const iv = crypto.randomBytes(16);
        const cipher = crypto.createCipheriv(this.algorithm, this.key, iv);
        let encrypted = cipher.update(text, 'utf8', 'hex');
        encrypted += cipher.final('hex');
        // Combine the IV and the encrypted text so that it can be used in decryption.
        return `${iv.toString('hex')}:${encrypted}`;
    }

    /**
     * Decrypts a given string.
     * @param data - The combined IV and encrypted text.
     * @returns The decrypted plaintext.
     */
    decrypt(data: string): string {

        try {
            const [ivHex, encrypted] = data.split(':');
            const iv = Buffer.from(ivHex, 'hex');
            const decipher = crypto.createDecipheriv(this.algorithm, this.key, iv);
            let decrypted = decipher.update(encrypted, 'hex', 'utf8');
            decrypted += decipher.final('utf8');
            return decrypted;
        } catch (error) {
            return null;
        }
    }
}
