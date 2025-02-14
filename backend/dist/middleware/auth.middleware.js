"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorize = exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authenticate = (req, res, next) => {
    const { authorization } = req.headers;
    if (!authorization) {
        res.status(404).json({ message: "no token found" });
        return;
    }
    // const token=authorization.split(" ")[1];
    const token = authorization;
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_PASSWORD);
        if (!decoded.userId) {
            res.json({ message: "authorized header are missing" });
            return;
        }
        req.userId = decoded.userId;
        req.role = decoded.role;
        next();
    }
    catch (error) {
        if (error instanceof jsonwebtoken_1.default.JsonWebTokenError) {
            res.status(401).json({ message: 'Invalid token' });
            return;
        }
        else if (error instanceof jsonwebtoken_1.default.TokenExpiredError) {
            res.status(403).json({ message: 'Token expired' });
            return;
        }
        else {
            res.status(500).json({ message: 'Server error' });
            return;
        }
    }
};
exports.authenticate = authenticate;
const authorize = (role) => {
    return (req, res, next) => {
        if (req.role !== role) {
            res.status(403).json({ message: "Forbidden: Insufficient permissions" });
            return;
        }
        next();
    };
};
exports.authorize = authorize;
