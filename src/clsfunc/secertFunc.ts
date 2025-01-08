import * as CryptoJS from 'crypto-js';

const getKeyBuffer = () => {
    const SECRET_KEY = process.env.SEND_DATA_SECRET_KEY;
    return CryptoJS.SHA256(SECRET_KEY);
};

export const encrypt = (data: any): string => {
    const jsonData = JSON.stringify(data);
    const iv = CryptoJS.lib.WordArray.random(16);
    const encrypted = CryptoJS.AES.encrypt(jsonData, getKeyBuffer(), { iv: iv });
    return iv.toString() + ':' + encrypted.toString();
};

export const decrypt = <T>(encrypted: string): T => {
    const parts = encrypted.split(':');
    const iv = CryptoJS.enc.Hex.parse(parts[0]);
    const encryptedData = parts[1];
    try {
        const decrypted = CryptoJS.AES.decrypt(encryptedData, getKeyBuffer(), { iv: iv });
        const data = decrypted.toString(CryptoJS.enc.Utf8);

        return JSON.parse(data) as T;
    } catch (error) {
        console.error('Decryption error:', error);
        throw new Error('Decryption failed: ' + error);
    }
}