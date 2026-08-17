import express from 'express';
import jwt from 'jsonwebtoken';
import {SECRET_ACCESS_TOKEN} from '../config/index.js';
import {updateEmailVerified, findUserByID} from '../services/db.js';

var router = express.Router();

router.post('/', async function(req, res){
    res.setHeader('Cache-Control', 'private, max-age=0, no-cache, no-store');
    res.render('verify', {
        info: 'Enter the 6-digit authentication code sent to your email.',
    });
    /*}else {
        res.render('verify', {
            info: 'Invalid verification link.\n' +
                'Click on Resend Link.'
        });
    }*/
});

export default router;