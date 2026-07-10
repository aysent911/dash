import Device from './device.js';
import {createTemperaturePoint} from '../services/influxdb_service.js';
import {updateHumidityTemperatureDevice} from '../services/db.js';
/*HumidityTemperatureDevice*/
class HumidityTemperatureDevice extends Device{
    #humidity;
    #temperature;
    #temperatureExternal;
    constructor(device ) {
        super(device);
        this.#humidity = device.humidity;
        this.#temperature = device.temperature;
        this.#temperatureExternal = device.temperature_ext;
        this.tileColor = '#d3d3d3';
    }
    get temperature(){
        return this.#temperature;
    }
    get humidity(){
        return this.#humidity;
    }
    get externalTemperature(){
        return this.#temperatureExternal;
    }
    getAttributes(){
        let attributes = super.getAttributes();
        attributes.humidity = this.#humidity;
        attributes.temperature = this.#temperature;
        attributes.temperature_ext = this.#temperatureExternal;
        return attributes;
    }
    
    setValues(data){
        this.updated = data.updated;
        this.#humidity  = data.Hum_SHT? data.Hum_SHT: this.#humidity;
        this.#temperature = data.TempC_SHT? data.TempC_SHT: this.#temperature;
        this.#temperatureExternal = data.TempC_DS? data.TempC_DS: this.#temperatureExternal;
        updateHumidityTemperatureDevice(this.getAttributes()).then((updatedDevice) => {
            if(updatedDevice){
                createTemperaturePoint(updatedDevice);
            }else{
                console.error('ERROR: Could not update humidity temperature device!');
            }
        });
    }
    render(options){
     return `<span style="font-weight:bold; font-size:34px;">${this.name}</span><br>
                    <span style="font-size: 20px;" id="${this.eui}-timestamp" class="timestamp">${new Intl.DateTimeFormat('en-GB', options).format(new Date(this.updated))}</span>
                    <span class= "${this.eui+' GaugeMeter'}" data-size=350 data-width=20 data-style='Arch'
                    data-theme='Green-Gold-Red' data-animationstep=1 data-showvalue='1'
                    data-text_size=0.325 data-append='°F' data-min='-20' data-text=${parseInt(this.temperature * 9/5 + 32)}
                    data-percent= ${parseInt((this.temperature+10)*100/95)} data-label = ${parseInt(this.humidity).toString()+'%H'}
                    data-animate_gauge_colors='1' data-animate_text_colors = '1'></span><br>
                    <!--span style="">
                        <span><i class="${this.statusIcon}" style="font-size: 44px"></i></span>
                        <span> ${this.temperature}&#8728C</span><br>
                        <span></span>
                        <span>
                            <i class="fas fa-droplet" style="font-size: 44px"></i>
                            <span style="font-size: 44px; font-weight:bold;">${this.humidity}</span>
                            <span style="font-size: 34px;">%H</span>
                        </span>
                    </span-->
                    <span hidden>Status: <span style="font-weight: bold">${this.status}</span></span>
                    <!--span>TempC_DS: <span style="font-weight: bold">${this.externalTemperature}&#8728C</span></span-->
                    <span hidden>Bat(mV): <span style="font-weight: bold">${this.batMv}</span></span>
                    <!--span>Sensor Type: <span style="font-weight: bold">${this.type}</span></span-->
                    <p hidden><span>Project: <span style="font-weight: bold">${this.project.name}</span></span><br>
                    <span hidden>Gateway: <span style="font-weight: bold">${this.gateway}</span></p>`;
    }
}

export default HumidityTemperatureDevice;