import { IsDate, IsString } from 'class-validator';

export abstract class BaseModel {
  @IsString()
  id: string;

  @IsDate()
  created_at: Date;

  @IsDate()
  updated_at: Date;
}
