import {getCameraEvents, getCameraEventsSummary, findUserId} from '../services/prisma.js';
import ClassicReport from '../reports/classic_report.js';
import {MasterDetailReport, Detail} from '../reports/master_detail.js';
import redisClient from '../services/redis.js';


const getReports = async (req, res, next) => {
    req.eventsSummary = await getCameraEventsSummary(req.body.projectId);
    req.eventsSummary[1].forEach((device) => {
        redisClient.set(device[Object.keys(device)[0]], JSON.stringify(device, (_, value) =>
            typeof value === "bigint" ? Number(value) : value));
    });
    if(req.eventsSummary[1].length > 0){
        req.report = new MasterDetailReport(req.eventsSummary, await getCameraEvents(req.body.projectId));
        let eventsSummary = {};
        let total = 0n;
        req.eventsSummary[1].forEach((summary) => {
            eventsSummary[summary.name] = summary.total;
            total += summary.total;
        });
        eventsSummary.total = total;
        res.send(JSON.stringify({
                summary: eventsSummary,
                report: req.report.render(),
                detail: req.report.detail.render(),
            }, (_, value) =>
                typeof value === "bigint" ? Number(value) : value
        ));
    }else{
        res.send(JSON.stringify({
                summary: {},
                report: '<div style="margin: 0 auto"><p>Oops! No record found!</p></div>',
            }));
    }
}

const getReportDetail = async (req, res, next) => {
    if(req.body.searchKeyword){
        req.deviceEvents = await getCameraEvents(req.body.projectId,'', 0, req.body.searchKeyword);
    }else{
        req.deviceEvents = await getCameraEvents(req.body.projectId, req.body.deviceId);
    }
    next();
}

const getEventDetail = async (req, res, next) => {

    next();
}

export {getReports, getReportDetail, getEventDetail};