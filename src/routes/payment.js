const express = require("express");
const { userAuth } = require("../middlewares/auth");
const paymentRouter = express.Router();
const instance = require("../utils/razorpay");
const Payment = require("../models/payment");
const { membershipAmount } = require("../utils/constants");
const {
  RAZORPAY_KEY_ID,
  RAZORPAY_WEBHOOK_SECRET,
} = require("../config/serverConfig");
/* NODE SDK: https://github.com/razorpay/razorpay-node */
const {
  validateWebhookSignature,
} = require("razorpay/dist/utils/razorpay-utils");
const User = require("../models/user");

paymentRouter.post("/payment/create", userAuth, async (req, res) => {
  try {
    const { membershipType } = req.body;
    const { firstName, lastName, emailId } = req.user;
    var options = {
      amount: membershipAmount[membershipType],
      currency: "INR",
      receipt: "order_rcptid_11",
      notes: {
        firstName: firstName,
        lastName: lastName,
        email: emailId,
        membershipType: membershipType,
      },
    };
    const order = await instance.orders.create(options);
    const payment = new Payment({
      userId: req.user._id,
      orderId: order.id,
      notes: order.notes,
      amount: order.amount,
      currency: order.currency,
      status: order.status,
    });
    const savedPayment = await payment.save();
    res.json({ ...savedPayment.toJSON(), keyId: RAZORPAY_KEY_ID });
  } catch (error) {
    console.error(error.message);
  }
});

paymentRouter.post("/payment/webhook", async (req, res) => {
  const webhookSignature = req.get("X-Razorpay-Signature");
  const isValid = validateWebhookSignature(
    JSON.stringify(req.body),
    webhookSignature,
    RAZORPAY_WEBHOOK_SECRET
  );

  if (!isValid) {
    return res.status(400).json({ msg: "Webhook signature is not valid" });
  }
  const paymentDetails = req.body.payload.payment.entity;

  const payment = await Payment.findOne({ orderId: paymentDetails.order_id });

  payment.status = paymentDetails.status;
  await payment.save();

  const user = await User.findOne({ _id: payment.userId });
  user.isPremium = true;
  user.membershipType = payment.notes.membershipType;
  await user.save();
  res.status(200).json({ msg: "Webhook recieved successfully" });
});

paymentRouter.get("/premium/verify",userAuth,async(req,res)=>{
    const user = req.user.toJSON();
    if(user.isPremium){
        return res.json({isPremium:user.isPremium,membershipType:user.membershipType})
    }
    return res.json({...user});
})

module.exports = paymentRouter;
