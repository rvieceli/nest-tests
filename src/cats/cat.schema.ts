import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Owner } from 'src/owner/owner.schema';

@Schema()
class Cat {
  @Prop({ required: true })
  name: string;

  @Prop()
  age: number;

  @Prop()
  breed: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Owner' })
  owner: Owner;
}

type CatDocument = Cat & mongoose.Document;

const CatSchema = SchemaFactory.createForClass(Cat);

export { Cat, CatSchema };

export type { CatDocument };
