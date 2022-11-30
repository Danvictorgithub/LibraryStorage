const express = require("express");
const app = express();
const port = 3000;

const wiki = require("./wiki.js");
app.get("/",(req,res)=>{
	throw Error;
	res.send("<a href='wiki'>Go to Wiki</a>");

});
app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});
app.use("/wiki",wiki);
app.use("/media",express.static("public"));
app.listen(port, function () {
  console.log(`Example app listening on port ${port}!`);
});
