import { TransactionsModule } from './transactions/transactions.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [TransactionsModule],
  providers: [],
})
export class AppModule {}
