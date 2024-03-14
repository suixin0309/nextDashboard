// /pages/api/submitData.ts

import { NextApiRequest, NextApiResponse } from 'next';
// import { createOrders } from '../../app/lib/actions';
import { createOrders } from '../../app/lib/data';
 
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      let resdata = req.body.data;
      // 在这里调用数据库操作
      if (resdata.projectList && resdata.projectList.length) {
        let memberId = resdata.member_id
        await createOrders(memberId, resdata.projectList)
      }
      res.status(201).json({ message: 'Data submitted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
