import express from 'express';
var router = express.Router();

router.get('/', function(req, res, next){
    res.render('create_account', {
        targetUrl: '/register_user',
        info: req.info,
    });
});

export default router;