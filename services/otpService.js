import CoolSMS from 'coolsms-node-sdk';
import { config } from '../config.js';

// const messageService = new coolSMS(config.coolsms.apiKey, config.coolsms.apiSecret);

const otpStorage = {};

export function generateRandomCode(length) {
    let otp = '';
    const chars = '0123456789';

    for (let i = 0; i < length; i++) {
        otp += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return otp;
};

export function sendSMS(hp, otp) {
    const myMessage = CoolSMS.default;
    const messageService = new myMessage(config.coolsms.apiKey, config.coolsms.apiSecret);

    return messageService.sendOne({
        to: hp, 
        from: '01049457628',
        text: `인증번호는 [${otp}] 입니다.`
    });
};

export function saveOTP(hp, otp) {
    otpStorage[hp] = otp;
};

export function verifyOTP(hp, userOtp) {
    return otpStorage[hp] === userOtp;
};

export function deleteOTP(hp) {
    delete otpStorage[hp];
};

export default { generateRandomCode, sendSMS, saveOTP, verifyOTP, deleteOTP };