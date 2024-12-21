import readline from 'node:readline';

import { makeI18nJoi } from './i18n/i18n';

/**
 * 入口函数
 */
async function main(): Promise<void> {
  // 创建终端输入对象
  const input = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  try {
    console.log('录入信息');

    // 输入 `name` 值
    const name = await new Promise<string>(resolve => input.question('姓名: ', name => { resolve(name); }));

    // 输入 `age` 值
    const age = await new Promise<string>(resolve => input.question('年龄: ', age => resolve(age)));

    // 创建 Joi 对象
    const Joi = makeI18nJoi('cn');

    // 创建 `schema` 对象
    const result = Joi.object({
      name: Joi.string().required().min(1).max(20).label('姓名'),
      age: Joi.number().required().min(18).max(100).label('年龄'),
    })
      // 将输入的值组成对象进行验证
      .validate({ name, age }, { abortEarly: false });

    // 判断验证结果, 输出最终内容
    if (result.error) {
      console.error(`\n录入错误: ${result.error.message}`);
    } else {
      console.log(`\n录入成功, 结果:\n${JSON.stringify(result.value, null, 2)}`);
    }
  } finally {
    input.close();
  }
}

main().catch(console.error);
