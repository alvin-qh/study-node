/**
 * 定义枚举.
 *
 * 枚举项定义后会自动表示为一个整数. 例如: Gender.MALE 的值为0
 * 可以在定义枚举的时候显式为其制定一个数值.
 *
 * 枚举可以看作是一个key为数值类型, value为字符串类型的字典，可以通过类似 Gender[Gender.MALE] 获取枚举项的名称, 即
 * Gender[0] 相当于 Gender[Gender.MALE] 等于 'MALE'
 */
export enum Gender {MALE/* = 0*/, FEMALE/* = 1*/}
