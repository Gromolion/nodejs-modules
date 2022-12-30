const http = require('http');
const querystring = require("querystring");

const METHOD_GET = 'GET';
const METHOD_POST = 'POST';

const host = '127.0.0.1';
const port = 7000;

module.exports.host = host;
module.exports.port = port;

function sendText(res, text) {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.end(text);
}

function methodNotAllowed(res) {
    res.statusCode = 405;
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.end('405 Method Not Allowed!');
}

const server = http.createServer((req, res) => {
    switch (req.url) {
        case '/get':
            if (req.method !== METHOD_GET) {
                methodNotAllowed(res);
            } else {
                sendText(res, 'GET запрос получен');
            }
            break;
        case '/post':
            if (req.method !== METHOD_POST) {
                methodNotAllowed(res);
            } else {
                sendText(res, 'POST запрос получен');
            }
            break;
        case '/form':
            if (req.method !== METHOD_POST) {
                methodNotAllowed(res);
            } else {
                let rawData = '';

                req.on('data', function (data) {
                    rawData += data;
                    if (data.length > 1e6) {
                        rawData = '';
                        res.statusCode = 413;
                        res.setHeader('Content-Type', 'text/plain; charset=utf-8');
                        res.end('Payload too large');
                        req.connection.destroy();
                    }
                });

                req.on('end', () => {
                    sendText(res, `Form-data получена:\n${rawData}`);
                });
            }
            break;
    }
});

server.listen(port, host, () => {
    console.log(`Сервер получатель запущен на http://${host}:${port}`);
});