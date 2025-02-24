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
exports.notificationRouter = void 0;
const express_1 = require("express");
const auth_middleware_1 = require("../middleware/auth.middleware");
const prisma_1 = __importDefault(require("../utils/prisma"));
exports.notificationRouter = (0, express_1.Router)();
exports.notificationRouter.get("/lists", auth_middleware_1.authenticate, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const appResult = yield prisma_1.default.application.findMany({
            where: {
                UserId: req.userId,
                status: { in: ["ACCEPTED", "REJECTED"] }
            },
            orderBy: {
                updatedAt: "desc"
            },
            select: {
                status: true,
                job: {
                    select: {
                        title: true,
                        employer: {
                            select: {
                                employerProfile: {
                                    select: {
                                        id: true,
                                        companyName: true
                                    }
                                }
                            }
                        }
                    }
                }
            },
            take: 5
        });
        res.status(201).json({ messagge: "succefully retrive the job status", appResult });
    }
    catch (error) {
        console.log("error from app status lists", error);
        res.status(500).json({ message: "server error", error });
    }
}));
