import UrlPattern from 'url-pattern';

/**
 * 测试 `url-pattern` 模块
 *
 * @see https://www.npmjs.com/package/url-pattern
 */
describe("test 'url-pattern' module", () => {
  /**
   * 测试创建 `UrlPattern` 对象
   */
  it("should create 'UrlPattern' object", () => {
    // 创建 `UrlPattern` 对象
    // `:major` 和 `:minor` 表示模式中的两个占位符号, 在匹配时会被匹配位置的实际内容代替
    // `*` 表示匹配任意内容
    const pattern = new UrlPattern('/v:major(.:minor)/*');

    let r = pattern.match('/v1.2/');
    expect(r).toEqual({
      major: '1',
      minor: '2',
      _: '',
    });

    r = pattern.match('/v1.2/info');
    expect(r).toEqual({
      major: '1',
      minor: '2',
      _: 'info',
    });
  });

  /**
   * 测试一个完整的 URL 模式匹配
   */
  it("should 'match' full url", () => {
    // 通过一个完整的 URL 模式创建 `UrlPattern` 对象
    // 注意, 要对 `:` 进行转义, 需要写为 `\:`, 在字符串中需写为 `\\:`
    // 一对小括号 `()` 中表示可选内容, 即只有匹配到内容才会出现在结果中
    const pattern = new UrlPattern('(http(s)\\://)(:subdomain.):domain.:tld(\\::port)(/*)');

    let r = pattern.match('google.com');
    expect(r).toEqual({
      domain: 'google',
      tld: 'com',
    });

    r = pattern.match('https://www.google.com');
    expect(r).toEqual({
      subdomain: 'www',
      domain: 'google',
      tld: 'com',
    });

    r = pattern.match('http://www.google.com/mail');
    expect(r).toEqual({
      subdomain: 'www',
      domain: 'google',
      tld: 'com',
      _: 'mail',
    });

    r = pattern.match('http://www.google.com:80/mail');
    expect(r).toEqual({
      subdomain: 'www',
      domain: 'google',
      tld: 'com',
      port: '80',
      _: 'mail',
    });
  });

  /**
   * 测试如果匹配错误, 则返回 `null` 值
   */
  it("should return 'null' if 'match' nothing", () => {
    const pattern = new UrlPattern('/api/users/:id');

    let r = pattern.match('/api/users/100');
    expect(r).toEqual({ id: '100' });

    r = pattern.match('/api/users/alvin');
    expect(r).toEqual({ id: 'alvin' });

    // 如果模式无法正确匹配, 则返回 `null` 致
    r = pattern.match('/api/users/home/alvin');
    expect(r).toBeNull();
  });

  /**
   * 测试通过正则表达式模式进行匹配
   */
  it("should 'match' by regex pattern", () => {
    let pattern = new UrlPattern(/\/api\/(.*)/);

    // 如果未对正则表达式中的分组进行命名, 则结果返回数组, 包含匹配到的内容集合
    let r = pattern.match('/api/users');
    expect(r).toEqual(['users']);

    r = pattern.match('/api/users/alvin');
    expect(r).toEqual(['users/alvin']);

    // 如果模式无法正确匹配, 则返回 `null` 致
    r = pattern.match('/apis/users');
    expect(r).toBeNull();

    // 可以对正则分组进行命名, 通过名称获取匹配结果
    // 这里一共三个分组, 其中通过 `?:` 标记的表示不保存匹配结果, 故最后只返回两个匹配结果
    pattern = new UrlPattern(/\/api\/([^/]+)(?:\/(\d+))?/, ['resource', 'id']);

    r = pattern.match('/api/users');
    expect(r).toEqual({ resource: 'users' });

    r = pattern.match('/api/users/1');
    expect(r).toEqual({ resource: 'users', id: '1' });

    // 因为 `alvin` 无法匹配名为 `id‵ 的分组 `(\d+)`, 但由于 `id` 分组后为 `?`, 故仍能返回第一个分组结果
    r = pattern.match('/api/users/alvin');
    expect(r).toEqual({ resource: 'users' });
  });

  /**
   * 测试生成符合模式的 URL 字符串
   */
  it("should create string from pattern by 'stringify'", () => {
    const pattern = new UrlPattern('/api/users/:id');

    let r = pattern.stringify({ id: 100 });
    expect(r).toEqual('/api/users/100');

    r = pattern.stringify({ id: 'alvin' });
    expect(r).toEqual('/api/users/alvin');
  });

  /**
   * 测试自定义模式中的语法规则
   */
  it("should 'customize' the pattern syntax", () => {
    const pattern = new UrlPattern(
      '[http[s]!://][$sub_domain.]$domain.$toplevel-domain[/?]',
      {
        escapeChar: '!',
        segmentNameStartChar: '$',
        segmentNameCharset: 'a-zA-Z0-9_-',
        segmentValueCharset: 'a-zA-Z0-9',
        optionalSegmentStartChar: '[',
        optionalSegmentEndChar: ']',
        wildcardChar: '?',
      }
    );

    const r = pattern.match('http://mail.google.com/mail');
    expect(r).toEqual({
      sub_domain: 'mail',
      domain: 'google',
      'toplevel-domain': 'com',
      _: 'mail',
    });
  });
});
