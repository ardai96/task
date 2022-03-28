export type CurrencyRate = { [currency: string]: number };
export interface CurrencyRateRequestMeta {
  success: boolean;
  historical: boolean;
  base: string;
  date: string;
  rates: CurrencyRate;
}
