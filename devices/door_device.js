/*DoorDevice*/
import Device from './device.js';
import {updateDoorDevice, createDoorEvent} from '../services/db.js';
class DoorDevice extends Device{
    #alarm;
    #openStatus;
    #openTimes;
    #lastOpenDuration;
    constructor(device) {
        super(device);
        this.#alarm = device.alarm;
        this.#openStatus = device.open_status;
        this.#openTimes = device.open_times;
        this.#lastOpenDuration =  device.last_open_duration;
        if(device.open_status == 'OPEN') {
            this.statusIcon = 'fas fa-lock-open';
            this.tileColor = '#00ed35';
        }else if(device.open_status == 'CLOSE'){
            this.statusIcon = 'fas fa-lock';
            this.tileColor = '#949494';
        }
    }

    get alarm(){
        return this.#alarm;
    }
    get openStatus(){
        return this.#openStatus;
    }
    get openTimes(){
        return this.#openTimes;
    }
    get lastOpenDuration(){
        return this.#lastOpenDuration;
    }

    getAttributes(){
        let attributes = super.getAttributes();
        attributes.alarm = this.#alarm;
        attributes.open_status = this.#openStatus;
        attributes.open_times = this.#openTimes;
        attributes.last_open_duration = this.#lastOpenDuration;
        return attributes;
    }
    setValues(data){
        this.updated = data.updated;
        this.#alarm = data.ALARM;
        this.#openStatus = data.DOOR_OPEN_STATUS? data.DOOR_OPEN_STATUS: this.#openStatus;
        this.#openTimes = data.DOOR_OPEN_TIMES? data.DOOR_OPEN_TIMES: this.#openTimes;
        this.#lastOpenDuration = data.LAST_DOOR_OPEN_DURATION? data.LAST_DOOR_OPEN_DURATION: this.#lastOpenDuration;
        if(this.#openStatus == 'OPEN') {
            this.statusIcon = 'fas fa-lock-open';
            this.tileColor = '#00ed35';
        }else if(this.#openStatus == 'CLOSE'){
            this.statusIcon = 'fas fa-lock';
            this.tileColor = '#949494';
        }
        updateDoorDevice(this.getAttributes()).then((updatedDevice) => {
            if(updatedDevice){
                updatedDevice.gateway = data.gateway;
                createDoorEvent(updatedDevice);
            }else{
                console.error('ERROR: Could not update power device!');
            }
        });
    }

    render(options){
        return `<h1>
                    ${this.name}<i class="${this.statusIcon}"></i>
                </h1>
                <p>
                    <span style="font-weight: bold;font-size: 20px;">${this.openStatus}</span><br>
                    <span id= "${this.eui}-timestamp" class="timestamp">${new Intl.DateTimeFormat('en-GB', options).format(new Date(this.updated))}</span><br>
                    <span>Open Times: ${this.openTimes}</span><br>
                    <span>LastOpenDuration: ${this.lastOpenDuration}</span><br>
                </p>
                <span>Bat(mV): <span style="font-weight: bold">${this.batMv}</span></span>
                <p>
                    <span>Project: <span style="font-weight: bold">${this.project.name}</span></span><br>
                    <span>Gateway: <span style="font-weight: bold">${this.gateway}</span>
                </p>`;
    }
}

export default DoorDevice;