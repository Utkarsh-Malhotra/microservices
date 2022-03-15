import express, { Request,Response } from 'express';
import { body } from 'express-validator';
import { requireAuth,validateRequest } from '@utktickets/common';
import { Ticket } from '../models/tickets';

const router = express.Router();

router.get('/api/tickets', async (req: Request, res: Response) => {
    const tickets = await Ticket.find({});

    res.send(tickets);
})

export {  router as  indexTicketrouter }