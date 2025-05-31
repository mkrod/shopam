const { db } = require("../config.js"); 
const { success, computeOrderPayLoad, client } = require("../misc.js");
const { publisher } = require("../redis.publisher.js");
const { initPaystackCheckout, verifyPaystackCheckout } = require("../service/paystack.js");
const { sendNotification } = require("./notification.controller.js");


const payWithPaystack = async (req, res) => {
    const { data } = req.body;
    const { user_id, email } = req.session;
    if(!user_id || !email) {
           return res.json(success("Please Log in"));
    }
    const fullOrder = computeOrderPayLoad(data);
    const params = {
        email,
        amount: Math.ceil(fullOrder.amount * 100),
        reference: fullOrder.order_id
    }
    try{
        const s_key = process.env.PAYSTACK_SECRET_KEY;
        const response = await initPaystackCheckout(s_key, params);
        if(!response.status) return res.json(success("Failed to create payment"));
        const reference = response.data.reference;
        const date = new Date().toISOString();
        const url = response.data.authorization_url;
        if(!url) return res.json(success("Fail to create payment"));
        const [query] = await db.execute("INSERT INTO orders (user_id, email, order_id, reference, data, amount, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)", [user_id, email, fullOrder.order_id, reference, JSON.stringify(fullOrder), fullOrder.amount, date, date]);
        if(query.length < 1) return res.json(success("Failed to create payment"));
        res.json(success("success", {url}));
    }catch(error){
        console.log("Error Creating paystack Payment: ", error);
        return res.json(success("Failed to create payment"));
    }
}

const paystackCallback = async (req, res) => {
    const { reference } = req.query;
    const { user_id, email } = req.session;
    if(!user_id || !email) {
        return res.redirect(`${client}/`);
    }
    try{
        const s_key = process.env.PAYSTACK_SECRET_KEY;
        const response = await verifyPaystackCheckout(s_key, reference);
        const isValid = response.status;
        if(!isValid){
            req.session.notification = success("error", {text: "Invalid payment reference"});
            return res.redirect(`${client}/not-found`);
        }
        if(response.data.status.toLowerCase() !== "success"){
            req.session.notification = success("error", {text: "Invalid payment reference"});
            return res.redirect(`${client}/not-found`);
        }
        const status = "Paid";//response.data.status;
        const [update] = await db.execute("UPDATE orders SET payment_status = ? WHERE user_id = ? AND reference = ? AND order_id = ?", [status, user_id, reference, reference]);

        if(update.affectedRows < 1){
            req.session.notification = success("error", {text: "Something went wrong, contact admin"});
            return res.redirect(`${client}/not-found`);
        }

        //get the vendor_id to notify the other server of it.
        const [result] = await db.execute("SELECT vendor_id FROM orders WHERE user_id = ? AND reference = ? AND order_id = ?", [user_id, reference, reference]);
        const vendor_id = result[0].vendor_id;
        const [user] = await db.execute("SELECT * FROM users WHERE user_id = ?", [user_id]);
        const userData = JSON.parse(user[0].user_data);  

        const text = "Order Placed Successful";
        const title =  "Success";
        req.session.notification = success("success", {title, text}); //frontend


        const notificationData = {
            type: "order",
            title: "New Order Receieved",
            message: `You have received a new order from ${Object.values(userData.name).join(" ")}.`,
            created_at: new Date().toISOString(),
            read: false,
            "data":{
                "user":  userData.name,
                "email":user[0].email||"",
            },
            "order_id": reference,
        }
        
        await sendNotification(vendor_id, notificationData);


        // 2. Publish event to Redis channel
        await publisher.publish('notify-admin', JSON.stringify({
            type: 'NEW_ORDER',
            receiver: vendor_id,
        }));
        return res.redirect(`${client}/`);

    }catch(error){
        req.session.notification = success("error", {text: error.message});
        console.log("Error verifying paystack payment: ", error);
        return res.redirect(`${client}/`);
    }


}

const paystackWebhook = (req, res) => {
    console.log("Payload: ", req.query ?? req.body);
}

const payWithStripe = async(req, res) => {

}





module.exports = { payWithPaystack, paystackCallback, paystackWebhook, payWithStripe }


