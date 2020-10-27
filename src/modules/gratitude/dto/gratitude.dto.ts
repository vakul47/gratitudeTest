import { GratitudeEntity } from '@app/modules/gratitude/gratitude.entity';
import { ApiProperty } from '@nestjs/swagger';

export class GratitudeDto {
  @ApiProperty({ type: 'string', nullable: true })
  from: string | null;

  @ApiProperty()
  reason: string;

  constructor(entity: GratitudeEntity) {
    this.from = entity.from;
    this.reason = entity.reason
  }
}
