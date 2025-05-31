const { db } = require("../config.js");
const { success } = require("../misc.js");

const getAllProducts = async(req, res) => {
    const sql = "SELECT * FROM products ORDER BY STR_TO_DATE(updated_at, '%Y-%m-%dT%H:%i:%s.%fZ') DESC";
    const [results] = await db.execute(sql);
    if (results.length > 0) {
        const data = results.map((row)=> ({
            ...JSON.parse(row.item)
        }))


        return res.json(success("success", data));
    } else {
        return res.json(success("success", results));
    }
}

module.exports = { getAllProducts }
