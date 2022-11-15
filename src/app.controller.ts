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
import { createReadStream } from 'fs';
import * as path from 'path';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('file-upload')
  @UseInterceptors(FileInterceptor('image', { dest: './media/' }))
  uploadfile(@UploadedFiles() image, @Req() req) {
    console.log(image);
    return req.file;
  }

  @Get('get-file')
  getFile(@Query('file_id') fileId, @Res() res) {
    const file: any = createReadStream(
      path.resolve(__dirname, `../media/${fileId}`),
    );
    file.pipe(res);
  }
}
