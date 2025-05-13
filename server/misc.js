const client = "http://192.168.43.103:5173";

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

module.exports = { client, generateRandomString, success, error, isAuthenticated }


