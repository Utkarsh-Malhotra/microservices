import Router from 'next/router';
import useRequest from "../../hooks/use-request";

const TicketShow = ({ ticket }) => {
    const { doRequest, errors } = useRequest({
        url: '/api/orders',
        method: 'post',
        body: {
            ticketId: ticket.id
        },
        onSuccess: (order) => Router.push('/orders/[orderId]', `/orders/${order.id}`)
    })
    // We wrapped do request with function because doRequest is expecting an argument 
    // if we dont wrap it then it automatically provide the event as the argument which will fail the fetch request 
    return <div>
        <h1>{ticket.title}</h1>
        <h4>Price: {ticket.price}</h4>
        {errors}
        <button onClick={() => doRequest()} className="btn btn-primary">Purchase</button>  
    </div>
};

TicketShow.getInitialProps = async (context,client) => {
    const { ticketId } = context.query; // Name of the file is extracted is part of the query
    const { data } = await client.get(`/api/tickets/${ticketId}`);

    return { ticket: data }
}

export default TicketShow;