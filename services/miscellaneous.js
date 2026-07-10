import {findPowerDevice, createPowerDevice, updatePowerDevice} from './db.js';
import {sendEmailVerification} from './novu.js';

const estimatePowerConsumption = async function(eui, id, value){
    try {
        const powerDevice = await findPowerDevice(id || eui);
        if (powerDevice) {
            value.consumption = powerDevice.consumption + value.consumption;
        } else {
            const createdDevice = await createPowerDevice(eui, id);
            if (!createdDevice) {
                throw new Error('Could not create power device!');
            }
        }
        const updatedDevice = await updatePowerDevice(id || eui, value);
        if(!updatedDevice){
            throw new Error('Could not update power device!');
        }
        return updatedDevice;
    }catch(err){
        console.error(err);
    }
}

export {estimatePowerConsumption};
