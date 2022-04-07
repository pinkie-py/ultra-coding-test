import {
  BadRequestException,
  GatewayTimeoutException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { GamesService } from '../games/games.service';

export const GAME_ID_TAKEN = 'Game ID already in use';
export const PUBLISHER_NOT_EXISTS = "Publisher doesn't exist";
export const INVALID_INPUT = 'Invalid input data';
export const DATABASE_UNREACHABLE = "Couldn't reach the database";
export const NO_NULL_VALUES = "Values can't be null";
export const ALL_FIELDS_PRESENT = 'All fields must be present';

export function prismaErrorCodes(error: Error) {
  console.log(error.message);
  if (error instanceof PrismaClientKnownRequestError) {
    // primary key constraint errors
    if (error.code === 'P2002') throw new BadRequestException(GAME_ID_TAKEN);

    // foreign key contraint errors
    if (error.code === 'P2003')
      throw new BadRequestException(PUBLISHER_NOT_EXISTS);

    // Insufficient input data
    if (error.code === 'P2025') throw new NotFoundException();

    // invalid input data
    if (['P2000', 'P2006', 'P2019', 'P2020'].includes(error.code))
      throw new BadRequestException();

    // database problems
    if (['P1002', 'P1008'].includes(error.code))
      throw new GatewayTimeoutException(DATABASE_UNREACHABLE);

    throw new InternalServerErrorException();
  }
  throw error;
}

export function checkForNull(dto: any) {
  dto = dto || {};
  if (Object.values(dto).includes(null))
    throw new BadRequestException(NO_NULL_VALUES);
}

export function allGameFieldsPresent(dto: Parameters<GamesService['add']>[0]) {
  dto = dto || ({} as any);
  if (
    dto.price === undefined ||
    dto.publisherId === undefined ||
    dto.releaseDate === undefined ||
    dto.tags === undefined ||
    dto.title === undefined
  )
    throw new BadRequestException(ALL_FIELDS_PRESENT);
}
