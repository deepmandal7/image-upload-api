import { Injectable } from '@nestjs/common';
import {
  createReadStream,
  existsSync,
  readFile,
  writeFile,
  readFileSync,
} from 'fs';
import * as path from 'path';
import { streamToBuffer } from '@jorgeferrero/stream-to-buffer';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  async getAllFile(): Promise<string[]> {
    const mediaArray: string[] = [];
    let mediaJson = readFileSync(path.resolve(__dirname, `media.json`), 'utf8');
    for (const fileName of JSON.parse(mediaJson)) {
      const data = await streamToBuffer(
        createReadStream(path.resolve(__dirname, `../media/${fileName}`)),
      );
      mediaArray.push(data.toString());
    }

    console.log(mediaArray);
    return mediaArray;
  }
}
