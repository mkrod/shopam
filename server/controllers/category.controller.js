const {db} = require("../config.js");
const {success, error} = require("../misc.js")



const getAllCategory = async (req,res) => {
try{
  const query = "SELECT * FROM categories";
  const [results] = await db.execute(query);
  //console.log("Results: ", results);
  res.json(success("success", results));
 }catch(err){
  console.log("Cannot get categories: ", err);
  res.json(error("failed: ", []));
  } 
}




module.exports = { getAllCategory };
