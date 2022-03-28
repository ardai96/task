/*
https://docs.nestjs.com/controllers#controllers
*/

import {
  Controller,
  Body,
  UsePipes,
  ValidationPipe,
  Put,
} from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import {
  CalculateCommission,
  Commission,
} from '../interfaces/transactions.types';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Put('commission-calculation')
  @UsePipes(ValidationPipe)
  commissionCalculation(
    @Body() data: CalculateCommission,
  ): Promise<Commission> {
    return this.transactionsService.calculateCommission(data);
  }
}
