import {body} from 'express-validator';

const createAccountValidator = [
    body('firstName', '* required').notEmpty(),
    body('firstName', 'Must be alphanumeric').isAlphanumeric(),
    body('secondName').optional(),
    body('email', '* required').notEmpty(),
    body('email', 'Invalid email').isEmail(),
    body('password', '* required').notEmpty(),
    body('password', 'Minimum 8 characters').isLength({min: 8}),
];

const loginValidator = [
    body('email', '* required').notEmpty(),
    body('email', 'Invalid email').isEmail(),
    body('password', '* required').notEmpty(),
];
const projectValidator = [
    body('projectName', '* required').notEmpty(),
    body('ownerEmail', '* required').notEmpty(),
    body('ownerEmail', 'Invalid email').isEmail(),
];

const MQTTEndpointValidator = [
    body('mqttServerHost', '* required').notEmpty(),
    body('mqttUserName', '* required').notEmpty(),
    body('mqttAPIKey', '* required').notEmpty(),
    body('mqttAPIKey', 'Must be 98 characters').isLength({min:98, max:98}),
]
const deviceValidator = [
    body('deviceEUI', '* required').notEmpty(),
    body('deviceEUI', 'Must be alphanumeric').isAlphanumeric(),
    body('deviceEUI', 'Must be 16 characters').isLength({min:16, max:16}),
    body('deviceEUI', 'Must be lowercase').isLowercase(),
    body('deviceID', '* required').notEmpty(),
    body('deviceID', 'Must be lowercase').isLowercase(),
    body('deviceType', '* required').notEmpty(),
    body('deviceName', '* required').notEmpty(),
    body('deviceName', "Must not contain ' , or / ").custom((value) => {
        return (value.search(',') == -1 && value.search("'") == -1 && value.search('"') == -1 && value.search('/') == -1);
    }),
    body('gateway', '* required').notEmpty(),
];

const gatewayValidator = [
    body('gatewayEUI', '* required').notEmpty(),
    body('gatewayEUI', 'Must be alphanumeric').isAlphanumeric(),
    body('gatewayEUI', 'Must be 16 characters').isLength({min:16, max:16}),
    body('gatewayEUI', 'Must be lowercase').isLowercase(),
    body('gatewayID', '* required').notEmpty(),
    body('gatewayID', 'Must be lowercase').isLowercase(),    
    body('gatewayName', '* required').notEmpty(),
    body('tower', '* required').notEmpty(),
];

const memberValidator = [
    body('email', '* required').notEmpty(),
    body('email', 'Invalid email').isEmail(),
    body('role', '* required').notEmpty(),
];

const emailValidator = [
    body('email', '* required').notEmpty(),
    body('email', 'Invalid email').isEmail(),
];

const alarmValidator = [
    body('deviceEUI', 'Device not specified').notEmpty(),
    body('alarmType', '* required').notEmpty(),
];

export {createAccountValidator, loginValidator, projectValidator, gatewayValidator, deviceValidator, memberValidator,
    emailValidator, alarmValidator, MQTTEndpointValidator};
