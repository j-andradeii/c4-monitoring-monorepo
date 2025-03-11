import { Injectable } from '@angular/core';
import * as scrypt from 'scrypt-js';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CryptoService {
  private readonly algorithm = 'AES-CBC';
  private keyPromise: Promise<CryptoKey>;
  

  constructor() {
    this.init();
  }
  
  private async init() {
    const password = environment.X_ACCESS_TOKEN_PASSWORD; // Set this in your environment.ts
    this.keyPromise = this.deriveKey(password);
  }

  private async deriveKey(password: string): Promise<CryptoKey> {
    const salt = new TextEncoder().encode('salt'); // Must match NestJS salt
    const keyBuffer = await new Promise<Uint8Array>((resolve, reject) => {
      scrypt.scrypt(
        new TextEncoder().encode(password),
        salt,
        1024, // N parameter
        8,     // r parameter
        1,     // p parameter
        32,    // key length
        (progress) => {
          // Handle progress updates if needed
        }
      ).then(resolve).catch(reject);
    });
  
    return crypto.subtle.importKey(
      'raw',
      keyBuffer,
      { name: this.algorithm },
      false,
      ['encrypt', 'decrypt']
    );
  }


  async encrypt(text: string): Promise<string> {
    const key = await this.keyPromise;
    const iv = crypto.getRandomValues(new Uint8Array(16));
    
    const encrypted = await crypto.subtle.encrypt(
      { name: this.algorithm, iv },
      key,
      new TextEncoder().encode(text)
    );

    return `${this.toHex(iv)}:${this.toHex(new Uint8Array(encrypted))}`;
  }

  async decrypt(data: string): Promise<string | null> {
    try {
      const key = await this.keyPromise;
      const [ivHex, encryptedHex] = data.split(':');
      const iv = this.fromHex(ivHex);
      const encrypted = this.fromHex(encryptedHex);

      const decrypted = await crypto.subtle.decrypt(
        { name: this.algorithm, iv },
        key,
        encrypted
      );

      return new TextDecoder().decode(decrypted);
    } catch (error) {
      return null;
    }
  }

  private toHex(buffer: ArrayBuffer | Uint8Array): string {
    return Array.from(new Uint8Array(buffer))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  }

  private fromHex(hex: string): Uint8Array {
    return new Uint8Array(
      hex.match(/[\da-f]{2}/gi)?.map(h => parseInt(h, 16)) || []
    );
  }
}