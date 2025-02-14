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
    const { jobId, resumeUrl, content } = parsedData.data;
    try {
        const job = yield prisma_1.default.job.findUnique({
            where: { id: jobId },
        });
        if (!job) {
            res.status(404).json({ message: "Jobpost not found" });
            return;
        }
        // Create the application
        const application = yield prisma_1.default.application.create({
            data: {
                jobId: Number(jobId),
                content: content,
                UserId: req.userId, // Attach the job seeker's ID
                status: "PENDING", // Default status
                resumeUrl
            },
        });
        res.status(201).json({ message: "Application submitted successfully", application });
        return;
    }
    catch (error) {
        console.error("Error applying for job:", error);
        res.status(500).json({ message: "Failed to apply for job" });
    }
}));
// Get details of a specific application
exports.applicationRouter.get("/:id", auth_middleware_1.authenticate, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const application = yield prisma_1.default.application.findUnique({
            where: { id: parseInt(id) },
        });
        if (!application) {
            res.status(404).json({ message: "Application not found" });
            return;
        }
        // Ensure the user is the applicant or the employer
        if (application.id !== req.userId && !(req.role === "EMPLOYER")) {
            res.status(403).json({ message: "You are not authorized to view this application" });
            return;
        }
        res.status(200).json({ application });
    }
    catch (error) {
        console.error("Error fetching application:", error);
        res.status(500).json({ message: "Failed to fetch application" });
    }
}));
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
// Withdraw an application (job seeker only)
exports.applicationRouter.delete("/:id", auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)("USER"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const application = yield prisma_1.default.application.findUnique({
            where: { id: parseInt(id) },
        });
        if (!application) {
            res.status(404).json({ message: "Application not found" });
            return;
        }
        // Ensure the user is the applicant
        if (application.UserId !== req.userId) {
            res.status(403).json({ message: "You are not authorized to withdraw this application" });
            return;
        }
        yield prisma_1.default.application.delete({
            where: { id: parseInt(id) },
        });
        res.status(200).json({ message: "Application withdrawn successfully" });
    }
    catch (error) {
        console.error("Error withdrawing application:", error);
        res.status(500).json({ message: "Failed to withdraw application" });
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
