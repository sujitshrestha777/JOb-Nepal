import multer from 'multer';
import { Request } from 'express';
import path from 'path';

// Type for the multer callback function
type DestinationCallback = (error: Error | null, destination: string) => void;
type FileNameCallback = (error: Error | null, filename: string) => void;

// Configure storage for uploaded files
const storage = multer.diskStorage({
  destination: (
    req: Request, 
    file: Express.Multer.File, 
    cb: DestinationCallback
  ): void => {
    // Create destination paths if they don't exist
    if (file.fieldname === 'resume') {
      cb(null, 'uploads/resume/');
    } else if (file.fieldname === 'photo') {
      cb(null, 'uploads/photo/');
    }
  },
  filename: (
    req: Request, 
    file: Express.Multer.File, 
    cb: FileNameCallback
  ): void => {
    const userId = req.userId; // Access userId from params
    const timestamp = Date.now();
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${userId}-${timestamp}${ext}`);
  },
});

// File filter to allow only PDF and image files
const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
): void => {
  if (file.fieldname === 'resume') {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(null, false);
    }
  } else if (file.fieldname === 'photo') {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  } else {
    cb(null, false);
  }
};

// Initialize Multer
export const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});