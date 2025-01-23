import * as authRepository from '../models/auth.js';
import User from '../models/auth.js';
import * as bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { config } from '../config.js';
import { sendOTP, verifyOTP } from './otp.js';


function createJwtToken(userid) {
    return jwt.sign({ userid }, config.jwt.secretKey, { expiresIn: config.jwt.expiresInsec });
}
// ----------------------------------------------------------------------------------------------------------------
export async function register(req, res, next) {
    const { userid, userpw, name, hp, email, ssn, address } = req.body;

    const found = await authRepository.findByuserid(userid);
    if (found) {
        return res.status(409).json({ message: `${userid}은 이미 사용중인 아이디입니다.` });
    }

    try {
        const hashedPassword = await bcrypt.hash(userpw, config.bcrypt.saltRounds);
        
        const user = new User({ userid, userpw: hashedPassword, name, hp, email, ssn, address });
        await user.save();
        
        console.log('회원가입 성공!');
        res.status(200).json({ success: true }); // createJwtToken(userid)?
    } catch (error) {
        console.error('비밀번호 해싱 오류: ', error);
        res.status(500).json({ error: '비밀번호 해싱 실패' });
    }
};

// ----------------------------------------------------------------------------------------------------------------
export async function login(req, res) {
    const { userid, userpw } = req.body;
    const user = await authRepository.findByuserid(userid);
    console.log(user);

    if (!user) {
        return res.status(401).json({ message: '아이디를 찾을 수 없습니다.' });
    }

    const isValidPassword = bcrypt.compareSync(userpw, user.userpw);
    if (!isValidPassword) {
        return res.status(401).json({ message: '아이디 또는 비밀번호 오류입니다.' });
    }

    const token = createJwtToken(userid);
    res.status(200).json({ token, userid });
}

// ----------------------------------------------------------------------------------------------------------------
export async function me(req, res, next) {
    const user = await authRepository.findByuserid(req.userid);
    console.log('user:', user);
    if (!user) {
        return res.status(404).json({message: `일치하는 사용자가 없음`});

    }
    res.status(200).json({token: req.token, userid: user.userid});
}
// ----------------------------------------------------------------------------------------------------------------
export async function getUserInfo(req, res, next) {
    const userId = req.query.userid;
    console.log(userId)
    if (!userId) {
        return res.status(400).json({ message: 'user id가 필요합니다.' });
    }

    try {
        const userData = await authRepository.getUserById(userId);
        console.log(userData)
        if (!userData) {
            return res.status(404).json({ message: '일치하는 사용자가 없음' });
        }
        res.status(200).json(userData);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: '서버 에러' });
    }
}
// ----------------------------------------------------------------------------------------------------------------
export async function findUser(req, res, next) {
    const { name, hp } = req.body;
    console.log(name, hp);
    if (!name || !hp) {
        return res.status(400).json({ message: 'name, hp가 필요합니다.' });
    }

    try {
        const userId = await authRepository.findUser(name, hp);
        if (!userId) {
            return res.status(404).json({ message: '일치하는 사용자가 없음' });
        }
        res.status(200).json({ userid: userId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: '서버 에러' });
    }
}
// ----------------------------------------------------------------------------------------------------------------
export async function updateUserInfo(req, res, next) {
    // checkPassword(req, res, next);
    // if (!checkPassword) {
    //     return res.status(400).json({ message: '비밀번호가 일치하지 않습니다.' });
    // }

    const userId = req.body.userid;
    const newData = { ...req.body };

    if (!userId) {
        return res.status(400).json({ message: 'update error: userId가 필요합니다.' });
    }
    if (newData.userpw) {
        newData.userpw = await bcrypt.hash(newData.userpw, config.bcrypt.saltRounds);
    }

    try {
        const updatedUserData = await authRepository.updateUser(userId, newData);
        console.log(updatedUserData);
        res.json(updatedUserData);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: '서버 에러' });
    }
}
// ----------------------------------------------------------------------------------------------------------------
export async function resetPassword(req, res, next) {
    const userId = req.body.userid;
    const hp = req.body.hp;
    const newPassword = req.body.newPassword;
    const otp = req.body.otp;

    try {
        // sendOTP(hp, otp);
        const isOtpValid = await verifyOTP(hp, otp);
        console.log('hp, otp: ', hp, otp);
        if (!isOtpValid) {
            return res.status(400).json({ message: 'OTP 인증 실패' });
        };
        const hashedPassword = await bcrypt.hash(newPassword, config.bcrypt.saltRounds);
        await authRepository.updateUserPassword(userId, { userpw: hashedPassword });
        console.log('hashed pw: ', hashedPassword);
        res.status(200).json({ message: '비밀번호 변경 성공' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: '서버 에러' });
    };

};
// ----------------------------------------------------------------------------------------------------------------
export async function logout(req, res, next) {
    res.clearCookie('token');
    res.status(200).json({ message: '로그아웃 성공' });
}
// ----------------------------------------------------------------------------------------------------------------
// export async function deleteUser(req, res, next) {
//     const userId = req.body.userid;
//     if (!userId) {
//         return res.status(400).json({ message: 'delete error: userId가 필요합니다.' });
//     }

//     try {
//         const deletedUserData = await authRepository.deleteUser(userId);
//         console.log(deletedUserData);
//         res.json(deletedUserData);
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: '서버 에러' });
//     }
// }
// ----------------------------------------------------------------------------------------------------------------
export async function checkPassword(req, res, next) {
    const { userid, userpw } = req.body;

    userpw = await bcrypt.hash(userpw, config.bcrypt.saltRounds);
    const user = await authRepository.findByuserid(userid);
    console.log(user);
}
// ----------------------------------------------------------------------------------------------------------------
