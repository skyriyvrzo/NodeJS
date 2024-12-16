const express = require('express');
const app = express();
const router = require('./routes/myrouter');
const port = 80
app.use(router);

app.listen(port,()=>{
    console.log(`Starting server at port: ${port}`);
})

