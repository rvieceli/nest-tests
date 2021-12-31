import { EntitySchema } from 'typeorm';
import { Photo } from '../photo.entity';

const PhotoSchema = new EntitySchema<Photo>({
  name: 'Photo',
  target: Photo,
  columns: {
    id: {
      type: Number,
      primary: true,
      generated: true,
    },
    name: {
      type: String,
    },
    user_id: {
      type: Number,
    },
  },
  relations: {
    user: {
      type: 'many-to-one',
      target: 'Photo',
    },
  },
});

export { PhotoSchema };
