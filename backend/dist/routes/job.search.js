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
exports.jobSerachRouter = void 0;
const express_1 = require("express");
const prisma_1 = __importDefault(require("../utils/prisma"));
const types_1 = require("../types/types");
exports.jobSerachRouter = (0, express_1.Router)();
// search based on tittle
exports.jobSerachRouter.get("/search", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { title } = req.query; // Get the 'title' query parameter from the request
    if (!title) {
        res.status(400).json({ message: "Title query parameter is required" });
        return;
    }
    try {
        // Search for jobs where the title contains the provided search term (case-insensitive)
        const jobs = yield prisma_1.default.job.findMany({
            where: {
                title: {
                    contains: title.toString(), // Case-insensitive search
                    mode: 'insensitive', // Ensures case-insensitive search
                },
            },
            orderBy: [
                { boost: 'desc' }, // Boosted jobs first
                { createdAt: 'asc' }, // Older jobs first
            ],
            take: 10,
        });
        if (jobs.length === 0) {
            res.status(404).json({ message: "No jobs found with that title" });
            return;
        }
        res.status(200).json({ jobs });
    }
    catch (error) {
        console.error("Error searching jobs by title:", error);
        res.status(500).json({ message: "Failed to search jobs by title", error: error });
    }
}));
// POST /filter
exports.jobSerachRouter.post("/filter", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const parsedData = types_1.JobFilterSchema.safeParse(req.body);
    if (!parsedData.success) {
        res.status(400).json({ message: "Invalid input data", errors: parsedData.error });
        return;
    }
    const { jobType, workLocation, experience, salary, education } = parsedData.data;
    try {
        const where = {};
        if (education) {
            where.education = {
                contains: education,
                mode: 'insensitive', // Case-insensitive search
            };
        }
        if (jobType) {
            where.jobtype = jobType;
        }
        if (salary) {
            where.salary = { gte: salary };
        }
        if (workLocation) {
            where.workLocation = workLocation;
        }
        if (experience) {
            where.experience = experience;
        }
        // Fetch jobs based on filters
        const jobs = yield prisma_1.default.job.findMany({
            where,
            orderBy: [
                { boost: 'desc' }, // Boosted jobs first
                { createdAt: 'asc' }, // Older jobs first
            ],
            take: 10
        });
        // Count total matching jobs
        const total = yield prisma_1.default.job.count({ where });
        // Return response
        res.status(200).json({
            jobs,
            total,
        });
    }
    catch (error) {
        console.error("Error filtering jobs:", error);
        res.status(500).json({ message: "Failed to filter jobs" });
    }
}));
