import * as mqtt from 'mqtt';
// import {MQTT_SERVER_HOST, MQTT_USERNAME, MQTT_PASSWORD} from '../config/index.js';
import {createTemperaturePoint, createCurrentPoint} from './influxdb_service.js';
import redisClient from './redis.js';
import {webSocketClient} from './websocket_service.js';
import { updateDeviceSystemParams} from './prisma.js';
import {estimatePowerConsumption} from './miscellaneous.js';
import CurrentDevice from '../devices/current_device.js';
import DoorDevice from '../devices/door_device.js';
import HumidityTemperatureDevice from '../devices/humidity_temperature_device.js';
import {getSystemParams} from '../sensors.js';


class MQTT{
    #options = {
        clean : true,
    };
    #host;
    constructor(host, username, password) {
        this.#host = host;
        this.#options.username = username;
        this.#options.password = password;
        this.client = mqtt.connect(this.#host, this.#options);
        this.client.on('error', function (error) {
            console.log(error);
        });
        this.client.on('connect', function () {
            console.log(`Connected to ${host}@${username}`);
            // Subscribe to all topics
        });
        this.client.on('message', async function (topic, payload, packet) {
            //console.log(`Topic: ${topic}, Message: ${payload.toString()}, QoS: ${packet.qos}`)
            let msg = JSON.parse(payload);
            console.log(msg);
            if(msg.uplink_message){
                let data = msg.uplink_message.decoded_payload? msg.uplink_message.decoded_payload: {};
                data.updated = msg.received_at;
                data.gateway= msg.uplink_message.rx_metadata? msg.uplink_message.rx_metadata[0].gateway_ids.eui: null;
                const eui = 'eui-' + msg.end_device_ids.dev_eui.toLowerCase();
                redisClient.get(eui).then((cacheDevice)=> {
                    if(cacheDevice){
                        let deviceAttributes = JSON.parse(cacheDevice);
                        let device;
                        switch (true){
                            case /CS/.test(deviceAttributes.type):
                                device = new CurrentDevice(deviceAttributes);
                                device.setValues(data);
                                redisClient.set(eui, JSON.stringify(device.getAttributes()));
                                webSocketClient.send(JSON.stringify({
                                    timestamp: device.updated,
                                    eui: eui,
                                    tileColor: device.tileColor,
                                    html: device.render({}),
                                }));
                                break;
                            case /DS/.test(deviceAttributes.type):
                                device = new DoorDevice(deviceAttributes);
                                if((data.DOOR_OPEN_STATUS != null) && (device.openStatus != data.DOOR_OPEN_STATUS)){
                                    device.setValues(data);
                                    redisClient.set(eui, JSON.stringify(device.getAttributes()));
                                    webSocketClient.send(JSON.stringify({
                                        timestamp: device.updated,
                                        eui: eui,
                                        tileColor: `background-color: ${device.tileColor}`,
                                        html: device.render({}),
                                    }));
                                }
                                break;
                            case /HT/.test(deviceAttributes.type):
                                device = new HumidityTemperatureDevice(deviceAttributes);
                                device.setValues(data);
                                redisClient.set(eui, JSON.stringify(device.getAttributes()));
                                webSocketClient.send(JSON.stringify({
                                    timestamp: device.updated,
                                    eui: eui,
                                    tileColor: `background-color: ${device.tileColor}`,
                                    html: device.render({}),
                                }));
                                break;
                            default:
                                console.error('Unknown device!');
                        }
                        device = null;
                    }
                });
                updateDeviceSystemParams(msg.end_device_ids.dev_eui.toLowerCase(), getSystemParams(msg.uplink_message));
            }
        });
    }
    get server(){
        return this.#host + '@' + this.#options.username;
    }
    subscribe(topic){
        this.client.subscribe(topic, function(err, success){
            if(err){
                console.error(`Error subscribing to ${topic}`);
            }else{
            	console.log(`Subscribed to ${success[0].topic}`);
            }
        });
    }
}
export {MQTT};
