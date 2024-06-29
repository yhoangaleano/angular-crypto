import { Component } from '@angular/core';
import * as sha256 from 'fast-sha256';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  aesSecr: string = 'VUYhbiNRZSlqRDUu';
  rndValue: string = '76667677668678867';

  formData: string = 'Hello';
  response: string;

  encrypted: any = '';
  decrypted: string;

  secret: string = 'admin123456';
  userEmail: string = 'yhoangaleano@gmail.com';
  decipherText: string;
  encryptedAES: any = '';
  decryptedAES: string;

  constructor() {
    this.encryptUsingAES256();
  }

  encryptUsingAES256() {
    let _key = new TextEncoder().encode(atob(this.aesSecr));
    let salt = new TextEncoder().encode(this.rndValue);

    let key256Bits = sha256.pbkdf2(_key, salt, 65536, 256).toString();

    //let _iv = "0000000000000000";
    let _iv = CryptoJS.lib.WordArray.random(16).toString();
    let encrypted = CryptoJS.AES.encrypt(this.formData, key256Bits, {
      iv: _iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });
    this.encrypted = btoa(encrypted.toString());
  }
  decryptUsingAES256() {
    let _key = new TextEncoder().encode(atob(this.aesSecr));
    let salt = new TextEncoder().encode(this.rndValue);

    let key256Bits = sha256.pbkdf2(_key, salt, 65536, 256).toString();

    //let _iv = "0000000000000000";
    let _iv = CryptoJS.lib.WordArray.random(16).toString();
    this.decrypted = CryptoJS.AES.decrypt(atob(this.response), key256Bits, {
      iv: _iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    }).toString(CryptoJS.enc.Utf8);
  }

  public encryptUsingAES() {
    this.encryptedAES = this.cipherStringToAES(this.userEmail, this.secret);
  }

  public decryptUsingAES() {
    this.decryptedAES = this.decipherAESToString(
      this.decipherText,
      this.secret
    );
  }

  private cipherStringToAES(text: string, secret: string): string | undefined {
    if (!text || !secret) {
      return undefined;
    }
    const _key = new TextEncoder().encode(atob(secret.trim()));
    const encrypted = CryptoJS.AES.encrypt(
      text.trim(),
      _key.toString()
    ).toString();
    return btoa(encrypted.toString());
  }

  private decipherAESToString(
    text: string,
    secret: string
  ): string | undefined {
    if (!text || !secret) {
      return undefined;
    }
    const key = new TextEncoder().encode(atob(secret.trim())).toString();
    return CryptoJS.AES.decrypt(atob(text.trim()), key).toString(
      CryptoJS.enc.Utf8
    );
  }
}
