const { db } = require("../config");
const { notAuthenticated, success, error, isAuthenticated } = require("../misc");

const getCart = async (req, res) => {
    if(!isAuthenticated(req)){
        return;
    }
    
    const { user_id } = req.session;

    const [result] = await db.execute("SELECT cart from data WHERE user_id = ? ", [user_id]);
    if(result.length > 0){
        const cart = JSON.parse(result[0].cart);
        return res.json(success("success", cart));
    }else{
        return res.json(success("success", []));
    }
}



const addToCart = async (req, res) => {
    const { user_id } = req.session;
    const { data } = req.body;
    if(!user_id || !data.id) return;

    //init cart
    const createCart =  async() => {
        const [result] = await db.execute("SELECT cart from data WHERE user_id = ? ", [user_id]);
        if(result.length === 0){
            await db.execute("INSERT into data (user_id, cart) VALUES (?, ?) ", [user_id, JSON.stringify([])]);
        }
    }
    await createCart();

    const [result] = await db.execute("SELECT cart from data WHERE user_id = ? ", [user_id]);
    if(result.length > 0){
        const oldCart = JSON.parse(result[0].cart);
        const alignedVariant = {}; //init
        data.variant.forEach((selectedVariant) => {
            const name = selectedVariant.name;
            alignedVariant[name] = selectedVariant; //im modifying affectedlogic to use the new variant structure
        })
        const newCart = {
            id: data.id,
            qty: data.qty ?? 1,
            selectedVariant: alignedVariant
        }

        const updatedCart = [...oldCart, newCart];
        const [ update ] = await db.execute("UPDATE data set cart = ? WHERE user_id = ? ", [JSON.stringify(updatedCart), user_id]);
        if(update.affectedRows > 0){
            return res.json(success("success"));
        }else{
            return res.json(failed("failed"));
        }
    }
}

const removeFromCart = async(req, res) => {
    const { user_id } = req.session;
    const { data } = req.body;
    if(!user_id){
        return;
    }

    const [result] = await db.execute("SELECT cart from data WHERE user_id = ? ", [user_id]);
    if(result.length > 0){
        const oldCart = JSON.parse(result[0].cart);

        const updatedCart = oldCart.filter((cart) => cart.id !== data.id);
        const [ update ] = await db.execute("UPDATE data set cart = ? WHERE user_id = ? ", [JSON.stringify(updatedCart), user_id]);
        if(update.affectedRows > 0){
            return res.json(success("success"));
        }else{
            return res.json(failed("failed"));
        }
    }
}


const increaseQty = async (req, res) => {
    const { user_id } = req.session;
    const { data } = req.body;
    if(!user_id){
        return;
    }

    const [result] = await db.execute("SELECT cart from data WHERE user_id = ? ", [user_id]);
    if(result.length > 0){
        const oldCart = JSON.parse(result[0].cart);
    
        const thisUpdate = oldCart.find((cart) => cart.id === data.id);
        if (thisUpdate) {
            thisUpdate.qty = Number(thisUpdate.qty) + 1;
            const updatedCart = oldCart.map((cart) => 
                cart.id === data.id ? thisUpdate : cart
            );
            const [ update ] = await db.execute("UPDATE data set cart = ? WHERE user_id = ? ", [JSON.stringify(updatedCart), user_id]);
            if(update.affectedRows > 0){
                return res.json(success("success"));
            }else{
                return res.json(error("failed"));
            }
        } else {
            return res.json(error("Item not found in cart"));
        }
    } else {
        return res.json(error("Cart not found"));
    }

}

const decreaseQty = async (req, res) => {
    const { user_id } = req.session;
    const { data } = req.body;
    if(!user_id){
        return;
    }

    const [result] = await db.execute("SELECT cart from data WHERE user_id = ? ", [user_id]);
    if(result.length > 0){
        const oldCart = JSON.parse(result[0].cart);
    
        const thisUpdate = oldCart.find((cart) => cart.id === data.id);
        if (thisUpdate) {
            thisUpdate.qty = Number(thisUpdate.qty) - 1;
            const updatedCart = oldCart.map((cart) => 
                cart.id === data.id ? thisUpdate : cart
            );
            const [ update ] = await db.execute("UPDATE data set cart = ? WHERE user_id = ? ", [JSON.stringify(updatedCart), user_id]);
            if(update.affectedRows > 0){
                return res.json(success("success"));
            }else{
                return res.json(error("failed"));
            }
        } else {
            return res.json(error("Item not found in cart"));
        }
    } else {
        return res.json(error("Cart not found"));
    }

}

module.exports = { getCart, addToCart, removeFromCart , increaseQty, decreaseQty}