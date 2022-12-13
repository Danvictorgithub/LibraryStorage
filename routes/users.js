var express = require('express');
var router = express.Router();
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
// router.get('/cool', (req,res,next) => {
//   res.send("I am cool");
// });
module.exports = router;
