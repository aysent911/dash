import {GRAFANA_URL, GRAFANA_AUTH, GRAFANA_TOKEN} from '../config/index.js';
let options = {
    headers : {
        "Content-Type" : "application/json",
        //"Authorization" : "Bearer "
        "Authorization" : `Basic ${GRAFANA_AUTH}`
    },
    //credentials : "same-origin",
}
let createGrafanaOrg = function(orgName){
    options.method = "POST";
    options.body = JSON.stringify({
        name: orgName
    });
    let result = fetch(`${GRAFANA_URL}/orgs`, options)
        .then((response) => {
            if(response.ok){
                return response.json();
            }else{
                //console.log(response);
                throw new Error(response.status + ' ' + response.statusText);
            }
        })
        .then((data) => {
            return data;
        })
        .catch((error) => {
            console.error(error);
            return {error: error.message};
        });
    return result;
}
//create user on grafana
let createGrafanaUser = function(user){
    options.method = "POST";
    options.body = JSON.stringify({
        name: user.email.split('@')[0],
        email: user.email,
        login: user.email,
        password: user.email,
        orgId : user.orgId,
    });
    let result = fetch(`${GRAFANA_URL}/admin/users`, options)
        .then((response) => {
            if(response.ok){
                return response.json();
            }else{
                //console.log(response);
                throw new Error(response.status + ' ' + response.statusText);
            }
        })
        .then((data) => {
            return data;
        })
        .catch((error) => {
            console.error(error);
            return {error: error.message};
        });
    return result;
}

export {createGrafanaOrg, createGrafanaUser}
/*
GET current organization  : http://67.205.129.183:3000/api/org/
GET all users within current organization  : http://67.205.129.183:3000/api/org/users/*/
