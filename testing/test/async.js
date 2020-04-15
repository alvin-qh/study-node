const { expect } = require('chai');

function delay(ms, callback) {
    setTimeout(() => {
        callback(true)
    }, ms);
}

function promise(ms) {
    return new Promise(resolve => {
        setTimeout(() => resolve(true), ms);
    });
}

describe('Test "async" function', () => {

    it('should "async callback function" can complete test', done => {
        delay(500, result => {
            expect(result).is.true;
            done();
        });
    });

    it('should "async promise function" can complete test', done => {
        promise(500).then(result => {
            expect(result).is.true;
            done();
        });
    });

    it('should "await" can complete test', async () => {
        const result = await promise(500);
        expect(result).is.true;
    });
});
