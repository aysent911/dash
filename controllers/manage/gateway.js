import {validationResult} from 'express-validator';
import {createGateway} from '../../services/db.js'

let addGateway = async function(req, res){
    const errors = validationResult(req);
    req.gatewayEUIError = '';
    req.gatewayIDError = '';
    req.gatewayNameError = '';
    req.towerError = '';
    let info = '';
    if(errors.isEmpty()){
        var result = await createGateway(req.user, req.body);
        if(result){
            info = result;
        }else{
            info = 'Oops! An Error occured!';
    	}
    }else {
        const validationErrors = errors.array();
        for (var i = 0; i < validationErrors.length; i++) {
            if (validationErrors[i].path === 'gatewayEUI' && !req.gatewayEUIError) {
                req.gatewayEUIError = validationErrors[i].msg;
            }else if (validationErrors[i].path === 'gatewayID' && !req.gatewayIDError) {
                req.gatewayIDError = validationErrors[i].msg;
            }else if (validationErrors[i].path === 'gatewayName') {
                req.gatewayNameError = validationErrors[i].msg;
            }else if (validationErrors[i].path === 'tower') {
                req.towerError = validationErrors[i].msg;
            }
        }
    }
    res.send(JSON.stringify({
        message: info,
        gatewayEUIError: req.gatewayEUIError,
        gatewayIDError: req.gatewayIDError,
        gatewayNameError: req.gatewayNameError,
        towerError: req.towerError,
    }));
};

export {addGateway};
