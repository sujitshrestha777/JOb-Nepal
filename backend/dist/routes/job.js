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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.jobRouter = void 0;
const express_1 = require("express");
const types_1 = require("../types/types"); // Define these schemas
const prisma_1 = __importDefault(require("../utils/prisma"));
const auth_middleware_1 = require("../middleware/auth.middleware"); // Middleware for auth
exports.jobRouter = (0, express_1.Router)();
// Create a new job (employer only)
exports.jobRouter.post("/", auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)("EMPLOYER"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const parsedData = types_1.JobSchema.safeParse(req.body);
    if (!parsedData.success) {
        res.status(400).json({ message: "Invalid input data", errors: parsedData.error.errors });
        return;
    }
    const { title, content, salary, experience, education, jobtype, skills, workLocation } = parsedData.data;
    try {
        const job = yield prisma_1.default.job.create({
            data: {
                title,
                content,
                salary,
                experience,
                education,
                jobtype,
                skills,
                workLocation,
                employerId: req.userId,
            },
        });
        res.status(200).json({ message: "Job created successfully", job });
    }
    catch (error) {
        console.error("Error creating job:", error);
        res.status(500).json({ message: "Failed to create job" });
    }
}));
// Get all jobs (public)
exports.jobRouter.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const jobs = yield prisma_1.default.job.findMany({
            orderBy: [
                { boost: 'desc' },
                { createdAt: "asc" }
            ],
            take: 7,
            include: {
                employer: {
                    include: {
                        employerProfile: {
                            select: {
                                companyName: true
                            }
                        }
                    }
                }
            }
        });
        const formattedJobs = jobs.map((_a) => {
            var _b;
            var { employer } = _a, job = __rest(_a, ["employer"]);
            return (Object.assign(Object.assign({}, job), { companyName: ((_b = employer.employerProfile) === null || _b === void 0 ? void 0 : _b.companyName) || 'Unknown Company' }));
        });
        res.status(200).json({ jobs: formattedJobs });
    }
    catch (error) {
        console.error("Error fetching jobs:", error);
        res.status(500).json({ message: "Failed to fetch jobs" });
    }
}));
// Get a specific job by ID (public)
// jobRouter.get("/:id", async (req, res) => {
//   const { id } = req.params;
//   try {
//     const job = await client.job.findUnique({
//       where: { id: parseInt(id) },
//     });
//     if (!job) {
//       res.status(404).json({ message: "Job not found" });
//       return;
//     }
//     res.status(200).json({ job });
//   } catch (error) {
//     console.error("Error fetching job:", error);
//     res.status(500).json({ message: "Failed to fetch job" });
//   }
// });
// Update a job (employer only)
exports.jobRouter.put("/:id", auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)("EMPLOYER"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const parsedData = types_1.UpdateJobSchema.safeParse(req.body);
    if (!parsedData.success) {
        res.status(400).json({ message: "Invalid input data", errors: parsedData.error.errors });
        return;
    }
    try {
        const job = yield prisma_1.default.job.findUnique({
            where: { id: parseInt(id) },
        });
        if (!job) {
            res.status(404).json({ message: "Job not found" });
            return;
        }
        // Ensure the employer owns the job
        if (job.employerId !== req.userId) {
            res.status(403).json({ message: "You are not authorized to update this job" });
            return;
        }
        const updatedJob = yield prisma_1.default.job.update({
            where: { id: parseInt(id) },
            data: parsedData.data,
        });
        res.status(200).json({ message: "Job updated successfully", job: updatedJob });
    }
    catch (error) {
        console.error("Error updating job:", error);
        res.status(500).json({ message: "Failed to update job" });
    }
}));
// Delete a job (employer only)
exports.jobRouter.delete("/:id", auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)("EMPLOYER"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const job = yield prisma_1.default.job.findUnique({
            where: { id: parseInt(id) },
        });
        if (!job) {
            res.status(404).json({ message: "Job not found" });
            return;
        }
        // Ensure the employer owns the job
        if (job.employerId !== req.userId) {
            res.status(403).json({ message: "You are not authorized to delete this job" });
            return;
        }
        yield prisma_1.default.job.delete({
            where: { id: parseInt(id) },
        });
        res.status(200).json({ message: "Job deleted successfully" });
    }
    catch (error) {
        console.error("Error deleting job:", error);
        res.status(500).json({ message: "Failed to delete job" });
    }
}));
// Get applications for a specific job (employer only)
exports.jobRouter.get("/:id/applications", auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)("EMPLOYER"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const job = yield prisma_1.default.job.findUnique({
            where: { id: parseInt(id) },
        });
        if (!job) {
            res.status(404).json({ message: "Job not found" });
            return;
        }
        // Ensure the employer owns the job
        if (job.employerId !== req.userId) {
            res.status(403).json({ message: "You are not authorized to view these applications" });
            return;
        }
        const applications = yield prisma_1.default.application.findMany({
            where: { jobId: parseInt(id) },
        });
        res.status(200).json({ applications });
    }
    catch (error) {
        console.error("Error fetching applications:", error);
        res.status(500).json({ message: "Failed to fetch applications" });
    }
}));
