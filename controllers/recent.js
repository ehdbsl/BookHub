// controllers/recent.js

import jwt from 'jsonwebtoken';
import { config } from '../config.js';
import * as authRepository from '../models/auth.js';

export const updateRecentBooks = async (req, res) => {
  try {
    const token = req.headers.authorization.split('Bearer ')[1];
    // console.log('recent token:', token); 테스트완료
    
    jwt.verify(token, config.jwt.secretKey, async (error, decoded) => {
      if (error) {
        console.log('JWT 검증 에러:', error);
        return res.status(401).json({ message: '토큰이 유효하지 않습니다.' });
      }

      try {
        const user = await authRepository.findByuserid(decoded.userid);
        if (!user) {
          return res.status(404).json({ message: "사용자를 찾을 수 없습니다." });
        }

        const recentBookURL = req.body.recentBookURL;
        user.recentBooks.push(recentBookURL);
        await user.save();

        res.status(200).json({ message: "최근 본 책 목록이 업데이트되었습니다." });
      } catch (error) {
        console.error('사용자 업데이트 에러:', error);
        res.status(500).json({ message: "사용자 정보를 업데이트하는 도중에 오류가 발생했습니다." });
      }
    });
  } catch (error) {
    console.error('토큰 파싱 에러:', error);
    res.status(401).json({ message: '토큰을 파싱하는 도중에 오류가 발생했습니다.' });
  }
};
