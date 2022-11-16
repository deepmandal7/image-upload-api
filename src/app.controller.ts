import {
  Controller,
  Get,
  Post,
  Query,
  Req,
  Res,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  createReadStream,
  existsSync,
  readFile,
  writeFile,
  readFileSync,
} from 'fs';
import * as path from 'path';
import { AppService } from './app.service';
import { streamToBuffer } from '@jorgeferrero/stream-to-buffer';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello() {
    return this.appService.getHello();
  }

  @Post('file-upload')
  @UseInterceptors(FileInterceptor('image', { dest: './media/' }))
  uploadfile(@UploadedFiles() image, @Req() req) {
    readFile(
      path.resolve(__dirname, `media.json`),
      'utf8',
      function readFileCallback(err, data) {
        if (err) {
        } else {
          let mediaArray = JSON.parse(data);
          mediaArray.push(req.file.filename);
          let mediaArrayJson = JSON.stringify(mediaArray);
          writeFile(
            path.resolve(__dirname, `media.json`),
            mediaArrayJson,
            'utf8',
            (err) => {},
          );
        }
      },
    );
    return req.file;
  }

  @Get('get-file')
  getFile(@Query('file_id') fileId, @Res() res) {
    if (existsSync(path.resolve(__dirname, `../media/${fileId}`))) {
      const file: any = createReadStream(
        path.resolve(__dirname, `../media/${fileId}`),
      );
      file.pipe(res);
    } else {
      return { error: 'file not found!' };
    }
  }

  @Get('get-all-file')
  async getAllFile() {
    // const file: any = createReadStream(path.resolve(__dirname, `media.json`));
    return await this.appService.getAllFile();
  }
}

// const file: any = createReadStream(
//   path.resolve(__dirname, `../media/${fileName}`),
// );
// console.log(file);
