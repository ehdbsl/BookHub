import { validationResult } from "express-validator";
import { body } from 'express-validator';

export const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        return next();
    }
    return res.status(400).json({ message: errors.array()[0].msg });
};

const expIdText = /^[A-Za-z0-9]{4,20}$/;
const expPwText = /^(?=.*[A-Za-z])(?=.*[0-9]).{4,20}$/;
const expNameText = /^[가-힣]+$/;
const expHpText = /^\d{3}\d{3,4}\d{4}$/;
const expEmailText = /^[A-Za-z0-9\-\.\_]+@[A-Za-z0-9\-]+\.[A-Za-z]+$/;
const expSsnText = /^\d{6}$/;

export const validateId = [
    body("userid")
        .trim()
        .matches(expIdText)
        .withMessage("아이디는 4자 이상 20자 이하의 영문자, 숫자로 입력하세요"), 
    validate,
];

export const validateLogin = [

    body("userid")
        .trim()
        .matches(expIdText)
        .withMessage("아이디는 4자 이상 20자 이하의 영문자, 숫자로 입력하세요"),
    body("userpw")
        .trim()
        .matches(expPwText)
        .withMessage("비밀번호는 4자 이상 20자 이하의 영문자, 숫자 1자 이상 꼭 포함해야 합니다."),
    
    validate,
];

export const validateSignup = [
    body("userid")
        .trim()
        .matches(expIdText)
        .withMessage("아이디는 4자 이상 20자 이하의 영문자, 숫자로 입력하세요"),

    body("userpw")
        .trim()
        .matches(expPwText)
        .withMessage("비밀번호는 4자 이상 20자 이하의 영문자, 숫자 1자 이상 꼭 포함해야 합니다."),

    body("name")
        .trim()
        .notEmpty()
        .matches(expNameText)
        .withMessage("이름은 한글로 입력하세요."),
    validate,

    body("hp")
        .trim()
        .notEmpty()
        .matches(expHpText)
        .withMessage("전화번호 형식을 확인해 주세요."),
    validate,
    
    body("email")
        .trim()
        .notEmpty()
        .matches(expEmailText)
        .withMessage("이메일 형식을 확인해 주세요."),
    validate,

    body("ssn")
        .trim()
        .notEmpty()
        .matches(expSsnText)
        .withMessage("주민번호 앞자리 6자리를 입력하세요."),
    validate,
];