// /pages/api/submitData.ts

import { NextApiRequest, NextApiResponse } from 'next';
import { recharge } from '../../app/lib/data';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      // 在这里调用数据库操作
      await recharge(req.body.data);
      res.status(201).json({ message: 'Data submitted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
