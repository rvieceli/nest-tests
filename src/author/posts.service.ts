import { Injectable } from '@nestjs/common';
import { Post } from './models/post.model';

@Injectable()
export class PostsService {
  async findAllByAuthor(id: number): Promise<Post[]> {
    const posts: Post[] = [...Array(5).keys()].map((key) => ({
      id: key,
      title: `Author ${id}, post ${key}`,
      votes: 0,
    }));

    return posts;
  }

  async upvoteById(id: number): Promise<Post> {
    return {
      id,
      title: `Post ${id}`,
      votes: id * 3,
    };
  }
}
