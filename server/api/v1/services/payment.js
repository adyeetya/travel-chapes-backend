import Payment from "../../../models/payment";

const paymentServices = {
    createPayment: async (paymentData) => {
        return await Payment.create(paymentData);
    },
    findPayment: async (query) => {
        return await Payment.findOne(query);
    },
    updatePayment: async (query, updatedObj) => {
        return await Payment.findOneAndUpdate(query, updatedObj, { new: true });
    },
    findPaymentById: async (paymentId) => {
        return await Payment.findOne({ razorpay_payment_id: paymentId });
    },
    getPaymentsByUserId: async (userId) => {
        return await Payment.find({ userId: userId });
    },
    updatePaymentStatus: async (paymentId, status) => {
        return await Payment.findOneAndUpdate(
            { razorpay_payment_id: paymentId },
            { payment_status: status },
            { new: true }
        );
    },
    updateRefundDetails: async (paymentId, refundStatus, refundAmount, refundDate) => {
        return await Payment.findOneAndUpdate(
            { razorpay_payment_id: paymentId },
            {
                refund_status: refundStatus,
                refund_amount: refundAmount,
                refund_date: refundDate
            },
            { new: true }
        );
    },
    getAllPayments: async () => {
        return await Payment.find();
    }
};

module.exports = { paymentServices };
