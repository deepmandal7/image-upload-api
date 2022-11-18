import { IsString } from 'class-validator';
import { BaseModel } from 'src/common/models/base.model';

export class Gallery extends BaseModel {
  @IsString()
  title: string;

  @IsString()
  description: string;
}
