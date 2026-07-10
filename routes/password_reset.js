import express from 'express';
import jwt from 'jsonwebtoken';
import {SECRET_ACCESS_TOKEN} from '../config/index.js';
import {findUserByID} from '../services/db.js';
var router = express.Router();

router.get('/', async function(req, res, next){
    if(req.query.token){
        jwt.verify(req.query.token, SECRET_ACCESS_TOKEN, async (err, decoded) => {
            if (err) {
                res.setHeader('Cache-Control', 'private, max-age=0, no-cache, no-store');
                res.render('verify', {
                    info: 'Reset token expired!\n' +
                        'Click on Resend Link',
                });
            }else if(decoded){
                const {id} = decoded;
                const user = await findUserByID(id);
                if (user) {
                    res.render('password_reset', {
                        email: user.email,
                        firstName: user.first_name,
                        secondName: user.second_name,
                        });
                }
                else{
                    res.setHeader('Cache-Control', 'private, max-age=0, no-cache, no-store');
                    res.render('verify', {
                        info: 'Invalid link! Please\n' +
                            'Click on Resend Link',
                    });
                }
            }
        });
    }else {
        res.render('verify', {
            info: 'Invalid verification link.\n' +
                'Please resend link.'
        });
    }
});

export default router;