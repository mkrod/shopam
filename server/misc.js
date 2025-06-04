require("dotenv").config();
const client = process.env.CLIENT || "http://192.168.43.103:5173";

function generateRandomString(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

const success = (message, data = null) => ({ 
    status: 200,
    data,
    message
});
const error = (message, data = null) => ({ 
    status: 500,
    data,
    message
});

const isAuthenticated = (req) => {
    const { user_id } = req.session;
    if(!user_id){
        return false;
    }
        return true;
}

function generateOrderID() {
    const now = new Date();
    const dateSegment = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;
    const uuidSegment = crypto.randomUUID().split('-')[0].toUpperCase(); // short portion of UUID
    return `ORD-${dateSegment}-${uuidSegment}`;
}
  
const computeOrderPayLoad = (data) => {
    const { orders, contact, total, deliveryMethod, paymentMethod, extraFee, message } = data;

    // Generate global order ID
    const order_id = generateOrderID(5); // e.g. "ORD-7T9H1B2K"
    
    // Attach order ID to each item
    const ordersWithIDs = orders.map((item, index) => ({
      ...item,
      order_id, // Shared across all items
      order_item_id: `${order_id}-ITEM${index + 1}`, // Unique per item
      status: "processing",
      updated_at: new Date().toISOString(),
    }));

    const others = {
        deliveryMethod,
        paymentMethod,
        message,
        extraFee,
    }
    
    // Final payload to store or pass to payment logic
    const fullOrder = {
      order_id,
      amount: total,
      orders: ordersWithIDs,
      contact,
      others,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    return fullOrder;
}



module.exports = { client, generateRandomString, success, error, isAuthenticated, generateOrderID, computeOrderPayLoad }


