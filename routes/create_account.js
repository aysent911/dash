import express from 'express';
var router = express.Router();

router.get('/', function(req, res, next){
    res.render('create_account', {info: req.info});
});

export default router;