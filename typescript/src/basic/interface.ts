import {Gender} from "./types";

/**
 * 基本接口：接口中包含三个属性，实现该接口只需目标对象同样包含该三个属性即可.
 *
 * 例如：
 *  const person1: Person = {
 *      name: 'Alvin',
 *      birthday: new Date('1981-03-17'),
 *      gender: Gender.MALE
 *  };
 */
export interface Person {
    name: string;
    // @ts-ignore
    birthday: Date;
    gender: Gender;
}

export function personCompare(p1: Person, p2: Person): boolean {
    return p1.name === p2.name &&
        p1.birthday.getTime() === p2.birthday.getTime() &&
        p1.gender === p2.gender;
}

/**
 * 函数类型接口, 该接口必须对应一个签名相符的函数.
 *
 * 例如:
 * const runner: Runnable = name => `${name} is running`;
 */
export interface Runnable {
    (name: string): string;
}

/**
 * 接口中包含其它接口类型，实现时要同时实现接口中的接口类型.
 *
 * 例如:
 * const executor: Executor = {
 *      scope: 'RUNTIME',
 *      run(name) {
 *          return `${name} is running at ${this.SCOPE}`;
 *      }
 * }
 *
 *
 * 接口中包含可选属性(或函数).
 * 对于可选项，实现时可以忽略，值自动为'undefined'
 */
export interface Executor {
    scope?: string,
    run: Runnable
}

/**
 * 接口中包含函数, 在接口中可以包含函数签名，实现接口时同时给予签名正确的函数.
 *
 * 例如:
 * const size: Size = {
 *      width: 100,
 *      height: 200,
 *      area() {
 *          return this.width * this.height;
 *      }
 * };
 *
 *
 * 只读项, 接口的只读项在接口实现对象中只能初始化一次，之后不能再被赋值.
 */
export interface Size {
    width: number;
    readonly height: number;

    area(): number;
}

/**
 * 包含索引属性的接口, 必须被实现为一个数组或一个dict.
 * 接口中其它属性类型必须和索引属性的类型相符。
 *
 * 例如：
 * const array: Array = {
 *      0: 1,
 *      1: 'OK',
 *      'name': 'Alvin'
 * };
 */
export interface Array {
    readonly [index: number]: any;

    readonly name: any;
}

/**
 * 实现接口的类
 */
export class Rectangle implements Size {
    private readonly left: number;
    private readonly top: number;
    private readonly right: number;
    private readonly bottom: number;

    constructor(left: number, top: number, right: number, bottom: number) {
        this.left = left;
        this.top = top;
        this.right = right;
        this.bottom = bottom;
    }

    get width(): number {
        return this.right - this.left;
    }

    get height(): number {
        return this.bottom - this.top;
    }

    area(): number {
        return this.width * this.height;
    }
}