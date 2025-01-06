const path = require('path')
const fs = require('fs')

const productsPath = path.join(__dirname, '../views/products/products.json');

function write(item) {
    let data = [];

    if(fs.existsSync(productsPath)) {
        data = JSON.parse(fs.readFileSync(productsPath, 'utf-8'));
    }
    item = {id: data.length + 1, ...item};

    data.push(item)
    fs.writeFileSync(productsPath, JSON.stringify(data, null, 2))
}

function read() {
    let data = [];
    if(fs.existsSync(productsPath)) {
        data = JSON.parse(fs.readFileSync(productsPath, 'utf-8'));
    }
    return data;
}

module.exports = {
    write,
    read
}