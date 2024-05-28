import jwt from 'jsonwebtoken';
import * as authRepository from '../models/auth.js';
import { config } from '../config.js';

const AUTH_ERROR = { message: '인증에러' };

export const isAuth = async (req, res, next) => {
    console.log('isAuth 함수 실행');
    console.log('Request Headers:', req.headers);

    console.log('test=====================')


    const authHeader = req.get('Authorization');
    console.log('Authorization Header:', authHeader);

    if (!(authHeader && authHeader.startsWith('Bearer '))) {
        console.log('에러1');
        return res.status(401).json(AUTH_ERROR);
    }

    const token = authHeader.split(' ')[1];
    // const token = authHeader;
    console.log('token:', token);
    jwt.verify(token, config.jwt.secretKey, async (error, decoded) => {
        if (error) {
            console.log('에러2',error);
            console.log(decoded)
            return res.status(401).json(AUTH_ERROR);
        }
        console.log('decoded.userid:', decoded.userid);
        const user = await authRepository.findByuserid(decoded.userid);
        if (!user) {
            console.log('에러3')
            return res.status(401).json(AUTH_ERROR);
        }

        req.userid = user.userid; // req 객체에 userid를 추가
        req.token = token;
        next();
    });
}
