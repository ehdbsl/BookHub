import * as authRepository from '../models/auth.js';
import User from '../models/auth.js';
import * as bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { config } from '../config.js';
import { findBook } from '../models/detail.js';


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
export async function checkToken(req, res, next) {
    const token = req.body.token;
    console.log('token:', token);
    if (!token) {
        return res.status(401).json({ success: false, message: '토큰이 없습니다.'});
    }
    try {
        const decoded = jwt.verify(token, config.jwt.secretKey);
        console.log('decoded:', decoded);
        res.status(200).json({ success: true, message: '토큰이 유효합니다.' });
    } catch (error) {
        console.error(error);
        res.status(401).json({ success: false, message: '토큰이 만료되었습니다.' });
    }
}
// ----------------------------------------------------------------------------------------------------------------
export async function me(req, res, next) {
    // const user = await authRepository.findByuserid(req.userid);
    const userId = req.userid;
    const user = await authRepository.getUserById(userId);
    console.log('user:', user);
    if (!user) {
        return res.status(404).json({message: `일치하는 사용자가 없음`});

    }
    res.status(200).json({token: req.token, userid: user.userid});
}
// ----------------------------------------------------------------------------------------------------------------
export async function getUserInfo(req, res, next) {
    const userId = req.userid;
    // console.log('getUserInfo:', userId) 테스트완료
    if (!userId) {
        return res.status(400).json({ message: 'user id가 필요합니다.' });
    }
    try {
        const userData = await authRepository.getUserById(userId);
        if (!userData) {
            return res.status(404).json({ message: '일치하는 사용자가 없음' });
        }
        res.status(200).json(userData);
        console.log('userData:', userData);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: '서버 에러' });
    }
}
// ----------------------------------------------------------------------------------------------------------------
export async function findID(req, res, next) {
    const { name, hp } = req.body;
    console.log(name, hp);
    if (!name || !hp) {
        return res.status(400).json({ message: 'name, hp가 필요합니다.' });
    }
    try {
        const userId = await authRepository.findUser(name, hp);
        if (userId) {
            res.status(200).json({ id: `${userId}`});
        }
        else {
            res.sendStatus(404);
        }
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

    const userId = req.userid;
    const newData = { ...req.body };

    if (!userId) {
        return res.status(400).json({ message: 'update error: userId가 필요합니다.' });
    }
    // if (newData.userpw) {
    //     newData.userpw = await bcrypt.hash(newData.userpw, config.bcrypt.saltRounds);
    // }

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
export async function logout(req, res, next) {
    res.clearCookie('token');
    res.status(200).json({ message: '로그아웃 성공' });
}
// ----------------------------------------------------------------------------------------------------------------
export async function deleteUser(req, res, next) {
    const token = req.token;
    // const userId = req.userid;
    if (!token) {
        return res.status(400).json({ message: '다시 로그인 해 주세요.' });
    }

    try {
        const decoded = jwt.verify(token, config.jwt.secretKey);
        const userid = decoded.userid;
        const deletedUserData = await authRepository.deleteUser(userid);
        console.log(deletedUserData);
        res.json(deletedUserData);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: '서버 에러' });
    }
}
// ----------------------------------------------------------------------------------------------------------------
export async function checkId(req, res, next) {
    const { userid } = req.body;
    console.log('Received userid:', userid);
    try {
        const user = await authRepository.findByuserid(userid);
        console.log('Found user:', user);
        if (user) {
            return res.status(409).json({ message: `${userid}은 이미 사용중인 아이디입니다.`, ok: false});
        }
        res.status(200).json({ message: '사용 가능한 아이디입니다.', ok: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: '서버 에러', ok: false });
    }
}
// ----------------------------------------------------------------------------------------------------------------
export async function resetPassword(req, res, next) {
    const { userid, newPassword } = req.body;
    const user = await authRepository.findByuserid(userid);
    console.log(`userid: ${userid}, newPassword: ${newPassword}`);

    if (!user) {
        return res.status(400).json({ message: '해당하는 사용자가 없습니다.' });
    }
    console.log('userpw:', newPassword)
    try {
        const hashedPassword = await bcrypt.hash(newPassword, config.bcrypt.saltRounds);
        const updatedPassword = await authRepository.updatePassword(userid, hashedPassword);
        // console.log(`성공: ${hashedPassword}`); 테스트완료
        console.log(`업데이트완료: ${updatedPassword}`)
        // res.json(updatedPassword);
        return res.send('비밀번호가 정상적으로 변경되었습니다.');
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: '서버 에러', ok: false});
    }
}
// ----------------------------------------------------------------------------------------------------------------
export async function getMyBooksInfo(req, res) {
    const userid = req.userid;
    try {
        const recentBooks = await authRepository.getMyRecentBooksInfo(userid);
        // res.json(recentBooks);
        const validUrls = recentBooks.filter(url => url !== null); // null이 아닌 url만 골라내기
        const searchKeyValues = validUrls.map(url => getSearchKeyValue(url, 'searchKey')); // searchKey값만 추출
        // const getMyBookData = await findBook(searchKeyValues);
        const booksInfoPromises = searchKeyValues.map(isbn => findBook(isbn));
        const booksInfo = await Promise.all(booksInfoPromises);
        const validBooksInfo = booksInfo.filter(book => book !== null); // null이 아닌 book만 골라내기
        console.log('validBooksInfo:', validBooksInfo);
        res.json({ validBooksInfo });   
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: '서버 에러' });
    }
}

//url 파싱
function getSearchKeyValue(url, key) {
    const urlObj = new URL(url);  // URL을 객체로 변환
    const params = new URLSearchParams(urlObj.search);  // URL의 search 부분을 URLSearchParams 객체로 변환
    return params.get(key); // isbn
}