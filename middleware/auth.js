import jwt from 'jsonwebtoken';
import {SECRET_ACCESS_TOKEN, FRONT_END_URL} from '../config/index.js';
import {body, matchedData, validationResult } from 'express-validator';
import {findUserByEmail, findUserByID, createUser, authenticateUser, authenticateUserKey, blacklistToken,
    checkBlacklisted} from '../services/db.js';
import {sendEmailVerification} from '../services/novu.js';

const getSessionToken = function(cookieHeader){
    const cookies = cookieHeader.split(';');
    for(let i = 0; i < cookies.length; i++){
        if(cookies[i].search('sessionID') >= 0){
            return cookies[i].split('=')[1];
        }
    }
}

var verifySession = async function(req, res, next) {
    try {
        const cookieHeader = req.headers["cookie"]; // get the session cookie from request reheaders
        if (!cookieHeader){
            res.setHeader('Cache-Control', 'private, max-age=0, no-cache, no-store');
            res.render('index', {
                error: 'Please login!',
            });
        }else{
            const sessionToken = getSessionToken(cookieHeader);
            if(! await checkBlacklisted(sessionToken)){
                // Verify validity of the jwt
                jwt.verify(sessionToken, SECRET_ACCESS_TOKEN, async (err, decoded) => {
                    if (err) {
                        res.setHeader('Cache-Control', 'private, max-age=0, no-cache, no-store');
                        res.render('index', {
                            error: 'Session expired. Please login!',
                        });
                    }else if(decoded){
                        const {id, timezone} = decoded;
                        const user = await findUserByID(id);
                        if (user) {
                            req.user = user;
                            req.timezone = timezone;
                            next();
                        }
                        else{
                            res.setHeader('Cache-Control', 'private, max-age=0, no-cache, no-store');
                            res.render('index', {
                                error: 'Please login!',
                            });
                        }
                    }
                });
            }else{
                res.setHeader('Cache-Control', 'private, max-age=0, no-cache, no-store');
                res.render('index', {
                    error: 'Please login!',
                });
            }
        }
    }catch (err) {
        res.status(500).json({
            status: "error",
            code: 500,
            data: [],
            message: "Internal Server Error",
        });
    }
}


export {verifySession};