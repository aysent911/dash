import express from 'express';
var router = express.Router();

/* GET Dashboard. */
router.get('/', function(req, res, next){
    //console.log(req.user);
    res.setHeader('Cache-Control', 'private, max-age=0, no-cache, no-store');
    console.log(req.devices);
    res.render('dashboard', {
        timezone: req.timezone,
        projects: req.projects,
        devices: req.devices,
        userRole: req.user.role,
        firstName: req.user.first_name,
        secondName: req.user.second_name,
        email: req.user.email,
        userKey: req.user.user_key,});
});

export default router;
