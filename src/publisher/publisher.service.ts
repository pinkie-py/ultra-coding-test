import { Injectable, NotFoundException } from '@nestjs/common';
import { DbService } from '../db/db.service';
import { prismaErrorCodes } from '../helpers/errors';

@Injectable()
export class PublisherService {
  constructor(private dbService: DbService) {}

  async findOne(id: number) {
    try {
      const data = await this.dbService.game.findUnique({
        where: { id },
        include: { publisher: true },
      });
      if (!data) throw new NotFoundException();

      return data.publisher;
    } catch (error) {
      prismaErrorCodes(error);
    }
  }
}
