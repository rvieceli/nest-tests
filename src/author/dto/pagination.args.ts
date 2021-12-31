import { ArgsType, Field, Int } from '@nestjs/graphql';

@ArgsType()
class PaginationArgs {
  @Field((_type) => Int)
  offset = 0;

  @Field((_type) => Int)
  limit = 10;
}

export { PaginationArgs };
