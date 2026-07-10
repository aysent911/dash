import Device from './device.js';
import {updatePowerDevice} from '../services/db.js';
import {createCurrentPoint} from '../services/influxdb_service.js';

class CurrentDevice extends Device{
    #current1;
    #current2;
    #consumption;
    #extiLevel;
    #extiTrigger;
    constructor(device){
        super(device);
        this.#extiLevel = device.exti_level;
        this.#extiTrigger = device.exti_trigger;
        this.#consumption = device.consumption;
        this.#current1 = device.current1;
        this.#current2 = device.current2;
        this.tileColor = '#d3d3d3';
    }

    //accessor fields
    get consumption(){
        if(this.#consumption != null) return (this.#consumption).toFixed(4);
    }
    get current1(){
        if(this.#current1 != null) return (this.#current1).toFixed(4);
    }
    get current2(){
        if(this.#current2 != null) return (this.#current2).toFixed(4);
    }

    //instance methods
    setValues(data){
        this.updated = data.updated;
        this.#consumption = this.#consumption + (data.Current1_A + data.Current2_A) * 240 / 60000;
        this.#current1 = data.Current1_A;
        this.#current2 = data.Current2_A;
        this.#extiTrigger = data.EXTI_Trigger;
        this.#extiLevel = data.EXTI_Level;
        this.batMv = data.BatV * 1000;
        data.consumption = this.consumption;
        updatePowerDevice(this.eui, data).then((updatedDevice) => {
            if(updatedDevice){
                createCurrentPoint(updatedDevice);
            }else{
                console.error('ERROR: Could not update power device!');
            }
        });
    }
    getAttributes(){
        let attributes = super.getAttributes();
        attributes.consumption = this.#consumption;
        attributes.current1 = this.#current1;
        attributes.current2 = this.#current2;
        attributes.exti_level = this.#extiLevel;
        attributes.exti_trigger = this.#extiTrigger;
        return attributes;
    }

    render(options){
        return `<h1>
                    ${this.name}<img src="/svgs/solid/electrical-sensor.svg">
                </h1>
                <div>
                    <!--span(style="font-weight: bold;font-size: 20px;")=device.dev_status-->
                    <!--br-->
                    <span id= "${this.eui}-timestamp" class="timestamp">${new Intl.DateTimeFormat('en-GB', options).format(new Date(this.updated))}</span>
                </div>
                <div class="values">
                    <span class="consumption">${this.consumption}</span>
                    <span class="consumption-unit">kWh</span>
                    <br>
                    <span>Current1: </span>
                    <span class="current">${this.current1}A</span>
                    <br>
                    <span>Current2: </span>
                    <span class="current">${this.current2}A</span>
                </div>
                <p>
                    <span>Bat(mV): </span>
                    <span style="font-weight: bold">${this.batMv}</span>
                    <br>
                    <br>
                    <span>
                        Project: <span style="font-weight: bold">${this.project.name}</span>
                    </span>
                    <br>
                    <span>
                        Gateway: <span style="font-weight: bold">${this.gateway}</span>
                    </span>
                </p>
                <!--p=device.eui-->`
    }
}

export default CurrentDevice;