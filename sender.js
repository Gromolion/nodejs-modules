const http = require('http');
const receiver = require('./receiver');

const METHOD_GET = 'GET';
const METHOD_POST = 'POST';

const host = '127.0.0.1';
const port = 7001;

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
        case '/send-get':
            if (req.method !== METHOD_GET) {
                methodNotAllowed(res);
            } else {
                let request = http.get(`http://${receiver.host}:${receiver.port}/get`, (_res) => {
                    let data = '';

                    _res.on('data', (chunk) => {
                        data += chunk;
                    });

                    _res.on('end', () => {
                        sendText(res, `GET запрос отправлен\n Ответ: ${data}`);
                        console.log(`GET запрос отправлен\n Ответ: ${data}`)
                    });
                });
                request.end();
            }
            break;
        case '/send-post':
            if (req.method !== METHOD_POST) {
                methodNotAllowed(res);
            } else {
                let postOptions = {
                    host: receiver.host,
                    port: receiver.port,
                    path: '/post',
                    method: 'POST',
                };
                let request = http.request(postOptions, (_res) => {
                    let data = '';

                    _res.on('data', (chunk) => {
                        data += chunk;
                    });

                    _res.on('end', () => {
                        sendText(res, `POST запрос отправлен\n Ответ: ${data}`);
                        console.log(`POST запрос отправлен\n Ответ: ${data}`)
                    });
                });
                request.end();
            }
            break;
        case '/send-form':
            if (req.method !== METHOD_POST) {
                methodNotAllowed(res);
            } else {
                let postData = JSON.stringify({
                    'key': 'value'
                });
                let postOptions = {
                    host: receiver.host,
                    port: receiver.port,
                    path: '/form',
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Content-Length': postData.length
                    }
                };
                let request = http.request(postOptions, (_res) => {
                    let data = '';

                    _res.on('data', (chunk) => {
                        data += chunk;
                    });

                    _res.on('end', () => {
                        sendText(res, `Form-data отправлена\n Ответ: ${data}`);
                        console.log(`Form-data отправлена\n Ответ: ${data}`);
                    });
                })
                request.write(postData);
                request.end();
            }
            break;
    }
});

server.listen(port, host, () => {
    console.log(`Сервер отправитель запущен на http://${host}:${port}`);
});