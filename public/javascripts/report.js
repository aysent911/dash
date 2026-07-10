
const findNextPage = function(){
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