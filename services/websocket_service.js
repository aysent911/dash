import WebSocket, {WebSocketServer} from 'ws';
import {WSS_ADDRESS, WSS_PORT, BASTION_WSS_PORT} from '../config/index.js';
import {cameraDevices} from '../devices/camera_device.js';
import {createSnapshot} from '../services/prisma.js';
const webSocketServer = new WebSocketServer({port: WSS_PORT});
webSocketServer.on('connection', (wss) => {

    //broadcast message to all connected clients (except webSocketServer) if device payload
    wss.on('message', (data) => {
        if(data.toString().search('eui') >= 0){
            webSocketServer.clients.forEach((client) => {
                if(client !== wss && client.readyState === WebSocket.OPEN){
                    client.send(data.toString());
                }
            });
        }
        wss.send(data.toString());
        console.log(data.toString());
    });
    wss.send(`connected to WebSocketServer on ${WSS_PORT}`);
});
let webSocketClient = new WebSocket(`ws://${WSS_ADDRESS}:${WSS_PORT}`);
webSocketClient.onerror = function(error){
    console.log(error);
}
webSocketClient.onopen = function(event){
    webSocketClient.send('connected');
}
webSocketClient.onmessage = function (event) {
    //console.log(event.data);
};

let bastionSocket = new WebSocketServer({port: BASTION_WSS_PORT});
bastionSocket.on('connection', (wss) => {
    wss.send(JSON.stringify({
        source: 'cc_monitor',
        destination: 'bastion',
        type: 'INFO',
        payload: `Connected to WebSocketServer at ${BASTION_WSS_PORT}`,
    }));
    wss.on('message', (data) => {
        const message = JSON.parse(data.toString());
        if (message.destination == "cc_monitor"){
            if (message.metadata && message.payload) {
                createSnapshot(message);
            }
        }else{
            bastionSocket.clients.forEach((client) => {
                if(client !== wss && client.readyState === WebSocket.OPEN){
                    client.send(data.toString());
                }
            });
            console.log(message);
        }
    })
});

let bastionSocketClient = new WebSocket(`ws://${WSS_ADDRESS}:${BASTION_WSS_PORT}`);
bastionSocketClient.onerror = function(error){
    console.log(error);
}
bastionSocketClient.onopen = function(event){
    //webSocketClient.send('connected');
}
bastionSocketClient.onmessage = function (event) {
    //console.log(event.data);
};
let requestSnapshot =  function(event){
    try{
        bastionSocketClient.send(JSON.stringify({
            source: "cc_monitor",
            destination: "fbp_bastion",
            type: "REQUEST",
            metadata: {
                link: event.alarm.eventLocalLink,
                timestamp: event.timestamp,
            },
            payload: {
                resource: `/cameras/${cameraDevices[event.alarm.triggers[0].device].alias}/snapshot`,
                cameraId: event.alarm.triggers[0].device
            }
        }));
    }catch(err){
        console.error(err);
    }
}
export {webSocketServer, webSocketClient, bastionSocketClient, requestSnapshot};
