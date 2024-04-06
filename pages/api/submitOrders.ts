// /pages/api/submitData.ts

import { NextApiRequest, NextApiResponse } from 'next';
import { createOrders } from '../../app/lib/data';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log(req)
  console.log(99999999999)
  if (req.method === 'POST') {
    try {
      let resdata = req.body.data;
      // 在这里调用数据库操作
      if (resdata.projectList && resdata.projectList.length) {
        let memberId = resdata.member_id;
        let userId=resdata.createId?resdata.createId:'1';
        await createOrders(memberId,userId, resdata.projectList);
        // res.end('ok');
        // res.redirect('/dashboard/orders');
      }
      console.log('ewsewsresresresres')
      res.status(201).json({ redirectTo: '/dashboard/customers' });
      // 处理成功后进行服务端重定向
      // res.writeHead(307, { Location: '/dashboard/orders' });
      // res.end();
      // res.redirect('/dashboard/orders');
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
