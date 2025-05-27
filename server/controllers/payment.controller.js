const { db } = require("../config.js"); 
const { success, computeOrderPayLoad, client } = require("../misc.js");
const { initPaystackCheckout, verifyPaystackCheckout } = require("../service/paystack.js");




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
        const [query] = await db.execute("INSERT INTO orders (user_id, email, order_id, reference, data, amount, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)", [user_id, email, fullOrder.order_id, reference, JSON.stringify(fullOrder), fullOrder.amount, date]);
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

        const text = "Order Placed Successful";
        const title =  "Success";
        req.session.notification = success("success", {title, text});
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


