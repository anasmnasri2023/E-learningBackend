var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/hello', function(req, res, next) {
  res.json('Marahbe bikom ye jmes3a ');
});

module.exports = router;
