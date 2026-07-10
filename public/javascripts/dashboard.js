let lastEtag = '';
var notificationSound = new Audio('/audio/mixkit-clear-announce-tones-2861.wav');
let options = {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    timeZoneName: 'short'
};
let online = true;

let cameraEventsSummary = [];
let eventsSummary;
let eventsDetail;
let cameraEventsReport;
var notifyMe = function(message){
    if (!("Notification" in window)) {
        // Check if the browser supports notifications
        alert("This browser does not support desktop notification");
    }else if (Notification.permission === "granted") {
        // Check whether notification permissions have already been granted;
        // if so, create a notification and audio
        const notification = new Notification(message);
    } else if (Notification.permission !== "denied") {
        // We need to ask the user for permission
        Notification.requestPermission().then((permission) => {
            // If the user accepts, let's create a notification
            if (permission === "granted") {
                const notification = new Notification(message);
            }
        });
    }
}

let getSocketParam = function(){
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function(){
        if(this.readyState == 4){
            try{
                const webSocketServer = JSON.parse(this.responseText);
                let webSocketClient = new WebSocket(`ws://${webSocketServer.address}:${webSocketServer.port}`);
                webSocketClient.onerror = function(error){
                    console.log(error);
                }
                webSocketClient.onopen = function(event){
                    webSocketClient.send('connected');
                }
                webSocketClient.onmessage = function (event) {
                    const data = event.data;
                    try{
                        parsedData = JSON.parse(data);
                        document.getElementById(parsedData.eui).innerHTML = parsedData.html;
                        document.getElementById(parsedData.eui).style.backgroundColor = parsedData.tileColor;
                        document.getElementById(`${parsedData.eui}-timestamp`).innerHTML = new Intl.DateTimeFormat('en-GB', options).format(new Date(parsedData.timestamp));
                        $(`.${parsedData.eui}`).gaugeMeter();
                    }catch(error){
                        console.error(error);
                    }
                };
            }catch(err){
                location.reload();
            }
        }
    }
    xhttp.open('GET', '/wss', true);
    xhttp.send();
};

window.onload = getSocketParam();

// check online status
setInterval(() => {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function(){
        if(this.readyState == 4 && this.status == 200){
            if(!online){
                getSocketParam();
                online = true;
                document.getElementById("alert-message").style.display = "none";
            }else{
                //console.log(JSON.parse(this.responseText));
            }
        }
    };
    xhttp.open('GET', '/check_status', true);
    xhttp.onerror = function(err){
        online = false;
        document.getElementById("alert-message").style.display = "flex";
    }
    xhttp.send();
}, 7000);
var openDeviceDialog = function(device){
    let body = JSON.stringify({
        type: device.type,
        eui: device.eui,
    });
    try{
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function(){
            if (this.readyState == 4){
                let response = JSON.parse(this.responseText);
                if(response.deviceInfo){
                    document.getElementById("device-dialog-title").innerHTML = response.deviceInfo.name;
                    document.getElementById("device-eui").textContent = device.eui;
                    document.getElementById("device-id-error").textContent = null;
                    document.getElementById("device-id").textContent = response.deviceInfo.id;
                    document.getElementById("device-name").value = response.deviceInfo.name;
                    document.getElementById("device-project").value = response.deviceInfo.project_id;
                    document.getElementById("device-gateway").textContent = device.gateway;
                    document.getElementById("device-status").textContent = response.deviceInfo.status;
                    if(response.deviceInfo.status == "disconnected"){
                        document.getElementById("device-status").style.color = "red";
                    }else{
                        document.getElementById("device-status").style.color = "green";
                    }
                    document.getElementById("device-last-update").textContent = response.deviceInfo.update_at;
                    document.getElementById("device-created").textContent = response.deviceInfo.created_at;
                    document.getElementById("device-type").textContent = device.type;
                    document.getElementById("device-brand").textContent = response.deviceInfo.brand;
                    document.getElementById("device-bat").textContent = response.deviceInfo.bat_mv;
                    document.getElementById("device-model").textContent = response.deviceInfo.sensor_model;
                    document.getElementById("device-firmware-version").textContent = response.deviceInfo.firmware_version;
                    document.getElementById("device-frequency-band").textContent = response.deviceInfo.frequency_band;
                    document.getElementById("device-sub-band").textContent = response.deviceInfo.sub_band;
                    if(response.deviceInfo.privilege == 'denied'){
                        document.getElementById("edit-device").disabled = true;
                        document.getElementById("remove-device").disabled = true;
                        document.getElementById("device-name").disabled = true;
                        document.getElementById("device-project").disabled = true;
                    }else if(response.deviceInfo.privilege == 'authorize'){
                        document.getElementById("edit-device").disabled = false;
                        document.getElementById("remove-device").disabled = false;
                        document.getElementById("device-name").disabled = false;
                        document.getElementById("device-project").disabled = false;
                    }
                    document.getElementById("about-device-menu").style.backgroundColor="darkgray";
                    document.getElementById("about-device-menu").style.color="black";
                    // document.getElementById("device-logs-menu").style.backgroundColor="unset";
                    // document.getElementById("device-logs-menu").style.color="unset";
                    // document.getElementById("device-alarms-menu").style.background="unset";
                    // document.getElementById("device-alarms-menu").style.color="unset";
                    document.getElementById("device-dialog").style.display = "flex";
                }else{
                    alert(response.error);
                }
            }
        };
        xhttp.open('POST', `/manage_project/devices/device`, true);
        xhttp.setRequestHeader('Content-type', 'application/json; charset=utf-8');
        xhttp.send(body);
    }catch(err){
        console.error(err);
    }
}
var closeDeviceDialog = function(){
    document.getElementById("device-dialog").style.display = "none";
}

const filterProjectDevices = function(project){
    document.getElementById("filter").style.display = "none";
    //console.log(project);
    //control displayed tiles using project.id as class. Display all tiles, then filter selection
    //add project.id to class attribute pug
    // forEach & map
    document.getElementById("project-selection").innerText = project.name;
    document.getElementById("selected-project").innerText = project.name;
    const selection = Array.from(document.getElementsByClassName(project.id)).map((tile) => tile.id);
    Array.from(document.getElementsByClassName("tile")).forEach((tile) => {
        if(!project.id){
            tile.style.display = "grid";
        }else if(selection.find((id) => id == tile.id)){
            tile.style.display = "grid";
        }else{
            tile.style.display = "none";
        }
    });
}

const changeDetailVisualization = function(value) {
    if(value == "bar"){
        document.getElementById("report-detail").innerHTML = '<canvas id="bar-chart" style="display: flex; width: 50vw;  height: 40vh;"></canvas>';
        let labels = [];
        let data = [];
        Object.entries(eventsSummary).forEach(([key, value]) => {
            if(Number.isInteger(value)){
                labels.push(key.toUpperCase());
                data.push(value);
            }
        });
        new Chart(document.getElementById('bar-chart'), {
            type: 'bar',
            data: {
                labels: labels.slice(0,-1),
                datasets: [{
                    label: 'Events',
                    data: data.slice(0,-1),
                    backgroundColor: 'purple'
                }]
            }
        });
        document.getElementById("toggle-icon").innerHTML = `<i class="button fas fa-table-list" onclick="changeDetailVisualization('list')"></i>`;
    }else if (value == "list"){
        document.getElementById("detail-section").innerHTML = eventsDetail;
        document.getElementById("toggle-icon").innerHTML = `<i class="button fas fa-chart-column" onclick="changeDetailVisualization('bar')"></i>`;
    }
}

const showDetailFor = function (device) {
    let xhttp = new XMLHttpRequest();
    const body = JSON.stringify({
        deviceId: device.id,
        deviceName: device.name,
        projectId: document.getElementById("project-selection-id").innerText,
        deviceVisualization:   device.visualization,
        searchKeyword: device.searchKeyword,
    });
    xhttp.onreadystatechange = function(){
        if(this.readyState == 4){
            //console.log(this.responseText);
            var response = JSON.parse(this.responseText);
            if(response){
                document.getElementById("detail-section").innerHTML = response.detail;
                eventsDetail = response.detail;
                searchEventListener();
                eventsSummary = JSON.parse(response.summary);
            }
        }
    };
    xhttp.open('POST', 'dashboard/reports/detail', true);
    xhttp.setRequestHeader('Content-type', 'application/json; charset=utf-8');
    xhttp.send(body);
}
const filterProjectReports = function(project){
    document.getElementById("project-selection").innerText = project.name;
    document.getElementById("project-selection-id").innerText = project.id;
    let xhttp = new XMLHttpRequest();
    const body = JSON.stringify({
        projectId: project.id,
        projectName: project.name,
        // ownerEmail: document.getElementById("ownerEmail").value,
        // mqttServerHost: document.getElementById("mqtt-server-host").value,
        // mqttUserName: document.getElementById("mqtt-user-name").value,
        // mqttAPIKey: document.getElementById("mqtt-api-key").value,
    });
    xhttp.onreadystatechange = function(){
        if(this.readyState == 4){
            //console.log(this.responseText);
            var response = JSON.parse(this.responseText);
            if(response){
                document.getElementById("filter-reports").style.display = "none";
                document.getElementById("main-content").style.display = "grid";
                document.getElementById("main-content").innerHTML = response.report;
                eventsDetail = response.detail;
                searchEventListener();
                eventsSummary = response.summary;
            }
        }
    };
    xhttp.open('POST', 'dashboard/reports', true);
    xhttp.setRequestHeader('Content-type', 'application/json; charset=utf-8');
    xhttp.send(body);
}

const showEventSnapshot = function(url) {
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function(){
        if(this.readyState == 4){
            var response = this.responseText;
            if(response){
                document.getElementById("snapshot-dialog-image").src = `data:image/jpeg;base64,${response}`;
            }
            else{
                document.getElementById("snapshot-dialog-image").src="/images/image-not-found.png";
            }
            document.getElementById("snapshot-dialog").style.display = "grid";
            document.getElementById("snapshot-dialog-title").innerText = url;
        }
    };
    xhttp.open('GET', `dashboard/reports/snapshot?${url}`, true);
    xhttp.send();
}

const closeSnapshotDialog = function() {
    document.getElementById("snapshot-dialog").style.display = "none";
}

const searchKeyword = function() {
    const keyword = document.getElementById("search-bar").value.trim();
    if (keyword !== "") {
        showDetailFor({searchKeyword: keyword});
    }
}

const searchEventListener = function () {
    let searchBar = document.getElementById("search-bar");
    searchBar.addEventListener("keydown", function(event) {
        if (event.key === "Enter") {
            event.preventDefault(); // stop form submission if inside a form
            searchKeyword();
        }
    });
}

const escalateEvent = function() {
    let xhttp = new XMLHttpRequest();
    const body = JSON.stringify({
        projectName: document.getElementById("project-selection").innerText,
        eventNarrative: document.getElementById("snapshot-narrative").value,
        eventLink: document.getElementById("snapshot-dialog-title").innerText,
        to: document.getElementById("escalation-point-of-contact").value,
    });
    xhttp.onreadystatechange = function(){
        if(this.readyState == 4){
            //console.log(this.responseText);
            var response = JSON.parse(this.responseText);
            if(response){
                alert(response.message);
            }
        }
    };
    xhttp.open('POST', 'dashboard/reports/escalate', true);
    xhttp.setRequestHeader('Content-type', 'application/json; charset=utf-8');
    xhttp.send(body);
}
