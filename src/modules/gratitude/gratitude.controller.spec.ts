// @ts-ignore
import request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from '../../app.module';
import { configApp } from "../../config/test.config";
import { GratitudeCreateDto } from './dto/gratitudeCreate.dto';
import { GratitudeRepository } from './gratitude.repository';
import { GratitudeCollectionDto } from './dto/gratitudeCollection.dto';
import { GratitudeDto } from './dto/gratitude.dto';
import { IGratitudeManyFilter } from './gratitude.types';

describe('Gratitude controller Api Tests', () => {
  let app: INestApplication;
  const urlEndpoint = '/gratitudes';

  let gratitudeRepository: GratitudeRepository;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = module.createNestApplication();
    app = await configApp(app);

    await app.init();

    gratitudeRepository = app.get<GratitudeRepository>(GratitudeRepository)
  });

  describe('POST /gratitudes', () => {
    const gratitudeCreateDto: GratitudeCreateDto = {
      from: '1111222233334444',
      to: '4444333322221111',
      reason: 'Test reason'
    };

    afterAll(async () => {
      await gratitudeRepository.delete({})
    });

    it('Should create gratitude', async () => {
      await request(app.getHttpServer())
        .post(urlEndpoint)
        .send(gratitudeCreateDto)
        .expect(201)
        .expect((response) => {
          const data = response.body;

          expect(Object.keys(data)).toEqual(['from', 'reason']);
        });

      const entity = await gratitudeRepository.findOne({ reason: gratitudeCreateDto.reason });
      expect(entity).not.toBeUndefined();
      expect(entity!.id).toEqual('4444333322221111#000001')
    });

    it('Should return 422', async () => {
      return request(app.getHttpServer())
        .post(urlEndpoint)
        .send({})
        .expect(422)
    });
  });

  describe('GET /gratitudes', () => {
    const to = '5555666677778888';

    beforeAll(async () => {
      const firstEntity = gratitudeRepository.create({
        to,
        from: null,
        reason: 'reason 1',
        id: `${to}#000001`
      });

      const secondEntity = gratitudeRepository.create({
        to,
        from: '0000111122223333',
        reason: 'reason 2',
        id: `${to}#000002`
      });

      const thirdEntity = gratitudeRepository.create({
        to,
        from: '0000111122223333',
        reason: 'reason 3',
        id: `${to}#000003`
      });

      const fourthEntity = gratitudeRepository.create({
        to: '9999888877776666',
        from: '0000111122223333',
        reason: 'reason 4',
        id: `9999888877776666#000001`
      });

      await gratitudeRepository.save(firstEntity);
      await gratitudeRepository.save(secondEntity);
      await gratitudeRepository.save(thirdEntity);
      await gratitudeRepository.save(fourthEntity);

    });

    it('Should return category list (query by id and perPage)', async () => {
      return request(app.getHttpServer())
        .get(urlEndpoint)
        .query({ perPage: 2, id: to })
        .expect(200)
        .expect((response) => {
          const body: GratitudeCollectionDto = response.body;

          expect(body.items).toBeInstanceOf(Array);
          expect(body.total).toEqual(3);
          expect(body.items.length).toEqual(2);
          expect(body.nextCursor).not.toBeUndefined();

          body.items.forEach((item: GratitudeDto) => {
            expect(Object.keys(item)).toEqual(['from', 'reason']);
          });

          const filter = JSON.parse(
            decodeURIComponent(Buffer.from(body.nextCursor!, 'base64').toString())
          ) as IGratitudeManyFilter;

          expect(filter.to).toEqual(to);
          expect(filter.perPage).toEqual(2);
          expect(filter.cursorId).toEqual(`${to}#000002`)
        });
    });

    it('Should return category list (query by cursor)', async () => {
      const res = await request(app.getHttpServer())
        .get(urlEndpoint)
        .query({ perPage: 2, id: to })
        .expect(200);

      const cursor = res.body.nextCursor;

      return  request(app.getHttpServer())
        .get(urlEndpoint)
        .query({ cursor: cursor })
        .expect(200)
        .expect((response) => {
          const body: GratitudeCollectionDto = response.body;

          expect(body.items).toBeInstanceOf(Array);
          expect(body.total).toEqual(3);
          expect(body.items.length).toEqual(1);
          expect(body.nextCursor).toBeUndefined();

          body.items.forEach((item: GratitudeDto) => {
            expect(Object.keys(item)).toEqual(['from', 'reason']);
          });
        });
    });

    it('Should return 422', async () => {
      return request(app.getHttpServer())
        .get(urlEndpoint)
        .query({})
        .expect(422)
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
