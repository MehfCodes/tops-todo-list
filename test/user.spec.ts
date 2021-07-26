import test from 'japa';
import { Assert } from 'japa/build/src/Assert';
import supertest from 'supertest';

const BASE_URL = `http://${process.env.HOST}:${process.env.PORT}`;

test.group('/api/v1/auth', () => {
  test('/signup', async (assert: Assert) => {
    const user = {
      username: 'mehf4',
      password: '123456789',
      email: 'mehf3@gmail.com',
      phone_number: '09123698544',
    };
    await supertest(BASE_URL).post('/api/v1/auth/signup').send(user).expect(201);
  });
});
