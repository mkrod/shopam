const { db } = require("../config");
const { error, success } = require("../misc");
const { publisher } = require("../redis.publisher");



const sendNotification = async (receiver, data) => {
    if(!receiver) return error("failed");

    try{
        const now = new Date().toISOString();
        const [result] = await db.execute("INSERT INTO notifications (receiver, data, created_at) VALUES (?, ?, ?)", [receiver, JSON.stringify(data), now]);
        if(result.affectedRows < 1) return error("failed");
        // 2. Publish event to Redis channel
        await publisher.publish('notify-admin', JSON.stringify({
            type: 'NEW_NOTIFICATION',
            payload: {title: data?.title ?? undefined},
            receiver,
        }));
        return success("success");

    }catch(err){
        console.log("Cannot send notification: ", err);
        return  error("failed");
    }
}

module.exports = { sendNotification }