import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { Module, HttpModule } from '@nestjs/common';
import { CurrencyRatesModule } from '../currency-rates/currency-rates.module';
import { CommissionCalculator } from './commission calculator';
import {
  CommissionSettings,
  CommissionCurrency,
} from '../interfaces/transactions.types';
import { CurrencyRatesService } from '../currency-rates/currency-rates.service';

@Module({
  imports: [CurrencyRatesModule, HttpModule],
  controllers: [TransactionsController],
  providers: [
    {
      provide: CommissionSettings,
      useValue: {
        defaultCommissionCurrency: CommissionCurrency.EUR,
        discounts: {
          client: {
            currency: CommissionCurrency.EUR,
            transactionCostAfterDiscount: 5,
            idsOfClientsWithClientDiscount: [42],
          },
          turnover: {
            currency: CommissionCurrency.EUR,
            transactionCostAfterDiscount: 3,
            amountToTurnoverToGetDiscount: 100000,
          },
        },
        defaultPrice: {
          amount: 5,
          currency: CommissionCurrency.EUR,
        },
      } as CommissionSettings,
    },
    TransactionsService,
    CommissionCalculator,
    CurrencyRatesService,
  ],
})
export class TransactionsModule {}
