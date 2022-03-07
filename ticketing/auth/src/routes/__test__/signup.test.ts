import request from 'supertest';
import { app } from '../../app';

it('returns a 201 on successful signup', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'testutk10@test.com',
      password: 'password',
    })
    .expect(201);
});

it('returns 400 with an invalid email', async () => {
  return request(app)
    .post('/api/users/signup')
    .send({
      email: 'asbdhjabdjabdjakbdjak',
      password: 'password',
    })
    .expect(400);
});

it('returns 400 with an invalid password', async () => {
  return request(app)
    .post('/api/users/signup')
    .send({
      email: 'test10@test.com',
      password: 'p',
    })
    .expect(400);
});

it('returns 400 with missing email and password', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({ email: 'test@test.com' })
    .expect(400);
  await request(app)
    .post('/api/users/signup')
    .send({ password: 'asdadadad' })
    .expect(400);
});

it('dissallows duplicate emails', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'asdadadad',
    })
    .expect(201);

  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'asdadadad',
    })
    .expect(400);
});

it('sets a cookie after successfull signup', async () => {
  const response = await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'asdadadad',
    })
    .expect(201);
  expect(response.get('Set-Cookie')).toBeDefined();
});
