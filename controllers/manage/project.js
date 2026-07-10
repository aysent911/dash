import {body, validationResult} from 'express-validator';
import {createProject, findProjectDevices, findUserDevice, findProjectMembers, createDevice, updateDevice,
    deleteDevice, createMember, createDeviceAlarm, updateProject} from '../../services/db.js';
import {createGrafanaOrg, createGrafanaUser} from '../../services/grafana.js';
import {PROJECT_OWNER, PROJECT_ADMIN, PROJECT_MEMBER, COPCART_ADMIN} from '../../config/index.js';
var addProject = async function(req, res){
    const validationErrors = validationResult(req);
    var isValidationError = false;
    let errors = {};
    var info = '';
    if(validationErrors.isEmpty()){
        let result = await createGrafanaOrg(req.body.projectName);
        if(result.orgId){
            req.body.orgId = result.orgId;
            createGrafanaUser({
                email: req.body.ownerEmail,
                orgId: result.orgId,
            });
        }
        result = await createProject(req.body);
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
            }
        }
    }
    res.send(JSON.stringify({
        isError: isValidationError,
        message: info,
        errors: errors,
    }));
};

const editProject = async function(req, res){
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
};

let getDeviceInfo = async function(req, res){
    const result = await findUserDevice(req.user, req.body);
    if(result){
        if(result.privilege == PROJECT_OWNER || result.privilege == PROJECT_ADMIN){
            result.privilege = 'authorize';
        }else{
            result.privilege = 'denied';
        }
        res.send(JSON.stringify({
                deviceInfo: result,
                error: null,
            }));
    }else {
        res.send(JSON.stringify({
            deviceInfo: null,
            error: `Oops, No device info matching ${req.body.eui} found!`,
        }));
    }
}

var addDevice = async function(req, res){
    const errors = validationResult(req);
    var validationError = false;
    req.deviceEUIError = '';
    req.deviceIDError = '';
    req.deviceTypeError = '';
    req.deviceNameError = '';
    req.gatewayError = '';
    var info = '';
    if(errors.isEmpty()){
        var result = await createDevice(req);
        if(result){
            info = result;
        }else{
            validationError = true;
            info = 'Oops! An Error occured!';
        }
    }else {
        validationError = true;
        const validationErrors = errors.array();
        for (var i = 0; i < validationErrors.length; i++) {
            if (validationErrors[i].path === 'deviceEUI' && !req.deviceEUIError) {
                req.deviceEUIError = validationErrors[i].msg;
            }else if (validationErrors[i].path === 'deviceID' && !req.deviceIDError) {
                req.deviceIDError = validationErrors[i].msg;
            }else if (validationErrors[i].path === 'deviceType') {
                req.deviceTypeError = validationErrors[i].msg;
            }else if (validationErrors[i].path === 'deviceName' && !req.deviceNameError) {
                req.deviceNameError = validationErrors[i].msg;
            }else if (validationErrors[i].path === 'gateway') {
                req.gatewayError = validationErrors[i].msg;
            }
        }
    }
    res.send(JSON.stringify({
        error: validationError,
        message: info,
        deviceEUIError: req.deviceEUIError,
        deviceIDError: req.deviceIDError,
        deviceTypeError: req.deviceTypeError,
        deviceNameError: req.deviceNameError,
        gatewayError: req.gatewayError,
    }));
};

var editDevice = async function(req, res){
    const errors = validationResult(req);
    var validationError = false;
    req.deviceEUIError = '';
    req.deviceIDError = '';
    req.deviceTypeError = '';
    req.deviceNameError = '';
    var info = '';
    if(errors.isEmpty()){
    	console.log(req.body);
        var result = await updateDevice(req);
        if(result){
            info = result;
        }else{
            validationError = true;
            info = 'Oops! An Error occured!';
        }
    }else {
        validationError = true;
        const validationErrors = errors.array();
        for (var i = 0; i < validationErrors.length; i++) {
            if (validationErrors[i].path === 'deviceEUI' && !req.deviceEUIError) {
                req.deviceEUIError = validationErrors[i].msg;
            }else if (validationErrors[i].path === 'deviceID' && !req.deviceIDError) {
                req.deviceIDError = validationErrors[i].msg;
            }else if (validationErrors[i].path === 'deviceType') {
                req.deviceTypeError = validationErrors[i].msg;
                console.log(req.body);
            }else if (validationErrors[i].path === 'deviceName' && !req.deviceNameError) {
                req.deviceNameError = validationErrors[i].msg;
            }
        }
    }
    res.send(JSON.stringify({
        error: validationError,
        message: info,
        deviceEUIError: req.deviceEUIError,
        deviceIDError: req.deviceIDError,
        deviceTypeError: req.deviceTypeError,
        deviceNameError: req.deviceNameError,
    }));
};

var removeDevice = async function(req, res){
    const errors = validationResult(req);
    var validationError = false;
    req.deviceEUIError = '';
    req.deviceIDError = '';
    req.deviceTypeError = '';
    req.deviceNameError = '';
    var info = '';
    if(errors.isEmpty()){
        var result = await deleteDevice(req);
        if(result){
            info = result;
        }else{
            validationError = true;
            info = 'Oops! An Error occured!';
        }
    }else {
        validationError = true;
        const validationErrors = errors.array();
        for (var i = 0; i < validationErrors.length; i++) {
            if (validationErrors[i].path === 'deviceEUI' && !req.deviceEUIError) {
                req.deviceEUIError = validationErrors[i].msg;
            }else if (validationErrors[i].path === 'deviceID' && !req.deviceIDError) {
                req.deviceIDError = validationErrors[i].msg;
            }else if (validationErrors[i].path === 'deviceType') {
                req.deviceTypeError = validationErrors[i].msg;
                console.log(req.body);
            }else if (validationErrors[i].path === 'deviceName' && !req.deviceNameError) {
                req.deviceNameError = validationErrors[i].msg;
            }
        }
    }
    res.send(JSON.stringify({
        error: validationError,
        message: info,
        deviceEUIError: req.deviceEUIError,
        deviceIDError: req.deviceIDError,
        deviceTypeError: req.deviceTypeError,
        deviceNameError: req.deviceNameError,
    }));
};
var inviteMember = async function(req, res){
    const errors = validationResult(req);
    var validationError = false;
    req.memberEmailError = '';
    req.roleError = '';
    var info = '';
    if(errors.isEmpty()){
        var result = await createMember(req);
        if(result){
            info = result;
        }else{
            validationError = true;
            info = 'Oops! An Error occured!';
        }
    }else {
        validationError = true;
        const validationErrors = errors.array();
        for (var i = 0; i < validationErrors.length; i++) {
            if (validationErrors[i].path === 'email' && !req.memberEmailError) {
                req.memberEmailError = validationErrors[i].msg;
            }else if (validationErrors[i].path === 'role') {
                req.roleError = validationErrors[i].msg;
            }
        }
    }
    res.send(JSON.stringify({
        error: validationError,
        message: info,
        memberEmailError: req.memberEmailError,
        roleError: req.roleError,
    }));
};
var getProjectDevices = async (req, res) =>{
    var result = await findProjectDevices(req.body.projectId);
    res.send(JSON.stringify(result));
};

var getProjectMembers = async (req, res) =>{
    var members = await findProjectMembers(req.body.projectId);
    for(let i = 0; i < members.length; i++){
        if(members[i].privilege == 0x35 || members[i].privilege == 0x71 ){
            members[i].privilege = 'Admin';
        }else if(members[i].privilege == 0x57){
            members[i].privilege = 'Owner';
        }else if(members[i].privilege == 0x02 || members[i].privilege == 0x98){
            members[i].privilege = 'Member';
        }
    }
    res.send(JSON.stringify(members));
};

let setDeviceAlarm = async function(req, res){
    let deviceEUIError = '';
    let alarmTypeError = '';
    let lowerLimitError = '';
    let upperLimitError = '';
    let timeZoneError = '';
    let startTimeError = '';
    let endTimeError = '';
    let thresholdError = '';
    let startValue = '';
    let endValue = '';
    let message = '';
    if(req.body.alarmType == 'outside-range'){
        await body('lowerLimit', '* required').notEmpty().run(req);
        await body('upperLimit', '* required').notEmpty().run(req);
        startValue = toString(req.body.lowerLimit);
        endValue = toString(req.body.upperLimit);
    }else if(req.body.alarmType == 'outside-time'){
        await body('timeZone', '* required').notEmpty().run(req);
        await body('startTime', '* required').notEmpty().run(req);
        await body('endTime', '* required').notEmpty().run(req);
        req.body.alarmType = req.body.alarmType  + req.body.timeZone;
        startValue = req.body.startTime;
        endValue = req.body.endTime;
    }else{
        await body('threshold', '* required').notEmpty().run(req);
        startValue = null;
        endValue = toString(req.body.threshold);
    }
    const errors = validationResult(req);
    if(errors.isEmpty()){
        let result = await createDeviceAlarm({
            deviceEUI: req.body.deviceEUI,
            type: req.body.alarmType,
            startValue: startValue,
            endValue: endValue,
        });
        if(result){
            message = 'Alarm created sucessfully';
        }else{
            message = 'Oops an error occurred';
        }
    }else{
        const validationErrors = errors.array();
        for (let i = 0; i < validationErrors.length; i++){
            if (validationErrors[i].path === 'deviceEUI'){
                deviceEUIError = validationErrors[i].msg;
            }else if (validationErrors[i].path === 'alarmType'){
                alarmTypeError = validationErrors[i].msg;
            }else if (validationErrors[i].path === 'lowerLimit'){
                lowerLimitError = validationErrors[i].msg;
            }else if (validationErrors[i].path === 'upperLimit'){
                upperLimitError = validationErrors[i].msg;
            }else if (validationErrors[i].path === 'timeZone'){
                timeZoneError = validationErrors[i].msg;
            }else if (validationErrors[i].path === 'startTime'){
                startTimeError = validationErrors[i].msg;
            }else if (validationErrors[i].path === 'endTime'){
                endTimeError = validationErrors[i].msg;
            }else if (validationErrors[i].path === 'threshold'){
                thresholdError = validationErrors[i].msg;
            }
        }
    }
    res.send(JSON.stringify({
        deviceEUIError: deviceEUIError,
        alarmTypeError: alarmTypeError,
        lowerLimitError: lowerLimitError,
        upperLimitError: upperLimitError,
        timeZoneError: timeZoneError,
        startTimeError: startTimeError,
        endTimeError: endTimeError,
        thresholdError: thresholdError,
        message: message,
    }));
}

export {addProject, editProject, getProjectDevices, getProjectMembers,getDeviceInfo, addDevice, editDevice,
    removeDevice, setDeviceAlarm, inviteMember};
