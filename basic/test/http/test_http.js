'use strict';

import {expect} from "chai";
import Request from "../../src/http/http-request";
import Server from "../../src/http/http-server";
import Results from "../../src/http/http-result";

describe('Test http request', () => {

    it('test parse hostname and port', () => {
        let request = new Request('localhost:8090');
        expect(request.hostname()).to.equal('localhost');
        expect(request.port()).to.equal('8090');

        request = new Request('localhost');
        expect(request.hostname()).to.equal('localhost');
        expect(request.port()).to.equal('80');
    });

    it('test get method with 404 response', done => {
        const server = new Server(18080).start();

        const request = new Request('http://localhost:18080');
        const result = request.get('/unknown-path');
        result.done(() => {
            expect.fail();
        }).fail(resp => {
            expect(resp.statusCode).to.equal(404);
        }).always(() => {
            server.close();
            done()
        }).start();
    });

    it('test get method', done => {
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
            expect(resp.statusCode).to.equal(200);
            expect(resp.responseText).to.equal('<html><body>1.0.0 build 123</body></html>');
        }).fail(() => {
            expect.fail();
        }).always(() => {
            server.close();
            done()
        }).start();
    });

    it('test get json method', done => {
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
            expect(resp.statusCode).to.equal(200);
            expect(resp.responseJSON).have.property('version', '1.0.0');
            expect(resp.responseJSON).have.property('build', 123);
        }).fail(() => {
            expect.fail();
        }).always(() => {
            server.close();
            done();
        }).start();
    });
});