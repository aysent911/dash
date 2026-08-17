import createError from 'http-errors';
import express from 'express';
import path from 'path';
import {fileURLToPath} from 'url';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import fs from 'fs';
import bodyParser from 'body-parser';
import {webSocketServer, requestSnapshot} from './services/websocket_service.js';
import getWSS from './controllers/manage/wss.js';

import indexRouter from './routes/index.js';
import usersRouter from './routes/users.js';
import dashboardRouter from './routes/dashboard.js';
import createAccountRouter from './routes/create_account.js';
import gatewaysRouter from './routes/gateways.js';
import reportsRouter from './routes/reports.js';
import verifyRouter from './routes/verify.js';
import addGatewayRouter from './routes/manage_gateways.js';
import resetInfoRouter from './routes/reset_info.js';
import passwordResetRouter from './routes/password_reset.js';
import {verifySession, login, send2FACode, verify2FACode} from './middleware/auth.js';
import {projectValidator, gatewayValidator, deviceValidator, memberValidator,
    emailValidator, alarmValidator, MQTTEndpointValidator, createAccountValidator,
    loginValidator} from './middleware/validators.js';
import {getProjects, getDevicesUpdate, getDevices, getUserDevices} from './middleware/data_handler.js';
import {getReports, getReportDetail, getEventDetail} from './middleware/reports.js';
import {reportDetail, escalateEvent} from './controllers/report.js';
import {addProject, editProject, getProjectDevices, getProjectMembers, getDeviceInfo, addDevice, editDevice,
    removeDevice, setDeviceAlarm, inviteMember} from './controllers/manage/project.js';
import {addGateway} from './controllers/manage/gateway.js';
import {addMQTTEndPoint} from './controllers/manage/integrations.js';
import {} from './services/miscellaneous.js';
import {logout, forgotPassword, updateUserAccount} from './controllers/auth.js';
import {MQTT_SERVER_HOST, MQTT_LHT_METRICS_USERNAME, MQTT_LHT_METRICS_PASSWORD,
   MQTT_CC_DOOR_USERNAME, MQTT_CC_DOOR_PASSWORD, MQTT_VIP_INDOOR_STORAGE_METRICS_USERNAME,
    MQTT_VIP_INDOOR_STORAGE_METRICS_PASSWORD} from './config/index.js';
import {MQTT} from './services/mqtt_service.js';

import checkCache from './services/redis.js';
import {getGateways, findMQTTEndPoints} from './services/db.js';
import {createCameraEvent, findSnapshot} from './services/prisma.js';

var app = express();
//retrieve and cache all devices
await getDevices();
//start mqtt clients
let hosts = await findMQTTEndPoints();
let mqttClients = [];
for(let i=0; i<hosts.length; i++){
    mqttClients.push(new MQTT('mqtt://'+hosts[i].host, hosts[i].user_name, hosts[i].key));
    mqttClients[i].subscribe('#');
}

let greeter = [];
// view engine setup
const __dirname = path.dirname(fileURLToPath(import.meta.url));
await fs.readdir(path.join(__dirname, 'assets/greeter'), (err, images) => {
    if(err){
        console.log(err);
    }else{
        greeter = greeter.concat(images);
    }
});
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
// global variable devices
app.set('devices', []);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/verify', verify2FACode);
//app.use('/verified', verifyEmail);
//app.use('/:search', checkCache);
app.use('/create_account', createAccountRouter);
app.post('/register_user', createAccountValidator, send2FACode, (req, res) => {
    res.render('verify', {
        info: `Verification code has been sent to ${req.body.email}\n` +
        `If not received within 2 minutes, click on Resend Link`,
        targetUrl: '/verify',
        tenant: req.body.email,
    });
});
app.post('/forgot_password', emailValidator, forgotPassword);
app.use('/reset_info', resetInfoRouter);
app.use('/password_reset', passwordResetRouter);
app.post('/update_account', createAccountValidator, updateUserAccount);
app.post('/login', loginValidator, login, send2FACode, (req, res) => {
    res.setHeader('Cache-Control', 'private, max-age=0, no-cache, no-store');
    res.render('verify', {
        targetUrl: '/verify',
        tenant: req.body.email,
  });
});
app.use('/dashboard', verifySession, getProjects, getUserDevices);
app.use('/dashboard', dashboardRouter);
app.use('/dashboard/reports/escalate', verifySession, getEventDetail, escalateEvent);
app.use('/dashboard/reports/detail', verifySession, getReportDetail, reportDetail);
app.use('/dashboard/reports/snapshot', verifySession, async (req, res) => {
    const snapshot = await findSnapshot(req.query);
    if(!snapshot.image){
        res.status(200).send();
    }else{
        res.setHeader("Content-Type", snapshot.mimeType);
        res.setHeader("Cache-Control", "private, max-age=0, no-cache, no-store");
        res.status(200).send(Buffer.from(snapshot.image).toString("base64"));
    }
});
app.use('/dashboard/reports', verifySession, getReports, reportsRouter);
app.use('/gateways', verifySession, getProjects, getGateways);
app.use('/gateways', gatewaysRouter);

app.get('/wss', getWSS);
app.get('/check_update', verifySession, getDevicesUpdate, (req, res) => {
  //var updatedDevices = checkUpdate();
  //console.log(req.devices.length);
  res.send(req.devicesUpdate);
});

app.get('/check_gateways', verifySession, getGateways, (req, res) => {
  //console.log(req.devices.length);
  res.send(req.gateways);
});
app.get('/greeter/image', async (req, res) => {
    let imageFile = 'assets/greeter/'+ greeter[Math.floor(Math.random()*greeter.length)];
    console.log(greeter);
    await fs.readFile(path.join(__dirname,imageFile), (err, data) => {
        if(err){
            console.log(err);
            res.status(500).send();
        }else{
            //res.setHeader('Content-Type', imageMimeType);
            res.send(data);
        }
    });
});
app.get('/check_status', (req, res) => {
    res.send(JSON.stringify({onlineStatus: 'available'}));
});
app.post('/v1/camera/events', (req, res) => {
    //console.log(req.body);
    requestSnapshot(req.body);
    createCameraEvent(req.body);
    res.status(200).send();
});
app.post('/manage_gateway/add_gateway', verifySession, gatewayValidator, addGateway);
app.post('/manage_project/add_project', verifySession, projectValidator, addProject);
app.post('/manage_project/edit', verifySession, projectValidator, editProject);
app.post('/manage_project/devices', verifySession, getProjectDevices);
app.post('/manage_project/devices/device', verifySession, getDeviceInfo);
app.post('/manage_project/devices/device/set_alarm', verifySession, alarmValidator, setDeviceAlarm);
app.post('/manage_project/devices/add', verifySession, deviceValidator, addDevice);
app.post('/manage_project/devices/edit', verifySession, deviceValidator, editDevice);
app.post('/manage_project/devices/remove', verifySession, deviceValidator, removeDevice);
app.post('/manage_project/members', verifySession, getProjectMembers);
app.post('/manage_project/members/invite', verifySession, memberValidator, inviteMember);
app.post('/manage/integrations/mqtt/add', verifySession, MQTTEndpointValidator, addMQTTEndPoint);

app.get('/logout', logout);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

export default app;
