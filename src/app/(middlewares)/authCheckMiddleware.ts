import { NextApiRequest, NextApiResponse, NextApiHandler } from 'next';
import { getSession } from 'next-auth/react';

const authCheckMiddleware = (handler: NextApiHandler) => async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req });

  if (session) {
    return res.status(403).json({ message: 'Already logged in' });
  }

  return handler(req, res);
};

export default authCheckMiddleware;
