import {DB_USER, DB_PASS, DB_HOST, DB_PORT, DB_NAME, PROJECT_OWNER, PROJECT_ADMIN, PROJECT_MEMBER,
    COPCART_ADMIN} from '../config/index.js';
import path from 'path';
import {fileURLToPath} from 'url';
import fs from 'fs';
import pkg from 'pg';
const {Client} = pkg;

const client = new Client({
    user: DB_USER,
    password: DB_PASS,
    host: DB_HOST,
    port: DB_PORT,
    database: DB_NAME,
    ssl: {
        rejectUnauthorized: false,
        ca: fs.readFileSync(path.join(path.dirname(fileURLToPath(import.meta.url)), '../ca.crt')).toString()
    },
});
client.connect();

let findUserProjects =  async (email) => {
    try {
        //await client.connect();
        const result = await client.query('SELECT projects.id, projects.name, projects.owner' +
            ' FROM public.projects INNER JOIN public.project_members ON projects.id=project_members.project_id ' +
            ' WHERE project_members.user_email= $1', [email]);
        return result.rows;
        //await client.end();
    } catch (err) {
        console.error(err);
        //await client.end();
        return;
    }
};

const findUserDevices =  async (user) => {
    let userDevices = [];
    try {
        //await client.connect();
        if(user){
            if(user.role == COPCART_ADMIN){
                const result = await client.query(
                    'SELECT eui FROM public.devices ORDER BY devices.type DESC;');
                userDevices.push(...(result.rows));
            }else {
                const result = await client.query(
                    'SELECT eui' +
                    ' FROM ((public.devices INNER JOIN public.projects ON devices.project_id = projects.id)' +
                    ' INNER JOIN public.project_members ON devices.project_id = project_members.project_id)' +
                    ' WHERE project_members.user_email = $1' +
                    ' ORDER BY devices.type DESC;', [user.email]);
                userDevices.push(...(result.rows));
            }
            //await client.end();
        }
        return userDevices;
    } catch (err) {
        console.error(err);
        //await client.end();
        return userDevices;
    }
};


let findDevicesUpdate = async (user, entity, lastEvent) => {
    try {
        //await client.connect();
        if(entity == 'door_devices'){
            if(user.role == COPCART_ADMIN){
                var result = await client.query(
                    'SELECT devices.eui dev_eui, devices.name dev_name, devices.status dev_status,' +
                    ' devices.update_at dev_update, devices.bat_mv bat_mv, gateways.name gateway_name,' +
                    ' projects.name project_name' +
                    ' FROM ((public.devices LEFT JOIN public.gateways ON devices.gateway = gateways.eui)' +
                    ' LEFT JOIN public.projects ON devices.project_id = projects.id)' +
                    ' WHERE devices.type = \'LDS\' AND devices.update_at > $1' +
                    ' ORDER BY devices.update_at ASC;', [lastEvent]);
                return result.rows;
            }else {
                var result = await client.query(
                    'SELECT devices.eui dev_eui, devices.name dev_name, devices.status dev_status,' +
                    ' devices.update_at dev_update, gateways.name gate_name,' +
                    ' projects.name project_name, project_members.user_email email ' +
                    'FROM (((public.devices LEFT JOIN public.gateways ON devices.gateway=gateways.eui) ' +
                    'INNER JOIN public.projects ON devices.project_id=projects.id) ' +
                    'INNER JOIN public.project_members ON devices.project_id=project_members.project_id)' +
                    ' WHERE devices.type = \'LDS\' AND project_members.user_email = $1 AND devices.update_at > $2' +
                    ' ORDER BY devices.update_at ASC;',
                    [user.email, lastEvent]);
                return result.rows;
            }
        }else if(entity == 'htdevices'){
            if(user.role == COPCART_ADMIN){
                var result = await client.query(
                    'SELECT htdevices.eui dev_eui, htdevices.name dev_name, htdevices.status dev_status,' +
                    ' htdevices.update_at dev_update, htdevices.hum_sht hum_sht,' +
                    ' htdevices.tempc_sht tempc_sht, htdevices.tempc_ds tempc_ds,' +
                    ' htdevices.bat_mv bat_mv,' +
                    ' gateways.name gateway_name, projects.name project_name' +
                    ' FROM ((public.htdevices LEFT JOIN public.gateways ON htdevices.gateway = gateways.eui)' +
                    ' LEFT JOIN public.projects ON htdevices.project_id = projects.id) WHERE ' +
                    'htdevices.update_at > $1 ORDER BY htdevices.update_at ASC;', [lastEvent]);
                return result.rows;
            }else {
                var result = await client.query(
                    'SELECT htdevices.eui dev_eui, htdevices.name dev_name, htdevices.status dev_status,' +
                    ' htdevices.update_at dev_update, htdevices.hum_sht AS hum_sht,' +
                    ' htdevices.tempc_sht tempc_sht, htdevices.tempc_ds tempc_ds,' +
                    ' htdevices.bat_mv bat_mv,' +
                    ' gateways.name gateway_name, projects.name project_name, project_members.user_email email' +
                    ' FROM (((public.htdevices LEFT JOIN public.gateways ON htdevices.gateway = gateways.eui)' +
                    ' LEFT JOIN public.projects ON htdevices.project_id=projects.id)' +
                    ' LEFT JOIN public.project_members ON htdevices.project_id=project_members.project_id) WHERE ' +
                    'project_members.user_email = $1 AND htdevices.update_at > $2 ORDER BY htdevices.update_at ASC;',
                    [user.email, lastEvent]);
                return result.rows;
            }
        }
        //await client.end();
    } catch (err) {
        console.error(err);
        //await client.end();
        return;
    }
};

let getGateways =  async (req, res, next) => {
    try {
        //await client.connect();
        var result = await client.query('SELECT * FROM public.gateways;');
        req.gateways = result.rows;
        //await client.end();
        next();
    } catch (err) {
        console.error(err);
        //await client.end();
        res.status(500).send('Internal Server Error');
    }
};

let authenticateUserKey =  async (userKey) => {
    try {
        var result = await client.query('SELECT * FROM public.users WHERE user_key=$1;', [userKey]);
        if(result.rows[0]){
            const user = result.rows[0];
            if(user.role == COPCART_ADMIN){   //user = 0x02, admin = 0x71
                return true;
            }else{
                return false;
            }
        }else {
            return false;
        }
        //await client.end();

    } catch (err) {
        console.error(err);
        //await client.end();
        return;
    }
};
let createGateway =  async (user, body) => {
    try {
    	let privilege = await client.query('SELECT users.role FROM public.users WHERE email=$1', [user.email]);
    	if(privilege.rows[0].role == COPCART_ADMIN){
    	    let result = await client.query('INSERT INTO public.gateways(eui, id, name, tower) VALUES($1, $2, $3, $4) RETURNING *;',
    	        ['eui-'+body.gatewayEUI, body.gatewayID, body.gatewayName, body.tower]);
    	    if(result.rows[0]){
    	        return 'Gateway ' + result.rows[0].eui + ' added successfully!';
    	    }else {
    	        return 'Oops! An error occurred';
    	    }
    	}else{
    	    return 'You do not have sufficient permission to perform this action!';
    	}    
    } catch (err) {
        console.error(err);
        //await client.end();
        return err.detail;
    }
};

let createProject =  async (project) => {
    try {
        let result = await client.query(
            'INSERT INTO public.projects(name, owner, org_id) VALUES($1, $2, $3) RETURNING *;',
            [project.projectName, project.ownerEmail, project.orgId]);
        if(result.rows[0]){
            await client.query('INSERT INTO public.project_members(project_id, user_email, privilege) VALUES($1, $2, $3);',
                [result.rows[0].id, project.ownerEmail, PROJECT_OWNER]);  //project admin
            return 'Project ' + result.rows[0].name + ' created successfully!';
        }else {
            return;
        }
    } catch (err) {
        console.error(err);
        //await client.end();
        return err.detail;
    }
};

const updateProject =  async (req) => {
    try {
        var privileges = await client.query(
            'SELECT privilege FROM public.project_members WHERE project_id=$1 AND user_email=$2;',
            [req.body.projectId, req.user.email]);
        var permission = privileges.rows[0].privilege;
        if(permission == PROJECT_OWNER || permission == PROJECT_ADMIN) {
            let result = await client.query(
                'UPDATE public.projects SET (name, owner, mqtt_server_host, mqtt_user_name, mqtt_api_key)' +
                ' = ($2, $3, $4, $5, $6) WHERE id = $1 RETURNING *;',
                [req.body.projectId, req.body.projectName, req.body.ownerEmail, req.body.mqttServerHost,
                    req.body.mqttUserName,
                    req.body.mqttAPIKey]);
            return 'Project ' + result.rows[0].name + ' updated successfully!';

        }else{
            return 'You do not have permission to perform this action';
        }
    } catch (err) {
        console.error(err);
        //await client.end();
        return err.detail;
    }
};
let createDevice =  async (req) => {
    try {
        var privileges = await client.query(
            'SELECT privilege FROM public.project_members WHERE project_id=$1 AND user_email=$2;',
            [req.body.projectId, req.user.email]);
        var permission = privileges.rows[0].privilege;
        if(permission == COPCART_ADMIN || permission == PROJECT_OWNER || permission == PROJECT_ADMIN){
            let result;
            result = await client.query('INSERT INTO public.devices(eui, id, name, gateway, project_id, type)' +
                ' VALUES($1, $2, $3, $4, $5, $6) RETURNING *;',
                ['eui-'+req.body.deviceEUI, req.body.deviceID, req.body.deviceName, req.body.gateway,
                req.body.projectId, req.body.deviceType]);
            if(result.rows[0]){
                return 'Device ' + result.rows[0].name + ' added successfully!';
            }else {
                return;
            }
        }else{
            return 'You do not have permission to perform this action';
        }
    } catch (err) {
        console.error(err);
        //await client.end();
        return err.detail;
    }
};

let updateDevice = async function (req) {
    try {
        var privileges = await client.query(
            'SELECT privilege FROM public.project_members WHERE project_id=$1 AND user_email=$2;',
            [req.body.projectId, req.user.email]);
        var permission = privileges.rows[0].privilege;
        if(permission == PROJECT_OWNER || permission == PROJECT_ADMIN){
            let result;
            if(req.body.deviceType.match(/DS/i)){
                result = await client.query('UPDATE public.devices SET(name, project_id) = ($2, $3) WHERE eui=$1' +
                    ' RETURNING *;',
                    ['eui-'+req.body.deviceEUI, req.body.deviceName, req.body.projectId]);
            }else if(req.body.deviceType.match(/HT/i)){
                result = await client.query('UPDATE public.htdevices SET(name, project_id) = ($2, $3) WHERE eui=$1' +
                    ' RETURNING *;',
                    ['eui-'+req.body.deviceEUI, req.body.deviceName, req.body.projectId]);
            }
            if(result.rows[0]){
                return 'Device ' + result.rows[0].name + ' updated successfully!';
            }else {
                return;
            }
        }else{
            return 'You do not have permission to perform this action';
        }
    } catch (err) {
        console.error(err);
        //await client.end();
        return err.detail;
    }
}
const updateDoorDevice = async function(device){
    const result = await client.query(
        'UPDATE public.door_devices SET ' +
        '(alarm, open_status, open_times, last_open_duration, update_at) ' +
        '= ($2, $3, $4, $5, $6) WHERE id = $1 OR eui = $1 RETURNING *;',
        [device.eui, device.alarm, device.open_status, device.open_times, device.last_open_duration, device.updated]
    );
    if(result.rows){
        return result.rows[0];
    }else{
        return;
    }
}

const createDoorEvent = async function(event){
    try{
        const result = await client.query('INSERT INTO public.logs(created_at, dev_eui, gate_eui, trigger_event)' +
            ' VALUES($1, $2, $3, $4) RETURNING *;',
            [event.update_at, event.eui, 'eui-'+ event.gateway.toLowerCase(), event.open_status]);
        return result.rows[0];
    }catch(err){
        console.error(err);
        return;
    }
}

let deleteDevice = async function (req) {
    try {
        var privileges = await client.query(
            'SELECT privilege FROM public.project_members WHERE project_id=$1 AND user_email=$2;',
            [req.body.projectId, req.user.email]);
        var permission = privileges.rows[0].privilege;
        if(permission == PROJECT_OWNER || permission == PROJECT_ADMIN){
            let result;
            if(req.body.deviceType.match(/DS/i)){
                result = await client.query('DELETE FROM public.devices WHERE eui=$1 RETURNING *;',
                    ['eui-'+req.body.deviceEUI]);
            }else if(req.body.deviceType.match(/HT/i)){
                result = await client.query('DELETE FROM public.devices WHERE eui=$1 RETURNING *;',
                    ['eui-'+req.body.deviceEUI]);
            }
            if(result.rows[0]){
                return 'Device ' + result.rows[0].name + ' removed successfully!';
            }else {
                return;
            }
        }else{
            return 'You do not have permission to perform this action';
        }
    } catch (err) {
        console.error(err);
        //await client.end();
        return err.detail;
    }
}
let updateHumidityTemperatureDevice = async (device) => {
    try{
        await client.query('UPDATE public.devices SET (status, update_at)=(\'online\', $2) WHERE eui=$1;',
            [device.eui, device.updated]);
        let result = await client.query('UPDATE public.humidity_temperature_devices ' +
            'SET(humidity, temperature_c, temperature_ext, update_at) = ($1, $2, $3, $4)' +
            'WHERE eui=$5 RETURNING *;',
            [device.humidity, device.temperature, device.temperature_ext, device.updated, device.eui]);
        if(result.rows[0]){
            return result.rows[0];
        }else {
            return;
        }
    }catch (err) {
        console.error(err);
        //await client.end();
        return;
    }

}

let createMember =  async (req) => {
    try {
        var privileges = await client.query(
            'SELECT privilege FROM public.project_members WHERE project_id=$1 AND user_email=$2;',
            [req.body.projectId, req.user.email]);
        var permission = privileges.rows[0].privilege;
        if(permission == COPCART_ADMIN || permission == PROJECT_OWNER || permission == PROJECT_ADMIN){
            var result = await client.query('INSERT INTO public.project_members(project_id, user_email, privilege)' +
                ' VALUES($1, $2, $3) RETURNING *;', [req.body.projectId, req.body.email, req.body.role]);
            if(result.rows[0]){
                return 'Invite sent to ' + result.rows[0].user_email + ' successfully!';
            }else {
                return;
            }
        }else{
            return 'You do not have permission to perform this action';
        }
    } catch (err) {
        console.error(err);
        //await client.end();
        return err.detail;
    }
};
let findProjectDevices = async function(projectId){
    try {
        var result = await client.query('SELECT eui, name FROM public.devices WHERE project_id=$1;', [projectId]);
        return result.rows;
    } catch (err) {
        console.error(err);
        //await client.end();
        return err.detail;
    }
};
let findUserDevice = async function(user, device){
    try {
        let result = await client.query('SELECT' +
            ' devices.id, devices.name, devices.project_id, devices.status, devices.created_at,' +
            ' devices.update_at, devices.bat_mv, devices.firmware_version, devices.sensor_model,' +
            ' devices.frequency_band, devices.sub_band, devices.brand, project_members.privilege' +
            ' FROM public.devices LEFT JOIN public.project_members' +
            ' ON devices.project_id = project_members.project_id WHERE devices.eui=$1' +
            ' AND project_members.user_email=$2;', [device.eui, user.email]);
        return  result.rows[0];
    } catch (err) {
        console.error(err);
        //await client.end();
        return ;
    }
};
let findProjectMembers = async function(projectId){
    try {
        var result = await client.query('SELECT user_email, privilege FROM public.project_members WHERE project_id=$1;', [projectId]);
        return result.rows;
    } catch (err) {
        console.error(err);
        //await client.end();
        return err.detail;
    }
};

let findUserByEmail =  async (email) => {
    try {
        //await client.connect();
        const result = await client.query('SELECT * FROM public.users WHERE email=$1;', [email]);
        return result.rows[0];
        //await client.end();

    } catch (err) {
        console.error(err);
        //await client.end();
        return;
    }
};
let findUserByID =  async (id) => {
    try {
        //await client.connect();
        const result = await client.query('SELECT * FROM public.users WHERE id=$1;', [id]);
        return result.rows[0];
        //await client.end();

    } catch (err) {
        console.error(err);
        //await client.end();
        return;
    }
};
let authenticateUser =  async (email, password) => {
    try {
        //await client.connect();
        var result = await client.query(
            'SELECT (passhash = crypt($2, passhash)) AS password_match' +
            ' FROM (SELECT * FROM public.users WHERE email=$1) AS user_details;',
            [email, password])
        return result.rows[0].password_match;
        //await client.end();

    } catch (err) {
        console.error(err);
        //await client.end();
        return;
    }
};


let createUser =  async (user) => {
    try {
        //await client.connect();
        const result = await client.query("INSERT INTO public.users(first_name, second_name, email, passhash)" +
            " VALUES($1, $2, $3, crypt($4, gen_salt('md5'))) RETURNING *;",
            [user.firstName, user.secondName, user.email, user.password]);
        return result.rows[0];
        //await client.end();

    } catch (err) {
        console.error(err);
        //await client.end();
        return;
    }
};

let updateUser = async function(firstName, secondName, email, password){
    try {
        //await client.connect();
        const result = await client.query("UPDATE public.users SET first_name = $1, second_name = $2, email=$3," +
            "passhash = crypt($4, gen_salt('md5')) WHERE email=$3 RETURNING *;", [firstName, secondName, email, password]);
        return result.rows[0];
        //await client.end();

    } catch (err) {
        console.error(err);
        //await client.end();
        return;
    }
}
let checkBlacklisted = async function(token){
    try {
        //await client.connect();
        const result = await client.query("SELECT * FROM public.blacklist WHERE token=$1;", [token]);
        return result.rows[0];
        //await client.end();

    } catch (err) {
        console.error(err);
        //await client.end();
        return;
    }
};
let blacklistToken = async function(token){
    try {
        //await client.connect();
        const result = await client.query("INSERT INTO public.blacklist(token) VALUES($1);", [token]);
        return 'blacklisted';
        //await client.end();

    } catch (err) {
        console.error(err);
        //await client.end();
        return;
    }
};

let updateEmailVerified =  async (id) => {
    try {
        //await client.connect();
        const result = await client.query('UPDATE public.users SET verified=true WHERE id=$1 RETURNING *;', [id]);
        return result.rows[0];
        //await client.end();

    } catch (err) {
        console.error(err);
        //await client.end();
        return;
    }
};

let createDeviceAlarm = async function(alarm){
    try{
       const result = await client.query('INSERT INTO public.alarms(dev_eui, start_value, end_value, type, enable)' +
           ' VALUES($1, $2, $3, $4, true) RETURNING *;',
           [alarm.deviceEUI, alarm.startValue, alarm.endValue, alarm.type]);
       return result.rows[0];
    }catch(err){
        console.error(err)
        return;
    }
}


let createMQTTEndPoint =  async (endPoint) => {
    try {
        let result = await client.query(
            'INSERT INTO public.mqtt_endpoints(host, user_name, key)' +
            ' VALUES($1, $2, $3) RETURNING *;',
            [endPoint.mqttServerHost, endPoint.mqttUserName, endPoint.mqttAPIKey]);
        if(result.rows[0]){
            return 'MQTT end point ' + result.rows[0].user_name + ' created successfully!';
        }else {
            return;
        }
    } catch (err) {
        console.error(err);
        //await client.end();
        return err.detail;
    }
};

const findMQTTEndPoints = async function () {
    try{
        const result = await client.query('SELECT host, user_name, key FROM public.mqtt_endpoints;');
        if(result.rows){
            return result.rows;
        }else{
            return;
        }
    }catch(err){
        console.error(err);
        return err.detail;
    }
}

const createPowerDevice = async function (eui, id){
    const result = await client.query(
        'INSERT INTO public.power_devices (eui, id) VALUES($1, $2) RETURNING *;',
        [eui, id]
    );
    if(result.rows){
        return result.rows[0];
    }else{
        return;
    }
}

const updatePowerDevice = async function(id, value) {
    client.query('UPDATE public.devices SET (status, update_at) = (\'online\', $2) WHERE eui = $1;', [id, value.updated]);
    const result = await client.query(
        'UPDATE public.power_devices SET ' +
        '(current1_a, current2_a, current3_a, current4_a, consumption, update_at, exti_level, exti_trigger) ' +
        '= ($2, $3, $4, $5, $6, $7, $8, $9) WHERE id = $1 OR eui = $1 RETURNING *;',
        [id, value.Current1_A, value.Current2_A, value.Current3_A, value.Current4_A, value.consumption, value.updated,
            value.EXTI_Level, value.EXTI_Trigger]
    );
    if(result.rows){
        return result.rows[0];
    }else{
        return;
    }
}

const findPowerDevice = async function (id) {
    const result = await client.query(
        'SELECT * FROM public.power_devices WHERE id = $1 OR eui = $1;', [id]
    );
    if(result.rows){
        return result.rows[0];
    }else{
        return;
    }
}

export {getGateways, findUserByEmail, findUserByID, createUser, updateEmailVerified, authenticateUser,
    authenticateUserKey, createGateway, checkBlacklisted, blacklistToken, createProject, findUserProjects,
    findProjectDevices, findUserDevices, findUserDevice, findProjectMembers, createDevice, updateDevice, deleteDevice,
    findDevicesUpdate, createMember, updateUser, updateHumidityTemperatureDevice, createDeviceAlarm,
    updateProject, createMQTTEndPoint, findMQTTEndPoints, createPowerDevice, updatePowerDevice, findPowerDevice,
    updateDoorDevice, createDoorEvent};
