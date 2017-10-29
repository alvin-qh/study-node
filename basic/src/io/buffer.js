import {Buffer} from "buffer";
import crypto from "crypto";

function toByteArray(buf) {
	const data = new Array(buf.length);
	for (let i = 0; i < data.length; i++) {
		data[i] = buf.readUInt8(i);
	}
	return data;
}

export default {
	stringToByteArray(s, encoding) {
		return toByteArray(Buffer.from(s, encoding));
	},
	byteArrayToString(data, encoding) {
		return Buffer.from(data).toString(encoding);
	},
	concat(...buf) {
		return toByteArray(Buffer.concat(buf));
	},
	readData(buffer) {
		// Data like { length: ?, checksum: ?, message: ? }
		let length, checksum, message;
		if (buffer.length >= 4) {
			length = buffer.readInt32BE();
			buffer = buffer.slice(4);

			if (buffer.length >= 16) {
				checksum = buffer.slice(0, 16).toString('hex');
				buffer = buffer.slice(16);

				if (buffer.length >= length) {
					message = buffer.slice(0, length);
					buffer = buffer.slice(length);

					const hash = crypto.createHash("md5").update(message).digest('hex');
					if (hash !== checksum) {
						return null;
					}

					return {
						length, checksum,
						message: message.toString("utf8")
					};
				}
			}
		}
		return null;
	}
};