import { Injectable } from '@nestjs/common';
import {
  CommissionCalculatorInputData,
  Commission,
  CommissionSettings,
  CommissionCurrency,
} from '../interfaces/transactions.types';
import { CurrencyRate } from '../interfaces/currency-rates.types';
import { transformMoneyToString } from '../utils/transform-money-to-string';

@Injectable()
export class CommissionCalculator {
  constructor(private readonly settings: CommissionSettings) {}

  calculate(
    data: CommissionCalculatorInputData,
    currencyRates: CurrencyRate,
  ): Commission {
    if (data.hasTurnoverDiscount) {
      return this.formatResponse(
        this.settings.discounts.turnover.transactionCostAfterDiscount,
        this.settings.discounts.turnover.currency,
      );
    }

    if (this.isAllowedToHaveClientDiscount(data.clientID)) {
      return this.formatResponse(
        this.settings.discounts.client.transactionCostAfterDiscount,
        this.settings.discounts.client.currency,
      );
    }

    const commission = this.getCommissionForThisTransaction(
      data.amount,
      currencyRates[data.currency],
      currencyRates[data.expectedCurrency],
    );

    if (
      this.shouldSetDefaultPrice(
        commission,
        currencyRates[data.expectedCurrency],
      )
    ) {
      return this.formatResponse(
        this.settings.defaultPrice.amount,
        this.settings.defaultPrice.currency,
      );
    }

    return this.formatResponse(commission, data.expectedCurrency);
  }

  private formatResponse(
    amount: number,
    currency: CommissionCurrency,
  ): Commission {
    return {
      amount: transformMoneyToString(amount),
      currency,
    };
  }

  private shouldSetDefaultPrice(
    commission: number,
    currencyRateToEuro: number,
  ): boolean {
    return (
      commission / currencyRateToEuro < this.settings.defaultPrice.amount / 100
    );
  }

  private isAllowedToHaveClientDiscount(clientID: number): boolean {
    return this.settings.discounts.client.idsOfClientsWithClientDiscount.includes(
      clientID,
    );
  }

  private getCommissionForThisTransaction(
    amount: string,
    currentCurrencyRateToEuro: number,
    expectedCurrencyRateToEuro: number,
  ): number {
    const amountInExpectedCurrency = this.getAmountInExpectedCurrency(
      amount,
      currentCurrencyRateToEuro,
      expectedCurrencyRateToEuro,
    );

    return amountInExpectedCurrency * 0.5;
  }

  private getAmountInExpectedCurrency(
    amount: string,
    currentCurrencyRateToEuro: number,
    expectedCurrencyRateToEuro: number,
  ): number {
    return (
      (parseFloat(amount) / currentCurrencyRateToEuro) *
      expectedCurrencyRateToEuro
    );
  }
}
