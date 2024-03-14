// This file contains type definitions for your data.
// It describes the shape of the data, and what data type each property should accept.
// For simplicity of teaching, we're manually defining these types.
// However, these types are generated automatically if you're using an ORM such as Prisma.

//菜单配置
//消费类型
export const ConsumptionMenu: any = [
  // {
  //   id: 0,
  //   name: '余额充值',
  //   isShow:false,
  // },
  {
    id: 1,
    name: '项目充值',
    isShow:true,
  },
  {
    id: 2,
    name: '充值项目消耗',
    isShow:true,
  },
  {
    id: 3,
    name: '单次消费',
    isShow:true,
  },
  {
    id: 4,
    name: '余额消费',
    isShow:true,
  },
];
export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
  login_name: string;
  login_password: string;
  nickname: string;
  avatar: string;
  remarks: string;
  create_time: string;
  update_time: string;
};
export type Management = {
  id: string;
  loginName: string;
  loginPassword: string;
  status: number;
  nickNme: string;
};
export type ManagementTable = {
  id: string;
  login_name: string;
  nickname: string;
  status: number;
  create_time: string;
};
export type MemberTable = {
  id: string;
  name: string;
  amount: number;
  phone: string;
  create_time: string;
};
export type Member = {
  id: number;
  name: string;
  amount: number;
  phone: string;
  address: string;
  create_time: string;
};

// 预付费套餐表字段映射的类型
// export interface PrepaidPackage {
//   id: number;
//   name: string;
//   price: number;
//   duration: number;
//   description?: string;
//   created_time: string; // 根据数据库存储的时间格式调整
// }

// 消费记录表字段映射的类型
export interface ConsumptionRecord {
  id: number;
  member_id: number;
  package_id: number;
  consumed_amount: number;
  create_time: string; // 根据数据库存储的时间格式调整
}
// /app/lib/definitions.ts

export interface Ticket {
  id: number;
  ticket_name: string;
  enabled: number;
  price: number;
}

export interface MemberTicket {
  id: number;
  member_id: number;
  ticket_id: number;
  amount: number;
  nums: number;
  create_time: string;
}

//声明 bill_record 表
export interface BillRecordTable {
  id: number;
  bill_type: number;
  pay_type: number;
  amount: number;
  create_time: string;
  name: string;
  phone: string;
  nickname: string;
  ticket_name: string;
  count:string;
}
//声明 bill_record 表
export interface BillRecord {
  member_id: number;
  user_id: number;
  ticket_id: number;
  amount: number;
  count: number;
  bill_type: number;
}



///////////

export type Invoice = {
  id: string;
  customer_id: string;
  amount: number;
  date: string;
  // In TypeScript, this is called a string union type.
  // It means that the "status" property can only be one of the two strings: 'pending' or 'paid'.
  status: 'pending' | 'paid';
};

export type Revenue = {
  month: string;
  revenue: number;
};

export type LatestInvoice = {
  id: string;
  name: string;
  image_url: string;
  email: string;
  amount: string;
};

// The database returns a number for amount, but we later format it to a string with the formatCurrency function
export type LatestInvoiceRaw = Omit<LatestInvoice, 'amount'> & {
  amount: number;
};

export type InvoicesTable = {
  id: string;
  customer_id: string;
  name: string;
  email: string;
  image_url: string;
  date: string;
  amount: number;
  status: 'pending' | 'paid';
};

export type CustomersTableType = {
  id: string;
  name: string;
  email: string;
  image_url: string;
  total_invoices: number;
  total_pending: number;
  total_paid: number;
};

export type FormattedCustomersTable = {
  id: string;
  name: string;
  email: string;
  image_url: string;
  total_invoices: number;
  total_pending: string;
  total_paid: string;
};

export type CustomerField = {
  id: string;
  name: string;
};

export type InvoiceForm = {
  id: string;
  customer_id: string;
  amount: number;
  status: 'pending' | 'paid';
};
export type ProjectForm = {
  id: string | Number;
  ticket_id: number;
  consumptionType: string ;
  consumptionNumber:  number;
  amount: number;
};
export type InventoryData = {
  id: string;
  customer_id: string;
  name: number;
  type: string;
  status: 'pending' | 'paid';
};