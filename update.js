let {getDevices, checkUpdate} = require('../../db');
//app.data = getDevices();
setTimeout(() => {
    console.log(checkUpdate);
    //document.location.reload();
}, 10000);