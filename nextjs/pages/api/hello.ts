// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { type NextApiRequest, type NextApiResponse } from 'next';

interface ResponseData {
  name: string
}

export default (req: NextApiRequest, res: NextApiResponse<ResponseData>) => {
  res.status(200).json({ name: 'John Doe' });
};
