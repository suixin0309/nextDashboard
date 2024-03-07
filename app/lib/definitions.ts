// This file contains type definitions for your data.
// It describes the shape of the data, and what data type each property should accept.
// For simplicity of teaching, we're manually defining these types.
// However, these types are generated automatically if you're using an ORM such as Prisma.

//菜单配置
//消费类型
export const ConsumptionMenu: any = [
  {
    id: 1,
    name: '余额充值',
  },
  {
    id: 2,
    name: '项目充值',
  },
  {
    id: 3,
    name: '充值项目消耗',
  },
  {
    id: 4,
    name: '单次消费',
  }
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
  nickNme: string;
};
export type ManagementTable = {
  id: string;
  login_name: string;
  nickname: string;
  create_time: string;
};
export type MemberTable = {
  id: string;
  name: string;
  amount: number;
  phone: string;
  create_time: string;
};


// 预付费套餐表字段映射的类型
export interface PrepaidPackage {
  id: number;
  name: string;
  price: number;
  duration: number;
  description?: string;
  created_at: string; // 根据数据库存储的时间格式调整
}

// 消费记录表字段映射的类型
export interface ConsumptionRecord {
  id: number;
  member_id: number;
  package_id: number;
  consumed_amount: number;
  create_time: string; // 根据数据库存储的时间格式调整
}

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
  projectName: string;
  consumptionType: string | Number;
  consumptionNumber: string | Number;
  price: number | string;
};
export type InventoryData = {
  id: string;
  customer_id: string;
  name: number;
  type: string;
  status: 'pending' | 'paid';
};