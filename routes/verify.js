import express from 'express';
import jwt from 'jsonwebtoken';
import {SECRET_ACCESS_TOKEN} from '../config/index.js';
import {updateEmailVerified, findUserByID} from '../services/db.js';

var router = express.Router();

router.get('/', async function(req, res, next){
    if(req.query.token){
        jwt.verify(req.query.token, SECRET_ACCESS_TOKEN, async (err, decoded) => {
            if (err) {
                res.setHeader('Cache-Control', 'private, max-age=0, no-cache, no-store');
                res.render('verify', {
                    info: 'Invalid verification link!\n' +
                        'Click on Resend Link',
                });
            }else if(decoded){
                const {id} = decoded;
                if(id) {
                    const user = await updateEmailVerified(id);
                    if(user.verified == true){
                        res.render('verify', {info: 'Email verified successfully.'})
                    }else{
                        res.render('verify', {info: 'Something went wrong\n' +
                                'Please try again later.'})
                    }
                }
                else{
                    res.setHeader('Cache-Control', 'private, max-age=0, no-cache, no-store');
                    res.render('verify', {
                        info: 'Invalid verification link!\n' +
                            'Click on Resend Link',
                    });
                }
            }
        });
    }else {
        res.render('verify', {
            info: 'Invalid verification link.\n' +
                'Click on Resend Link.'
        });
    }
});

export default router;