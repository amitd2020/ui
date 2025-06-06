import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';


@Injectable({
    providedIn: 'root'
})
export class EncrDecrService {
    value = 'SeCuRe!/*.%,#3@+__EnCrYpTiOn_KeY';

    constructor() { }

    // The set method is use for encrypt the value.
    set(data) {
        let key = CryptoJS.enc.Utf8.parse(this.value);
        let iv = CryptoJS.enc.Utf8.parse(this.value);
        let encrypted = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(data.toString()), this.value,
            {
                keySize: 128 / 8,
                iv: iv,
                mode: CryptoJS.mode.CBC,
                padding: CryptoJS.pad.Pkcs7
            });
        return encrypted.toString();
    }


    // The get method is use for decrypt the value.
    get(data) {
        let key = CryptoJS.enc.Utf8.parse(this.value);
        let iv = CryptoJS.enc.Utf8.parse(this.value);
        let decrypted = CryptoJS.AES.decrypt(data, this.value, {
            keySize: 128 / 8,
            iv: iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        });

        return decrypted.toString(CryptoJS.enc.Utf8);
    }
}
