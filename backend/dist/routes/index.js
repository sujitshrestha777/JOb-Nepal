"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const auth_1 = require("./auth");
const job_1 = require("./job");
const user_1 = require("./user");
const application_1 = require("./application");
const job_search_1 = require("./job.search");
exports.router = (0, express_1.Router)();
// router.use("/employer",employerRouter)
exports.router.use("/auth", auth_1.authRouter);
exports.router.use("/job", job_1.jobRouter);
exports.router.use("/user", user_1.userRouter);
exports.router.use("/application", application_1.applicationRouter);
exports.router.use("/jobSearch", job_search_1.jobSerachRouter);
