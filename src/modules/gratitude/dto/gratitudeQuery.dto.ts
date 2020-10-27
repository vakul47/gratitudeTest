import {
  IsInt,
  IsNotEmpty,
  IsString,
  Length,
  Max, MaxLength,
  Min,
  MinLength,
  ValidateIf
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class GratitudeQueryDto {
  @IsNotEmpty()
  @IsString()
  @Length(16, 16)
  @ValidateIf(o => !o.cursor)
  @ApiPropertyOptional({ minLength: 16, maxLength: 16 })
  id?: string;

  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @Max(100)
  @ValidateIf(o => !o.cursor || o.id)
  @Transform(value => /^\d+$/.test(value) ? +value : value)
  @ApiPropertyOptional()
  perPage?: number = 10;

  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @MaxLength(1000)
  @ValidateIf(o => !o.id && !o.perPage)
  @ApiPropertyOptional()
  cursor?: string;
}
