import { HttpException, HttpStatus } from '@nestjs/common';

class ForbiddenException extends HttpException {
  constructor(message = 'Forbidden') {
    super(message, HttpStatus.FORBIDDEN);
  }
}

export { ForbiddenException };
