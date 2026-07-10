/*Device*/

class Device{
    #created;
    #updated;
    #eui;
    #id;
    #type;
    #name;
    #status;
    #projectId;
    #project;
    #gateway;
    #brand;
    #model;
    #firmwareVersion;
    #frequencyBand;
    #subBand;
    #batMv;
    #statusIcon;
    #tileColor;

    constructor(device){
        this.#created = device.created;
        this.#updated = device.updated;
        this.#eui = device.eui;
        this.#id = device.id;
        this.#type = device.type;
        this.#name = device.name;
        this.#status = device.status;
        this.#projectId = device.project.id? device.project.id: device.project_id;
        this.#project = device.project.name? device.project.name: device.project;
        this.#gateway = device.gateway;
        this.#brand = device.brand;
        this.#model = device.model;
        this.#firmwareVersion = device.firmware_version;
        this.#frequencyBand = device.frequency_band;
        this.#subBand = device.sub_band;
        this.#batMv = device.bat_mv;
        if(device.status == 'offline'){
            this.#tileColor = '#ff5f5c';
        }
    }

    /*Accessor fields setters*/
    set updated(update_at){
        this.#updated = update_at;
    }
    set status(status){
        this.#status = status;
    }
    set name(name){
        this.#name = name;
    }
    set gateway(gateway){
        this.#gateway = gateway;
    }
    set batMv(value){
        this.#batMv = value;
    }
    set statusIcon(value){
        this.#statusIcon = value;
    }
    set tileColor(value){
        this.#tileColor = value;
    }

    /*Accessor fields getters*/
    get updated(){
        return this.#updated;
    }
    get status(){
        return this.#status;
    }
    get name(){
        return this.#name;
    }
    get gateway(){
        return this.#gateway;
    }

    //Read only
    get type(){
        return this.#type;
    }
    get created(){
        return this.#created;
    }
    get eui(){
        return this.#eui;
    }
    get id(){
        return this.#id;
    }
    get batMv(){
        return this.#batMv;
    }
    get statusIcon(){
        return this.#statusIcon;
    }
    get tileColor(){
        return this.#tileColor;
    }
    get project(){
        return {
            id: this.#projectId,
            name: this.#project,
        };
    }
    get gateway(){
        return this.#gateway;
    }
    /*instance methods*/
    render(){
        return 'undefined';
    }
    getAttributes(){
        return {
           created: this.#created,
           updated: this.#updated,
           eui: this.#eui,
           id: this.#id,
           type: this.#type,
           name: this.#name,
           status: this.#status,
           project: {
               id: this.#projectId,
               name: this.#project,
           },
           gateway: this.#gateway,
           brand: this.#brand,
           model: this.#model,
           firmware_version: this.#firmwareVersion,
           frequency_band: this.#frequencyBand,
           sub_band: this.#subBand,
           bat_mv: this.#batMv,
        };
    }
}

export default Device;