import express from 'express';
var router = express.Router();

router.post('/add_gateway', function(req, res){
    console.log(req.body);
    res.send('added');
});

//module.exports = {router as default};
export default router;
