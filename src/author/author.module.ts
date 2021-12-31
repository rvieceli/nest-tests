import { Module } from '@nestjs/common';
import { AuthorsResolver } from './authors.resolver';
import { AuthorsService } from './authors.service';
import { PostsService } from './posts.service';

@Module({
  providers: [AuthorsService, PostsService, AuthorsResolver],
})
export class AuthorModule {}
