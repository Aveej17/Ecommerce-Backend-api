import express from 'express';
import dotenv from 'dotenv';
import Stripe from "stripe";
import dbConnect from '../config/dbConnect.js';
import userRoutes from '../routes/userRoute.js';
import { globalErrhandler, notFound } from '../middlewares/globalErrHandler.js';
import productsRouter from '../routes/productsRoute.js';
import categoriesRouter from '../routes/categoriesRoute.js';
import brandsRouter from '../routes/brandsRoute.js';
import colorsRouter from '../routes/colorRoute.js';
import couponsRouter from '../routes/couponsRoute.js';
import reviewsRouter from '../routes/reviewsRoute.js';
import orderRouter from '../routes/ordersRoute.js';
import Order from '../models/Order.js';

// db connect
dotenv.config();
dbConnect();

const app = express();


//Stripe webhook
// stripe instance
const stripe = new Stripe(process.env.STRIPE_KEY);


// This is your Stripe CLI webhook secret for testing your endpoint locally.
const endpointSecret = "whsec_9f7bcc25e5932fbd5b8f6ea892bd8b96659db5f8731cd96e641d8524854a5ec0";

app.post('/webhook', express.raw({type: 'application/json'}), async (request, response) => {
  const sig = request.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
    console.log("event");
  } catch (err) {
    console.log(`err: ${err.message}`);
    response.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  if(event.type === "checkout.session.completed"){
    // update the order
    const session = event.data.object;
    const {orderId } = session.metadata;
    const paymentStatus = session.payment_status;
    const paymentMethod = session.payment_method_types[0];
    const totalAmount = session.amount_total;
    const currency = session.currency;
    
    // console.log({
    //   orderId, paymentStatus, paymentMethod, totalAmount, currency
    // })


    // find the order
    const order = await Order.findByIdAndUpdate(

      JSON.parse(orderId),
      {
        totalPrice: totalAmount / 100,
        currency,
        paymentMethod,
        paymentStatus,
      },
      {
        new: true,
      }

    );

    console.log(order);

  }else{
    return
  }

  // // Handle the event
  // switch (event.type) {
  //   case 'payment_intent.succeeded':
  //     const paymentIntentSucceeded = event.data.object;
  //     // Then define and call a function to handle the event payment_intent.succeeded
  //     break;
  //   // ... handle other event types
  //   default:
  //     console.log(`Unhandled event type ${event.type}`);
  // }

  // Return a 200 response to acknowledge receipt of the event
  response.send();
});


// pass incoming data
app.use(express.json());

// routes

app.use("/api/v1/users/", userRoutes);
app.use("/api/v1/products/", productsRouter);
app.use("/api/v1/categories/", categoriesRouter);
app.use("/api/v1/brands/", brandsRouter);
app.use("/api/v1/colors/", colorsRouter);
app.use("/api/v1/reviews/", reviewsRouter);
app.use("/api/v1/orders/", orderRouter);
app.use("/api/v1/coupons", couponsRouter);



// err middleware
app.use("/", notFound);
app.use("/", globalErrhandler);

export default app;