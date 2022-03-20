import { Ticket } from "../tickets";

it('implements optimistic concurrency control', async () => {
    // Create an instance of a ticket
    const ticket = await Ticket.build({
        title: 'concert',
        price: 5,
        userId: '123'
    })
    // Save the tiket in database Here version no is assigned for first time
    await ticket.save();

    // Fetch the ticket twice
    const firstInstance = await Ticket.findById(ticket.id);
    const secondInstance = await Ticket.findById(ticket.id);

    // make two saperate changes to the tickets we fetched
    firstInstance!.set({ price: 10 })
    secondInstance!.set({ price: 15 })
    // Save the first fecthed tickets
    await firstInstance!.save();

    // Save the second fetched ticket
    try {
        await secondInstance!.save();
    } catch (err) {
        return;
    }

    throw new Error('Should not reach this point')
})

it('increments the version no on multiple saves', async () => {
    // Create an instance of a ticket
    const ticket = await Ticket.build({
        title: 'concert',
        price: 5,
        userId: '123'
    })
    // Save the tiket in database Here version no is assigned for first time
    await ticket.save();
    expect(ticket.version).toEqual(0);
    await ticket.save();
    expect(ticket.version).toEqual(1);
    await ticket.save();
    expect(ticket.version).toEqual(2);

})