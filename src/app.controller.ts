import {
  CacheInterceptor,
  CacheKey,
  CacheTTL,
  Controller,
  Get,
  UseInterceptors,
} from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @UseInterceptors(CacheInterceptor)
  @CacheKey('app@get')
  @CacheTTL(10)
  getHello(): string {
    return this.appService.getHello();
  }
}
