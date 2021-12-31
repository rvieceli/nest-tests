import {
  Args,
  Resolver,
  Int,
  ResolveField,
  Parent,
  Query,
  Mutation,
  Subscription,
} from '@nestjs/graphql';
import { AuthorsService } from './authors.service';
import { Author } from './models/author.model';
import { Post } from './models/post.model';
import { PostsService } from './posts.service';
import { Inject } from '@nestjs/common';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import { PUB_SUB } from 'src/pubSub/constants';

@Resolver(() => Author)
class AuthorsResolver {
  constructor(
    private authorsService: AuthorsService,
    private postsService: PostsService,
    @Inject(PUB_SUB)
    private pubSub: RedisPubSub,
  ) {}

  @Query(() => Author)
  async author(@Args('id', { type: () => Int }) id: number) {
    return this.authorsService.findOne(id);
  }

  @ResolveField()
  async posts(@Parent() author: Author) {
    const { id } = author;

    return this.postsService.findAllByAuthor(id);
  }

  @Mutation(() => Post)
  async upvote(@Args({ name: 'postId', type: () => Int }) postId: number) {
    const postUpvoted = await this.postsService.upvoteById(postId);

    this.pubSub.publish('postUpvoted', { postUpvoted });

    return postUpvoted;
  }

  @Subscription(() => Post)
  postUpvoted() {
    return this.pubSub.asyncIterator('postUpvoted');
  }
}

export { AuthorsResolver };
