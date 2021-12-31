import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
class Post {
  @Field(() => Int)
  id: number;

  @Field({ description: 'Post title' })
  title: string;

  @Field(() => Int, { nullable: true })
  votes?: number;

  @Field()
  createdAt?: Date;
}

export { Post };
