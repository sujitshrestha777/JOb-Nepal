import { upload } from '../utils/fileupload';

export const uploadFiles = upload.fields([
  { name: 'resume', maxCount: 1 }, // Accept one PDF file
  { name: 'photo', maxCount: 1 },  // Accept one image file
]);