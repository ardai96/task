import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/transactions/commission-calculation (PUT) success calculation', () => {
    return request(app.getHttpServer())
      .put('/transactions/commission-calculation')
      .send({
        amount: '1000.00',
        client_id: 5,
        currency: 'PLN',
        date: '2021-03-01',
      })
      .expect(200)
      .expect({ amount: '1.10', currency: 'EUR' });
  });

  it('/transactions/commission-calculation (PUT) validation error', () => {
    return request(app.getHttpServer())
      .put('/transactions/commission-calculation')
      .send({
        amount: '1000.00',
        currency: 'PLN',
        date: '2021-03-01',
      })
      .expect(400);
  });

  it('/transactions/commission-calculation (PUT) invalid date', () => {
    return request(app.getHttpServer())
      .put('/transactions/commission-calculation')
      .send({
        amount: '1000.00',
        currency: 'PLN',
        date: '1021-03-01',
      })
      .expect(400);
  });

  it('/transactions/commission-calculation (PUT) invalid amount', () => {
    return request(app.getHttpServer())
      .put('/transactions/commission-calculation')
      .send({
        amount: '1000.asd00',
        currency: 'PLN',
        date: '2021-03-01',
      })
      .expect(400);
  });
});
