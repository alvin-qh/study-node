'use strict';

class Result {
    constructor(contentType) {
        this._statusCode = 200;
        this._contentType = contentType;
        this._headers = {};
        this._body = {};
        this._raw = '';
    }

    code(code) {
        if (code === undefined) {
            return this._statusCode;
        }
        this._statusCode = code;
        return this;
    }

    contentType(contentType) {
        if (contentType === undefined) {
            return this._contentType;
        }
        this._contentType = contentType;
        return this;
    }

    ok() {
        this._statusCode = 200;
        return this;
    }

    badRequest() {
        this._statusCode = 400;
        return this;
    }

    notFound() {
        this._statusCode = 404;
        return this;
    }

    serverError() {
        this._statusCode = 500;
        return this;
    }

    header(key, val) {
        if (typeof key === 'object' && val === undefined) {
            Object.assign(this._headers, key);
        } else {
            this._headers[key] = val;
        }
        return this;
    }

    headers() {
        return this._headers;
    }

    render(key, val) {
        if (typeof key === 'object' && val === undefined) {
            Object.assign(this._body, key);
        } else {
            this._body[key] = val;
        }
        return this;
    }

    body() {
        return this._body;
    }

    raw(html) {
        if (html === undefined) {
            return this._raw;
        }
        this._raw = html;
        return this;
    }
}

class Results {

    static html() {
        return new Result('text/html');
    }

    static json() {
        return new Result('application/json');
    }
}

export default Results;