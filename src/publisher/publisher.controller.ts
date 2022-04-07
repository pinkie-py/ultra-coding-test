import { Controller, Get, Param } from '@nestjs/common';
import { PublisherService } from './publisher.service';

@Controller('games')
export class PublisherController {
  constructor(private readonly publisherService: PublisherService) {}

  @Get(':id/publisher')
  findOne(@Param('id') id: string) {
    return this.publisherService.findOne(+id);
  }
}
