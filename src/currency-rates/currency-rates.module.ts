import { CurrencyRatesService } from './currency-rates.service';
import { Module, HttpModule } from '@nestjs/common';

@Module({
  imports: [HttpModule],
  controllers: [],
  providers: [CurrencyRatesService],
})
export class CurrencyRatesModule {}
