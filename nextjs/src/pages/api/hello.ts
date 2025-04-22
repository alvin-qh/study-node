// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { type NextApiRequest, type NextApiResponse } from 'next';

interface ResponseData {
  name: string
}

const route = (req: NextApiRequest, res: NextApiResponse<ResponseData>) => {
  res.status(200).json({ name: 'John Doe' });
};

export default route;
