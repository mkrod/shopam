const { db } = require("../config.js");
const { success } = require("../misc.js");

const editUserData = async (req, res) => {
    const { data } = req.body;
    const email = data.email;
    const { user_id } = req.session;
    if(!user_id || !email) {
           return res.json(success("Please Log in"));
    }
    
    if(req.session.email !== email){
        const [check] = await db.execute("SELECT * FROM users WHERE email = ?", [data.email]);
        if(check.length > 0){
            res.json(success("Email not available"));
        }else{
            const [update] = await db.execute("UPDATE users SET email = ? WHERE user_id = ? ", [data.email, user_id]);
            if(update.affectedRows > 0){
                req.session.email = email;
            }
        }
    }
    

    const filteredData = { ...data };
    //console.log(filteredData);
    delete filteredData.email;

    const [ query ] = await db.execute("UPDATE users SET user_data = ? WHERE user_id = ?", [JSON.stringify(filteredData), user_id]);
    if(query.affectedRows > 0){
        res.json(success("success"));
        return;
    }else{
        res.json(success("failed"));
    }
}


const getOrderList = async (req, res) => {
    const { user_id, email } = req.session;
    if(!user_id || !email) {
           return res.json(success("Please Log in"));
    }

    try{

        const [results] = await db.execute("SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC", [user_id]);
        return res.json(success("success", results));

    }catch(error){
        console.log("Error fetching orders", error.message);
        return res.json(success("success", []))
    }
}


const getMessages = async (req, res) => {
    const { user_id, email } = req.session;
    if(!user_id || !email) {
           return res.json(success("Please Log in"));
    }

    const query = "SELECT * FROM messages WHERE sender_id = ? OR receiver_id = ?";
    try{
        const [results] = await db.execute(query, [user_id, user_id]);
        return res.json(success("success", results));
      }catch(error){
          console.log("Error fetching messages for user: " + user_id + " reason: " + error.message);
          res.json(success("success", []));
      }

}

module.exports = { editUserData, getOrderList , getMessages }