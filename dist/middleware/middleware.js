"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authMiddleware = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const decode = jsonwebtoken_1.default.verify(authHeader, "vipul123");
    if (decode) {
        // @ts-ignore
        req.userId = decode.id;
        next();
    }
    else {
        // @ts-ignore
        return res.status(401).json({ message: "Unauthorized" });
    }
};
exports.authMiddleware = authMiddleware;
exports.default = exports.authMiddleware;
