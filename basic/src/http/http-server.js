'use strict';

import http from "http";
import url from "url";
import querystring from "querystring";

class Server {

    constructor(port, router, charset = 'UTF-8', bindAddress = '0.0.0.0') {
        router = router || {};
        this._port = port;
        this._proxy = http.createServer((req, resp) => {
            const href = url.parse(req.url);
            if (!router[href.pathname]) {
                resp.writeHead(404, {
                    'Content-Type': `text/html; charset=${this._contentTypeEncoding}`,
                    'Content-Length': 0
                });
                resp.end('', this._encoding);
            } else {
                const buffers = [];
                let length = 0;

                req.on('data', chunk => {
                    buffers.push(new Buffer(chunk));
                    length += chunk.length;
                });

                req.on('end', () => {
                    const parameters = {};
                    if (href.query) {
                        Object.assign(parameters, querystring.parse(href.query));
                    }

                    const body = Buffer.concat(buffers, length).toString(this._encoding);
                    if (body.startsWith('{') && body.endsWith('}')) {
                        Object.assign(parameters, JSON.parse(body));
                    } else {
                        Object.assign(parameters, querystring.parse(body));
                    }

                    req.parameters = parameters;
                    let result;
                    try {
                        result = router[href.pathname](req);
                    } catch (e) {
                        console.log(e);
                    }

                    switch (result.contentType()) {
                    case 'text/html':
                        resp.writeHead(result.code(), Object.assign({
                            'Content-Type': `${result.contentType()}; charset=${this._contentTypeEncoding}`,
                            'Content-Length': Buffer.byteLength(result.raw() || '', this._encoding)
                        }, result.headers()));

                        resp.write(result.raw() || '', this._encoding);
                        break;
                    case 'application/json':
                        const body = JSON.stringify(result.body() || '{}');
                        resp.writeHead(result.code(), Object.assign({
                            'Content-Type': `${result.contentType()}; charset=${this._contentTypeEncoding}`,
                            'Content-Length': Buffer.byteLength(body || '', this._encoding)
                        }, result.headers()));

                        resp.write(body, this._encoding);
                        break;
                    }

                    resp.end('', this._encoding);
                });
            }
        });

        this._contentTypeEncoding = charset;
        this._encoding = charset.replace('-', '').toLowerCase();
        this._bindAddress = bindAddress;
    }

    start() {
        this._proxy.listen(this._port, this._bindAddress);
        return this;
    }

    close() {
        this._proxy.close();
        return this;
    }
}


export default Server;