import express from 'express';
var router = express.Router();

router.get('/', function(req, res){
    res.render('verify', {info: 'A password reset link has been sent\n' +
            'to your email. Please click on the\n' +
            'link to reset your password.\n' +
            'If not received within 5 minutes,\n' +
            'Click on Resend Link.'});
});

export default router;