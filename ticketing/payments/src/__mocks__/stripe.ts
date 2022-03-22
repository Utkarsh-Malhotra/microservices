export const stripe = {
    charges : {
        create: jest.fn().mockResolvedValue({})   // Rteuns the promise that resolves itself
    }
}