#!/usr/bin/env node

'use strict';

// 导入lodash库
let _ = require('lodash');
let assert = require('assert');

/**
 * 数组操作
 */
(function () {
    // 分割数组
    // _.chunk(array, size) -> array
    assert.deepEqual(_.chunk([1, 2, 3, 4], 2), [[1, 2], [3, 4]]);

    // 移除所有表示'false'的元素
    // _.compact(array) -> array
    assert.deepEqual(_.compact([1, 0, 'a', false, {}, null]), [1, 'a', {}]);

    // 找出a, b两个数组之间的差集(在a数组中且不在b数组中的集合)
    // _.difference(array1, array2) -> array
    assert.deepEqual(_.difference([1, 2, 3, 4], [3, 4, 5]), [1, 2]);

    // 找出若干数组之间的交集
    // _.intersection(...arrays) -> array
    assert.deepEqual(_.intersection([1, 2, 3], [1, 3, 4], [2, 3, 4]), [3]);

    // 删除指定个数的元素
    // _.drop(array1, size) -> array
    // _.dropRight(array1, size) -> array
    assert.deepEqual(_.drop([1, 2, 3, 4], 2), [3, 4]);
    assert.deepEqual(_.dropRight([1, 2, 3, 4], 2), [1, 2]);

    // 删除所有符合条件的元素, 遇到第一个不符合条件的元素为止
    // _.dropWhile(array1, size) -> array
    // _.dropRightWhile(array1, size) -> array
    assert.deepEqual(_.dropWhile([1, 3, 5, 2, 3, 1], n => n % 2 !== 0), [2, 3, 1]);
    assert.deepEqual(_.dropRightWhile([1, 3, 5, 2, 3, 1], n => n % 2 !== 0), [1, 3, 5, 2]);

    // 删除所有指定元素(从数组中删除所有的2, 3元素)
    // _.pull(array, element1, element2, ...) -> array
    assert.deepEqual(_.pull([1, 2, 3, 1, 2, 3], 2, 3), [1, 1]);

    // 删除数组中所有指定位置的元素
    // _.pullAt(array, pos1, pos2, ...) -> array
    let array = [1, 2, 3, 4];
    assert.deepEqual(_.pullAt(array, 1, 2), [2, 3]);
    assert.deepEqual(array, [1, 4]);


    // 按条件删除元素
    let dataToRemove = [
        {'user': 'barney', 'age': 30, 'active': false},
        {'user': 'fred', 'age': 40, 'active': false},
        {'user': 'pebbles', 'age': 50, 'active': true}
    ];

    // 删除指定元素
    // _.remove(array, property/object)
    // _.remove(array, function)
    assert.deepEqual(_.remove(dataToRemove, {'age': 50}), [{'user': 'pebbles', 'age': 50, 'active': true}]);
    // 被删除元素后的集合
    assert.deepEqual(dataToRemove, [
        {user: 'barney', age: 30, active: false},
        {user: 'fred', age: 40, active: false}
    ]);

    // 删除指定元素
    // assert.deepEqual(_.remove(dataToRemove, 'user', 'fred'), [{user: 'fred', age: 40, active: false}]);
    // 被删除元素后的集合
    // assert.deepEqual(dataToRemove, [{user: 'barney', age: 30, active: false}]);

    // 删除指定元素
    // assert.deepEqual(_.remove(dataToRemove, elem => elem.age < 40), [{user: 'barney', age: 30, active: false}]);
    // // 被删除元素后的集合
    // assert.deepEqual(dataToRemove, []);


    // 填充元素到数组
    // _.fill(array, elem[, start = 0, end = array.length])
    assert.deepEqual(_.fill([0, 0, 0], '*', 1, 3), [0, '*', '*']);


    // 查找元素
    // _.indexOf(array, index)
    // _.lastIndexOf(array, index)
    assert.equal(_.indexOf([1, 2, 3, 2, 1], 2), 1);
    assert.equal(_.lastIndexOf([1, 2, 3, 2, 1], 2), 3);


    // 获取数组第一个元素
    assert.equal(_.first([1, 2, 3, 4]), 1);
    assert.equal(_.head([1, 2, 3, 4]), 1);  // 别名

    // 获取数组最后一个元素
    assert.equal(_.last([1, 2, 3, 4]), 4);

    // 展开子数组
    assert.deepEqual(_.flatten([1, [2, [3, 4]]]), [1, 2, [3, 4]]);
    assert.deepEqual(_.flattenDeep([1, [2, [3, 4]]]), [1, 2, 3, 4]);  // 深度展开


    // 获取前n项（n = array.length - 1）
    assert.deepEqual(_.initial([1, 2, 3, 4]), [1, 2, 3]);

    // 获取后n项（n = array.length - 1
    assert.deepEqual(_.tail([1, 2, 3, 4]), [2, 3, 4]);   // 别名

    // 获取数组子集'_.slice(array[, start = 0, end = array.length])'
    assert.deepEqual(_.slice([1, 2, 3, 4], 1, 3), [2, 3]);

    // 获取数组前n项
    assert.deepEqual(_.take([1, 2, 3, 4], 3), [1, 2, 3]);

    // 获取数组后n项
    assert.deepEqual(_.takeRight([1, 2, 3, 4], 3), [2, 3, 4]);

    const DATA_TO_TAKE = [
        {'user': 'barney', 'age': 30, 'active': false},
        {'user': 'fred', 'age': 40, 'active': false},
        {'user': 'pebbles', 'age': 50, 'active': true}
    ];

    // 根据条件获取数组前n项
    assert.deepEqual(_.takeWhile(DATA_TO_TAKE, elem => elem.age <= 40), [
        {user: 'barney', age: 30, active: false},
        {user: 'fred', age: 40, active: false}
    ]);
    assert.deepEqual(_.takeWhile(DATA_TO_TAKE, {'age': 30}), [{user: 'barney', age: 30, active: false}]);

    // 根据条件获取数组后n项
    assert.deepEqual(_.takeRightWhile(DATA_TO_TAKE, elem => elem.age >= 40), [
        {'user': 'fred', 'age': 40, 'active': false},
        {'user': 'pebbles', 'age': 50, 'active': true}
    ]);
    assert.deepEqual(_.takeRightWhile(DATA_TO_TAKE, {'age': 50}), [{'user': 'pebbles', 'age': 50, 'active': true}]);

    // 合并数组
    assert.deepEqual(_.union([1, 2], [2, 3], [3, 4]), [1, 2, 3, 4]);

    // 过滤重复
    assert.deepEqual(_.uniq([1, 1, 2, 1]), [1, 2]);
    // 对排序数组过滤重复
    assert.deepEqual(_.sortedUniq([1, 1, 2, 1], true), [1, 2, 1]);
    assert.deepEqual(_.uniq([1, 1, 2, 1].sort((a, b) => a - b), true), [1, 2]);

    const DATA_TO_UNIQUE = [
        {'user': 'barney', 'age': 30, 'active': false},
        {'user': 'fred', 'age': 40, 'active': false},
        {'user': 'pebbles', 'age': 50, 'active': true}
    ];
    // 根据'active'属性对数组元素过滤重复
    assert.deepEqual(_.uniqBy(DATA_TO_UNIQUE, 'active'), [
        {user: 'barney', age: 30, active: false},
        {user: 'pebbles', age: 50, active: true}
    ]);
    // 根据指定条件对数组元素过滤重复
    assert.deepEqual(_.uniqBy(DATA_TO_UNIQUE, elem => elem.age < 50), [
        {user: 'barney', age: 30, active: false},
        {user: 'pebbles', age: 50, active: true}
    ]);


    // 对数组元素重新分组, 要求各个数组元素数量一致
    assert.deepEqual(_.zip(['alvin', 'lucy'], [30, 40], [true, false]), [['alvin', 30, true], ['lucy', 40, false]]);
    assert.deepEqual(_.zipWith([1, 2], [3, 4], [5, 6], (a, b, c) => {
        return a + b + c;
    }), [9, 12]);

    // 将数组组合为对象
    assert.deepEqual(_.zipObject(['fred', 'barney'], [30, 40]), {'fred': 30, 'barney': 40});

    assert.deepEqual(_.unzip([['alvin', 30, true], ['lucy', 40, false]]), [['alvin', 'lucy'], [30, 40], [true, false]]);
    assert.deepEqual(_.unzipWith([[1, 2, 3], [4, 5, 6]], (a, b) => {
        return b + a;
    }), [5, 7, 9]);


    // 从数组中去除指定元素
    assert.deepEqual(_.without([1, 2, 3, 4], 1, 2), [3, 4]);
})();


/**
 * 集合操作
 */
(function () {
    // 将集合元素映射为其它值
    assert.deepEqual(_.at([1, 2, 3, 4], 2, 3), [3, 4]);
    assert.deepEqual(_.at([1, 2, 3, 4], [2, 3]), [3, 4]);

    // 判断集合内所有元素是否都符合条件
    assert.ok(_.every([1, 2, 3, 4], elem => elem < 5));

    // 判断集合内是否有任意符合条件的元素
    assert.ok(_.each([1, 2, 3, 4], elem => elem == 2));

    // 将集合元素映射为其它值
    assert.deepEqual(_.map([1, 2, 3, 4], elem => elem * 2), [2, 4, 6, 8]);

    // 计算符合条件的元素个数
    assert.deepEqual(_.countBy([4.3, 6.1, 6.4], n => Math.floor(n)), {'4': 1, '6': 2});

    // 过滤数组中符合指定属性值的元素
    const DATA_TO_WHERE = [
        {'user': 'barney', 'age': 30, 'active': false},
        {'user': 'fred', 'age': 40, 'active': false},
        {'user': 'pebbles', 'age': 50, 'active': true}
    ];
    assert.deepEqual(_.filter(DATA_TO_WHERE, {'age': 50}), [{user: 'pebbles', age: 50, active: true}]);

    // 按指定属性值排序
    const DATA_TO_SORT = [
        {'user': 'barney', 'age': 30, 'active': false},
        {'user': 'fred', 'age': 40, 'active': false},
        {'user': 'pebbles', 'age': 50, 'active': true}
    ];
    assert.deepEqual(_.map(_.sortBy(DATA_TO_SORT, 'age'), 'user'), ['barney', 'fred', 'pebbles']);
    assert.deepEqual(_.map(_.sortBy(DATA_TO_SORT, (a) => a.age), 'user'), ['barney', 'fred', 'pebbles']);

    // 求集合大小
    // _.size(array/object(map)/string)
    assert.equal(_.size([1, 2, 3]), 3);
    assert.equal(_.size({'a': 1, 'b': 2}), 2);
    assert.equal(_.size('abc'), 3);


    // 随机打乱集合元素
    assert.notDeepEqual(_.shuffle([1, 2, 3, 4]), [1, 2, 3, 4]);

    // 过滤元素
    // _.select(array, object/string/function) -> array
    const DATA_TO_SELECT = [
        {'user': 'barney', 'age': 30, 'active': false},
        {'user': 'fred', 'age': 40, 'active': false},
        {'user': 'pebbles', 'age': 50, 'active': true}
    ];
    assert.deepEqual(_.map(_.filter(DATA_TO_SELECT, n => n.age < 50), 'user'), ['barney', 'fred']);
    assert.deepEqual(_.map(_.filter(DATA_TO_SELECT, {'age': 40}), 'user'), ['fred']);

    // 随机获取指定个数的数组元素
    // _.sample(array, count) -> array
    let sub = _.sortBy(_.sample([1, 2, 3, 4], 2), (a, b) => a - b);
    assert.deepEqual(_.intersection([1, 2, 3, 4], sub), sub);


    // 查找和指定属性匹配的元素
    // _.find(array, array/object/function)
    // _.findLast(array, array/object/function)
    // _.findWhere(array, object)
    const DATA_TO_FIND = [
        {'user': 'barney', 'age': 30, 'active': false},
        {'user': 'fred', 'age': 40, 'active': false},
        {'user': 'pebbles', 'age': 50, 'active': true}
    ];

    assert.deepEqual(_.find(DATA_TO_FIND, {'user': 'barney', 'age': 30, 'active': false}).user, 'barney');
    assert.deepEqual(_.find(DATA_TO_FIND, {'age': 40}).user, 'fred');
    assert.deepEqual(_.find(DATA_TO_FIND, 'active', true).user, 'pebbles');
    assert.deepEqual(_.find(DATA_TO_FIND, elem => elem.age < 50).user, 'barney');
    assert.deepEqual(_.find(DATA_TO_FIND, elem => elem.age < 50 && elem.active), undefined);
    assert.deepEqual(_.findLast(DATA_TO_FIND, elem => elem.age < 50).user, 'fred');

    // 查找和指定属性匹配的元素在数组中的位置
    // _.findIndex(array, array/object/function)
    // _.findLastIndex(array, array/object/function)
    assert.deepEqual(_.findIndex(DATA_TO_FIND, {'user': 'fred'}), 1);
    assert.deepEqual(_.findIndex(DATA_TO_FIND, elem => elem.age < 50), 0);
    assert.deepEqual(_.findIndex(DATA_TO_FIND, elem => elem.age < 50 && elem.active), -1);
    assert.deepEqual(_.findLastIndex(DATA_TO_FIND, elem => elem.age < 50), 1);


    // 元素分组
    // _.groupBy(array, property/function) -> array
    assert.deepEqual(_.groupBy(['one', 'two', 'three'], 'length'), {'3': ['one', 'two'], '5': ['three']});
    assert.deepEqual(_.groupBy([4.2, 6.1, 6.4], n => Math.floor(n)), {'4': [4.2], '6': [6.1, 6.4]});

    // 根据条件将元素分组
    // _.partition(array, property/object/function)
    assert.deepEqual(_.partition([1.2, 2.3, 3.4], n => Math.floor(n) % 2), [[1.2, 3.4], [2.3]]);
    assert.deepEqual(_.partition([{'a': 1, 'b': 2}, {'a': 1, 'b': 3}, {'a': 2, 'b': 3}], {'a': 1}),
        [[{a: 1, b: 2}, {a: 1, b: 3}], [{a: 2, b: 3}]]);

    // 获取和指定属性不匹配的元素
    // _.reject(array, property/function)
    assert.deepEqual(_.reject([{'a': 1, 'b': 2}, {'a': 1, 'b': 3}, {'a': 2, 'b': 3}], {'a': 1}), [{a: 2, b: 3}]);
    assert.deepEqual(_.reject([{'a': 1, 'b': 2}, {'a': 1, 'b': 3}, {'a': 2, 'b': 3}], n => n.b == 3),
        [{a: 1, b: 2}]);


    // 遍历集合
    // _.each(array, function)
    // _.eachRight(array, function)
    let array = [];
    _.each([1, 2, 3], (n, index) => {
        let o = {};
        o[index] = n;
        array.push(o)
    });
    assert.deepEqual(array, [{'0': 1}, {'1': 2}, {'2': 3}]);

    array = [];
    _.eachRight([1, 2, 3], (n, index) => {
        let o = {};
        o[index] = n;
        array.push(o);
    });
    assert.deepEqual(array, [{'2': 3}, {'1': 2}, {'0': 1}]);


    // 计算总和
    // _.reduce(array, function, initial_value) -> object
    assert.equal(_.reduce([{'a': 1}, {'a': 2}, {'a': 3}], (total, n, index) => total + n.a, 0), 6);

})();


/**
 * 测试'chain'链式操作
 */
(function () {
    let array = _([1, 2, 3, 4])
        .filter(n => n % 2 == 0)
        .map(n => n * 2)
        .value();
    assert.deepEqual(array, [4, 8]);

    let total = _([1, 2, 3, 4])
        .filter(n => n % 2 == 0)
        .map(n => n * 2)
        .reduce((total, n, index) => total + n, 0);
    assert.deepEqual(total, 12);

    let exist = _([1, 2, 3, 4])
        .filter(n => n > 3)
        .every(n => n % 2 == 0);
    assert.ok(exist);

    let obj = _([1, 2, 3, 4])
        .chunk(2)
        .value();
    assert.deepEqual(obj, [[1, 2], [3, 4]]);

})();


/**
 * Object操作
 */
(function () {

    // 合并对象, 将多个对象的不同属性进行合并
    // _.assign(object1[, sources, function, thisArg]) -> object
    // _.defaults(object[, sources])
    // _.defaultsDeep(object[, sources])

    // 合并对象属性, 相同属性以最后一个对象的为准
    assert.deepEqual(_.assign({'user': 'barney'}, {'age': 40}, {'user': 'fred'}), {'user': 'fred', 'age': 40});

    // 利用回调函数指定属性合并的策略
    assert.deepEqual(_.assign(
        {'user': 'barney'},
        {'age': 36},
        {'user': 'fred'},
        (value, other) => _.isUndefined(value) ? other : value
    ), {user: 'fred', age: 36});

    // 合并对象属性, 相同属性以第一个对象属性为准
    assert.deepEqual(_.defaults({'user': 'barney'}, {'age': 36}, {'user': 'fred'}), {'user': 'barney', 'age': 36});

    // 深度合并对象, 递归合并对象属性中包含的属性
    assert.deepEqual(_.defaultsDeep(
        {'user': {'name': 'barney'}},
        {'user': {'name': 'fred', 'age': 36}}
    ), {'user': {'name': 'barney', 'age': 36}});


    // 指定的子类继承超类
    // _.create(prototype[, properties]) -> Class

    // 创建超类
    function Base(a, b) {
        // 超类成员属性
        this.a = a;
        this.b = b;

        // 超类成员方法
        this.add = function () {
            return `${this.a}+${this.b}=${this.a + this.b}`
        };
    }

    // 超类原型方法
    Base.prototype.showMe = function () {
        return `a=${this.a}, b=${this.b}`;
    };

    // 定义子类
    function Child() {
        Base.apply(this, arguments);
    }

    // 子类继承超类
    Child.prototype = _.create(Base.prototype, {
        'constructor': Child,   // 定义子类构造器
        'sub': function () {    // 定义子类方法
            return `${this.a}-${this.b}=${this.a - this.b}`;
        }
    });

    let base = new Base(10, 20);
    let child = new Child(10, 20);
    assert.equal(base.add(), child.add());
    assert.equal(base.showMe(), child.showMe());
    assert.equal(child.sub(), '10-20=-10');


    // 查找指定对象的属性名
    // _.findKey(object[, predicate=_.identity, thisArg]) -> string
    let users = {
        'barney': {'age': 36, 'active': true},
        'fred': {'age': 40, 'active': false},
        'pebbles': {'age': 1, 'active': true}
    };

    // 通过回调函数设置的条件查找属性名
    assert.equal(_.findKey(users, chr => chr.age < 40), 'barney');
    // 通过指定的对象匹配与之相符的属性名
    assert.equal(_.findKey(users, {'age': 1, 'active': true}), 'pebbles');
    // 通过指定的属性和值匹配与之相符的属性名
    assert.equal(_.findKey(users, {'active': false}), 'fred');
    // 通过指定的属性名匹配与之相符的属性名
    assert.equal(_.findKey(users, 'active'), 'barney');
    // 如果能匹配多个属性名, 则找到最后一个
    assert.equal(_.findLastKey(users, 'active'), 'pebbles');


    // 遍历对象所有属性
    // _.forIn(object[, iteratee=_.identity], [thisArg]) -> void
    // _.forOwn(object[, iteratee=_.identity], [thisArg]) -> void

    // 定义类
    function Foo() {
        this.a = 1; // 定义类属性
        this.b = 2;
    }

    // 定义原型属性
    Foo.prototype.c = 3;

    let actual = [];
    // 遍历对象的全部属性, 包括'this'上的属性和'prototype'上的属性
    _.forIn(new Foo(), (key, value) => actual.push([key, value]));
    assert.deepEqual(actual, [[1, 'a'], [2, 'b'], [3, 'c']]);

    actual = [];
    _.forInRight(new Foo(), (key, value) => actual.push([key, value]));
    assert.deepEqual(actual, [[3, 'c'], [2, 'b'], [1, 'a']]);

    actual = [];
    // 遍历对象的全部属性, 只包括'this'上的属性
    _.forOwn(new Foo(), (key, value) => actual.push([key, value]));
    assert.deepEqual(actual, [[1, 'a'], [2, 'b']]);

    actual = [];
    _.forOwnRight(new Foo(), (key, value) => actual.push([key, value]));
    assert.deepEqual(actual, [[2, 'b'], [1, 'a']]);


    // 获取对象的所有原型方法
    // _.functions(object) -> array
    Foo.prototype.add = function () {
        return this.a + this.b;
    };

    let foo = new Foo();

    // 定义非原型方法
    foo.sub = function () {
        return this.a - this.b;
    };

    // 获取一个对象上定义的所有原型方法, 非原型方法不计入
    assert.deepEqual(_.functions(foo), ['sub']);


    // 根据属性路径获取对象属性的值
    // _.get(object, path[, defaultValue])
    let object = {'a': [{'b': {'c': 3}}]};

    // 根据字符串描述的路径获取指定值
    assert.ok(_.has(object, 'a[0].b.c'));
    assert.equal(_.get(object, 'a[0].b.c'), 3);
    assert.ok(_.has(object, 'a.0.b.c'));
    assert.equal(_.get(object, 'a.0.b.c'), 3);
    // 根据数组描述的路径获取指定值
    assert.ok(_.has(object, ['a', '0', 'b', 'c']));
    assert.equal(_.get(object, ['a', '0', 'b', 'c']), 3);
    // 指定获取失败后的默认值
    assert.ifError(_.has(object, 'a.b.c'));
    assert.equal(_.get(object, 'a.b.c', 'nothing'), 'nothing');


    // 将对象的属性和值翻转, 值为属性名, 属性名为值
    // _.invert(object[, multiValue])
    assert.deepEqual(_.invert({'a': 1, 'b': 2, 'c': 1}), {'1': 'c', '2': 'b'});

    // 获取对象'this'上定义的所有属性名
    // _.keys(object) -> array
    // _.keysIn(object) -> array

    // 获取Foo对象的所有属性, 不包括'prototype'定义的属性
    assert.deepEqual(_.keys(new Foo()), ['a', 'b']);

    // 获取Foo对象的所有属性, 包括'prototype'定义的属性
    assert.deepEqual(_.keysIn(new Foo()), ['a', 'b', 'c', 'add']);

    // 获取数组对象的属性
    assert.deepEqual(_.keys([1, 2]), [0, 1]);


    // 改变对象属性名和属性值
    // _.mapKeys(object[, iteratee=_.identity, thisArg]) -> object
    // _.mapKeys(object[, iteratee=_.identity, thisArg]) -> object

    // 改变对象属性名
    assert.deepEqual(_.mapKeys({'a': 1, 'b': 2}, (value, key) => key + '-' + value), {'a-1': 1, 'b-2': 2});
    assert.deepEqual(_.mapValues({'a': 1, 'b': 2}, (value, key) => key + '-' + value), {'a': 'a-1', 'b': 'b-2'});


    // 合并对象相同属性名的属性值, 参考'_.assign(...)'方法
    // _.merge(object[, sources, customizer, thisArg]) -> object

    let left = {a: 11, b: 12};
    let right = {a: 21, c: 23};
    // 合并两个对象, 同名属性被覆盖, 不同属性被合并
    assert.deepEqual(_.merge(left, right), {a: 21, b: 12, c: 23});

    left = [11, 12];
    right = [21, 22];
    // 合并两个数组, 相同的数组项被覆盖
    assert.deepEqual(_.merge(left, right), [21, 22]);

    left = {'data': [{'user': 'barney'}, {'user': 'fred'}]};
    right = {'data': [{'age': 36}, {'age': 40}]};
    // 深度和并对象
    assert.deepEqual(_.merge(left, right), {data: [{user: 'barney', age: 36}, {user: 'fred', age: 40}]});

    left = {'fruits': ['apple'], 'vegetables': ['beet']};
    right = {'fruits': ['banana'], 'vegetables': ['carrot']};
    // 自定义合并规则
    assert.deepEqual(_.mergeWith(left, right, (a, b) => a.concat(b)),
        {fruits: ['apple', 'banana'], vegetables: ['beet', 'carrot']});


    // 排除对象指定属性
    // _.omit(object[, predicate, thisArg]) -> object

    // 根据属性名排除对象属性
    assert.deepEqual(_.omit({'user': 'fred', 'age': 40}, 'age'), {'user': 'fred'});

    // 根据指定的条件排除对象属性
    assert.deepEqual(_.omitBy({'user': 'fred', 'age': 40},
        (value, key) => key === 'user' && typeof value === 'string'), {'age': 40});


    // 保留对象指定属性
    // _.pick(object[, predicate, thisArg]) -> object

    // 根据属性名保留对象属性
    assert.deepEqual(_.pick({'user': 'fred', 'age': 40}, 'age'), {'age': 40});

    // 根据指定的条件保留对象属性
    assert.deepEqual(_.pickBy({'user': 'fred', 'age': 40},
        (value, key) => key === 'user' && typeof value === 'string'), {'user': 'fred'});


    // 获取指定的对象属性, 返回'{'属性名': 值}'
    // _.pick(object[, predicate, thisArg]) -> object
    object = {'user': 'fred', 'age': 40};

    // 获取名为'user'的属性
    assert.deepEqual(_.pick(object, 'user'), {'user': 'fred'});
    // 获取类型为'number'的属性
    assert.deepEqual(_.pickBy(object, (value, key) => _.isNumber(value)), {'age': 40});


    // 获取对象指定名称的属性值
    // _.result(object, path[, defaultValue]) -> object
    object = {'a': 'hello', 'b': [1, 2, {'c': 'ok', d: false}]};

    // 获取'a'名称的属性值
    assert.equal(_.result(object, 'a'), 'hello');
    // 获取'b'数组第2项的值
    assert.equal(_.result(object, 'b[1]'), 2);
    // 获取'b'数组第3项的'c'属性值
    assert.equal(_.result(object, 'b.2.c'), 'ok');
    // 获取失败后返回默认值
    assert.equal(_.result(object, 'b.c', 'nothing'), 'nothing');


    // 设置对象指定名称的属性值
    // _.result(object, path[, defaultValue]) -> object
    object = {'a': 'hello', 'b': [1, 2, {'c': 'ok', d: false}]};

    // 设置'a'名称的属性值
    assert.deepEqual(_.set(object, 'a', 'welcome'), {a: 'welcome', b: [1, 2, {c: 'ok', d: false}]});
    assert.equal(object.a, 'welcome');
    // 设置'b'数组第2项的值
    assert.deepEqual(_.set(object, 'b[1]', 100), {a: 'welcome', b: [1, 100, {c: 'ok', d: false}]});
    assert.equal(object.b[1], 100);
    // 获取'b'数组第3项的'c'属性值
    assert.deepEqual(_.set(object, 'b.2.d', true), {a: 'welcome', b: [1, 100, {c: 'ok', d: true}]});
    assert.equal(object.b[2].d, true);


    // 根据指定规则转换指定对象的值
    // _.transform(object[, iteratee=_.identity, accumulator, thisArg]) -> object

    // 转换数组元素
    assert.deepEqual(_.transform([1, 2, 3], (result, value, key) => result[key] = value * 100), [100, 200, 300]);
    // 转换对象的属性值
    assert.deepEqual(_.transform({'a': 'Hello', 'b': 'OK'},
        (result, value, key) => result[key] = value.substr(0, 1)), {a: 'H', b: 'O'});
    // 回调函数返回false表示停止转换
    assert.deepEqual(_.transform({'a': 'Hello', 'b': 'OK'},
        (result, value, key) => {
            result[key] = value.substr(0, 1);
            return false;
        }), {a: 'H'});


    // 获取对象所有属性值
    // _.values(object) -> array    获取定义在对象上的属性值
    // _.valuesIn(object) -> array  获取定义在对象上以及对象原型上的属性值

    // 获取数组的所有元素值（和原数组相同）
    assert.deepEqual(_.values([1, 2, 3]), [1, 2, 3]);

    // 转换对象的属性值
    function Value() {
        this.a = 10;
        this.b = 20;
    }

    Value.prototype.c = 30;

    assert.deepEqual(_.values(new Value()), [10, 20]);
    assert.deepEqual(_.valuesIn(new Value()), [10, 20, 30]);

})();


/**
 * Function操作
 */
(function () {

    // 将指定方法的某些参数固定, 对于不想固定的参数, 可以通过'_'占位符忽略
    // _.partialRight(function, arg1, arg2, ...) -> function
    function add(a, b) {
        return [a, '+', b, '=', a + b].join('');
    }

    // 将add函数的第二个参数固定
    let func = _.partialRight(add, 10);
    assert.equal(func(20), '20+10=30');

    // 将add函数的第一个参数固定
    func = _.partialRight(add, 10, _);
    assert.equal(func(20), '10+20=30');

    // 将add函数的两个参数均固定
    func = _.partialRight(add, 10, 20);
    assert.equal(func(), '10+20=30');


    // 定义在调用指定函数前(后)调用的函数
    // _.before(n, func) -> function
    // _.after(n, func) -> function

    function makeArray(length) {
        let array = [];
        for (let i = 0; i < length; i++) {
            array.push({'a': false, 'b': false});
        }
        return array;
    }

    let array = makeArray(5);

    // 产生一个回调函数的代理, 该代理函数只允许调用2次, 从第3次开始调用无效
    func = _.before(3, (array, n) => array[n].b = true);
    // 调用5次函数
    _.each(array, (value, n) => {
        value.a = true;
        func(array, n);
    });
    // 确认只有前两次调用有效
    assert.deepEqual(array, [
        {a: true, b: true},
        {a: true, b: true},
        {a: true, b: false},
        {a: true, b: false},
        {a: true, b: false}
    ]);


    array = makeArray(5);

    // 产生一个回调函数的代理, 该代理函数只允许调用3次, 但前两次调用无效, 从第3次开始调用有效
    func = _.after(3, (array, n) => array[n].b = true);
    // 调用5次函数
    _.each(array, (value, n) => {
        value.a = true;
        func(array, n);
    });
    // 确认只有后三次调用有效
    assert.deepEqual(array, [
        {a: true, b: false},
        {a: true, b: false},
        {a: true, b: true},
        {a: true, b: true},
        {a: true, b: true}
    ]);


    // 绑定指定函数, 赋予函数新的'this'引用以及固定函数的某些参数
    // _.bind(func, thisArg[, partials]) -> function

    // 定义回调函数
    function addMax(a, b) {
        let max = Math.max(a, b);
        this.value += max;
        return max;
    }

    // 定义存储结果的对象
    var total = {value: 0};

    // 绑定函数, 获取指定函数的代理函数, 并设置该函数的this引用
    func = _.bind(addMax, total);
    // 调用代理函数, 确认其行为和被代理函数一致
    assert.equal(func(1, 2), 2);
    // 确认函数内部确实将this引用到了指定对象
    assert.equal(total.value, 2);

    // 绑定函数并指定缺省参数, 无需缺省的参数用'_'占位
    func = _.bind(addMax, total, _, 20);
    assert.equal(func(10), 20);
    assert.equal(total.value, 22);

})();
