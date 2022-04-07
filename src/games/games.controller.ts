import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { GamesService } from './games.service';

@Controller('games')
export class GamesController {
  constructor(private gamesService: GamesService) {}

  @Get('spring-cleaning')
  springCleaning() {
    return this.gamesService.springCleaning();
  }

  @Get()
  findAll() {
    return this.gamesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.gamesService.findOne(+id);
  }

  @Post()
  add(@Body() dto: Parameters<GamesService['add']>[0]) {
    return this.gamesService.add(dto);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: Parameters<GamesService['update']>[0],
  ) {
    return this.gamesService.update(dto, +id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.gamesService.remove(+id);
  }
}
