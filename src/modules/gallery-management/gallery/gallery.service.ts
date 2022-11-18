import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import { CreateGalleryDto } from './dto/create-gallery.dto';
import { UpdateGalleryDto } from './dto/update-gallery.dto';
import { PrismaService } from 'nestjs-prisma';
import * as fs from 'fs';
import stream = require('stream');
import fastify = require('fastify');
import * as util from 'util';
import { v4 as uuid } from 'uuid';
import path = require('path');
import { stream2buffer } from 'src/helper/streamtobuffer';

@Injectable()
export class GalleryService {
  constructor(private prisma: PrismaService) {}

  async create(req) {
    const write = this.handler(
      req.body.file.fieldname,
      req.body.file._buf,
      uuid(),
      req.body.file.encoding,
      req.body.file.mimetype,
    );
    if (write) {
      return await this.prisma.gallery.create({
        data: {
          title: req.body.title.value,
          description: req.body.description.value,
          image_name: write,
          mimetype: req.body.file.mimetype,
        },
      });
    }
  }

  handler(
    fieldname: string,
    file: any,
    filename: string,
    encoding: string,
    mimetype: string,
  ): string {
    try {
      fs.createWriteStream(`media/${filename}.${mimetype.split('/')[1]}`).write(
        file,
      );
      return filename;
    } catch (err) {
      console.error('Pipeline failed', err);
      return;
    }
  }

  async findAll() {
    let dbResponse: any = await this.prisma.gallery.findMany();
    for (let item of dbResponse) {
      if (item.image_name) {
        let mediaPath = path.resolve(
          __dirname,
          `../../../../media/${item.image_name}.${item.mimetype.split('/')[1]}`,
        );
        if (fs.existsSync(mediaPath)) {
          const data = await stream2buffer(fs.createReadStream(mediaPath));
          item.image_data = data;
        } else {
          return { error: 'file not found!' };
        }
      }
    }
    return dbResponse;
  }

  async findOne(id: string): Promise<any> {
    let dbResponse: any = await this.prisma.gallery.findUnique({
      where: {
        id,
      },
    });
    let mediaPath = path.resolve(
      __dirname,
      `../../../../media/${dbResponse.image_name}.${
        dbResponse.mimetype.split('/')[1]
      }`,
    );
    if (fs.existsSync(mediaPath)) {
      const data = await stream2buffer(fs.createReadStream(mediaPath));
      dbResponse.image_data = data;
      return dbResponse;
    } else {
      return { error: 'file not found!' };
    }
  }

  update(id: number, updateGalleryDto: UpdateGalleryDto) {
    return `This action updates a #${id} gallery`;
  }

  remove(id: number) {
    return `This action removes a #${id} gallery`;
  }
}
