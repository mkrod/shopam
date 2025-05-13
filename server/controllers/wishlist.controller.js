const { db } = require("../config.js");
const { success, error, isAuthenticated } = require("../misc.js")


const getWishlist = async (req, res) => {
    if(!isAuthenticated(req)){
        return;
    }
    const { user_id } = req.session;

    const [result] = await db.execute("SELECT wishlist from data WHERE user_id = ? ", [user_id]);
    if(result.length > 0){
        const wishlist = JSON.parse(result[0].wishlist);
        return res.json(success("success", wishlist));
    }else{
        return res.json(success("success", []));
    }
}


const addToWishlist = async (req, res) => {
    const { user_id } = req.session;
    const { data } = req.body;
    if(!user_id || !data.id) return;

    //init wishlist
    const createWishList =  async() => {
        const [result] = await db.execute("SELECT wishlist from data WHERE user_id = ? ", [user_id]);
        if(result.length === 0){
            await db.execute("INSERT into data (user_id, wishlist) VALUES (?, ?) ", [user_id, JSON.stringify([])]);
        }
    }
    await createWishList();

    const [result] = await db.execute("SELECT wishlist from data WHERE user_id = ? ", [user_id]);
    if(result.length > 0){
        const oldWish = JSON.parse(result[0].wishlist);


        const updatedWish = [...oldWish, data.id];
        const [ update ] = await db.execute("UPDATE data set wishlist = ? WHERE user_id = ? ", [JSON.stringify(updatedWish), user_id]);
        if(update.affectedRows > 0){
            return res.json(success("success"));
        }else{
            return res.json(failed("failed"));
        }
    }
}

const removeFromWishlist = async (req, res) => {
    const { user_id } = req.session;
    const { data } = req.body;
    if(!user_id){
        return;
    }

    const [result] = await db.execute("SELECT wishlist from data WHERE user_id = ? ", [user_id]);
    if(result.length > 0){
        const oldWish = JSON.parse(result[0].wishlist); //array of string (id)

        const updatedWish = oldWish.filter((wish) => wish !== data.id);
        const [ update ] = await db.execute("UPDATE data set wishlist = ? WHERE user_id = ? ", [JSON.stringify(updatedWish), user_id]);
        if(update.affectedRows > 0){
            return res.json(success("success"));
        }else{
            return res.json(failed("failed"));
        }
    }
}

module.exports = { getWishlist, addToWishlist, removeFromWishlist }