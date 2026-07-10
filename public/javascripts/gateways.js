let lastEtag = '';
setInterval(() => {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function(){
        //console.log(this.readyState);
        if (this.readyState == 4 && this.getResponseHeader('etag') != lastEtag ){
            //console.log(this.getAllResponseHeaders());
            lastEtag = this.getResponseHeader('etag');
            try{
                let gateways = JSON.parse(this.responseText);
                //console.log(`length ${devices.length}`);
                for(let i = 0; i < gateways.length; i++){
                    let text = '';
                    let deviceStatus = gateways[i].status;
                    let statusIcon = "fas fa-circle-exclamation";
                    let openGatewayDialog = `openGatewayDialog({id: \'${gateways[i].eui}\', name: \'${gateways[i].name}\',`+
                        `tower: \'${gateways[i].tower }\', status: \'${gateways[i].status}\',` +
                        `lastSeen: \'${gateways[i].last_seen}\', created: \'${gateways[i].created_at}\',` +
                        `apiKey: \'${gateways[i].api_key}\'})`;
                    let tileColor = "#ff5f5c";   //light-red
                    if(deviceStatus == 'connected') {
                        tileColor = "#00ed35";   //light-green
                        statusIcon = "fas fa-tower-broadcast";
                    }
                    text +=`<h1>${gateways[i].name}<i class="${statusIcon}"></i></h1>
                    <p>
                        <span style="font-weight: bold;font-size: 20px;">${gateways[i].status}</span><br>
                        <span>${gateways[i].remote_address}</span><br><br>
                        <span style="font-weight: bold;font-size: 16x;">${gateways[i].status} At:</span><br>
                        <span>${new Date(gateways[i].status_at)}</span><br>
                        <span style="font-weight: bold;font-size: 16x;">Last Status At:</span><br>
                        <span>${new Date(gateways[i].last_status_at)}</span><br>
                        <span style="font-weight: bold;font-size: 16x;">Last Uplink At:</span><br>
                        <span>${new Date(gateways[i].last_uplink_at)}</span>
                    </p>`;
                    document.getElementById(`${gateways[i].id}`).innerHTML = text;
                    document.getElementById(`${gateways[i].id}`).style.backgroundColor = tileColor;

                }
            }catch(err){
                location.reload();
            }
        }
    };
    xhttp.open('GET', `/check_gateways`, true);
    xhttp.send();
    //document.location.reload();
}, 15000);

var openNewGatewayDialog = function(){
    document.getElementById("new-gateway-dialog").style.display = "flex";
}
var closeNewGatewayDialog = function(){
    document.getElementById("new-gateway-dialog").style.display = "none";
}

var openGatewayDialog = function(gateway){
    document.getElementById("about-gateway-menu").style.backgroundColor="darkgray";
    document.getElementById("about-gateway-menu").style.color="black";
    document.getElementById("gateway-devices-menu").style.backgroundColor="unset";
    document.getElementById("gateway-devices-menu").style.color="unset";
    document.getElementById("project-details").style.display="none";
    document.getElementById("device-details").style.display="none";
    document.getElementById("about-gateway").style.display="flex";
    if(gateway){
        document.getElementById("gateway-dialog-title").innerHTML = gateway.name;
        document.getElementById("gateway-id").innerHTML = gateway.id;
        document.getElementById("gatewayEUI").value = gateway.id;
        document.getElementById("gatewayName").value = gateway.name;
        document.getElementById("gatewayTower").value = gateway.tower;
        document.getElementById("gatewayStatus").innerText = gateway.status;
        document.getElementById("gatewayLastSeen").value = gateway.lastSeen;
        document.getElementById("gatewayCreatedAt").value = gateway.created;
        document.getElementById("gatewayStatus").disabled = true;
        document.getElementById("gatewayLastSeen").disabled = true;
        document.getElementById("gatewayCreatedAt").disabled = true;
        document.getElementById("gateway-dialog").style.display = "flex";
    }
}
var closeGatewayDialog = function(){
    document.getElementById("gateway-dialog").style.display = "none";
}
