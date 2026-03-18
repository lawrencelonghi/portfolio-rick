import multer from 'multer';
import path from 'path';
import type { Request } from 'express';

// Configurar onde e como salvar os arquivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Pasta onde serão salvos
  },
  filename: (req, file, cb) => {
    // gerar nome único: timestamp + nome original
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, uniqueSuffix + ext);
  }
});

const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp|svg|mp4|mkv|avi|mov|webm|ogg/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (!extname || !mimetype) {
    return cb(new Error('allowed file types: (jpeg, jpg, png, gif, webp, svg, mp4, mkv, avi, mov, webm, ogg)'));
  }

  const isVideo = /mp4|mkv|avi|mov|webm|ogg/.test(path.extname(file.originalname).toLowerCase());
  const maxSize = isVideo ? 200 * 1024 * 1024 : 10 * 1024 * 1024; // 200MB video, 10MB imagem

  if (parseInt(req.headers['content-length'] || '0') > maxSize) {
    return cb(new Error(`Tamanho máximo: ${isVideo ? '200MB para vídeos' : '20MB para imagens'}`));
  }

  cb(null, true);
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 200 * 1024 * 1024  // limite geral = o maior (vídeo)
  }
});