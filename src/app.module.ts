import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DbModule } from './db/db.module';
import { GamesModule } from './games/games.module';
import { PublisherModule } from './publisher/publisher.module';

@Module({
  imports: [
    GamesModule,
    DbModule,
    ConfigModule.forRoot({ isGlobal: true }),
    PublisherModule,
  ],
})
export class AppModule {}
