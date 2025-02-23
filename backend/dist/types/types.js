"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateApplicationSchema = exports.ApplicationSchema = exports.JobFilterSchema = exports.UpdateUserProfileSchema = exports.UpdateEmployerProfileSchema = exports.UpdateJobSchema = exports.JobSchema = exports.SigninSchema = exports.signupSchema = void 0;
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
exports.signupSchema = zod_1.z.object({
    name: zod_1.z.string().min(3),
    role: zod_1.z.enum(['USER', 'EMPLOYER', 'ADMIN']).optional(),
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(3)
});
exports.SigninSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(5),
});
exports.JobSchema = zod_1.z.object({
    experience: zod_1.z.nativeEnum(client_1.Experience),
    education: zod_1.z.string().optional(),
    jobtype: zod_1.z.nativeEnum(client_1.Jobtype),
    skills: zod_1.z.array((0, zod_1.string)()).min(1, "At least one skill is required")
        .max(5, "Maximum 5 skills allowed"),
    title: zod_1.z.string().min(3),
    content: zod_1.z.string().min(3),
    salary: zod_1.z.number(),
    workLocation: zod_1.z.enum(['ONSITE', 'HYBRID', 'REMOTE'])
});
exports.UpdateJobSchema = zod_1.z.object({
    title: zod_1.z.string().min(5).optional(),
    contact: zod_1.z.string().min(5).optional(),
    content: zod_1.z.string().min(10).optional(),
    salary: zod_1.z.number().positive().optional(),
    workLocation: zod_1.z.enum(['ONSITE', 'HYBRID', 'REMOTE']).optional()
});
exports.UpdateEmployerProfileSchema = zod_1.z.object({
    companyName: zod_1.z.string().optional(),
    bio: zod_1.z.string().optional(),
    companyType: zod_1.z.string().optional(),
    noEmployees: zod_1.z.number().optional(),
    location: zod_1.z.string().optional(),
    companyurl: zod_1.z.string().optional(),
    photoUrl: zod_1.z.string().optional()
});
exports.UpdateUserProfileSchema = zod_1.z.object({
    skills: zod_1.z.array(zod_1.z.string()).min(1).max(5),
    bio: zod_1.z.string(),
    location: zod_1.z.string(),
    education: zod_1.z.string()
});
exports.JobFilterSchema = zod_1.z.object({
    jobType: zod_1.z.nativeEnum(client_1.Jobtype).optional(),
    experience: zod_1.z.nativeEnum(client_1.Experience).optional(),
    salary: zod_1.z.number().int().positive().optional(),
    education: zod_1.z.string().optional(),
    workLocation: zod_1.z.nativeEnum(client_1.WorkLocation).optional(),
    boost: zod_1.z.boolean().optional(),
});
exports.ApplicationSchema = zod_1.z.object({
    jobId: zod_1.z.number(),
    content: zod_1.z.string()
});
exports.UpdateApplicationSchema = zod_1.z.object({
    status: zod_1.z.nativeEnum(client_1.AppStatus)
});
