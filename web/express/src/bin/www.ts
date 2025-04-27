import { fileURLToPath } from 'node:url';
import path from 'node:path';

import express from 'express';

import Logger from 'log4js';
import env from 'dotenv';

import { bootstrap } from '../core';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

env.config();

// 初始化日志组件
Logger.configure(path.join(__dirname, './log4js.json'));

// 初始化 Express
export const app = express();

// 启动 Express
export const server = bootstrap(app);
