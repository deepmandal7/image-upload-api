import { IsString, MaxLength } from 'class-validator';

export class CreateGalleryDto {
  @IsString()
  title: string;

  @IsString()
  description: string;
}
