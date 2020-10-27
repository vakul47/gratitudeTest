import { Body, Controller, Get, HttpCode, HttpStatus, Post, Query } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags, ApiUnprocessableEntityResponse } from '@nestjs/swagger';
import { GratitudeService } from '@app/modules/gratitude/gratitude.service';
import { GratitudeQueryDto } from '@app/modules/gratitude/dto/gratitudeQuery.dto';
import { GratitudeCreateDto } from '@app/modules/gratitude/dto/gratitudeCreate.dto';
import { GratitudeDto } from '@app/modules/gratitude/dto/gratitude.dto';
import { IGratitudeManyFilter, IGratitudesManyResult } from '@app/modules/gratitude/gratitude.types';
import { GratitudeCollectionDto } from '@app/modules/gratitude/dto/gratitudeCollection.dto';

@Controller('gratitudes')
@ApiTags('gratitudes')
export class GratitudeController {
  constructor(
    private readonly gratitudeService: GratitudeService
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create gratitude' })
  @ApiOkResponse({ type: GratitudeDto })
  public async create(
    @Body() gratitudeCreateDto: GratitudeCreateDto
  ): Promise<GratitudeDto> {
    const entity = await this.gratitudeService.create(gratitudeCreateDto);

    return new GratitudeDto(entity);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'List of gratitudes by recipient' })
  @ApiOkResponse({ type: GratitudeCollectionDto })
  @ApiUnprocessableEntityResponse()
  public async getList(
    @Query() gratitudeQueryDto: GratitudeQueryDto
  ): Promise<GratitudeCollectionDto> {
    const filter = GratitudeController.getFilter(gratitudeQueryDto);

    const gratitudesManyResult = await this.gratitudeService.getMany(filter);

    const nextCursor = GratitudeController.getNextCursor(gratitudesManyResult, filter);

    return new GratitudeCollectionDto(gratitudesManyResult.entities, gratitudesManyResult.total, nextCursor);
  }

  private static getFilter(gratitudeQueryDto: GratitudeQueryDto): IGratitudeManyFilter {
    if (gratitudeQueryDto.cursor) {
      return JSON.parse(
        decodeURIComponent(Buffer.from(gratitudeQueryDto.cursor, 'base64').toString())
      ) as IGratitudeManyFilter;
    } else {
      return  {
        to: gratitudeQueryDto.id,
        perPage: gratitudeQueryDto.perPage
      };
    }
  }

  private static getNextCursor(
    gratitudesManyResult: IGratitudesManyResult,
    filter: IGratitudeManyFilter
  ): string | undefined {
    if (!gratitudesManyResult.isLastPage) {
      const cursorData = {
        ...filter,
        cursorId: gratitudesManyResult.cursorId
      };

      return Buffer.from(encodeURIComponent(JSON.stringify(cursorData))).toString('base64');
    }

    return;
  }
}
