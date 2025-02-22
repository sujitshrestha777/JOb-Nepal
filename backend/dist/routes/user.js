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
exports.userRouter = void 0;
const express_1 = require("express");
const prisma_1 = __importDefault(require("../utils/prisma"));
const auth_middleware_1 = require("../middleware/auth.middleware");
const types_1 = require("../types/types");
const upload_middleware_1 = require("../middleware/upload.middleware");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
exports.userRouter = (0, express_1.Router)();
//user id for profile anyone
exports.userRouter.get("/profile/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const user = yield prisma_1.default.user.findUnique({
            where: { id: parseInt(id) },
            include: {
                userProfile: true, // Include user profile details if available
                employerProfile: true, // Include employer profile details if available
            },
        });
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        res.status(200).json({ user });
    }
    catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({ message: "Failed to fetch user" });
    }
}));
// update or create the user profile
exports.userRouter.put("/profile/user", auth_middleware_1.authenticate, upload_middleware_1.uploadFiles, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req;
    const id = Number(userId);
    const parsedData = types_1.UpdateUserProfileSchema.safeParse(req.body);
    if (!parsedData.success) {
        res.status(400).json({ message: "Invalid input data", errors: parsedData.error.errors });
        console.log("error in useprofile update parsed data", parsedData.error.errors);
        return;
    }
    const photoPath = req.files && !Array.isArray(req.files) && "photo" in req.files && Array.isArray(req.files["photo"])
        ? req.files["photo"][0].path
        : null;
    const resumePath = req.files && !Array.isArray(req.files) && "resume" in req.files && Array.isArray(req.files["resume"])
        ? req.files["resume"][0].path
        : null;
    console.log(photoPath, resumePath);
    try {
        const user = yield prisma_1.default.user.findUnique({
            where: { id },
            include: { userProfile: true }, // Include the user's profile
        });
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        // Ensure the user is updating their own profile
        if (user.id !== req.userId) {
            res.status(403).json({ message: "You are not authorized to update this profile" });
            return;
        }
        const updatedData = Object.assign(Object.assign(Object.assign({}, parsedData.data), (photoPath && { photoUrl: photoPath })), (resumePath && { resumeUrl: resumePath }));
        // Update or create the UserProfile
        const updatedProfile = yield prisma_1.default.userProfile.upsert({
            where: { UserId: id },
            update: updatedData,
            create: Object.assign(Object.assign({}, updatedData), { UserId: id }),
        });
        res.status(200).json({ message: "User profile updated successfully", profile: updatedProfile });
    }
    catch (error) {
        console.error("Error updating user profile:", error);
        res.status(500).json({ message: "Failed to update user profile" });
    }
}));
// update or create the employer profile
exports.userRouter.put("/profile/employer", auth_middleware_1.authenticate, upload_middleware_1.uploadFiles, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.body.noEmployees) {
        req.body.noEmployees = parseInt(req.body.noEmployees, 10);
    }
    const photoPath = req.files && !Array.isArray(req.files) && "photo" in req.files && Array.isArray(req.files["photo"])
        ? req.files["photo"][0].path
        : null;
    const id = Number(req.userId);
    const parsedData = types_1.UpdateEmployerProfileSchema.safeParse(req.body);
    if (!parsedData.success) {
        res.status(400).json({ message: "Invalid input data", errors: parsedData.error.errors });
        return;
    }
    try {
        const user = yield prisma_1.default.user.findUnique({
            where: { id },
            include: { employerProfile: true },
        });
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        // Ensure the user is updating their own profile
        if (user.id !== id) {
            res.status(403).json({ message: "You are not authorized to update this profile" });
            return;
        }
        const updateData = Object.assign(Object.assign({}, parsedData.data), (photoPath && { companyphotourl: photoPath }));
        // Update or create the EmployerProfile
        const updatedProfile = yield prisma_1.default.employerProfile.upsert({
            where: { UserId: id },
            update: updateData,
            create: Object.assign(Object.assign({}, updateData), { UserId: id }),
        });
        res.status(200).json({ message: "Employer profile updated successfully", profile: updatedProfile });
    }
    catch (error) {
        console.error("Error updating employer profile:", error);
        res.status(500).json({ message: "Failed to update employer profile" });
        return;
    }
}));
//   userRouter.delete("/:id", authenticate, async (req, res) => {
//     const { id } = req.params;
//     // Check if the user is an admin
//     if (req.role !== "ADMIN") {
//       res.status(403).json({ message: "Unauthorized" });
//       return;
//     }
//     try {
//       await client.user.delete({
//         where: { id: parseInt(id) },
//       });
//       res.status(200).json({ message: "User deleted successfully" });
//     } catch (error) {
//       console.error("Error deleting user:", error);
//       res.status(500).json({ message: "Failed to delete user" });
//     }
//   }); 
exports.userRouter.get("/profile/resume/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const user = yield prisma_1.default.userProfile.findUnique({
            where: { UserId: parseInt(id) },
            select: { resumeUrl: true },
        });
        if (!(user === null || user === void 0 ? void 0 : user.resumeUrl)) {
            res.status(404).json({ error: "Resume not found" });
            return;
        }
        const filePath = path_1.default.resolve(user.resumeUrl);
        if (!fs_1.default.existsSync(filePath)) {
            res.status(404).json({ error: "File not found" });
            return;
        }
        res.sendFile(filePath);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to retrieve resume" });
    }
}));
exports.userRouter.post("/profile/resume", auth_middleware_1.authenticate, upload_middleware_1.uploadFiles, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.userId;
        const resumePath = req.files && !Array.isArray(req.files) && "resume" in req.files &&
            Array.isArray(req.files["resume"])
            ? req.files["resume"][0].path
            : null;
        const photoPath = req.files && !Array.isArray(req.files) && "photo" in req.files &&
            Array.isArray(req.files["photo"])
            ? req.files["photo"][0].path
            : null;
        console.log(`photo path :::: ${photoPath}`);
        const updatedUser = yield prisma_1.default.userProfile.upsert({
            where: { UserId: Number(userId) },
            update: { resumeUrl: resumePath, photoUrl: photoPath },
            create: {
                UserId: Number(userId),
                resumeUrl: resumePath,
                skills: ["JavaScript", "React", "Node.js", "Python", "SQL"],
                bio: "very very hardworker",
                photoUrl: photoPath
            },
        });
        res.status(200).json({ message: 'Files uploaded successfully', user: updatedUser });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: `Failed to upload files${error}` });
    }
}));
exports.userRouter.get("/profile/photo/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const user = yield prisma_1.default.userProfile.findUnique({
            where: { UserId: parseInt(id) },
            select: { photoUrl: true },
        });
        if (!(user === null || user === void 0 ? void 0 : user.photoUrl)) {
            res.status(404).json({ error: `photoUrl not found ` });
            return;
        }
        const filePath = path_1.default.resolve(user.photoUrl);
        if (!fs_1.default.existsSync(filePath)) {
            res.status(404).json({ error: "File not found" });
            return;
        }
        res.sendFile(filePath);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to retrieve resume" });
    }
}));
//get profile 
exports.userRouter.get("/profile", auth_middleware_1.authenticate, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.userId;
    try {
        const user = yield prisma_1.default.user.findUnique({
            where: { id: Number(id) },
            include: {
                userProfile: true, // Include user profile details if available
                employerProfile: true, // Include employer profile details if available
            },
        });
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        if (user.employerProfile) {
            const jobs = yield prisma_1.default.job.findMany({
                where: { employerId: Number(id) }
            });
            res.status(200).json({ user, jobs });
        }
    }
    catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({ message: "Failed to fetch user" });
    }
}));
