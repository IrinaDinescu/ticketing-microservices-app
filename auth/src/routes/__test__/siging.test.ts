import request from 'supertest';
import {app} from '../../app';

it('fails when an email that does not eixsts is supplied', async () => {
    await request(app)
        .post('/api/users/signin')
        .send({
            email: 'test@test.com',
            password: 'password'
        })
        .expect(400);
});

it('fails when an inccorect password is supplied', async () => {
    await request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@test.com',
            password: 'password'
        })
        .expect(201);
    
    await request(app)
        .post('/api/users/signin')
        .send({
            email: 'test@test.com',
            password: '12234'
        })
        .expect(400);
});

it('responds with a cookie when given valid credetials', async () => {
    await request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@test.com',
            password: 'password'
        })
        .expect(201);

    const response = await request(app)
        .post('/api/users/signin')
        .send({
            email: 'test@test.com',
            password: 'password'
        })
        .expect(200);

    expect(response.get('Set-Cookie')).toBeDefined();
});