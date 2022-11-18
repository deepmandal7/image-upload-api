import { Injectable } from '@nestjs/common';
import { createReadStream, readFileSync } from 'fs';
import * as path from 'path';
import { stream2buffer } from './helper/streamtobuffer';

@Injectable()
export class AppService {
  getHello() {
    return { status: 'Hello World!' };
  }

  // async getAllFile() {
  //   const mediaArray = [];
  //   let mediaJson = readFileSync(path.resolve(__dirname, `media.json`), 'utf8');
  //   for (const fileName of JSON.parse(mediaJson)) {
  //     const data = await stream2buffer(
  //       createReadStream(path.resolve(__dirname, `../media/${fileName}`)),
  //     );
  //     mediaArray.push(data);
  //   }
  //   return mediaArray;
  // }
}
