import {PORT} from './config/index.js';
import app from './app.js';
const port = PORT;


// start server and listen on PORT
app.listen(port, ()=>{
    console.log(`Listening on port ${port}`)
});
