const http = require('http');
const fs = require('fs')
const { URL } = require('url');

const PORT = 38314;

const server = http.createServer((req, res) => {

    const url = req.url;
    const myUrl = new URL(url, `http://${req.headers.host}`);
    const pathname = myUrl.pathname;
    console.log(pathname);
    if (url === '/' || url === '/home') {
        res.end(fsc('index'));
    } else if(pathname === '/product') {
        res.end(fsc(`product${myUrl.searchParams.get('id')}`));
    } else {
        res.writeHead(404);
        res.end('<h1><p style="color: mediumvioletred">404 Page not found.</p></h1>');
    }


}).listen(PORT, () => {
    console.log(`Node.js listening on port ${PORT}`);
});

function fsc(path) {
    return fs.readFileSync(`${__dirname}/templates/${path}.html`, 'utf8');
}
// {
//     let myHtml = '';
//
//     if(url === '/' || url === '/home') {
//         myHtml = `<h1>Hello student to learn ITMI1210: Node.js</h1>
//                     <h2><p style="color: green">@Semester: 2/2567</p></h2>`
//     } else if(url === '/student') {
//         myHtml = `<h1>Hello student to learn ITMI1210: Node.js</h1>
//                     <h2><p style="color: orange">@Semester: 2/2567</p></h2>`
//     } else if(url === '/teacher') {
//         myHtml = `<h1>Hello student to learn ITMI1210: Node.js</h1>
//                     <h2><p style="color: blue">@Semester: 2/2567</p></h2>`
//     }
//     else {
//         res.writeHead(404);
//         myHtml = `<h1><p style="color: mediumvioletred">404 Page not found.</p></h1>`
//     }
//     res.write(myHtml);
//     res.end();
// }