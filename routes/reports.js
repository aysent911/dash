import express from 'express';
var router = express.Router();

/* GET gateways. */
router.get('/', function(req, res, next){
    res.setHeader('Cache-Control', 'private, max-age=0, no-cache, no-store');
    res.render('reports', {
        report: req.report,
        projects: req.projects,
        userRole: req.user.role,
        firstName: req.user.first_name,
        secondName: req.user.second_name,
        email: req.user.email,
        userKey: req.user.user_key,});
});

export default router;