/*
https://docs.nestjs.com/exception-filters#custom-exceptions
*/

import { HttpException, HttpStatus } from '@nestjs/common';

export class NotPossibleToCheckRatesForThisDateException extends HttpException {
  constructor() {
    super('Is impossible to check rates for this date', HttpStatus.BAD_REQUEST);
  }
}
