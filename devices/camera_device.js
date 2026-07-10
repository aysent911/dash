import {findCameraDevices} from '../services/prisma.js';
let cameraDevices = {};
for ( const device of await findCameraDevices()) {
    cameraDevices[device.id] = device;
}
// {   mac: {id:, alias:, name:, project, id:},
//   ...
// }

export {cameraDevices};