import { IsNotEmpty, IsOptional, IsString, Length, MaxLength, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class GratitudeCreateDto {
  @IsOptional()
  @IsString()
  @Length(16 ,16)
  @ApiPropertyOptional({ type: 'string', nullable: true, minLength: 16, maxLength: 16 })
  from?: string | null;

  @IsNotEmpty()
  @IsString()
  @Length(16 ,16)
  @ApiProperty({ minLength: 16, maxLength: 16 })
  to: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @MaxLength(1000)
  @ApiProperty({ minLength: 1, maxLength: 1000 })
  reason: string;
}
