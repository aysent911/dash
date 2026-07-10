const addProject = function(){
    var xhttp = new XMLHttpRequest();
    var body = JSON.stringify({
        projectName: document.getElementById("projectName").value,
        ownerEmail: document.getElementById("ownerEmail").value,
    });
    xhttp.onreadystatechange = function(){
        if(this.readyState == 4){
            //console.log(this.responseText);
            var response = JSON.parse(this.responseText);
            if(response){
                if(response.isError){
                    document.getElementById('projectNameError').innerHTML = response.errors.projectNameError || "";
                    document.getElementById('ownerEmailError').innerHTML = response.errors.ownerEmailError || "";
                }
                if(response.message){
                    alert(`${response.message}`);
                    document.getElementById("project-dialog").style.display = "none";
                    location.reload();
                }
            }
        }
    };
    xhttp.open('POST', 'manage_project/add_project', true);
    xhttp.setRequestHeader('Content-type', 'application/json; charset=utf-8');
    xhttp.send(body);
}

const editProject = function(){
    let xhttp = new XMLHttpRequest();
    const body = JSON.stringify({
        projectId: document.getElementById("project-id").innerText,
        projectName: document.getElementById("projectName").value,
        ownerEmail: document.getElementById("ownerEmail").value,
        mqttServerHost: document.getElementById("mqtt-server-host").value,
        mqttUserName: document.getElementById("mqtt-user-name").value,
        mqttAPIKey: document.getElementById("mqtt-api-key").value,
    });
    xhttp.onreadystatechange = function(){
        if(this.readyState == 4){
            //console.log(this.responseText);
            var response = JSON.parse(this.responseText);
            if(response){
                if(response.isError){
                    document.getElementById('projectNameError').innerHTML = response.errors.projectNameError || "";
                    document.getElementById('ownerEmailError').innerHTML = response.errors.ownerEmailError || "";
                    document.getElementById('mqtt-server-host-error').innerHTML = response.errors.mqttServerHostError || "";
                    document.getElementById('mqtt-user-name-error').innerHTML = response.errors.mqttUserNameError || "";
                    document.getElementById('mqtt-api-key-error').innerHTML = response.errors.mqttAPIKeyError || "";
                }
                if(response.message){
                    alert(`${response.message}`);
                    document.getElementById("project-dialog").style.display = "none";
                    location.reload();
                }
            }
        }
    };
    xhttp.open('POST', 'manage_project/edit', true);
    xhttp.setRequestHeader('Content-type', 'application/json; charset=utf-8');
    xhttp.send(body);
}


var showUserMenu = function(){
    document.getElementById("user_menu").style.display = "block";
}
var hideUserMenu = function(){
    document.getElementById("user_menu").style.display = "none";
}

var showUserSettings = function(){
    document.getElementById("user_settings").style.display = "block";
}
var hideUserSettings = function(){
    document.getElementById("user_settings").style.display = "none";
}
var openProjectDialog = function(project){
    document.getElementById("about-menu").style.backgroundColor="darkgray";
    document.getElementById("about-menu").style.color="black";
    document.getElementById("devices-menu").style.backgroundColor="unset";
    document.getElementById("devices-menu").style.color="unset";
    document.getElementById("members-menu").style.backgroundColor="revert";
    document.getElementById("members-menu").style.color="revert";
    document.getElementById("project-details").style.display="none";
    document.getElementById("new-device-dialog").style.display="none";
    document.getElementById("member-details").style.display = "none";
    document.getElementById("about-project").style.display="flex";
    if(project instanceof Object){
        document.getElementById("project-dialog-title").innerHTML = project.name;
        document.getElementById("project-id").innerHTML = project.id;
        document.getElementById("edit-project").disabled=false;
        document.getElementById("delete-project").disabled=false;
        document.getElementById("create-project").disabled=true;
        document.getElementById("projectName").value = project.name;
        document.getElementById("ownerEmail").value = project.owner;
        //document.getElementById("mqtt-endpoint-fieldset").disabled = true;
        document.getElementById("ownerEmail").disabled = true;
        document.getElementById("project-dialog").style.display = "flex";
    }
    else{
        document.getElementById("project-dialog-title").innerHTML = "New Project";
        document.getElementById("project-id").innerHTML="";
        document.getElementById("edit-project").disabled=true;
        document.getElementById("delete-project").disabled=true;
        document.getElementById("create-project").disabled=false;
        document.getElementById("projectName").value = "";
        //document.getElementById("mqtt-endpoint-fieldset").disabled = false;
        document.getElementById("ownerEmail").value = project;
        document.getElementById("ownerEmail").disabled = false;
        document.getElementById("project-dialog").style.display = "flex";

    }
}
var closeProjectDialog = function(){
    document.getElementById("project-dialog").style.display = "none";
}

var showAbout = function(){
    document.getElementById("about-menu").style.backgroundColor="darkgray";
    document.getElementById("about-menu").style.color="black";
    document.getElementById("devices-menu").style.backgroundColor="unset";
    document.getElementById("devices-menu").style.color="unset";
    document.getElementById("members-menu").style.backgroundColor="revert";
    document.getElementById("members-menu").style.color="revert";
    document.getElementById("about-project").style.display="flex";
    document.getElementById("project-details").style.display="none";
    document.getElementById("new-device-dialog").style.display = "none";
    document.getElementById("member-details").style.display = "none";
}
var showDevices = function(){
    //console.log(document.getElementById("project-id").textContent);
    var xhttp = new XMLHttpRequest();
    var body = JSON.stringify({
        projectId: document.getElementById("project-id").textContent,
    });
    xhttp.onreadystatechange = function(){
        if(this.readyState == 4){
            //console.log(this.responseText);
            var response = JSON.parse(this.responseText);
            if(response){
                document.getElementById("about-menu").style.backgroundColor="revert";
                document.getElementById("about-menu").style.color="revert";
                document.getElementById("devices-menu").style.backgroundColor="darkgrey";
                document.getElementById("devices-menu").style.color="black";
                document.getElementById("members-menu").style.backgroundColor="revert";
                document.getElementById("members-menu").style.color="revert";
                document.getElementById("about-project").style.display="none";
                document.getElementById("new-device-dialog").style.display="none";
                var text = '';
                for(var i = 0; i< response.length; i++){
                    text += `<div class="button"><span style="font-weight: bold;">${response[i].name}</span><br>` +
                        `<span>${response[i].eui}</span></div>`;
                }

                text += '<div class="button">' +
                    '            <span id="add-new-device" name="add" style="font-size: 24px; font-weight: bold;" onclick="addNewDevice()">' +
                    '                   Add New Device?' +
                    '            </span>' +
                    '</div>';
                document.getElementById("project-details").innerHTML = text;
                document.getElementById("member-details").style.display = "none";
                document.getElementById("project-details").style.display = "block";
                //document.getElementById("project-details").style.flex-wrap = "wrap";
            }
        }
    };
    xhttp.open('POST', 'manage_project/devices', true);
    xhttp.setRequestHeader('Content-type', 'application/json; charset=utf-8');
    xhttp.send(body);
}
var showMembers = function(){
    var xhttp = new XMLHttpRequest();
    var body = JSON.stringify({
        projectId: document.getElementById("project-id").textContent,
    });
    xhttp.onreadystatechange = function(){
        if(this.readyState == 4){
            //console.log(this.responseText);
            var response = JSON.parse(this.responseText);
            if(response){
                document.getElementById("about-menu").style.backgroundColor="revert";
                document.getElementById("about-menu").style.color="revert";
                document.getElementById("devices-menu").style.backgroundColor="revert";
                document.getElementById("devices-menu").style.color="revert";
                document.getElementById("members-menu").style.backgroundColor="darkgrey";
                document.getElementById("members-menu").style.color="black";
                document.getElementById("about-project").style.display="none";
                var text = '';
                for(var i = 0; i< response.length; i++){
                    text += `<div class="button">` +
                        `        <span style="font-weight: bold;">` +
                        `           <i class="fas fa-circle-user" style="font-size: 30px; float: left;"></i>`+
                        `           ${response[i].user_email}</span><br>` +
                        `        <span>${response[i].privilege}</span>` +
                        `</div>`;
                }

                text += '<div class="button">' +
                    '            <span id="member-form" name="add" style="font-size: 24px; font-weight: normal;" onclick="memberForm()">' +
                    '                   Invite Member' +
                    '                   <i class="fas fa-user-plus" style="float: left"></i>' +
                    '            </span>' +
                    '</div>';
                document.getElementById("project-details").innerHTML = text;
                document.getElementById("new-device-dialog").style.display = "none";
                document.getElementById("project-details").style.display = "block";
            }
        }
    };
    xhttp.open('POST', 'manage_project/members', true);
    xhttp.setRequestHeader('Content-type', 'application/json; charset=utf-8');
    xhttp.send(body);

}

var addNewDevice = function(){
    if(document.getElementById("new-device-dialog").style.display == "none"){
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function(){
            //console.log(this.readyState);
            if (this.readyState == 4){
                let gateways = JSON.parse(this.responseText);
                let text = '';
                for(let i = 0; i < gateways.length; i++){
                    text +=`<option value="${gateways[i].eui}">
                    ${gateways[i].name}</option>`;
                }
                document.getElementById("new-device-gateway").innerHTML = text;
            }
        };
        xhttp.open('GET', '/check_gateways', true);
        xhttp.send();
        document.getElementById("project-details").style.display = "none";
        document.getElementById("member-details").style.display = "none";
        document.getElementById("new-device-dialog").style.display = "flex";
    }else{
        document.getElementById("new-device-dialog").style.display = "none";
    }
}
var addDevice = function(){
    var xhttp = new XMLHttpRequest();
    var body = JSON.stringify({
        deviceEUI: document.getElementById("new-device-eui").value.toLowerCase(),
        deviceID: document.getElementById("new-device-id").value.toLowerCase(),
        deviceType: document.getElementById("new-device-type").value,
        deviceName: document.getElementById("new-device-name").value,
        gateway: document.getElementById("new-device-gateway").value,
        projectId: document.getElementById("project-id").textContent,
    });
    xhttp.onreadystatechange = function(){
        if(this.readyState == 4){
            //console.log(this.responseText);
            var response = JSON.parse(this.responseText);
            if(response){
                document.getElementById('new-device-eui-error').innerHTML = response.deviceEUIError;
                document.getElementById('new-device-id-error').innerHTML = response.deviceIDError;
                document.getElementById('new-device-type-error').innerHTML = response.deviceTypeError;
                document.getElementById('new-device-name-error').innerHTML = response.deviceNameError;
                document.getElementById('new-device-gateway-error').innerHTML = response.gatewayError;
                if(response.message){
                    alert(`${response.message}`);
                    document.getElementById('project-dialog-form').reset();
                }
                //showDevices();
            }
        }
    };
    xhttp.open('POST', 'manage_project/devices/add', true);
    xhttp.setRequestHeader('Content-type', 'application/json; charset=utf-8');
    xhttp.send(body);
}
var editDevice = function () {
    var xhttp = new XMLHttpRequest();
    var body = JSON.stringify({
        deviceEUI: document.getElementById("device-eui").textContent.replace('eui-', ''),
        deviceID: document.getElementById("device-id").textContent,
        deviceType: document.getElementById("device-type").textContent,
        deviceName: document.getElementById("device-name").value,
        projectId: document.getElementById("device-project").value,
        gateway: document.getElementById("device-gateway").textContent,
    });
    xhttp.onreadystatechange = function(){
        if(this.readyState == 4){
            //console.log(this.responseText);
            var response = JSON.parse(this.responseText);
            if(response){
                document.getElementById('device-eui-error').innerHTML = response.deviceEUIError;
                document.getElementById('device-id-error').innerHTML = response.deviceIDError;
                document.getElementById('device-type-error').innerHTML = response.deviceTypeError;
                document.getElementById('device-name-error').innerHTML = response.deviceNameError;
                if(response.message){
                    alert(`${response.message}`);
                    // location.reload();
                }
            }
        }
    };
    xhttp.open('POST', 'manage_project/devices/edit', true);
    xhttp.setRequestHeader('Content-type', 'application/json; charset=utf-8');
    xhttp.send(body);
}

var removeDevice = function () {
    if(confirm("All device data will be lost. Do you want to proceed?") == true){
        var xhttp = new XMLHttpRequest();
        var body = JSON.stringify({
            deviceEUI: document.getElementById("device-eui").textContent.replace('eui-', ''),
            deviceID: document.getElementById("device-id").textContent,
            deviceType: document.getElementById("device-type").textContent,
            deviceName: document.getElementById("device-name").value,
            projectId: document.getElementById("device-project").value,
            gateway: document.getElementById("device-gateway").textContent,
        });
        xhttp.onreadystatechange = function(){
            if(this.readyState == 4){
                //console.log(this.responseText);
                var response = JSON.parse(this.responseText);
                if(response){
                    document.getElementById('device-eui-error').innerHTML = response.deviceEUIError;
                    document.getElementById('device-id-error').innerHTML = response.deviceIDError;
                    document.getElementById('device-type-error').innerHTML = response.deviceTypeError;
                    document.getElementById('device-name-error').innerHTML = response.deviceNameError;
                    if(response.message){
                        alert(`${response.message}`);
                        // location.reload();
                    }
                }
            }
        };
        xhttp.open('POST', 'manage_project/devices/remove', true);
        xhttp.setRequestHeader('Content-type', 'application/json; charset=utf-8');
        xhttp.send(body);
    }
}
var backToProject = function(){    //back to project details
    document.getElementById("new-device-dialog").style.display = "none";
    document.getElementById("member-details").style.display = "none";
    document.getElementById("project-details").style.display = "block";
}

var memberForm = function (){
    document.getElementById("project-details").style.display = "none";
    document.getElementById("member-details").style.display = "flex";
}

var inviteMember = function() {
    var xhttp = new XMLHttpRequest();
    var body = JSON.stringify({
        email: document.getElementById("memberEmail").value,
        role: document.getElementById("role").value,
        projectId: document.getElementById("project-id").textContent,
    });
    xhttp.onreadystatechange = function(){
        if(this.readyState == 4){
            //console.log(this.responseText);
            var response = JSON.parse(this.responseText);
            if(response){
                document.getElementById('memberEmailError').innerHTML = response.memberEmailError;
                document.getElementById('roleError').innerHTML = response.roleError;
                if(response.message){
                    alert(`${response.message}`);
                }
            }
        }
    };
    xhttp.open('POST', 'manage_project/members/invite', true);
    xhttp.setRequestHeader('Content-type', 'application/json; charset=utf-8');
    xhttp.send(body);
}

var addGateway = function(){
    var xhttp = new XMLHttpRequest();
    var body = JSON.stringify({
        gatewayEUI: document.getElementById("new-gateway-EUI").value.toLowerCase(),
        gatewayID: document.getElementById("new-gateway-ID").value.toLowerCase(),
        gatewayName: document.getElementById("new-gateway-name").value,
        tower: document.getElementById("new-gateway-tower").value,
    });
    xhttp.onreadystatechange = function(){
        if(this.readyState == 4){
            //console.log(this.responseText);
            const response = JSON.parse(this.responseText);
            if(response){
                document.getElementById('new-gateway-EUI-error').innerHTML = response.gatewayEUIError;
                document.getElementById('new-gateway-ID-error').innerHTML = response.gatewayIDError;
                document.getElementById('new-gateway-name-error').innerHTML = response.gatewayNameError;
                document.getElementById('new-gateway-tower-error').innerHTML = response.towerError;
                if(response.message){
                    alert(`${response.message}`);
                    location.reload();
                }
            }
        }
    };
    xhttp.open('POST', '/manage_gateway/add_gateway', true);
    xhttp.setRequestHeader('Content-type', 'application/json; charset=utf-8');
    xhttp.send(body);
}
let showDeviceAlarms = function(){
    document.getElementById('about-device').style.display = 'none';
    document.getElementById('device-alarms').style.display = 'block';
}

let openSetAlarmDialog = function(){
    document.getElementById("device-alarms").style.display = "none";
    document.getElementById("set-alarm-dialog").style.display = "flex";
    document.getElementById("set-alarm-dialog").style.flexDirection = "column";
}

let closeSetAlarmDialog = function(){
    document.getElementById("set-alarm-dialog").style.display = "none";
    document.getElementById("device-alarms").style.display = "block";
}

let alarmTypeControl = document.getElementById("alarm-type");
let timeInputControl = document.getElementById("time-input-control");
let rangeInputControl = document.getElementById("range-input-control");
let thresholdInputControl = document.getElementById("threshold-input-control");
alarmTypeControl.addEventListener("change", () => {
    if(alarmTypeControl.value == "outside-time"){
        rangeInputControl.hidden = true;
        thresholdInputControl.hidden = true;
        timeInputControl.hidden = false;
    }else if(alarmTypeControl.value == "threshold"){
        rangeInputControl.hidden = true;
        timeInputControl.hidden = true;
        thresholdInputControl.hidden = false;
    }else{
        timeInputControl.hidden = true;
        thresholdInputControl.hidden = true;
        rangeInputControl.hidden = false;
    }
});

let setDeviceAlarm = function(){
    let xhttp = new XMLHttpRequest();
    let body = JSON.stringify({
        deviceEUI: document.getElementById("device-eui").textContent,
        alarmType: document.getElementById("alarm-type").value,
        lowerLimit: document.getElementById("lower-limit").value,
        upperLimit: document.getElementById("upper-limit").value,
        timeZone: document.getElementById("timezone").value,
        startTime: document.getElementById("start-time").value,
        endTime: document.getElementById("end-time").value,
        threshold: document.getElementById("threshold").value,
        deviceAlarmDescription: document.getElementById("device-alarm-description").value,
    });
    xhttp.onreadystatechange = function(){
        if(this.readyState == 4){
            const response = JSON.parse(this.responseText);
            if(response){
                document.getElementById('device-error').innerHTML = response.deviceEUIError;
                document.getElementById('alarm-type-error').innerHTML = response.alarmTypeError;
                document.getElementById('lower-limit-error').innerHTML = response.lowerLimitError;
                document.getElementById('upper-limit-error').innerHTML = response.upperLimitError;
                document.getElementById('timezone-error').innerHTML = response.timeZoneError;
                document.getElementById('start-time-error').innerHTML = response.startTimeError;
                document.getElementById('end-time-error').innerHTML = response.endTimeError;
                document.getElementById('threshold-error').innerHTML = response.thresholdError;
            }
            if(response.message){
                alert(`${response.message}`);
                //location.reload();
            }
        }
    }
    xhttp.open('POST', '/manage_project/devices/device/set_alarm', true);
    xhttp.setRequestHeader('Content-type', 'application/json; charset=utf-8');
    xhttp.send(body);
}
const openIntegrationsDialog = function(){
    document.getElementById("integrations-dialog").style.display = "flex";
}
const closeIntegrationsDialog = function(){
    document.getElementById("integrations-dialog").style.display = "none";
}

const openNewMQTTEndpointDialog = function (){
    document.getElementById("new-mqtt-endpoint-dialog").style.display = "grid";
}

const closeNewMQTTEndpointDialog = function (){
    document.getElementById("new-mqtt-endpoint-dialog").style.display = "none";
}

const addMQTTEndpoint = function (){
    var xhttp = new XMLHttpRequest();
    var body = JSON.stringify({
        mqttServerHost: document.getElementById("new-mqtt-server-host").value,
        mqttUserName: document.getElementById("new-mqtt-user-name").value,
        mqttAPIKey: document.getElementById("new-mqtt-api-key").value,
    });
    xhttp.onreadystatechange = function(){
        if(this.readyState == 4){
            //console.log(this.responseText);
            var response = JSON.parse(this.responseText);
            if(response){
                if(response.isError){
                    document.getElementById('mqtt-server-host-error').innerHTML = response.errors.mqttServerHostError || "";
                    document.getElementById('mqtt-user-name-error').innerHTML = response.errors.mqttUserNameError || "";
                    document.getElementById('mqtt-api-key-error').innerHTML = response.errors.mqttAPIKeyError || "";
                }
                if(response.message){
                    alert(`${response.message}`);
                    document.getElementById("integrations-dialog-form").reset();
                    //location.reload();
                }
            }
        }
    };
    xhttp.open('POST', 'manage/integrations/mqtt/add', true);
    xhttp.setRequestHeader('Content-type', 'application/json; charset=utf-8');
    xhttp.send(body);
}

let openFilterProjectsDialog = async function(event){
    document.getElementById("filter").style.top =  event.clientY + "px";
    document.getElementById("filter").style.left = event.clientX + "px";
    document.getElementById("filter-reports").style.display = "none";
    document.getElementById("filter").style.display = "inline";
}
let openFilterReportsDialog = async function(event){
    document.getElementById("filter-reports").style.top =  event.clientY + "px";
    document.getElementById("filter-reports").style.left = event.clientX + "px";
    document.getElementById("filter").style.display = "none";
    document.getElementById("filter-reports").style.display = "inline";
}