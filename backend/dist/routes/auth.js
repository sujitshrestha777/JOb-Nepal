"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = void 0;
const express_1 = require("express");
const types_1 = require("../types/types");
const bcrypt_1 = require("bcrypt");
const prisma_1 = __importDefault(require("../utils/prisma"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
exports.authRouter = (0, express_1.Router)();
exports.authRouter.post("/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const parseddata = types_1.signupSchema.safeParse(req.body);
    if (!parseddata.success) {
        res.status(401).json({ "message": "invalid schema!!!" });
        return;
    }
    const { name, email, password, role } = parseddata.data;
    const hashedPassword = yield (0, bcrypt_1.hash)(password, Number(process.env.HASH_NUMBER));
    try {
        const prevUser = yield prisma_1.default.user.findFirst({
            where: {
                email,
            }
        });
        if (prevUser) {
            res.status(402).json({ message: "user email already exists" });
            return;
        }
        const user = yield prisma_1.default.user.create({
            data: {
                name,
                password: hashedPassword,
                email,
                role: role || "USER"
            },
        });
        const token = jsonwebtoken_1.default.sign({ userId: user.id, role: user.role }, process.env.JWT_PASSWORD, { expiresIn: "2d" });
        res.status(200).json({ message: "Signup success", token, role: user.role, userId: user.id });
        return;
    }
    catch (error) {
        console.error("Error during signup:", error);
        res.status(400).json({ message: "Signup failed" });
        return;
    }
}));
exports.authRouter.post("/signin", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const parsedData = types_1.SigninSchema.safeParse(req.body);
    if (!parsedData.success) {
        res.json(400).json({ "message": "invalid schema" });
        return;
    }
    const { email, password } = parsedData.data;
    try {
        const user = yield prisma_1.default.user.findUnique({
            where: {
                email
            }
        });
        if (!user) {
            res.status(404).json({ message: "email address not found" });
            return;
        }
        const isValid = yield (0, bcrypt_1.compare)(password, user.password);
        if (!isValid) {
            res.status(403).json({ message: "invalid password" });
            return;
        }
        const token = jsonwebtoken_1.default.sign({
            userId: user.id,
            role: user.role
        }, process.env.JWT_PASSWORD, 
        //1month expiry date
        { expiresIn: '30d' });
        res.status(200).json({ message: "SignIN success",
            token, role: user.role,
            userId: user.id
        });
    }
    catch (error) {
        res.status(400).json({ message: "SignIN failed!!!" });
    }
}));
