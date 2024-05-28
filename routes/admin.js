import express from 'express';
import User from '../models/user.js';
import bcrypt from 'bcrypt';

const router = express.Router();

// 모든 회원 정보 조회 (페이징 포함)
router.get('/users', async (req, res) => {
    const { page = 1, limit = 10 } = req.query;

    try {
        const users = await User.find()
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .exec();
        const count = await User.countDocuments();

        res.json({
            users,
            totalPages: Math.ceil(count / limit),
            currentPage: page
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 특정 회원 정보 조회
router.get('/users/:userid', async (req, res) => {
    try {
        const user = await User.findOne({ userid: req.params.userid });
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 회원 추가
router.post('/users', async (req, res) => {
    const { userid, userpw, name, hp, email, ssn, address, recentBooks, isAdmin } = req.body;

    // 비밀번호 암호화
    const hashedPassword = await bcrypt.hash(userpw, 10);

    const user = new User({
        userid,
        userpw: hashedPassword,
        name,
        hp,
        email,
        ssn,
        address,
        recentBooks,
        isAdmin
    });

    try {
        const newUser = await user.save();
        res.status(201).json(newUser);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// 회원 정보 수정
router.patch('/users/:userid', async (req, res) => {
    try {
        const user = await User.findOne({ userid: req.params.userid });
        if (!user) return res.status(404).json({ message: 'User not found' });

        if (req.body.userpw != null) {
            user.userpw = req.body.userpw;
        }
        if (req.body.name != null) {
            user.name = req.body.name;
        }
        if (req.body.hp != null) {
            user.hp = req.body.hp;
        }
        if (req.body.email != null) {
            user.email = req.body.email;
        }
        if (req.body.ssn != null) {
            user.ssn = req.body.ssn;
        }
        if (req.body.address != null) {
            user.address = req.body.address;
        }
        if (req.body.recentBooks != null) {
            user.recentBooks = req.body.recentBooks;
        }
        if (req.body.isAdmin != null) {
            user.isAdmin = req.body.isAdmin;
        }

        const updatedUser = await user.save();
        res.json(updatedUser);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// 회원 정보 삭제
router.delete('/users/:userid', async (req, res) => {
    try {
        const user = await User.findOneAndDelete({ userid: req.params.userid });
        if (!user) return res.status(404).json({ message: 'User not found' });

        res.json({ message: 'User deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

export default router;
