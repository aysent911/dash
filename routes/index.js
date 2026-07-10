import express from 'express';
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.setHeader('Cache-Control', 'private, max-age=0, no-cache, no-store');
  res.render('index');
});

export default router;
