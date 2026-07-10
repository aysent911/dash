import {WSS_ADDRESS, WSS_PORT} from '../../config/index.js';
const getWSS = function(req, res){
    res.status(200).send(JSON.stringify({
        address: WSS_ADDRESS,
        port: WSS_PORT,
    }));
}
export default getWSS;