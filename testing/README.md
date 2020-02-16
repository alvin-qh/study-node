Study mocha test lib
===

## Install and setup

### Install mocha

```shell
$ npm install --global mocha
```

### Install dependencies

```shell
$ npm install --save-dev should
```

## Use chai.js

### BDD

`expect`和`should`是 BDD 风格的，二者使用相同的链式语言来组织断言，但不同在于他们初始化断言的方式: 

- `expect`使用构造函数来创建断言对象实例，
- `should`通过为`Object.prototype`新增方法来实现断言（所以`should`不支持IE）；

比较建议使用`expect`，`should`不仅不兼容IE，在某些情况下还需要改变断言方式来填坑。详细的比较可以看看官网[Assertion Styles](http://chaijs.com/guide/styles/)，说的很清楚。

CommonJS
```javascript
const chai = require('chai'), 
      expect = chai.expect,
      should = chai.should()
```

ES6
```javascript
import {expect, should} from "chai";
```

### 语言链

下面的接口是单纯作为语言链提供以期提高断言的可读性。除非被插件改写否则它们一般不提供测试功能。

* `to`
* `be`
* `been`
* `is`
* `that`
* `which`
* `and`
* `has`
* `have`
* `with`
* `at`
* `of`
* `same`

#### .not

对之后的断言取反

```javascript
expect(foo).to.not.equal('bar');
expect(goodFn).to.not.throw(Error);
expect({ foo: 'baz'}).to.have.property('foo').and.not.equal('bar');
```

#### .deep

设置`deep`标记，然后使用`equal`和`property`断言。该标记可以让其后的断言不是比较对象本身，而是递归比较对象的键值对

```javascript
expect(foo).to.deep.equal({ bar: 'baz'});
expect({ foo: { bar: { baz: 'quux'}}}).to.have.deep.property('foo.bar.baz', 'quux');
```

`deep.property`中的特殊符号可以使用双反斜杠进行转义（第一个反斜杠是在字符串参数中对第二个反斜杠进行转义，第二个反斜杠用于在`property`中进行转义）

```javascript
var deepCss = { '.link': { '[target]': 42 } };
expect(deepCss).to.have.deep.property('\\.link.\\[target\\]', 42);
```

#### .any

在`keys`断言之前使用`any`标记（与`all`相反）

```javascript
expect(foo).to.have.any.keys('bar', 'baz');
```

#### .all

在`keys`断言之前使用`all`标记（与`any`相反）

```javascript
expect(foo).to.have.all.keys('bar', 'baz');
```

#### .a(type) / .an(type)

* `type`: `String`，被测试的值的类型

`a`和`an`断言即可作为语言链又可作为断言使用

```javascript
// 类型断言
expect('test').to.be.a('string');
expect({ foo: 'bar' }).to.be.an('object');
expect(null).to.be.a('null');
expect(undefined).to.be.an('undefined');
expect(new Error).to.be.an('error');
expect(new Promise).to.be.a('promise');
expect(new Float32Array()).to.be.a('float32array');
expect(Symbol()).to.be.a('symbol');

// es6 overrides
expect({[Symbol.toStringTag]:()=>'foo'}).to.be.a('foo');

// language chain
expect(foo).to.be.an.instanceof(Foo);
```

#### .include(value) / contains(value)

* `value`: `Object` | `String` | `Number`

`include()`和`contains()`即可作为属性类断言前缀语言链又可作为作为判断数组、字符串是否包含某值的断言使用。当作为语言链使用时，常用于`key()`断言之前

```javascript
expect([1, 2, 3]).to.include(2);
expect('foobar').to.include('bar');
expect({ foo: 'bar', hello: 'universe' }).to.include.keys('foo');
```

#### .ok

断言目标为真值。

```javascript
expect('everything').to.be.ok;
expect(1).to.be.ok;
expect(false).to.not.be.ok;
expect(null).to.not.be.ok;
```

#### .true

断言目标为`true`，注意，这里与`ok`的区别是不进行类型转换，只能为`true`才能通过断言

```javascript
expect(true).to.be.true;
expect(1).to.not.be.true;
```

#### .false

断言目标为`false`

```javascript
expect(false).to.be.false;
expect(0).to.not.be.false;
```

#### .null

断言目标为`null`

```javascript
expect(null).to.be.null;
expect(undefined).to.not.be.null;
```

#### .undefined

断言目标为`undefined`。

```javascript
expect(undefine).to.be.undefined;
expect(null).to.not.be.undefined;
```

#### .NaN

断言目标为非数字`NaN`

```javascript
expect('foo').to.be.null;
expect(4)to.not.be.null;
```

#### .exist

断言目标存在，即非`null`也非`undefined`

```javascript
const foo = 'hi',
	  bar = null,
      baz

expect(foo).to.exist;
expect(bar).to.not.exist;
expect(baz).to.not.exist;
```

#### .empty

断言目标的长度为`0`。对于数组和字符串，它检查`length`属性，对于对象，它检查可枚举属性的数量

```javascript
expect([]).to.be.empty;
expect('').to.be.empty;
expect({}).to.be.empty;
```

#### .arguments

断言目标是一个参数对象`arguments`

```javascript
function test () {
  expect(arguments).to.be.arguments;
}
```

#### .equal(value)

* `value`: `Mixed`

断言目标严格等于(`===`)`value`。另外，如果设置了`deep`标记，则断言目标深度等于`value`

```javascript
expect('hello').to.equal('hello');
expect(42).to.equal(42);
expect(1).to.not.equal(true);
expect({ foo: 'bar'}).to.not.equal({ foo: 'bar'});
expect({ foo: 'bar'}).to.deep.equal({foo: 'bar'});
```

#### .eql(value)

* `value`: `Mixed`

断言目标深度等于`value`，相当于`deep.equal(value)`的简写

```javascript
expect({ foo: 'bar' }).to.eql({ foo: 'bar' });
expect([1, 2, 3]).to.eql([1, 2, 3]);
```

#### .above(value)

* `value`: `Number`

断言目标大于（超过）`value`

```javascript
expect(10).to.be.above(5);
```

也可接在`length`后来断言一个最小的长度。相比直接提供长度的好处是提供了更详细的错误消息

```javascript
expect('foo').to.have.length.above(2);
expect([1, 2, 3]).to.have.length.above(2);
```

#### .least(value)

* `value`: `Number`

断言目标不小于（大于或等于）`value`

```javascript
expect(10).to.be.at.least(10);
```

也可接在`length`后来断言一个最小的长度。相比直接提供长度的好处是提供了更详细的错误消息

```javascript
expect('foo').to.have.length.of.at.least(3);
expect([1, 2, 3]).to.have.length.of.at.least(3);
```

#### .below(value)

* `value`: `Number`

断言目标小于`value`

```javascript
expect(5).to.be.below(10);
```

也可接在`length`后来断言一个最大的长度。相比直接提供长度的好处是提供了更详细的错误消息

```javascript
expect('foo').to.have.length.below(4);
expect([1, 2, 3]).to.have.length.below(4);
```

#### .most(value)

* `value`: `String`

断言目标不大于（小于或等于）`value`

```javascript
expect(5).to.be.at.most(5);
```

也可接在`length`后来断言一个最大的长度。相比直接提供长度的好处是提供了更详细的错误消息

```javascript
expect('foo').to.have.length.of.at.most(4);
expect([1, 2, 3]).to.have.length.of.at.most(3);
```

#### .within(start, finish)

* `start`: `Number`，下限
* `finish`: `Number`，上限

断言目标在某个区间内

```javascript
expect(7).to.be.within(5, 10);
```

也可接在`length`后来断言一个长度区间。相比直接提供长度的好处是提供了更详细的错误消息

```javascript
expect('foo').to.have.length.within(2, 4);
expect([1, 2, 3]).to.have.length.within(2, 4);
```

#### .instanceof(constructor)

* `constructor`: Constructor，构造函数

断言目标是构造函数`constructor`的一个实例

```javascript
const Tea = function (name) { this.name = name },
      Chai = new Tea('chai');

expect(Chai).to.be.an.instanceof(Tea);
expect([1, 2, 3]).to.be.an.instanceof(Array);
```

#### .property(name, [value])

* `name`: String，属性名
* `value`: Mixed，可选，属性值

断言目标是否拥有某个名为`name`的属性，可选地如果提供了`value`则该属性值还需要严格等于（`===`）`value`。如果设置了`deep`标记，则可以使用点`.`和中括号`[]`来指向对象和数组中的深层属性

```javascript
// 简单引用
const obj = { foo: 'bar' };
expect(obj).to.have.property('foo');
expect(pbj).to.have.property('foo', 'bar');

// 深层引用
const deepObj = {
	green: { tea: 'matcha' },
	teas: [ 'Chai', 'matcha', { tea: 'konacha' } ]
};

expect(deepObj).to.have.deep.property('green.tea', 'matcha');
expect(deepObj).to.have.deep.property('teas[1]', 'matcha');
expect(deepObj).to.have.deep.property('teas[2].tea', 'konacha');
```

如果目标是一个数组，还可以直接使用一个或多个数组下标作为`name`来在嵌套数组中断言`deep.property`

```javascript
var arr = [
  [ 'chai', 'matcha', 'konacha' ],
  [ { tea: 'chai' },
    { tea: 'matcha' },
    { tea: 'konacha' }
  ]
];

expect(arr).to.have.deep.property('[0][1]', 'matcha');
expect(arr).to.have.deep.property('[1][2].tea', 'konacha');
```

此外，`property`把断言的主语（subject）从原来的对象变为当前属性的值，使得可以在其后进一步衔接其它链式断言（来针对这个属性值进行测试）

```javascript
expect(obj).to.have.property('foo').that.is.a('string');
expect(deepObj).to.have.property('green').that.is.an('object').that.deep.equals({ tea: 'matcha' });
expect(deepObj).to.have.property('teas').that.is.an('array').with.deep.property('[2]').that.deep.equals({ tea: 'konacha' });
```

注意，只有当设置了`deep`标记的时候，在`property()` `name`中的点（`.`）和中括号（`[]`）才必须使用双反斜杠``进行转义（为什么是双反斜杠，在前文有提及），当没有设置`deep`标记的时候，是不能进行转义的

```javascript
// 简单指向
var css = { '.link[target]': 42 };
expect(css).to.have.property('.link[target]', 42);

//深度指向
var deepCss = { 'link': { '[target]': 42 } };
expect(deepCss).to.have.deep.property('\\.link\\.[target]', 42);
```

#### .ownProperty(name)

* `name`: `String`，属性名

断言目标拥有名为`name`的自有属性

```javascript
expect('test').to.have.ownProperty('length');
```

#### .ownPropertyDescription(name[, descriptor])

* `name`: `String`，属性名
* `descriptor`: `Object`，描述对象，可选

断言目标的某个自有属性存在描述符对象，如果给定了`descroptor`描述符对象，则该属性的描述符对象必须与其相匹配

```javascript
expect('test').to.have.ownPropertyDescriptor('length')
expect('test').to.have.ownPropertyDescriptor('length', {
  enumerable: false,
  configrable: false,
  writeable: false,
  value: 4
});

expect('test').not.to.have.ownPropertyDescriptor('length', {
  enumerable: false,
  configurable: false,
  writeable: false,
  value: 3  
});

// 将断言的主语改为了属性描述符对象
expect('test').to.have.ownPropertyDescriptor('length').to.have.property('enumerable', false);
expect('test').to.have.ownPropertyDescriptor('length').to.have.keys('value');
```

#### .length

设置`.have.length`标记作为比较`length`属性值的前缀

```javascript
expect('foo').to.have.length.above(2);
expect([1, 2, 3]).to.have.length.within(2, 4);
```

#### .lengthOf(value)

* `value`: `Number`

断言目标的`length`属性为期望的值

```javascript
expect([1, 2, 3]).to.have.lengthOf(3);
expect('foobar').to.have.lengthOf(6);
```

#### .match(regexp)

* `regexp`: `RegExp`，正则表达式

断言目标匹配到一个正则表达式

```javascript
expect('foobar').to.match(/^foo/);
```

#### .string(string)

* `string`: `String`，字符串

断言目标字符串包含另一个字符串

```javascript
expect('foobar').to.have.string('bar');
```

#### .keys(key1, [key2], [...])

* `key`: `String` | `Array` | `Object` 属性名

断言目标包含传入的属性名。与`any`，`all`，`contains`或者`have`前缀结合使用会影响测试结果: 

当与`any`结合使用时，无论是使用`have`还是使用`contains`前缀，目标必须至少存在一个传入的属性名才能通过测试。注意，`any`或者`all`应当至少使用一个，否则默认为`all`

当结合`all`和`contains`使用时，目标对象必须至少拥有全部传入的属性名，但是它也可以拥有其它属性名

当结合`all`和`have`使用时，目标对象必须且仅能拥有全部传入的属性名

```javascript
// 结合any使用
expect({ foo: 1, bar: 2, baz: 3 }).to.have.any.keys('foo', 'bar');
expect({ foo: 1, bar: 2, baz: 3 }).to.contains.any.keys('foo', 'bar');

// 结合all使用
expect({ foo: 1, bar: 2, baz: 3 }).to.have.all.keys('foo', 'bar', 'baz');
expect({ foo: 1, bar: 2, baz: 3 }).to.contains.all.keys('foo', 'bar');

// 传入string
expect({ foo: 1, bar: 2, baz: 3 }).to.have.any.keys('foo');
// 传入Array
expect({ foo: 1, bar: 2, baz: 3 }).to.have.all.keys(['foo', 'bar', 'baz']);
// 传入Object
expect({ foo: 1, bar: 2, baz: 3 }).to.have.any.keys({ bar: 2, foo: 1 });
```

#### .throw(constructor)

* `constructor`:  `Error` | `String` | `RegExp`

断言目标函数会抛出一个指定错误或错误类型（使用`instanceOf`计算），也可使用正则表达式或者字符串来检测错误消息

```javascript
var err = new RefernceError('this is a bad function');
var fn = function () { throw err };

expect(fn).to.throw(ReferenceError);
expect(fn).to.throw(Error);
expect(fn).to.throw(/bad function/);
expect(fn).to.not.throw('good function');
expect(fn).to.throw(ReferrenceError, /bad function/);
expect(fn).to.throw(err);
```

注意，当一个抛错断言被否定了（前面有`.not`），那么它会从Error构造函数开始依次检查各个可能传入的参数。检查一个只是消息类型不匹配但是已知的错误，合理的方式是先断言该错误存在，然后使用`.and`后断言错误消息不匹配

```
expect(fn).to.throw(ReferenceError)
  .and.not.throw(/good function/)
```

#### .respondTo(method)

* `method`: `String`

断言目标类或对象会响应一个方法（存在这个方法）

```javascript
Klass.prototype.bar = function () {};
expect(Klass).to.respondTo('bar');
expect(obj).to.respondTo('bar');
```

如果需要检查一个构造函数是否会响应一个静态方法（挂载在构造函数本身的方法），请查看`itself`标记

```javascript
Klass.baz = function () {};
expect(Klass).itself.to.respondTo('baz');
```

#### .itself

设置`itself`标记，然后使用`respondTo`断言

```javascript
function Foo () {};
Foo.bar = function () {};
Foo.prototype.baz = function () {};

expect(Foo).itself.to.respondTo('bar');
expect(Foo).itself.not.to.respond('baz');
```

#### .satisfy(method)

* `method`: `Function`，测试器，接受一个参数表示目标值，返回一个布尔值

断言目标值能够让给定的测试器返回真值

```javascript
expect(1).to.satisfy(function (num) { return num > 0 });
```

#### .closeTo(expected, delta)

* `expect`: `Numbre`，期望值
* `delta`: `Numbre`，范围半径

断言目标数字等于`expected`，或在期望值的+/-`delta`范围内

```javascript
expect(1.5).to.be.closeTo(1, 0.5);
```

#### .members(set)

* `set`: `Array`

断言目标是`set`的超集，或前者有后者所有严格相等（`===`）的成员。另外，如果设置了`deep`标记，则成员进行深度比较（`include`/`contains`只能接受单个值，但它们的主语除了是数组，还可以判断字符串；`members`则将它们的能力扩展为能够接受一个数组，但主语只能是数组）

```javascript
expect([1, 2, 3]).to.include.members([3, 2]);
expect([1, 2, 3]).to.not.include.members([3, 2, 8]);

expect([4, 2]).to.have.members([2, 4]);
expect([5, 2]).to.not.have.members([5, 2, 1]);

expect([{ id: 1 }]).to.deep.include.members([{ id: 1 }]);
```

#### .oneOf(list)

* `list`: `Array`

断言目标值出现在`list`数组的某个顶层位置（直接子元素，严格相等）

```javascript
expect('a').to.be.oneOf(['a', 'b', 'c']);
expect(9).to.not.be.oneOf(['z']);

// 严格相等，所以对象类的值必须为同一个引用才能被判定为相等
var three = [3];
expect([3]).to.not.be.oneOf([1, 2, [3]]);
expect(three).to.not.be.oneOf([1, 2, [3]]);
expect(three).to.be.oneOf([1, 2, three]);
```

#### change(object, property)

* `object`: `Object`，对象
* `property`: `String`，属性名

断言目标方法会改变指定对象的指定属性

```javascript
var obj = { val: 10 };
var fn = function () { obj.val += 3 };
var noChangeFn = function () { return 'bar' + 'baz' };

expect(fn).to.change(obj, 'val');
```

#### .increase(object, property)

* `object`: `Object`，对象
* `property`: `String`，属性名

断言目标方法会增加指定对象的属性

```javascript
var obj = { val: 10 };
var fn = function () { obj.val = 15 };
expect(fn).to.increase(obj, val);
```

#### .decrease(object, property)

* `object`: `Object`，对象
* `property`: `String`，属性名

断言目标方法会减少指定对象的属性

```javascript
var obj = { val: 10 };
var fn = function () { obj.val = 5 };
expect(fn).to.decrease(obj, val);
```

#### .extensible

断言目标对象是可扩展的（可以添加新的属性）

```javascript
var nonExtensibleObject = Object.preventExtensions({});
var sealedObject = Object.seal({});
var frozenObject = Object.freeze({});

expect({}).to.be.extensible;
expect(nonExtensibleObject).to.not.be.extensible;
expect(sealObject).to.not.be.extensible;
expect(frozenObject).to.not.be.extensible;
```

#### .sealed

断言目标对象是封闭的（无法添加新的属性并且存在的属性不能被删除但可以被修改）

```javascript
var sealedObject= Object.seal({});
var frozenObject = Object.freeze({});

expect(sealedObject).to.be.sealed;
expect(frozenObject).to.be.sealed;
expect({}).to.not.be.sealed;
```

#### .frozen

断言目标对象是冻结的（无法添加新的属性并且存在的属性不能被删除和修改）

```javascript
var frozenObject = Object.freeze({});

expect(frozenObject).to.be.frozen;
expect({}).to.not.be.frozen;
```

### TDD

除了一些语法糖以外，Chai提供的`assert`风格的断言和 node.js 包含的 assert 模块非常相似。`assert`风格是三种断言风格中唯一不支持链式调用的。
