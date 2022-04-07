import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class DbService extends PrismaClient {
  constructor(private config: ConfigService) {
    super({
      datasources: {
        db: {
          url: config.get('DATABASE_URL'),
        },
      },
    });

    if (process.env.LOAD_DUMMY_DATA) {
      this.publisher
        .create({
          data: {
            id: +process.env.LOAD_DUMMY_DATA,
            name: 'EA',
            siret: 1,
            phone: '1234567890',
          },
        })
        .catch(() => null);
    }
  }
}
