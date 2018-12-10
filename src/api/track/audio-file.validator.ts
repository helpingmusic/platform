import { FileUpload } from 'src/core/storage/file-upload.type';

const validFileTypes = [
  'audio/vnd.wav',
  'audio/wav',
  'audio/mpeg',
  'audio/mp4',
  'audio/ogg',
];

export function audioFileValidator(req, file: FileUpload, cb: (err: any, pass: boolean) => void) {

  const validFile = validFileTypes.indexOf(file.mimetype) !== -1;

  return cb(null, validFile);
}