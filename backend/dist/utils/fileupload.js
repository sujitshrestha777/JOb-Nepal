"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
// Configure storage for uploaded files
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        // Create destination paths if they don't exist
        if (file.fieldname === 'resume') {
            cb(null, 'uploads/resume/');
        }
        else if (file.fieldname === 'photo') {
            cb(null, 'uploads/photo/');
        }
    },
    filename: (req, file, cb) => {
        const userId = req.userId; // Access userId from params
        const timestamp = Date.now();
        const ext = path_1.default.extname(file.originalname);
        cb(null, `${file.fieldname}-${userId}-${timestamp}${ext}`);
    },
});
// File filter to allow only PDF and image files
const fileFilter = (req, file, cb) => {
    if (file.fieldname === 'resume') {
        if (file.mimetype === 'application/pdf') {
            cb(null, true);
        }
        else {
            cb(null, false);
        }
    }
    else if (file.fieldname === 'photo') {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        }
        else {
            cb(null, false);
        }
    }
    else {
        cb(null, false);
    }
};
// Initialize Multer
exports.upload = (0, multer_1.default)({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});
