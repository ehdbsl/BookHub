import Mongoose from "mongoose";
import { useVirtualId } from "./database.js";

const userSchema = new Mongoose.Schema({
    userid: { type: String, required: true, unique: true },
    userpw: { type: String, required: true },
    name: { type: String, required: true },
    hp: { type: String, required: true},
    email: { type: String, required: true },
    ssn: { type: String, required: true },
    address: { type: String, required: true }
});



useVirtualId(userSchema);

const User = Mongoose.model('User', userSchema); // 컬렉션 생성

// userid 찾기
export async function findByuserid(userid) {
    return User.findOne({ userid });
}

// _id 중복검사
export async function findById(id) {
    return User.findById(id);
}

export async function createUser(user) {
    return new User(user).save().then((data) => data.id);
}

// 아이디찾기
export async function findUser(name, hp) {
    const user = await User.findOne({ name, hp });
    return user ? user.userid : null;
}

// 해당유저 찾기
export async function getUserById(userid) {
    return User.findOne({ userid });
}

// 해당유저 정보 업데이트
export async function updateUser(userId, newData) {
    return await User.findOneAndUpdate({ userid: userId }, newData, { new: true });
}

// 해당유저 비밀번호 업데이트
export async function updateUserPassword(userId, newPassword) {
    return await User.findOneAndUpdate({ userid: userId }, { userpw: newPassword }, { new: true });
}

export default User;