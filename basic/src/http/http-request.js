import https from "https";
import http from "http";
import url from "url";
import zlib from "zlib";
import querystring from "querystring"

function sendRequest(thisObj, path, method, query, contentType, data, callback) {
	query = query || null;
	data = data || '';

	let protocol = http;
	const httpsOption = {};
	if (thisObj._options.protocol === 'https:') {
		protocol = https;
		httpsOption.rejectUnauthorized = false;
		httpsOption.requestCert = true;
	}

	const opt = Object.assign(
		Object.assign({}, thisObj._options),
		Object.assign(httpsOption, {
			path: query ? `${path}?${query}` : path,
			method,
			headers: {
				'Accept-Encoding': 'gzip,deflate',
				'Content-Type': `${contentType}; charset=${thisObj._contentTypeEncoding}`,
				"Content-Length": Buffer.byteLength(data, thisObj._encoding)
			}
		})
	);

	const request = protocol.request(opt, resp => {
		const headers = resp.headers;
		const statusCode = resp.statusCode;
		const buffers = [];

		let length = 0;

		switch (resp.headers['content-encoding']) {
		case 'gzip':
			(unzip => {
				resp.pipe(unzip);
				resp = unzip;
			})(zlib.createGunzip());
			break;
		case 'deflate':
			(deflate => {
				resp.pipe(deflate);
				resp = deflate;
			})(zlib.createDeflate());
		}

		resp.on('data', chunk => {
			buffers.push(new Buffer(chunk));
			length += chunk.length;
		});

		resp.on('end', () => {
			const buffer = Buffer.concat(buffers, length);
			callback({
				statusCode,
				headers,
				responseText: buffer.toString(thisObj._encoding),
				exception: null
			});
		});
	});

	request.on('error', e => {
		callback({
			exception: e
		});
	});

	request.write(data);
	request.end();
}

function makeResult(callback) {
	return {
		done(callback) {
			this.done = callback;
			return this;
		},
		fail(callback) {
			this.fail = callback;
			return this;
		},
		always(callback) {
			this.always = callback;
			return this;
		},
		start() {
			callback(this.done, this.fail, this.always);
		}
	};
}

function isResponseOk(resp) {
	return resp.exception || resp.statusCode < 200 || resp.statusCode > 300;
}

class Request {

	constructor(baseUrl, encoding = 'UTF-8') {
		if (!baseUrl.startsWith('http')) {
			baseUrl = 'http://' + baseUrl;
		}
		this._options = url.parse(baseUrl);
		this._contentTypeEncoding = encoding;
		this._encoding = encoding.replace('-', '').toLowerCase();
	}

	hostname() {
		return this._options.hostname;
	}

	port() {
		return this._options.port || '80';
	}

	get(path, data) {
		return makeResult((done, fail, always) => {
			let qs = data ? querystring.stringify(data) : null;

			sendRequest(this, path, 'GET', qs, 'text/html', null, resp => {
				if (isResponseOk(resp) && fail) {
					fail(resp);
				} else if (done) {
					done(resp);
				}

				if (always) {
					always();
				}
			});
		});
	}

	getJSON(path, data) {
		return makeResult((done, fail, always) => {
			let qs = data ? querystring.stringify(data) : null;

			sendRequest(this, path, 'GET', qs, 'application/json', null, resp => {
				if (isResponseOk(resp) && fail) {
					fail(resp);
				} else if (done) {
					if (resp.responseText.startsWith('{') && resp.responseText.endsWith('}')) {
						resp.responseJSON = JSON.parse(resp.responseText);
					}
					done(resp);
				}
				if (always) {
					always();
				}
			});
		})
	}
}

export default Request;