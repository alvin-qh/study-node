import {expect} from "chai";

import BufferMethods from "../../src/io/buffer";
import {Buffer} from "buffer";
import crypto from "crypto";

describe('Test buffer methods', () => {

	it('test convert string to byte array', () => {
		const bytes = BufferMethods.stringToByteArray('Hello',);
		expect(bytes).to.deep.equal([72, 101, 108, 108, 111]);
	});

	it('test convert byte array to string', () => {
		const s = BufferMethods.byteArrayToString([72, 101, 108, 108, 111], 'utf8');
		expect(s).to.equal('Hello');
	});

	it('test concat buffers', () => {
		const buf1 = Buffer.from([1, 2, 3]);
		const buf2 = Buffer.from([4, 5, 6]);

		const data = BufferMethods.concat(buf1, buf2);
		expect(data).to.deep.equal([1, 2, 3, 4, 5, 6]);
	});

	it('test read data', () => {
		const message = Buffer.from('Hello, 世界', 'utf8');
		const checksum = crypto.createHash("md5").update(message).digest();
		const length = Buffer.alloc(4);
		length.writeInt32BE(message.length, 0);

		const data = BufferMethods.readData(Buffer.concat([length, checksum, message]));
		expect(data.length).to.equal(13);
		expect(data.checksum).to.equal('3dbca55819ed79f62e6f770eef640eee');
		expect(data.message).to.equal('Hello, 世界');
	});
});