import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/tickets'
import { natsWrapper } from '../../nats-wrapper';

it('has a route handler to /api/tickets for posts request', async () => {
    const response = await request(app)
        .post('/api/tickets')
        .send({});

    expect(response.status).not.toEqual(404);
});

it('can only be accessed if the user is signed in', async () => {
    const response = await request(app)
        .post('/api/tests')
        .send({})
        .expect(401)
});

it('return a status other than 401 if the user is signed in', async () => {
    const response = await request(app)
        .post('/api/tests')
        .set('Cookie',global.signin())
        .send({})
    
    expect(response.status).not.toEqual(401)
});
     

it('returns an error if an invalid title is provided', async () => {
    await request(app)
        .post('/api/tickets')
        .set('Cookie',global.signin())
        .send({
            title: '',
            price: 10
        })
        .expect(400)
    await request(app)
        .post('/api/tickets')
        .set('Cookie',global.signin())
        .send({
            price: 10
        })
        .expect(400)
    });

it('return an error if invalid price is provided', async () => {
    await request(app)
        .post('/api/tickets')
        .set('Cookie',global.signin())
        .send({
            title: 'asdad',
            price: -10
        })
        .expect(400)
    await request(app)
        .post('/api/tickets')
        .set('Cookie',global.signin())
        .send({
            title: 'sdfasfasd',
        })
        .expect(400)
});

it('creates a tickets with valid inputs', async () => {
    let tickets = await Ticket.find({});
    expect(tickets.length).toEqual(0);
    const title = 'asdasd'
    await request(app)
        .post('/api/tickets')
        .set('Cookie',global.signin())
        .send({
            title,
            price: 20
        })
        .expect(201)

    tickets = await Ticket.find({});
    expect(tickets.length).toEqual(1);
    expect(tickets[0].price).toEqual(20);
    expect(tickets[0].title).toEqual(title);
});

it('publishes an event', async () => {
    const title = 'asdasd'
    
    await request(app)
        .post('/api/tickets')
        .set('Cookie',global.signin())
        .send({
            title,
            price: 20
        })
        .expect(201)

    console.log(natsWrapper); //importing natsWrapper from a real file but jest will redirect it to fake natswrapper in __mocks__
   
    expect(natsWrapper.client.publish).toHaveBeenCalled();
})