import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DbService } from '../db/db.service';
import {
  allGameFieldsPresent,
  checkForNull,
  INVALID_INPUT,
  prismaErrorCodes,
} from '../helpers/errors';
import { GameDto } from './dto/game.dto';

@Injectable()
export class GamesService {
  constructor(private dbService: DbService) {}

  async springCleaning() {
    let now = Date.now();

    // resets the timestamp to 12 am on the same day
    now = now - (now % 86400000);
    // epoch reference to 18 months ago
    const months18 = new Date(now - 86400000 * 30.5 * 18);
    // epoch reference to 12 months ago
    const months12 = new Date(now - 86400000 * 30.5 * 12);

    try {
      const updates = this.dbService.game.updateMany({
        where: {
          releaseDate: {
            gte: months18,
            lt: months12,
          },
        },
        data: {
          price: {
            multiply: 0.8,
          },
        },
      });

      const deletions = this.dbService.game.deleteMany({
        where: {
          releaseDate: {
            lt: months18,
          },
        },
      });

      const data = await Promise.all([updates, deletions]);

      return {
        discounted: data[0].count,
        deleted: data[1].count,
      };
    } catch (error) {
      prismaErrorCodes(error);
    }
  }

  async findAll() {
    try {
      const data = await this.dbService.game.findMany({
        include: { publisher: true },
      });
      if (!data) throw new NotFoundException();

      // splits csv-formatted tags into string[], as per spec
      return data.map((v) => ({ ...v, tags: v.tags.split(';') }));
    } catch (error) {
      prismaErrorCodes(error);
    }
  }

  async findOne(id: number) {
    try {
      const data = await this.dbService.game.findUnique({
        where: { id },
        include: { publisher: true },
      });
      if (!data) throw new NotFoundException();

      return { ...data, tags: data.tags.split(';') };
    } catch (error) {
      prismaErrorCodes(error);
    }
  }

  async add(dto: Omit<GameDto, 'id'> & { id?: number }) {
    checkForNull(dto);
    allGameFieldsPresent(dto);

    let typeExchange: any;

    // in case improper date string was supplied
    try {
      typeExchange = {
        releaseDate: new Date(dto.releaseDate),
        tags: dto.tags.join(';'),
      };
    } catch (error) {
      throw new BadRequestException(INVALID_INPUT);
    }

    try {
      await this.dbService.game.create({
        data: {
          ...dto,
          ...typeExchange,
        },
      });
    } catch (error) {
      prismaErrorCodes(error);
    }
  }

  async update(dto: Partial<GameDto>, id: number) {
    checkForNull(dto);
    let typeExchange: any;

    try {
      typeExchange = {
        releaseDate: dto.releaseDate ? new Date(dto.releaseDate) : undefined,
        tags: dto.tags ? dto.tags.join(';') : undefined,
      };
    } catch (error) {
      throw new BadRequestException(INVALID_INPUT);
    }

    try {
      const data = await this.dbService.game.update({
        data: { ...dto, ...typeExchange },
        where: { id },
      });
      if (!data) throw new NotFoundException();
    } catch (error) {
      prismaErrorCodes(error);
    }
  }

  async remove(id: number) {
    try {
      const data = await this.dbService.game.delete({ where: { id } });
      if (!data) throw new NotFoundException();
    } catch (error) {
      prismaErrorCodes(error);
    }
  }
}
