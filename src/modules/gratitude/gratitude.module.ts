import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GratitudeRepository } from '@app/modules/gratitude/gratitude.repository';
import { GratitudeController } from '@app/modules/gratitude/gratitude.controller';
import { GratitudeService } from '@app/modules/gratitude/gratitude.service';

@Module({
  imports: [TypeOrmModule.forFeature([GratitudeRepository])],
  controllers: [GratitudeController],
  providers: [GratitudeService],
  exports: [GratitudeService]
})
export class GratitudeModule {}
