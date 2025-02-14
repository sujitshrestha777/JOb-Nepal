"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadFiles = void 0;
const fileupload_1 = require("../utils/fileupload");
exports.uploadFiles = fileupload_1.upload.fields([
    { name: 'resume', maxCount: 1 }, // Accept one PDF file
    { name: 'photo', maxCount: 1 }, // Accept one image file
]);
