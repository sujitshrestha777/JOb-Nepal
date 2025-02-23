import { Router } from "express";
import { authRouter } from "./auth";
import { jobRouter } from "./job";
import { userRouter } from "./user";
import { applicationRouter } from "./application";
import { jobSerachRouter } from "./job.search";
export const router=Router();

// router.use("/employer",employerRouter)
router.use("/auth",authRouter)
router.use("/job",jobRouter)
router.use("/user",userRouter)
router.use("/application",applicationRouter)
router.use("/jobSearch",jobSerachRouter)