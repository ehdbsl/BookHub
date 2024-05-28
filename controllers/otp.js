import path from "path";
import { fileURLToPath } from 'url';
import otpService from "../services/otpService.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function renderSignup(req, res) {
    res.sendFile(path.join(__dirname, "../public", "signup.html"));
};

export function sendOTP(req, res) {
    const hp = req.body.hp;
    // console.log(hp); 테스트완료
    const otp = otpService.generateRandomCode(6);

    otpService.sendSMS(hp, otp)
        .then(() => {
            otpService.saveOTP(hp, otp);
            res.status(200).json({ message: "OTP 전송 성공" });
        })
        .catch((error) => {
            console.error(error);
            res.status(500).json({ message: "서버 에러" });
        });
};

export function verifyOTP(req, res) {
    const hp = req.body.hp;
    const userOtp = req.body.otp;

    if (!otpService.verifyOTP(hp, userOtp)) {
        return res.status(400).json({ message: "OTP 인증 실패" });
    }

    res.status(200).json({ message: "OTP 인증 성공" });
    otpService.deleteOTP(hp);
};
