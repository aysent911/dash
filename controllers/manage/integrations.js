import {body, validationResult} from 'express-validator';
import {createMQTTEndPoint} from '../../services/db.js';
import {createGrafanaOrg, createGrafanaUser} from '../../services/grafana.js';
import {PROJECT_OWNER, PROJECT_ADMIN, PROJECT_MEMBER, COPCART_ADMIN} from '../../config/index.js';
const addMQTTEndPoint = async function (req, res) {
    const validationErrors = validationResult(req);
    let isValidationError = false;
    let errors = {};
    let info = '';
    if(validationErrors.isEmpty()){
        const result = await createMQTTEndPoint(req.body);
        if(result){
            info = result;
        }else{
            isValidationError = true;
            info = 'Oops! An error occured!';
        }
    }else {
        isValidationError = true;
        const errorsArray = validationErrors.array();
        console.log(errorsArray);
        for (var i = 0; i < errorsArray.length; i++) {
            if (errorsArray[i].path === 'mqttServerHost') {
                errors.mqttServerHostError = errorsArray[i].msg;
            }else if (errorsArray[i].path === 'mqttUserName') {
                errors.mqttUserNameError = errorsArray[i].msg;
            }else if (errorsArray[i].path === 'mqttAPIKey' && !errors.mqttAPIKeyError) {
                errors.mqttAPIKeyError = errorsArray[i].msg;
            }
        }
    }
    res.send(JSON.stringify({
        isError: isValidationError,
        message: info,
        errors: errors,
    }));
};

const editMQTTEndPoint = async function(req, res){
    const validationErrors = validationResult(req);
    let isValidationError = false;
    let errors = {};
    let info = '';
    if(validationErrors.isEmpty()){
        let result = await updateProject(req);
        if(result){
            info = result;
        }else{
            isValidationError = true;
            info = 'Oops! An error occured!';
        }
    }else {
        isValidationError = true;
        const errorsArray = validationErrors.array();
        console.log(errorsArray);
        for (var i = 0; i < errorsArray.length; i++) {
            if (errorsArray[i].path === 'projectName') {
                errors.projectNameError = errorsArray[i].msg;
            }else if (errorsArray[i].path === 'ownerEmail' && !errors.ownerEmailError) {
                errors.ownerEmailError = errorsArray[i].msg;
            }else if (errorsArray[i].path === 'mqttServerHost') {
                errors.mqttServerHostError = errorsArray[i].msg;
            }else if (errorsArray[i].path === 'mqttUserName') {
                errors.mqttUserNameError = errorsArray[i].msg;
            }else if (errorsArray[i].path === 'mqttAPIKey' && !errors.mqttAPIKeyError) {
                errors.mqttAPIKeyError = errorsArray[i].msg;
            }
        }
    }
    res.send(JSON.stringify({
        isError: isValidationError,
        message: info,
        errors: errors,
    }));
}

export {addMQTTEndPoint, editMQTTEndPoint};