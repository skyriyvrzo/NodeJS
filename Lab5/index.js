const express = require('express');
const app = express();
const path = require('path');
const router = require('./routes/myrouter');
const port = 80

app.use(router)

app.listen(port, () => {
    console.log(`Express server listening on port ${port}`);
})