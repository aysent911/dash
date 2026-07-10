import {PrismaClient, Prisma} from '@prisma/client';
import fs from 'fs/promises';
import path from 'path';
import {SNAPSHOT_ROOT} from '../config/index.js';

const prisma = new PrismaClient();
let triggers = await prisma.camera_triggers.findMany({
    select: {
        id: true,
        key: true,
    },
});

let camera_triggers = {};
triggers.forEach((trigger) => {
    camera_triggers[trigger.key] = trigger.id;
});

const findUserId = async function(userEmail) {
    let userId;
    await prisma.users.findMany({
        where: {
            email: {
                in: userEmail,
            }
        },
    }).catch((err) => console.log('ERROR FETCHING USER ID: ', err));
    return userId;
}
const findDevices = async function() {
    //Read all devices values, status and system parameters
    try{
        const devices = await prisma.$queryRaw`SELECT devices.created_at created, devices.update_at updated, devices.eui eui,
        devices.id id, devices.name name, devices.status status, devices.bat_mv bat_mv, devices.type type,
        devices.firmware_version firmware_version, devices.frequency_band frequency_band, devices.sensor_model model,
        devices.sub_band sub_band, devices.brand brand, door_devices.alarm alarm, door_devices.open_status open_status,
        door_devices.open_times open_times, door_devices.last_open_duration last_open_duration,
        power_devices.current1_a current1, power_devices.current2_a current2, power_devices.consumption consumption,
        power_devices.exti_level exti_level, power_devices.exti_trigger exti_trigger,
        humidity_temperature_devices.humidity humidity, humidity_temperature_devices.temperature_c temperature,
        humidity_temperature_devices.temperature_ext temperature_ext,
        gateways.name gateway, projects.id project_id, projects.name project
        FROM ((((public.devices LEFT JOIN public.door_devices ON devices.eui=door_devices.eui)
            LEFT JOIN public.power_devices ON devices.eui = power_devices.eui)
           LEFT JOIN public.humidity_temperature_devices ON devices.eui=humidity_temperature_devices.eui)
           LEFT JOIN public.gateways ON devices.gateway = gateways.eui)
           LEFT JOIN public.projects ON devices.project_id= projects.id`;

        return devices;

    }catch(err){
        console.error(err);
        return;
    }
}

const updateDeviceSystemParams = function(eui, systemParams) {
    prisma.devices.updateMany({
        where: {
            eui: {
                contains: eui
            }
        },
        data: systemParams,
    }).catch((err) => console.log('ERROR UPDATING DEVICE: ', err));
}

const findCameraDevices = async function(){
    return await prisma.camera_devices.findMany();
}
const updateCameraDevices = function(cameraDevices){
    prisma.$transaction(async (tx) => {
        for (const [key, value] of Object.entries(cameraDevices)) {
            await tx.camera_devices.update({
                where: {
                    id: key,
                },
                data: {
                    alias: value,
                },
            });
        }
    })
        .then(result => console.log('CAMERA DEVICES UPDATED SUCCESSFULLY'))
        .catch(err => console.error('ERROR UPDATING CAMERA DEVICES: ', err));
}

const createCameraEvent = function(event){
    try {
        prisma.camera_events.create({
            data: {
                created_at: new Date(event.timestamp),
                trigger_id: camera_triggers[event.alarm.triggers[0].key],
                device_id: event.alarm.triggers[0].device,
                local_link: event.alarm.eventLocalLink,
                detail: JSON.stringify(event.alarm.triggers[0].value? event.alarm.triggers[0].value: event.alarm.triggers[0].zones),
            }
        }).catch((err) => console.error('ERROR CREATING CAMERA EVENT: ', err));
    }catch(err){
        console.error(err);
    }

}

const getCameraEvents = async function(projectId, deviceId='', startId=0, searchKeyword=''){
    let cameraEvents;
    let count;
    deviceId = '%' + deviceId + '%';
    searchKeyword = '%' + searchKeyword + '%';
    if(!startId){
        cameraEvents = await prisma.$queryRaw`
                SELECT
                 camera_events.id           AS id,
                 camera_events.created_at,
                 camera_events.device_id,
                 camera_devices.name        AS device,
                 camera_events.trigger_id,
                 camera_triggers.key        AS trigger,
                 camera_events.detail,
                 camera_events.local_link   AS link
                FROM (public.camera_events LEFT JOIN  public.camera_triggers ON camera_events.trigger_id = camera_triggers.id)
                 LEFT JOIN public.camera_devices ON camera_events.device_id = camera_devices.id
                WHERE camera_events.device_id LIKE ${deviceId} AND camera_events.detail LIKE ${searchKeyword} 
                  AND camera_devices.project_id = ${projectId}::uuid
                ORDER BY camera_events.created_at DESC
                LIMIT 200;`;
            // prisma.camera_events.findMany({
            //     take: 100,                       //limit 100
            //     where: {
            //         device_id: {contains: deviceId},
            //     },
            //     orderBy: {
            //         created_at: 'desc',         //latest events
            //     }
            // }),
        //console.log(cameraEvents);
        count = cameraEvents.length;
    }else{
        [ count, cameraEvents ] = await prisma.$transaction([
            prisma.camera_events.count(),
            prisma.camera_events.findMany({
                id: {
                    gte: stardId - 30,
                    lte: stardyId,
                },
                where: {
                    device_id: {contains: deviceId},
                },
                orderBy: {
                    created_at: 'desc',
                }
            }),
        ]);
    }
    return [count, cameraEvents];
}

const getCameraEventsSummary = async function(projectId) {
    let cameraEventsSummary =  [];
    try{
        const query = await prisma.$queryRaw`SELECT 'SELECT' || '\n'
            ' device_id,\n' ||
            ' name,\n' ||
            string_agg(
                format(
                    'COUNT(*) FILTER (WHERE trigger_id = %s) AS %I',
                    id,
                    key
                ), ',\n ' ) ||
            ', COUNT(*) AS total ' || '\n'
            'FROM public.camera_events' || '\n'
            ' LEFT JOIN public.camera_devices ON camera_events.device_id = camera_devices.id' || '\n'
            ' WHERE camera_devices.project_id=''' || ${projectId} || '''\n'
            ' GROUP BY camera_events.device_id, camera_devices.name'
            FROM public.camera_triggers`;
        //console.log(query[0]['?column?']);
        cameraEventsSummary = cameraEventsSummary.concat(await prisma.$queryRawUnsafe(`${query[0]['?column?']}`));

    }catch(err){
        console.error(err);
    }
    return ['Camera Events Summary', cameraEventsSummary];
}

const createSnapshot = async function (event){
    try {
        const [date, time] = new Date(event.metadata.timestamp).toISOString().split('T');
        let dirname = path.join(SNAPSHOT_ROOT, date, event.payload.cameraId);
        const filename = time.replaceAll(':', '-') + '_' + path.basename(event.metadata.link) + '.jpg';
        const filepath = path.join(dirname, filename);
        fs.mkdir(dirname, {recursive: true})
            .then(async () => {
                await fs.writeFile(filepath, Buffer.from(event.payload.image, 'base64'));
            })
            .catch((err) => console.error('ERROR SAVING SNAPHOT: ', err));;
        /*console.log(Buffer.from(event.payload, "binary"));
        prisma.snapshots.create({
            data: {
                created_at: new Date(),
                link: event.metadata,
                mime_type: "image/jpeg",
                image: Buffer.from(event.payload, "binary"),
            }
        })*/
    }catch(err){
        console.error(err);
    }
}

const findSnapshot = async function(query){
    /*const snapshot = await prisma.snapshots.findUnique({
        where: {
            link: link,
        },
    });*/
    let snapshot = {};
    snapshot.mimeType = "image/jpeg";
    try{
        const [date, time] = query.created_at.split('T');
        const filename = path.join(SNAPSHOT_ROOT, date, query.device_id, time.replaceAll(':', '-') + '_' + query.link + '.jpg');
        snapshot.image =  await fs.readFile(filename);
    }catch(err){
        console.error(err);
    }
    return snapshot;
}

export {findDevices, findCameraDevices, findUserId, updateDeviceSystemParams, createCameraEvent, getCameraEvents,
    getCameraEventsSummary, createSnapshot, findSnapshot};