const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

// router.get('/', (req, res) => {
//     // const id = 'ITMI1210'
//     // const subject = 'Designing Web API using Node.js'
//     // const course = "<h3><p style='color: mediumvioletred'>Course: Information Technology and Mobile Software Innovation</p></h3>"
//
//     // const id = '6614110014'
//     // const name = 'Thewa Laokasikan'
//     // const gpa = 2.0
//
//     // const id = ['6614110014', '6614110015', '6614110016']
//     // const name = ['Thewa1 Laokasikan', 'Thewa2 Laokasikan', 'Thewa3 Laokasikan']
//     // const gpa = [2.5, 3.0 ,3.5]
//
//     const students = [
//         {id: "6614110014", name: "Thewa1 Laokasikan", gpa: 2.5},
//         {id: "6614110015", name: "Thewa2 Laokasikan", gpa: 3.0},
//         {id: "6614110016", name: "Thewa3 Laokasikan", gpa: 3.5}
//     ]
//
//
//     res.render('index', {
//         students
//     });
// })

router.get('/', (req, res) => {
    fs.readFile(path.join(__dirname, '../public/data/products.json'), 'utf8', (err, data) => {
        if (err) throw err
        const products = JSON.parse(data);
        // console.log(products);
        res.render('index.ejs', {products: products})
    });
});

router.get('/students', (req, res) => {
    const students = [
        {id: "6614110014", name: "Thewa1 Laokasikan", gpa: 2.5},
        {id: "6614110015", name: "Thewa2 Laokasikan", gpa: 3.0},
        {id: "6614110016", name: "Thewa3 Laokasikan", gpa: 3.5}
    ]


    res.render('forEach-index.ejs', {
        students
    });
})
module.exports = router;