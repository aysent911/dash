import {InfluxDB, Point, HttpError} from '@influxdata/influxdb-client';
//import {InfluxDBClient, Point} from '@influxdata/influxdb3-client';
import {INFLUX_URL, INFLUX_TOKEN, INFLUX_ORG, INFLUX_BUCKET} from '../config/index.js';
import {hostname} from 'node:os';

// create a write API, expecting point timestamps in nanoseconds (can be also 's', 'ms', 'us')
const influxClientWriteAPI = new InfluxDB({url: INFLUX_URL, token: INFLUX_TOKEN}).getWriteApi(INFLUX_ORG, INFLUX_BUCKET, 'ns')
const influxClientQueryAPI = new InfluxDB({url: INFLUX_URL, token: INFLUX_TOKEN}).getQueryApi(INFLUX_ORG, INFLUX_BUCKET);
//const influxDBClient = new InfluxDBClient({host: INFLUX_URL, token: INFLUX_TOKEN, database: INFLUX_BUCKET});
// setup default tags for all writes through this API
//influxClientWriteAPI.useDefaultTags({location: hostname()});

let createTemperaturePoint = async function(data){
    try{
        let point = new Point('temperatures')
            .tag('dev_eui', data.id)
            .floatField('Hum_SHT', data.humidity)
            .floatField('TempC_SHT', data.temperature_c)
            .floatField('TempF', data.temperature_c* 1.8 + 32)
            .floatField('TempC_DS', data.temperature_ext || 327.67)
            .timestamp(new Date(data.update_at));
        influxClientWriteAPI.writePoint(point);
    }catch(err){
        console.error(err);
    }
}

const createCurrentPoint = function (device){
    try{
        const point = new Point('currents')
            .tag('id', device.id)
            .tag('trigger', device.exti_trigger)
            .floatField('Current1_A', device.current1_a)
            .floatField('Current2_A', device.current2_a)
            .floatField('Current3_A', device.current3_a)
            .floatField('Current4_A', device.current4_a)
            .floatField('Consumption_kWh', device.consumption)
            .timestamp(new Date(device.update_at));
        influxClientWriteAPI.writePoint(point);
    }catch(err){
        console.error(err);
    }
    
}

export {createTemperaturePoint, createCurrentPoint};