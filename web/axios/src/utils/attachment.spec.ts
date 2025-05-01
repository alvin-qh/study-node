import { decodeAttachment, encodeAttachment } from './attachment';

/**
 * 测试 'attachment' 模块
 */
describe("test 'attachment' module", () => {
  /**
   * 测试编码文件名
   */
  it('should encode filename to attachment', () => {
    const filename = 'test.txt';

    const encoded = encodeAttachment(filename);
    expect(encoded).toEqual('attachment; filename="test.txt"; filename*=UTF-8\'\'test.txt');
  });

  /**
   * 测试编码文件名包含特殊字符
   */
  it('should encode filename with special chars to attachment', () => {
    const filename = '测试.txt?=';

    const encoded = encodeAttachment(filename);
    expect(encoded).toEqual('attachment; filename="%E6%B5%8B%E8%AF%95.txt%3F%3D"; filename*=UTF-8\'\'%E6%B5%8B%E8%AF%95.txt%3F%3D');
  });

  /**
   * 测试解码文件名
   */
  it('should decode attachment to filename', () => {
    const filename = 'attachment; filename="test.txt"; filename*=UTF-8\'\'test.txt';

    const decoded = decodeAttachment(filename);
    expect(decoded).toEqual('test.txt');
  });

  /**
   * 测试解码文件名包含特殊字符
   */
  it('should decode attachment to filename with special chars', () => {
    const filename = 'attachment; filename="%E6%B5%8B%E8%AF%95.txt%3F%3D"; filename*=UTF-8\'\'%E6%B5%8B%E8%AF%95.txt%3F%3D';

    const decoded = decodeAttachment(filename);
    expect(decoded).toEqual('测试.txt?=');
  });

  /**
   * 测试解码文件名不包含 'filename*' 字段的情况
   */
  it("should decode attachment to filename without 'filename*' field", () => {
    const filename = 'attachment; filename="%E6%B5%8B%E8%AF%95.txt%3F%3D"';

    const decoded = decodeAttachment(filename);
    expect(decoded).toEqual('测试.txt?=');
  });

  /**
   * 测试解码文件名不包含 'filename' 字段的情况
   */
  it("should decode attachment to filename without 'filename' field", () => {
    const filename = 'attachment; filename*=UTF-8\'\'%E6%B5%8B%E8%AF%95.txt%3F%3D';

    const decoded = decodeAttachment(filename);
    expect(decoded).toEqual('测试.txt?=');
  });
});
