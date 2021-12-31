import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { ObjectSchema } from 'joi';

@Injectable()
class JoiValidationPipe implements PipeTransform {
  constructor(private schema: ObjectSchema) {}

  transform(
    value: any,
    // , metadata: ArgumentMetadata
  ) {
    const { error } = this.schema.validate(value);

    if (error) {
      throw new BadRequestException(error, 'Validation failed');
    }

    return value;
  }
}

export { JoiValidationPipe };
