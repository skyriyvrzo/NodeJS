const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');

const statsFile = path.join(__dirname, '../data/stats.json');
const logFile = path.join(__dirname, '../logs/clicks.log');

const productName = ["กระเป๋า", "หมวก", "รองเท้า"]

router.get('/', (req, res)=>{
    const statsFile = path.join(__dirname, '../data/stats.json');
    let stats = {};


    // อ่านไฟล์สถิติ
    if (fs.existsSync(statsFile)) {
        stats = JSON.parse(fs.readFileSync(statsFile, 'utf8'));
    }

    // แทรกสถิติลงใน HTML
    const statsHTML = Object.entries(stats)
        .map(([productID, clicks]) => `<p>${productName[productID - 1]}: ${clicks} clicks</p>`)
        .join('');    

    // อ่านไฟล์ index.html และเพิ่มส่วนแสดงผล
    const indexPath = path.join(__dirname, '../templates/index.html');
    let html = fs.readFileSync(indexPath, 'utf8');
    html = html.replace('{{stats}}', statsHTML);

    res.status(200).type('text/html').send(html);

});

router.get('/product/:id', (req, res)=>{
    const productID = req.params.id;
    const productFilePath = path.join(__dirname, `../templates/product${productID}.html`);
    const fs = require('fs');
    

    if (fs.existsSync(productFilePath)) {
        
        updateStats(productID);
        logClick(productID);
        res.sendFile(productFilePath);

    } else { 
        res.redirect('/');
    }
});

router.get('*', (req, res) => {
    res.redirect('/');
});

function updateStats(productID) {
    // อ่านไฟล์ stats.json
    let stats = {};
    if (fs.existsSync(statsFile)) {
        stats = JSON.parse(fs.readFileSync(statsFile, 'utf8'));
    }

    // อัปเดตจำนวนคลิก
    stats[productID] = (stats[productID] || 0) + 1;

    // เขียนกลับไปที่ stats.json
    fs.writeFileSync(statsFile, JSON.stringify(stats, null, 2));
}

function logClick(productID) {
    const logEntry = `[${new Date().toISOString()}] Product ${productID} clicked\n`;
    fs.appendFileSync(logFile, logEntry);
}

/** @deprecated */
function productIdToString(productID) {
    switch (productID) {
        case '1':
            return 'กระเป๋า'
        case '2':
            return 'หมวก'
        case '3':
            return 'รองเท้า'
        default:
            return null
    }
}

module.exports = router;


