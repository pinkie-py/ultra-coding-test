import { Game } from '@prisma/client';

export interface GameDto extends Omit<Game, 'tags' | 'releaseDate'> {
  tags: string[];
  releaseDate: string;
}
