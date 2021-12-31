import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Cat } from 'src/cats/cat.schema';

@Schema()
class Owner {
  @Prop({ required: true })
  name: string;

  @Prop()
  email: string;

  @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: 'Cat' })
  cats: Cat[];
}

type OwnerDocument = Owner & mongoose.Document;

const OwnerSchema = SchemaFactory.createForClass(Owner);

export { Owner, OwnerSchema };

export type { OwnerDocument };
