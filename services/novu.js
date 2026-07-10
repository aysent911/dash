import { Novu } from '@novu/node';
import {NOVU_SECRET_KEY, NOVU_TENANT_KEY, SECURITY_MAIL} from '../config/index.js';
const novu = new Novu(NOVU_SECRET_KEY);

var triggerEmail = function(eventID, ID, email, payload){
    novu.trigger(eventID, {
        tenant: NOVU_TENANT_KEY,
        to: {
            subscriberId: ID,
            email,
        },
        payload,
    });
}
var sendEmailVerification = function(ID, email, link){
    try{
        triggerEmail('email-verification', ID, email, {verifyLink: link, securityEmail: SECURITY_MAIL});
    }catch (err){
        console.log(err);
    }
}

var sendPasswordReset = function(ID, email, link){
    try{
        triggerEmail('password-reset', ID, email, {resetLink: link, securityEmail: SECURITY_MAIL});
    }catch (err){
        console.log(err);
    }
}
export {sendEmailVerification, sendPasswordReset};