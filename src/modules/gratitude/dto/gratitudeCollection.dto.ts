import { GratitudeDto } from '@app/modules/gratitude/dto/gratitude.dto';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { GratitudeEntity } from '@app/modules/gratitude/gratitude.entity';

export class GratitudeCollectionDto {
  @ApiProperty({ type: GratitudeDto, isArray: true })
  items: GratitudeDto[];

  @ApiProperty()
  total: number;

  @ApiPropertyOptional()
  nextCursor?: string;

  constructor(entities: GratitudeEntity[], total: number, nextCursor?: string) {
    this.items = entities.map(entity => new GratitudeDto(entity));
    this.total = total;
    this.nextCursor = nextCursor;
  }
}
