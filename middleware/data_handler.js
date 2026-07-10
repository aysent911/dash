import {findUserProjects, findUserDevices, findDevicesUpdate} from '../services/db.js';
import {findDevices} from '../services/prisma.js';
import CurrentDevice from '../devices/current_device.js';
import DoorDevice from '../devices/door_device.js';
import HumidityTemperatureDevice from '../devices/humidity_temperature_device.js';
import redisClient from '../services/redis.js';
let getProjects =  async (req, res, next) => {
    req.projects = await findUserProjects(req.user.email);
    next();
}
let getDevicesUpdate =  async (req, res, next) => {
    req.devicesUpdate = await findDevicesUpdate(req.user, req.query.entity, req.query.from);
    next();
}

const getDevices = () => {
    findDevices()
        .then((devices) => {
            devices.forEach((device) => {
                let deviceObject;
                if(device.type.match(/CS/i)) {
                    deviceObject = new CurrentDevice(device);
                    redisClient.set(device.eui, JSON.stringify(deviceObject.getAttributes()));
                }else if(device.type.match(/DS/i)){
                    deviceObject = new DoorDevice(device);
                    redisClient.set(device.eui, JSON.stringify(deviceObject.getAttributes()));
                }else if(device.type.match(/HT/i)){
                    deviceObject = new HumidityTemperatureDevice(device);
                    redisClient.set(device.eui, JSON.stringify(deviceObject.getAttributes()));
                }
                deviceObject = null;
            });
        })
        .catch((err) => {
            console.error('ERROR RETRIEVING DEVICES: ', err);
            setTimeout(getDevices, 3000);
        });
}
const getUserDevices = async(req, res, next) => {
    let devices = [];
    const userDevices = await findUserDevices(req.user);
    try{
        for(let i = 0; i < userDevices.length; i++){
            const cacheDevice = JSON.parse(await redisClient.get(userDevices[i].eui));
            if(cacheDevice.type.match(/CS/i)) {
                devices.push(new CurrentDevice(cacheDevice));
            }else if(cacheDevice.type.match(/DS/i)){
                devices.push(new DoorDevice(cacheDevice));
            }else if(cacheDevice.type.match(/HT/i)){
                devices.push(new HumidityTemperatureDevice(cacheDevice));
            }
        }
    }catch(err){
        console.error(err);
    }
    req.devices = devices;
    next();
}
export {getProjects, getDevicesUpdate, getDevices, getUserDevices};
