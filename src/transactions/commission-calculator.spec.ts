import {
  CommissionSettings,
  CommissionCurrency,
} from '../interfaces/transactions.types';
import { CommissionCalculator } from './commission calculator';
import { transformMoneyToString } from '../utils/transform-money-to-string';

describe('CommissionCalculator', () => {
  let commissionCalculator: CommissionCalculator;
  let settings: CommissionSettings = {
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
  };

  beforeEach(() => {
    commissionCalculator = new CommissionCalculator(settings);
  });

  it('should apply turnover discount', async () => {
    const result = commissionCalculator.calculate(
      {
        amount: '1000.00',
        currency: 'EUR',
        clientID: 5,
        expectedCurrency: CommissionCurrency.EUR,
        hasTurnoverDiscount: true,
      },
      { EUR: 1 },
    );

    expect(result.amount).toBe(
      transformMoneyToString(
        settings.discounts.turnover.transactionCostAfterDiscount,
      ),
    );
    expect(result.currency).toBe(settings.discounts.turnover.currency);
  });

  it('should apply client discount if user is allowed to get one', async () => {
    const result = commissionCalculator.calculate(
      {
        amount: '1000.00',
        currency: 'EUR',
        clientID: 42,
        expectedCurrency: CommissionCurrency.EUR,
        hasTurnoverDiscount: false,
      },
      { EUR: 1 },
    );

    expect(result.amount).toBe(
      transformMoneyToString(
        settings.discounts.client.transactionCostAfterDiscount,
      ),
    );
    expect(result.currency).toBe(settings.discounts.client.currency);
  });

  it('should apply turnover discount if user is allowed to get one even if he has client discount', async () => {
    const result = commissionCalculator.calculate(
      {
        amount: '1000.00',
        currency: 'EUR',
        clientID: 42,
        expectedCurrency: CommissionCurrency.EUR,
        hasTurnoverDiscount: true,
      },
      { EUR: 1 },
    );

    expect(result.amount).toBe(
      transformMoneyToString(
        settings.discounts.turnover.transactionCostAfterDiscount,
      ),
    );
    expect(result.currency).toBe(settings.discounts.turnover.currency);
  });

  it('should set default price', async () => {
    const result = commissionCalculator.calculate(
      {
        amount: '0.01',
        currency: 'EUR',
        clientID: 2,
        expectedCurrency: CommissionCurrency.EUR,
        hasTurnoverDiscount: false,
      },
      { EUR: 1 },
    );

    expect(result.amount).toBe('0.05');
    expect(result.currency).toBe(CommissionCurrency.EUR);
  });

  it('should calculate transaction commission price', async () => {
    const result = commissionCalculator.calculate(
      {
        amount: '10000.00',
        currency: 'EUR',
        clientID: 2,
        expectedCurrency: CommissionCurrency.EUR,
        hasTurnoverDiscount: false,
      },
      { EUR: 1 },
    );

    expect(result.amount).toBe('50.00');
    expect(result.currency).toBe(CommissionCurrency.EUR);
  });

  it('should calculate transaction commission price', async () => {
    const result = commissionCalculator.calculate(
      {
        amount: '6000.00',
        currency: 'PLN',
        clientID: 2,
        expectedCurrency: CommissionCurrency.EUR,
        hasTurnoverDiscount: false,
      },
      { EUR: 1, PLN: 5 },
    );

    expect(result.amount).toBe('6.00');
    expect(result.currency).toBe(CommissionCurrency.EUR);
  });
});
