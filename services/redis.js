import redis from 'redis';
import {REDIS_URI} from '../config/index.js'
let redisClient;

(async () => {
    redisClient = redis.createClient({
        url: REDIS_URI,
        connectTimeout: 10000, //in milliseconds
    });
    redisClient.on('error', (err) => {
        console.error(err)
    });
    await redisClient.connect();
})();

let checkCache = () => {
    try{
        redisClient.get('camera').then((data) => {
            if (!data) {
                console.log(`No matching data from cache.`);
            }else{
                console.log(data);
            }
        });
    }catch(error){
        console.error(error);
    }
};

export default redisClient;
