import jwt from 'jsonwebtoken';
import crypto from 'node:crypto';
import nodemailer from 'nodemailer';
import redisClient from '../services/redis.js';
;import {SECRET_ACCESS_TOKEN, FRONT_END_URL, SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD, EMAIL_FROM } from '../config/index.js';
import {body, matchedData, validationResult } from 'express-validator';
import {findUserByEmail, findUserByID, createUser, authenticateUser, authenticateUserKey, blacklistToken,
    checkBlacklisted} from '../services/db.js';

const transportter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: true,
    auth: {
        user: SMTP_USER,
        pass: SMTP_PASSWORD,
    },
});

const getSessionToken = function(cookieHeader){
    const cookies = cookieHeader.split(';');
    for(let i = 0; i < cookies.length; i++){
        if(cookies[i].search('sessionID') >= 0){
            return cookies[i].split('=')[1];
        }
    }
}

let generateSessionToken = function(payload){
    return jwt.sign(payload, SECRET_ACCESS_TOKEN, {expiresIn: '1d'});
};

let registerUser = async function(req, res, next){

    const {secondName, password} = matchedData(req);
    if(secondName){ //validate on condition that secondName is provided
        await body('secondName', 'Must be alphanumeric').isAlphanumeric().run(req);
    }
    if(password){
        await body('confirmPassword', 'Passwords do not match').equals(password).run(req);
    }
    const errors = validationResult(req);
    if(errors.isEmpty()){
        var user = await findUserByEmail(req.body.email);
        if(user){
            res.render('create_account', {
                info: 'User already exists',
                email: req.body.email,
                firstName: req.body.firstName,
                pass: req.body.password,
                confirmPassword: req.body.confirmPassword,
            });
        }else{
            var user = await createUser(req.body);
            if(user){
                //console.log(user);
                const accountVerificationToken = generateSessionToken({id: user.id});
                //const link = `${FRONT_END_URL}verify?token=${accountVerificationToken}`;
                //sendEmailVerification(user.id, user.email, link);
                next();
                
            }else {
                res.render('create_account', {
                    info: 'Please try again later',
                    email: req.body.email,
                    firstName: req.body.firstName,
                    pass: req.body.password,
                    confirmPassword: req.body.confirmPassword,
                });
            }
        }
        //res.redirect('/dashboard');
    }else {
        const validationErrors = errors.array();
        for (var i = 0; i < validationErrors.length; i++) {
            if (validationErrors[i].path === 'firstName' && !req.firstNameError) {
                req.firstNameError = validationErrors[i].msg;
            } else if (validationErrors[i].path === 'email' && !req.emailError) {
                req.emailError = validationErrors[i].msg;
            } else if (validationErrors[i].path === 'password' && !req.passwordError) {
                req.passwordError = validationErrors[i].msg;
            } else if (validationErrors[i].path === 'confirmPassword') {
                req.confirmPasswordError = validationErrors[i].msg;
            }
        }
        res.render('create_account', {
            email: req.body.email,
            emailError: req.emailError,
            firstName: req.body.firstName,
            firstNameError: req.firstNameError,
            pass: req.body.password,
            passwordError: req.passwordError,
            confirmPassword: req.body.confirmPassword,
            confirmPasswordError: req.confirmPasswordError
        });
    }
}

let login = async function(req, res, next){
    const errors = validationResult(req);
    if(errors.isEmpty()){
        var user = await findUserByEmail(req.body.email);
        if(user){
            if(user.verified){
                var authenticated = await authenticateUser(req.body.email, req.body.password);
                if(authenticated){
                    let options = {
                        maxAge: 24 * 60 * 60 * 1000, //expiry in 1day
                        httpOnly: true, //cookie is only accessible by the web server
                        secure: false,
                        sameSite: "Strict",
                    }
                    //client will send back token as header in subsequent requests
                    res.cookie('sessionID', generateSessionToken({id: user.id, timezone: req.body.timezone}), options);
                    req.authenticated = true;
                    next();
                }else{
                    res.setHeader('Cache-Control', 'private, max-age=0, no-cache, no-store');
                    res.render('index', {
                        error: 'Incorrect email/password!',
                        email: req.body.email,
                        pass: req.body.password,
                    });
                }
            }else{
                res.setHeader('Cache-Control', 'private, max-age=0, no-cache, no-store');
                res.render('index', {
                    error: 'User not verified!',
                    email: req.body.email,
                    pass: req.body.password,
                });
            }
        }else{
            res.setHeader('Cache-Control', 'private, max-age=0, no-cache, no-store');
            res.render('index', {
                error: 'Incorrect email/password!',
                email: req.body.email,
                pass: req.body.password,
            });
        }
        //res.redirect('/dashboard');
    }else {
        const validationErrors = errors.array();
        for (var i = 0; i < validationErrors.length; i++) {
            if (validationErrors[i].path === 'email' && !req.emailError) {
                req.emailError = validationErrors[i].msg;
            } else if (validationErrors[i].path === 'password') {
                req.passwordError = validationErrors[i].msg;
            }
        }
        res.setHeader('Cache-Control', 'private, max-age=0, no-cache, no-store');
        res.render('index', {
            email: req.body.email,
            emailError: req.emailError,
            pass: req.body.password,
            passwordError: req.passwordError,
        });
    }
}

const send2FACode = async function(req, res, next) {
    const randomCode = crypto.randomInt(100_000, 1_000_000).toString();
    const codeHash = crypto.createHash("sha256").update(randomCode).digest("hex");
    const expiresAt = new Date(Date.now() + 10*60*1000); //10 minutes
    const intent = req.authenticated? "login" : "register";
    const id = req.body.email.split('@')[0];
    await redisClient
        .multi()
        .hSet(`${id+codeHash}`, {
            intent: intent,
            attempts: 0,
            lease: expiresAt.toISOString(),
        })
        .expire(`${id+codeHash}`, 60*10)
        .exec();

    try{
        await transportter.sendMail({
            from: EMAIL_FROM,
            to: req.body.email,
            subject: "Verify your Email",
            text:   `Hello ${id},
                Please verify your email using the one-time pass code : ${randomCode}
                Note : This code will expire in 10 minutes.
                Sincerely,
                BearInfinity.`,
            html: `<p>Hello ${id}</p>,        
                <p>Please verify your email using the one-time pass code : <strong style="font-size: 24px;">${randomCode}</strong></p>
                <p>Note : This code will expire in 10 minutes.</p>
                <p>Sincerely,</p>
                <p>BearInfinity</p>`,
            headers: {
                "Auto-Submitted": "auto-generated",
            }
        });
    }catch(err){
        console.error(err.message);
    }finally{
        next();
    }
}

const verify2FACode = async function(req, res, next) {
    const verificationCode = req.body.codeDigits.join("");
    const intent = document.get
    const codeHash = crypto.createHash("sha256").update(verificationCode).digest("hex");

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


export {registerUser, login, verifySession, send2FACode, verify2FACode};