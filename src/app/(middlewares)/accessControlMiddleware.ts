import { NextApiRequest, NextApiResponse, NextApiHandler } from 'next';
import { getSession } from 'next-auth/react';

const accessControlMiddleware = (handler: NextApiHandler, allowedTypes: string[]) => async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req });

  if (!session || !allowedTypes.includes(session.user.type)) {
    return res.status(403).json({ message: 'Forbidden' });
  }

  return handler(req, res);
};

export default accessControlMiddleware;
