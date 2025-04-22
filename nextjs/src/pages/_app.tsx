/**
 * @file _app.tsx
 *
 * 自定义 Next 的 `App` 对象
 *
 * 可以不需要该文件, 只需要在 `pages` 目录下创建路由文件即可,
 * 也可以自定义 `App` 对象, 只需要在 `pages/_app.tsx` 文件下创建即可
 *
 * 本例中, 通过自定义 `_app.tsx` 文件, 用于引入全局样式文件
 */

import React from 'react';

import { type AppProps } from 'next/app';

import '../styles/globals.css';

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default MyApp;
