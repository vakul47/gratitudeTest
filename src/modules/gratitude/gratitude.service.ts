import { GratitudeRepository } from '@app/modules/gratitude/gratitude.repository';
import { Injectable } from '@nestjs/common';
import { IGratitudeManyFilter, IGratitudesManyResult, IRawGratitude } from '@app/modules/gratitude/gratitude.types';
import { DeepPartial, FindConditions } from 'typeorm';
import { GratitudeEntity } from '@app/modules/gratitude/gratitude.entity';

@Injectable()
export class GratitudeService {
  constructor(
    private readonly gratitudeRepository: GratitudeRepository
  ) {}

  public async getMany(query: IGratitudeManyFilter): Promise<IGratitudesManyResult> {
    const totalCondition: FindConditions<GratitudeEntity> = {};

    const qb = this.gratitudeRepository.createQueryBuilder('gratitudes')
      .select([
        '*',
        '(MIN(created_at) OVER ()) = "created_at" as "is_last"'
      ]);

    if (query.to) {
      qb.andWhere('gratitudes.to = :to', { to: query.to });
      totalCondition.to = query.to
    }
    if (query.cursorId) {
      qb.andWhere('gratitudes.id < :cursorId', { cursorId: query.cursorId });
    }
    if (query.perPage) {
      qb.limit(query.perPage);
    }

    const rawEntities = await qb.orderBy('gratitudes.createdAt', 'DESC')
      .getRawMany() as IRawGratitude[];

    const total = await this.gratitudeRepository.count(totalCondition);

    const lastEntity = rawEntities[rawEntities.length - 1];

    return {
      entities: rawEntities.map(item => GratitudeService.rawEntityToEntity(item)),
      total,
      isLastPage: lastEntity?.is_last !== undefined ? lastEntity.is_last : true,
      cursorId: lastEntity?.id
    }
  }

  public async create(partialEntity: DeepPartial<GratitudeEntity>): Promise<GratitudeEntity> {
    const rawResult = await this.gratitudeRepository.createQueryBuilder('gratitudes')
        .insert()
        .values({
          ...partialEntity,
          id: () => `(SELECT '${partialEntity.to}' || '#' || to_char(COALESCE(MAX(SUBSTRING(id from 18)::int), 0) + 1, 'fm000000') FROM gratitudes WHERE "to" = '${partialEntity.to}')`
        })
        .returning('*')
        .execute();

    const rawGratitude = rawResult.raw.shift() as IRawGratitude;

    return GratitudeService.rawEntityToEntity(rawGratitude)
  }

  private static rawEntityToEntity(rawEntity: IRawGratitude): GratitudeEntity {
    return {
      ...rawEntity,
      createdAt: rawEntity.created_at
    }
  }
}
