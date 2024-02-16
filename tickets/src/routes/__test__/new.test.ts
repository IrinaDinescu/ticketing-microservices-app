import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';
import { natsWrapper } from '../../nats-wrapper';

it('has a route handler listening to /api/tickets for post request', async () => {
  const response = await request(app).post('/api/tickets').send({});

  expect(response.status).not.toEqual(404);
});

it('can only be accessed if the user is signed in', async () => {
  const response = await request(app).post('/api/tickets').send({});
  expect(response.status).toEqual(401);
});

it('returns a status other than 401 if the user is signed in', async () => {
  const cookie = await global.signup();
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({});

  expect(response.status).not.toEqual(401);
});

it('returns an error if an invalid title is provided', async () => {
  const cookie = await global.signup();
  await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: '',
      price: 10,
    })
    .expect(400);

  await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      price: 10,
    })
    .expect(400);
});

it('return an error if an invalid price is provided', async () => {
  const cookie = await global.signup();
  await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: 'asgsgsg',
      price: -10,
    })
    .expect(400);

  await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: 'asgsgsg',
    })
    .expect(400);
});

it('has a route handler listening to /api/tickets for post requests', async () => {});

it('creates a ticket with valid inputs', async () => {
  // add in a check to make sure a ticket was saved
  let tickets = await Ticket.find({});
  expect(tickets.length).toEqual(0);

  const cookie = await global.signup();

  await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: 'ticket',
      price: 20,
    })
    .expect(201);

  tickets = await Ticket.find({});
  expect(tickets.length).toEqual(1);
  expect(tickets[0].price).toEqual(20);
  expect(tickets[0].title).toEqual('ticket');
});

it('publishes an event', async () => {
  const cookie = await global.signup();

  await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: 'ticket',
      price: 20,
    })
    .expect(201);

  // console.log(natsWrapper);
  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
