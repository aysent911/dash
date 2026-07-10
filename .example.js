import redisClient from './services/redis.js';
import {SNAPSHOT_ROOT} from './config/index.js';
class Vehicle{
	/*#make;
	#model;
	#colour;
	#year;*/
	constructor(make, model, colour, year){
		this.make = make;
		this.model = model;
		this.colour = colour;
		this.year = year;
	}
	
	getMake(){
		return this.make;
	}
	getModel(){
		return this.model;
	}
	getYear(){
		return this.year;
	}
	getColour(){
		return this.colour;
	}
}
class Car extends Vehicle{
	constructor(make, model, colour, year, type){
		super(make, model, colour, year);
		this.type = type;
	}

	getType(){
		return this.type;
	}
}
const myCar = new Car('Toyota', 'Crown', 'White', 2021, 'car');
redisClient.set('myCar', JSON.stringify(myCar));
redisClient.set('hisCar', JSON.stringify({
	make: "BMW",
	model: "x7",
	colour: "Black",
	year: 2023,
}));
const retrievedCar = JSON.parse(await redisClient.get('myCar'));
retrievedCar.__proto__ = Car.prototype;

console.log(retrievedCar.getType());
console.log(myCar.colour);

const colours = ['red', 'black', 'deep-blue', 'white', 'grey', 'beige', 'cream', 'brown', 'silver', 'gold'];
let car;
let cars = [];
for(let i = 0; i < colours.length; i++){
	car = new Car(...Object.values(JSON.parse(await redisClient.get('myCar'))));
	car.colour = colours[i];
	car.year = 2000+i;
	cars.push(car);
	console.log(car);
}
car = null;
console.log('Number of cars: %d', cars.length);
console.log(cars);

//Object.keys(obj) returns array of [keys]
//Object.values(obj) returns array of [values]
//Object.entries(obj) returns nested array of [[array of key and value]]

import fs from 'fs/promises';
import path from 'path';

const fullpath='https://10.1.8.32/protect/events/event/51b4015b-8174-48b3-bb42-5a7628bd3e20';
console.log(path.basename(fullpath));
let image = await fs.readFile('/home/ted/copcart/snapshots/IMG-20240307-WA0016.jpg');
console.log(image);
image = image.toString("base64");
//image = Buffer.from(image, "binary");
//await fs.writeFile('/home/ted/copcart/snapshots/image.jpg', image);

console.log(image);
console.log(typeof image);

let event = {
	"alarm": {
		"name": "Person Object Event",
		"sources": [
			{
				"device": "F4E2C670FE4E",
				"type": "include"
			},
			{
				"device": "F4E2C6708FBE",
				"type": "include"
			},
			{
				"device": "942A6FD08C47",
				"type": "include"
			},
			{
				"device": "F4E2C6787778",
				"type": "include"
			},
			{
				"device": "2432AEB6AD57",
				"type": "include"
			},
			{
				"device": "AC8BA99FFA9D",
				"type": "include"
			}
		],
		"conditions": [
			{
				"condition": {
					"type": "is",
					"source": "person"
				}
			}
		],
		"triggers": [
			{
				"key": "person",
				"device": "2432AEB6AD57",
				"zones": {
					"loiter": [],
					"zone": [
						1
					],
					"line": []
				},
				"eventId": "69bab08b03bb5603e4029250",
				"timestamp": 1773842572461
			},
			{
				"key": "person",
				"device": "2432AEB6AD57",
				"zones": {
					"loiter": [],
					"zone": [
						1
					],
					"line": []
				},
				"eventId": "69bab08b03bb5603e4029250",
				"timestamp": 1773842572466
			}
		],
		"eventPath": "/protect/events/event/69bab08b03bb5603e4029250",
		"eventLocalLink": "https://10.10.1.36/protect/events/event/69bab08b03bb5603e4029250"
	},
	"timestamp": 1773842572972
}

const timestamp = event.timestamp;
const dateString = new Date(timestamp).toLocaleDateString();
const timeString = new Date(timestamp).toLocaleTimeString();
const isoString = new Date(timestamp).toISOString();
const _string = new Date(timestamp).toString();
const _timeString = new Date(timestamp).toTimeString();
const _dateString = new Date(timestamp).toDateString();
const _utcString = new Date(timestamp).toUTCString();
console.log(dateString, timeString, isoString);
console.log(_string, _timeString, _dateString, _utcString);

/*const [date, time] = new Date(event.timestamp).toISOString().split('T');
let dirname = path.join(SNAPSHOT_ROOT, date, event.alarm.triggers[0].device);
const filename = time.replaceAll(':', '-') + '_' + path.basename(event.alarm.eventLocalLink) + '.jpg'
const filepath = path.join(dirname, filename);
fs.mkdir(dirname, {recursive: true})
	.then(async () => {
		await fs.writeFile(filepath, Buffer.from(image, 'base64'));
	})
	.catch(err => console.error(err))*/
import {cameras} from './devices/camera_device.js';

const message = {
	source: "fbp_monitor",
	destination: "cc_monitor",
	type: "RESPONSE",
	metadata: {
	link: event.alarm.eventLocalLink,
		timestamp: event.timestamp,
	},
	payload: {
		resource: `/cameras/${cameras[event.alarm.triggers[0].device]}/snapshot`,
		cameraId: event.alarm.triggers[0].device,
		image: image,
	}
}

import {bastionSocketClient} from './services/websocket_service.js';

bastionSocketClient.send(JSON.stringify(message));
