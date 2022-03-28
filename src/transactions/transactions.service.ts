import { Injectable } from '@nestjs/common';
import { CommissionCalculator } from './commission calculator';
import { CurrencyRatesService } from '../currency-rates/currency-rates.service';
import { CurrencyRateRequestMeta } from '../interfaces/currency-rates.types';
import {
  CalculateCommission,
  CommissionSettings,
  Commission,
} from '../interfaces/transactions.types';
import { NotValidAmountException } from '../errors/not-valid-amount.exception';

@Injectable()
export class TransactionsService {
  constructor(
    private readonly commissionCalculator: CommissionCalculator,
    private readonly currencyRatesService: CurrencyRatesService,
    private readonly commissionSettings: CommissionSettings,
  ) {}

  public async calculateCommission(
    data: CalculateCommission,
  ): Promise<Commission> {
    if (isNaN(+data.amount)) {
      throw new NotValidAmountException();
    }

    const currencyRates: CurrencyRateRequestMeta =
      await this.currencyRatesService.getCurrencyRates(data.date).toPromise();

    return this.commissionCalculator.calculate(
      {
        amount: data.amount,
        clientID: data.client_id,
        hasTurnoverDiscount: this.hasTurnoverDiscount(),
        currency: data.currency,
        expectedCurrency: this.commissionSettings.defaultCommissionCurrency,
      },
      currencyRates.rates,
    );
  }

  private hasTurnoverDiscount(): boolean {
    return false; //???
  }
}
