import {
  Injectable,
  HttpService,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { CurrencyRateRequestMeta } from 'src/interfaces/currency-rates.types';
import { map, catchError } from 'rxjs/operators';
import { AxiosResponse, AxiosError } from 'axios';
import { NotPossibleToCheckRatesForThisDateException } from '../errors/not-possible-to-check-rate-for-this-date.exception';

@Injectable()
export class CurrencyRatesService {
  constructor(private readonly httpService: HttpService) {}

  public getCurrencyRates(
    date: string = '2021-01-01',
  ): Observable<CurrencyRateRequestMeta> {
    return this.httpService.get(`https://api.exchangerate.host/${date}`).pipe(
      map((response: AxiosResponse<CurrencyRateRequestMeta>) => response.data),
      catchError((error: AxiosError<unknown>) => {
        if (error.response.status === HttpStatus.NOT_FOUND) {
          throw new NotPossibleToCheckRatesForThisDateException();
        }

        throw error;
      }),
    );
  }
}
