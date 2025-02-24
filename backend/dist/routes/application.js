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
exports.applicationRouter = void 0;
const express_1 = require("express");
const types_1 = require("../types/types"); // Define these schemas
const prisma_1 = __importDefault(require("../utils/prisma"));
const auth_middleware_1 = require("../middleware/auth.middleware"); // Middleware for auth
exports.applicationRouter = (0, express_1.Router)();
// Apply for a job (job seeker only)
exports.applicationRouter.post("/apply", auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)("USER"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const parsedData = types_1.ApplicationSchema.safeParse(req.body);
    if (!parsedData.success) {
        res.status(400).json({ message: "Invalid input data", errors: parsedData.error.errors });
        return;
    }
    const { jobId, content } = parsedData.data;
    try {
        const job = yield prisma_1.default.job.findUnique({
            where: { id: jobId },
        });
        if (!job) {
            res.status(404).json({ message: "Jobpost not found" });
            return;
        }
        const userId_jobId = yield prisma_1.default.application.upsert({
            where: {
                userId_jobId: {
                    UserId: req.userId,
                    jobId: jobId
                }
            },
            update: {
                createdAt: new Date(),
                content: content,
            },
            create: {
                jobId: Number(jobId),
                content: content,
                UserId: req.userId,
                status: "PENDING",
            }
        });
        if (userId_jobId) {
            res.status(201).json({ message: "Application submitted successfully" });
            return;
        }
    }
    catch (error) {
        console.error("Error applying for job:", error);
        res.status(500).json({ message: "Failed to apply for job" });
    }
}));
// // Get details of a specific application
// applicationRouter.get("/:id", authenticate, async (req, res) => {
//   const { id } = req.params;
//   try {
//     const application = await client.application.findUnique({
//       where: { id: parseInt(id) },
//     });
//     if (!application) {
//      res.status(404).json({ message: "Application not found" });
//      return
//     }
//     // Ensure the user is the applicant or the employer
//     if (application.id !== req.userId && !(req.role === "EMPLOYER")) {
//        res.status(403).json({ message: "You are not authorized to view this application" });
//        return
//     }
//      res.status(200).json({ application });
//   } catch (error) {
//     console.error("Error fetching application:", error);
//     res.status(500).json({ message: "Failed to fetch application" });
//   }
// });
// Update application status (employer only),AppStatus { PENDING ACCEPTED REJECTED}
exports.applicationRouter.put("/:id", auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)("EMPLOYER"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const parsedData = types_1.UpdateApplicationSchema.safeParse(req.body);
    if (!parsedData.success) {
        res.status(400).json({ message: "Invalid input data", errors: parsedData.error.errors });
        return;
    }
    const { status } = parsedData.data;
    try {
        const application = yield prisma_1.default.application.findUnique({
            where: { id: parseInt(id) },
        });
        if (!application) {
            res.status(404).json({ message: "Application not found" });
            return;
        }
        // Ensure the employer owns the job
        const job = yield prisma_1.default.job.findUnique({
            where: { id: application.jobId },
        });
        if (!job || job.employerId !== req.userId) {
            res.status(403).json({ message: "You are not authorized to update this application" });
            return;
        }
        const updatedApplication = yield prisma_1.default.application.update({
            where: { id: parseInt(id) },
            data: { status },
        });
        res.status(200).json({ message: "Application status updated successfully", application: updatedApplication });
        return;
    }
    catch (error) {
        console.error("Error updating application:", error);
        res.status(500).json({ message: "Failed to update application" });
    }
}));
exports.applicationRouter.get("/lists", auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)("EMPLOYER"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const employerId = Number(req.userId);
        console.log("employer:", employerId);
        const applications = yield prisma_1.default.application.findMany({
            where: {
                job: {
                    employerId
                }
            },
            include: {
                user: {
                    include: {
                        userProfile: true
                    }
                },
                job: {
                    select: {
                        id: true,
                        title: true,
                        salary: true,
                        jobtype: true,
                        workLocation: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
        res.status(201).json({ message: "succefully retrive the applications", applications });
    }
    catch (err) {
        console.log("error from fetching application", err);
        res.status(500).json({ message: "faild to get the applications", error: err });
    }
}));
// Get all applications of that particular job
exports.applicationRouter.get("/job/:jobId", auth_middleware_1.authenticate, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { jobId } = req.params;
    try {
        if (!jobId || isNaN(parseInt(jobId))) {
            res.status(400).json({ message: "Invalid job ID" });
            return;
        }
        // Fetch all applications for the given job ID
        const applications = yield prisma_1.default.application.findMany({
            where: { jobId: parseInt(jobId) }, // Match the jobId
            include: {
                user: true, // Optionally include user data for applications
                job: true, // Optionally include job data
            },
            orderBy: { createdAt: "desc" }, // Sort applications by creation date
        });
        if (!applications || applications.length === 0) {
            res.status(404).json({ message: "No applications found for this job" });
            return;
        }
        res.status(200).json({ applications });
    }
    catch (error) {
        console.error("Error fetching applications:", error);
        res.status(500).json({ message: "Failed to fetch applications" });
    }
}));
//rejected or accepted of appliaction
exports.applicationRouter.put("/:id/status", auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)("EMPLOYER"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const { status } = req.body;
    if (!(status === "ACCEPTED" || status === "REJECTED")) {
        res.status(401).json({ message: "no status(rejected/accepted) is provided" });
        return;
    }
    try {
        const postOwner = yield prisma_1.default.application.findFirst({
            where: {
                id: Number(id),
                job: {
                    employerId: req.userId
                }
            },
        });
        if (postOwner) {
            const response = yield prisma_1.default.application.update({
                where: {
                    id: Number(id)
                },
                data: {
                    status,
                    updatedAt: new Date()
                }
            });
        }
        else {
            res.status(401).json({ message: "not authorized " });
            return;
        }
        res.status(201).json({ message: "successfully status updated", status: status });
    }
    catch (error) {
        res.status(500).json({ message: "server error", error });
    }
}));
