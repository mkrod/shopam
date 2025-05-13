const { hash, verify } = require("argon2");
const { db } = require("../config.js");
const { error, generateRandomString, success } = require("../misc.js");


const Auth = (req, res) => {
    res.send("Auth route");
}

const createUser  = async (req, res) => {
    const { data } = req.body;
    const hashedPassword = await hash(data.password);
    const emailName  = data.email.split("@");
    const newUserID = `${emailName[0].slice(0, 2)}-${generateRandomString(10)}-${emailName[0].slice(-2)}`;
    const date = new Date().toISOString();
    const [query] = await db.execute("INSERT INTO users (user_id, email, user_data, password, joined) VALUES (?, ?, ?, ?, ?)", [newUserID, data.email, "{}", hashedPassword, date]);
    if(query.affectedRows > 0){
        console.log("registered");
        req.session.isLoggedIn = true;
        req.session.email = data.email;
        req.session.user_id = newUserID;
        return res.json(success("success"));
    }else{
        return res.json(error("failed"));
    }
}

const localAuth = async (req, res) => {
    const { data } = req.body;
    
    const [result] = await db.execute("SELECT * FROM users WHERE email = ?", [data.email]);
    if(result.length > 0){
        const password = result[0].password;
        const isValid = await verify(password, data.password);
        if(isValid){
            console.log("authenticated");
            req.session.isLoggedIn = true;
            req.session.email = data.email;
            req.session.user_id = result[0].user_id;
            return res.json(success("success"));

        }else{
            return res.json(success("Invalid Credentials"));
        }
    }else{
        return res.json(success("Invalid Credentials"));
    }
}


const googleCallback = async (req, res) => {
    const { code } = req.query;
    if(!code){
        console.log("No callback code");
        return res.redirect(`${client}/auth/login`);
    }
}




const userData = async (req, res) => {
    const { email, user_id } = req.session;
    if(!email || !user_id){
        //user didn't log in 
        return res.json(success("success", null));
    }

    const [result] = await db.execute("SELECT * FROM users WHERE email = ? AND user_id = ?", [email, user_id]);
    if(result.length > 0){
        const data = { //format according to the User type in the client
                email,
                user_id,
                user_data: JSON.parse(result[0].user_data),
        }

        return res.json(success("success", data));
    }else{
        res.json(error("Something went wrong"));
    }
}

module.exports = {
    Auth,
    createUser,
    localAuth,
    googleCallback,
    userData,
};