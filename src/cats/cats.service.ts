import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { InjectRepository } from '@nestjs/typeorm';
import { Model } from 'mongoose';
import { Repository } from 'typeorm';
import * as schema from './cat.schema';
import { CreateCatDTO } from './dto/create-cat.dto';
import { Cat } from './entities/cat.entity';

type GithubUser = {
  name: string;
};

@Injectable()
export class CatsService {
  constructor(
    @InjectRepository(Cat)
    private catsRepository: Repository<Cat>,
    @InjectModel(schema.Cat.name)
    private catModel: Model<schema.CatDocument>,
    private httpService: HttpService,
  ) {}

  async create(createCatDTO: CreateCatDTO): Promise<Cat> {
    const typeormCat = this.catsRepository.create(createCatDTO);

    return this.catsRepository.save(typeormCat);
  }

  async noSqlCreate(createCatDTO: CreateCatDTO): Promise<schema.Cat> {
    const mongoCat = new this.catModel(createCatDTO);

    return mongoCat.save();
  }

  async findAll(): Promise<Cat[]> {
    return this.catsRepository.find();
  }

  async noSqlFindAll(): Promise<schema.Cat[]> {
    return this.catModel.find().exec();
  }

  async findOne(id: number): Promise<Cat> {
    const { data } = await this.httpService
      .get<GithubUser>('https://api.github.com/users/rvieceli')
      .toPromise();

    console.log(data.name);

    return this.catsRepository.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.catsRepository.delete(id);
  }
}
