import {expect} from "chai";

import BufferMethods from "../../src/io/buffer";
import {Buffer} from "buffer";
import crypto from "crypto";

describe('Test buffer methods', () => {

    it('should convert string to byte array', function () {
        const bytes = BufferMethods.stringToByteArray('Hello',);
        expect(bytes).is.eql([72, 101, 108, 108, 111]);
    });

    it('should convert byte array to string', function () {
        const s = BufferMethods.byteArrayToString([72, 101, 108, 108, 111], 'utf8');
        expect(s).is.eql('Hello');
    });

    it('should concat buffers', function () {
        const buf1 = Buffer.from([1, 2, 3]);
        const buf2 = Buffer.from([4, 5, 6]);

        const data = BufferMethods.concat(buf1, buf2);
        expect(data).is.eql([1, 2, 3, 4, 5, 6]);
    });

    it('should read data', function () {
        const message = Buffer.from('Hello, 世界', 'utf8');
        const checksum = crypto.createHash("md5").update(message).digest();
        const length = Buffer.alloc(4);
        length.writeInt32BE(message.length, 0);

        const data = BufferMethods.readData(Buffer.concat([length, checksum, message]));
        expect(data.length).is.eql(13);
        expect(data.checksum).is.eql('3dbca55819ed79f62e6f770eef640eee');
        expect(data.message).is.eql('Hello, 世界');
    });
});