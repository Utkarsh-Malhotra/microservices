import { useEffect,useState } from 'react';
import StripeCheckout from 'react-stripe-checkout';

const OrderShow = ({ order, currentUser }) => {
    const [timeLeft, setTimeLeft] = useState(0);

    useEffect(() => {
        const findTimeLeft = () => {
            const msLeft = new Date(order.expiresAt) - new Date();
            setTimeLeft(Math.round(msLeft/1000));
        };
        findTimeLeft();
        const timerId = setInterval(findTimeLeft, 1000);

        return () => {  // this function is only called when we navigate away from the component
            clearInterval(timerId);
        }
    },[order])
    if(timeLeft < 0) {
            return <div>Order Expired</div>
    }

    return <div>
        Time Left to pay: {timeLeft} seconds
        <StripeCheckout 
            token={(token) => console.log(token)}
            stripeKey='pk_test_51Kg1PRSHW3oFTPPVpXqsqvlf3zjsvad0eTpRFUwKiuvYqBgIGi3w2oCxEbW7C8rOemmyzkRtqMrlO1fdZjIeHoto00Pjw63oT8'  // can keep in env variable , need to look next doc for env variables
            amount={order.ticket.price * 100}
            email={currentUser.email}
        />
    </div>
}

OrderShow.getInitialProps = async (context,client) => {
    const { orderId } = context.query;
    const { data } = await client.get(`/api/orders/${orderId}`);

    return { order: data }
}
export default OrderShow;