import { EntityRepository, Repository } from 'typeorm';
import { GratitudeEntity } from '@app/modules/gratitude/gratitude.entity';

@EntityRepository(GratitudeEntity)
export class GratitudeRepository extends Repository<GratitudeEntity>{}
