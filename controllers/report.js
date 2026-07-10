import ClassicReport from '../reports/classic_report.js';
import {MasterDetailReport, Detail} from '../reports/master_detail.js';
import {Table} from '../reports/page.js';
import redisClient from '../services/redis.js';

const reportDetail = async (req, res) => {
    req.detail = new Detail(req.deviceEvents, req.body.deviceName);
    res.send(JSON.stringify({
        summary: req.body.deviceId? await redisClient.get(req.body.deviceId) : "{}",
        detail: req.detail.render(),
    }));
}
const escalateEvent = async (req, res) => {
    res.status(200).send(JSON.stringify({message: 'Event escalated successfully'}));
}
export {reportDetail, escalateEvent};