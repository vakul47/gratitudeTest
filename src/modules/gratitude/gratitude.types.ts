import { GratitudeEntity } from '@app/modules/gratitude/gratitude.entity';

export interface IGratitudeManyFilter {
  to?: string;
  perPage?: number;
  cursorId?: string;
}

export interface IRawGratitude {
  id: string;
  created_at: Date;
  from: string;
  to: string;
  reason: string;
  is_last?: boolean;
}

export class IGratitudesManyResult {
  entities: GratitudeEntity[];
  total: number;
  isLastPage: boolean;
  cursorId?: string;
}
