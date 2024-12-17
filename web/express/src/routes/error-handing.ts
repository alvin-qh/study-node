import { type Request, type Response, Router } from 'express';

// 导出路由对象, 该路由的相对路径为 `/error-handing`
export const router = Router();

// 设置 "/" 路径的路由, 渲染主页
router.get('/', (req: Request, res: Response) => {
  res.render('error-handing/index.html');
});
