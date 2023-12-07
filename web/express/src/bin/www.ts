import env from 'dotenv';
import express from 'express';
import Logger from 'log4js';
import path from 'path';

import { bootstrap } from '../core';

env.config();

// 初始化日志组件
Logger.configure(path.join(__dirname, './log4js.json'));

const app = express();

// 启动 Express
bootstrap(app);

export default app;
