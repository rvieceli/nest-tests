import { IsInt, IsString } from 'class-validator';

class UpdateCatDTO {
  @IsString()
  name: string;

  @IsInt()
  age: number;

  @IsString()
  breed: string;
}

export { UpdateCatDTO };
