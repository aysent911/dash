import {body, validationResult, matchedData} from 'express-validator';
import {findUserByEmail, createUser, updateUser, findUserByID, authenticateUser, authenticateUserKey, blacklistToken,
    checkBlacklisted} from '../services/db.js';
import {SECRET_ACCESS_TOKEN, FRONT_END_URL} from '../config/index.js';
import {sendPasswordReset, sendEmailVerification} from '../services/novu.js';
import jwt from 'jsonwebtoken';

let generateResetToken = function(payload){
    return jwt.sign(payload, SECRET_ACCESS_TOKEN, {expiresIn: '1h'});
};
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
                secondName: req.body.secondName,
                pass: req.body.password,
                confirmPassword: req.body.confirmPassword,
            });
        }else{
            var user = await createUser(req.body);
            if(user){
                //console.log(user);
                const accountVerificationToken = generateSessionToken({id: user.id});
                const link = `${FRONT_END_URL}verify?token=${accountVerificationToken}`;
                sendEmailVerification(user.id, user.email, link);
                res.render('verify', {info: 'A verification link has been sent\n' +
                        'to your email. Please click on the\n' +
                        'link to verify your email.\n' +
                        'If not received within 5 minutes,\n' +
                        'Click on Resend Link.'});
            }else {
                res.render('create_account', {
                    info: 'Please try again later',
                    email: req.body.email,
                    firstName: req.body.firstName,
                    secondName: req.body.secondName,
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
            } else if (validationErrors[i].path === 'secondName') {
                req.secondNameError = validationErrors[i].msg;
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
            secondName: req.body.secondName,
            secondNameError: req.secondNameError,
            pass: req.body.password,
            passwordError: req.passwordError,
            confirmPassword: req.body.confirmPassword,
            confirmPasswordError: req.confirmPasswordError
        });
    }
}
let forgotPassword = async function(req, res){+
                    'link to verify your email.\n' +
                    'If not received within 3 minutes,\n' +
                    'Click on Resend Link.'
    const errors = validationResult(req);
    if(errors.isEmpty()){
        var user = await findUserByEmail(req.body.email);
        if(user){
            const passwordResetToken  = generateResetToken({id: user.id})
            const link = `${FRONT_END_URL}password_reset?token=${passwordResetToken}`;
            sendPasswordReset(user.id, user.email, link);
            res.send(JSON.stringify({info: 'A password reset link has been sent'}));

        }else{
            res.setHeader('Cache-Control', 'private, max-age=0, no-cache, no-store');
            res.send(JSON.stringify({
                emailError: 'User does not exist!',
                email: req.body.email,
            }));
        }
        //res.redirect('/dashboard');
    }else {
        const validationErrors = errors.array();
        for (var i = 0; i < validationErrors.length; i++) {
            if (validationErrors[i].path === 'email' && !req.emailError) {
                req.emailError = validationErrors[i].msg;
            }
        }
        res.setHeader('Cache-Control', 'private, max-age=0, no-cache, no-store');
        res.send(JSON.stringify({
            email: req.body.email,
            emailError: req.emailError,
        }));
    }
}

let updateUserAccount = async function(req, res){
    const {secondName, password} = matchedData(req);
    if(secondName){ //validate on condition that secondName is provided
        await body('secondName', 'Must be alphanumeric').isAlphanumeric().run(req);
    }
    if(password){
        await body('confirmPassword', 'Passwords do not match').equals(password).run(req);
    }
    const errors = validationResult(req);
    if(errors.isEmpty()){
        var user = await updateUser(req.body.firstName, req.body.secondName, req.body.email, req.body.password);
        if(user){
            res.render('verify', {info: 'Account updated successfully\n' +
                    'Please Login to continue.'});
        }else {
            res.render('password_reset', {
                info: 'Please try again later',
                email: req.body.email,
                firstName: req.body.firstName,
                secondName: req.body.secondName,
                pass: req.body.password,
                confirmPassword: req.body.confirmPassword,
            });
        }
        //res.redirect('/dashboard');
    }else {
        const validationErrors = errors.array();
        for (var i = 0; i < validationErrors.length; i++) {
            if (validationErrors[i].path === 'firstName' && !req.firstNameError) {
                req.firstNameError = validationErrors[i].msg;
            } else if (validationErrors[i].path === 'secondName') {
                req.secondNameError = validationErrors[i].msg;
            } else if (validationErrors[i].path === 'email' && !req.emailError) {
                req.emailError = validationErrors[i].msg;
            } else if (validationErrors[i].path === 'password' && !req.passwordError) {
                req.passwordError = validationErrors[i].msg;
            } else if (validationErrors[i].path === 'confirmPassword') {
                req.confirmPasswordError = validationErrors[i].msg;
            }
        }
        res.render('password_reset', {
            email: req.body.email,
            emailError: req.emailError,
            firstName: req.body.firstName,
            firstNameError: req.firstNameError,
            secondName: req.body.secondName,
            secondNameError: req.secondNameError,
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
                    res.redirect('/dashboard');
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
                error: 'User not found!',
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

let logout = async function(req, res, next){
    const cookieHeader = req.headers["cookie"]; // get the session cookie from request reheaders
    if (!cookieHeader){
        res.setHeader('Cache-Control', 'private, max-age=0, no-cache, no-store');
        res.render('index', {
            error: 'Please login!',
        });
    }else{
        const sessionToken = cookieHeader.split("=")[1];
        var blacklisted = await checkBlacklisted(sessionToken);
        if(blacklisted){
            res.setHeader('Cache-Control', 'private, max-age=0, no-cache, no-store');
            res.render('index', {
                error: 'Please login!',
            });
        }else{
            await blacklistToken(sessionToken);
            //clear request cookie on client
            res.setHeader('Clear-Site-Data', '"cache", "cookies", "storage"');
            res.setHeader('Cache-Control', 'private, max-age=0, no-cache, no-store');
            res.render('index');
        }
    }
};
export {login, logout, registerUser, forgotPassword, updateUserAccount};