import { IsString, IsNumber, IsDateString, IsDefined } from 'class-validator';

export class CalculateCommission {
  @IsString({ message: 'You must enter the amount in the format "100.00"' })
  @IsDefined()
  amount: string;

  @IsNumber()
  @IsDefined({ message: 'You must enter valid client id!' })
  client_id: number;

  @IsString()
  @IsDefined()
  currency: string;

  @IsDateString()
  @IsDefined()
  date: string;
}

export interface CommissionCalculatorInputData {
  amount: string;
  clientID: number;
  hasTurnoverDiscount: boolean;
  currency: string;
  expectedCurrency: CommissionCurrency;
}

export enum CommissionCurrency {
  EUR = 'EUR',
}

export interface Commission {
  amount: string;
  currency: CommissionCurrency;
}

export interface Discount {
  currency: CommissionCurrency;
  transactionCostAfterDiscount: number;
}

export interface ClientDiscount extends Discount {
  idsOfClientsWithClientDiscount: number[];
}

export interface TurnoverDiscount extends Discount {
  amountToTurnoverToGetDiscount: number;
}

export class CommissionSettings {
  defaultPrice: {
    amount: number;
    currency: CommissionCurrency;
  };
  discounts: {
    turnover: TurnoverDiscount;
    client: ClientDiscount;
  };
  defaultCommissionCurrency: CommissionCurrency.EUR;
}
