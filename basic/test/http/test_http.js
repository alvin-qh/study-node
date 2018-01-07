import {expect} from "chai";
import Request from "../../src/http/http-request";
import Server from "../../src/http/http-server";
import Results from "../../src/http/http-result";

describe('Test http request', () => {

    it('should parse hostname and port', function () {
		let request = new Request('localhost:8090');
		expect(request.hostname()).is.eql('localhost');
		expect(request.port()).is.eql('8090');

		request = new Request('localhost');
		expect(request.hostname()).is.eql('localhost');
		expect(request.port()).is.eql('80');
	});

    it('should get method with 404 response', function (done) {
		const server = new Server(18080).start();

		const request = new Request('http://localhost:18080');
		const result = request.get('/unknown-path');
		result.done(() => {
			expect.fail();
		}).fail(resp => {
			expect(resp.statusCode).is.eql(404);
		}).always(() => {
			server.close();
			done()
		}).start();
	});

    it('should `get` method working', function (done) {
		const server = new Server(18080, {
			'/version': req => {
				let version = '1.0.0';
				if (req.parameters['with_build_num']) {
					version += ' build 123';
				}
				return Results.html().raw(`<html><body>${version}</body></html>`);
			}
		}).start();

		const request = new Request('http://localhost:18080');
		const result = request.get('/version', {'with_build_num': true});
		result.done(resp => {
			expect(resp.statusCode).is.eql(200);
			expect(resp.responseText).is.eql('<html><body>1.0.0 build 123</body></html>');
		}).fail(() => {
			expect.fail();
		}).always(() => {
			server.close();
			done()
		}).start();
	});

    it('should `get json` method working', function (done) {
		const server = new Server(18080, {
			'/version': req => {
				const version = {
					version: '1.0.0'
				};

				if (req.parameters['with_build_num']) {
					version.build = 123;
				}
				return Results.json().render(version);
			}
		}).start();

		const request = new Request('http://localhost:18080');
		const result = request.getJSON('/version', {'with_build_num': true});
		result.done(resp => {
			expect(resp.statusCode).is.eql(200);
			expect(resp.responseJSON).has.property('version', '1.0.0');
			expect(resp.responseJSON).has.property('build', 123);
		}).fail(() => {
			expect.fail();
		}).always(() => {
			server.close();
			done();
		}).start();
	});
});