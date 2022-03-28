/*
https://docs.nestjs.com/exception-filters#custom-exceptions
*/

import { HttpException, HttpStatus } from '@nestjs/common';

export class NotValidAmountException extends HttpException {
  constructor() {
    super('Not valid amount!', HttpStatus.BAD_REQUEST);
  }
}
