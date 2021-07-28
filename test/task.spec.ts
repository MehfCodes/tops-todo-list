import test from 'japa';
import { Assert } from 'japa/build/src/Assert';
import supertest from 'supertest';

const BASE_URL = `http://${process.env.HOST}:${process.env.PORT}/api/v1/todos/`;

test.group('/api/v1/todos', () => {
  async function login() {
    const user = {
      username: 'mehf',
      password: '123456789',
    };
    const res = await supertest(`http://${process.env.HOST}:${process.env.PORT}/api/v1/auth/`)
      .post('login')
      .send(user);
    const accessToken = res.body.data.accessToken;
    return accessToken;
  }

  test('store', async (assert: Assert) => {
    let token = await login();
    const task = {
      status: 'todo',
      note: 'create todo programm.',
    };

    const res = await supertest(BASE_URL)
      .post('')
      .send(task)
      .set('x-access-token', `Bearer ${token}`);
    assert.equal(res.statusCode, 201, 'task was created');
  });

  test('store -- ERROR : validation error during store', async (assert: Assert) => {
    let token = await login();
    const task = {
      note: 'create todo programm.',
    };

    const res = await supertest(BASE_URL)
      .post('')
      .send(task)
      .set('x-access-token', `Bearer ${token}`);

    assert.equal(res.statusCode, 406, 'task was not created');
  });

  test('index', async (assert: Assert) => {
    let token = await login();
    const res = await supertest(BASE_URL).get('').set('x-access-token', `Bearer ${token}`);
    assert.equal(res.statusCode, 200, 'return all tasks');
  });
  test('index -- ERROR : protected', async (assert: Assert) => {
    const res = await supertest(BASE_URL).get('');
    assert.equal(res.statusCode, 401, 'Unauthorized');
  });
  test('update status', async (assert: Assert) => {
    let token = await login();
    const res = await supertest(BASE_URL)
      .put('1')
      .send({ status: 'doing' })
      .set('x-access-token', `Bearer ${token}`);
    assert.equal(res.statusCode, 200, 'update todo');
  });
  test('delete a todo', async (assert: Assert) => {
    let token = await login();
    const res = await supertest(BASE_URL).delete('1').set('x-access-token', `Bearer ${token}`);
    assert.equal(res.statusCode, 200, 'delete a todo');
  });
});
