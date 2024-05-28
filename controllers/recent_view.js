import jwt from 'jsonwebtoken';
import { config } from '../config.js';
import * as authRepository from '../models/auth.js';

export const getRecentBooks = async (req, res) => {
  try {
    const token = req.headers.authorization.split('Bearer ')[1];

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

        console.log('사용자의 최근 본 책 목록:');
        user.recentBooks.forEach((bookURL, index) => {
          console.log(`${index + 1}. ${bookURL}`);
        });

        res.status(200).json({ recentBooks: user.recentBooks });
      } catch (error) {
        console.error('사용자 조회 에러:', error);
        res.status(500).json({ message: "사용자 정보를 가져오는 도중에 오류가 발생했습니다." });
      }
    });
  } catch (error) {
    console.error('토큰 파싱 에러:', error);
    res.status(401).json({ message: '토큰을 파싱하는 도중에 오류가 발생했습니다.' });
  }
};
