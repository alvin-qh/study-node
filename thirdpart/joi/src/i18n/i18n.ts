import Joi, { type ValidationOptions } from 'joi';

/**
 * 创建 `Joi` 国际化错误信息对象
 *
 * @see https://joi.dev/api#list-of-errors
 */
export function makeI18nJoi(locale: string = 'cn'): Joi.Root {
  // 定义错误信息选项
  const opts: ValidationOptions = {
    // 设置错误信息的语言
    errors: { language: locale },
    messages: {
      // 中文错误信息定义 (部分)
      cn: {
        'string.base': '{{#label}} 必须为字符串类型',
        'string.email': '{{#label}} 必须为一个有效的邮箱',
        'string.min': '{{#label}} 长度必须等于或大于 {{#limit}} 个字符',
        'string.max': '{{#label}} 长度必须小于 {{#limit}} 个字符',
        'number.base': '{{#label}} 必须为数值类型',
        'number.min': '{{#label}} 的值必须等于或大于 {{#limit}}',
        'number.max': '{{#label}} 的值必须小于 {{#limit}}',
        'number.integer': '{{#label}} 的值必须为一个整数',
      },

      // 法文错误信息定义 (部分)
      fr: {
        'string.base': '{{#label}} doit être de type string',
        'string.email': '{{#label}} doit être une boîte aux lettres valide',
        'string.min': '{{#label}} doit être égal ou supérieur à {{#limit}} caractères',
        'string.max': '{{#label}} doit comporter moins de {{#limit}} caractères',
        'number.base': '{{#label}} doit être de type numérique',
        'number.min': '{{#label}} doit être égal ou supérieur à {{#limit}}',
        'number.max': '{{#label}} doit être inférieur à {{#limit}}',
        'number.integer': '{{#label}} doit être un entier',
      },
    },
  };

  // 通过 `Joi::default` 方法可以创建一个新的 Joi 对象, 包含指定的选项
  return Joi.defaults((schema) => schema.options(opts));
}
