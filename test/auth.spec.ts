import test from 'japa';
import { Assert } from 'japa/build/src/Assert';
import supertest from 'supertest';

const BASE_URL = `http://${process.env.HOST}:${process.env.PORT}/api/v1/auth/`;

test.group('/api/v1/auth', () => {
  test('/signup', async (assert: Assert) => {
    const user = {
      username: 'mehf',
      password: '123456789',
      email: 'mehf@gmail.com',
      phone_number: '09123698544',
    };
    const res = await supertest(BASE_URL).post('signup').send(user);
    assert.equal(res.statusCode, 201, 'user successfully signed up');
  });

  test('/signup -- ERROR : validation error during signup', async (assert: Assert) => {
    const user = {
      password: '123456789',
      email: 'mehf@gmail.com',
      phone_number: '09123698544',
    };
    const res = await supertest(BASE_URL).post('signup').send(user);
    const field = res.body.errors[0].field;
    assert.equal(field, 'username', 'signup failed.');
  });

  test('/login', async (assert: Assert) => {
    const user = {
      username: 'mehf',
      password: '123456789',
    };
    const res = await supertest(BASE_URL).post('login').send(user);
    assert.equal(res.statusCode, 200, 'user successfully signed up');
  });
  test('/login -- ERROR : user not found during login', async (assert: Assert) => {
    const user = {
      username: 'mehf2',
      password: '123456789',
    };
    const res = await supertest(BASE_URL).post(`login`).send(user);
    assert.equal(res.statusCode, 404, 'user not found');
  });

  test('/login -- ERROR: incurrect password during login', async (assert: Assert) => {
    const user = {
      username: 'mehf',
      password: '123456788',
    };
    const res = await supertest(BASE_URL).post(`login`).send(user);
    assert.equal(res.statusCode, 401, 'incorrect password');
  });
  test('/login -- ChECK : existing of the access token', async (assert: Assert) => {
    const user = {
      username: 'mehf',
      password: '123456789',
    };
    const res = await supertest(BASE_URL).post('login').send(user);
    const accessToken = res.body.data.accessToken;
    assert.exists(accessToken, 'access token generated');
  });
  test('/login -- ChECK : existing of the refresh token', async (assert: Assert) => {
    const user = {
      username: 'mehf',
      password: '123456789',
    };
    const res = await supertest(BASE_URL).post('login').send(user);
    const refreshToken = res.body.data.refreshToken;
    assert.exists(refreshToken, 'refresh token generated');
  });
});
