import Razorpay from 'razorpay';
import "../../config/config";
const razorpay = new Razorpay({
    key_id: global.gConfig.razorPay.keyId,
    key_secret: global.gConfig.razorPay.keySecret,
});

const createRazorpayOrder = async ({ amount, currency = 'INR', receipt, notes = {} }) => {
    const options = {
        amount: amount*100,
        currency,
        receipt,
        notes,
    };

    return await razorpay.orders.create(options);
};

const fetchOrderDetails = async (orderId)=>{
    return await razorpay.orders.fetchPayments(orderId);
}
const fetchPaymentDetails = async(paymentId)=>{
    return await razorpay.payments.fetch(paymentId);
}

module.exports = { createRazorpayOrder,fetchOrderDetails ,fetchPaymentDetails};
