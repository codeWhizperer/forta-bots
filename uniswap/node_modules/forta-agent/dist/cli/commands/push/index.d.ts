import { CommandHandler } from '../..';
import { AppendToFile } from '../../utils/append.to.file';
import { UploadImage } from '../publish/upload.image';
export default function providePush(uploadImage: UploadImage, appendToFile: AppendToFile): CommandHandler;
