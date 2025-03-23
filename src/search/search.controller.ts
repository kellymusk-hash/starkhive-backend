import { Controller, Get, Query } from '@nestjs/common';
import { SearchService } from './search.service';
import { SearchDto } from './search.dto';

@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get('messages')
  async searchMessages(@Query() searchDto: SearchDto) {
    return this.searchService.searchMessages(searchDto);
  }
}