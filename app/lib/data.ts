import { sql } from '@vercel/postgres';
import {
  Management,
  CustomerField,
  CustomersTableType,
  InvoiceForm,
  InvoicesTable,
  LatestInvoiceRaw,
  User,
  Revenue,
  ManagementTable,
  MemberTable,
  Member,
  Ticket,
  BillRecord,
  BillRecordTable,
  ProjectForm,
  MemberTicket
} from './definitions';
import { formatCurrency } from './utils';
import { unstable_noStore as noStore } from 'next/cache';
export async function fetchRevenue() {
  // Add noStore() here to prevent the response from being cached.
  // This is equivalent to in fetch(..., {cache: 'no-store'}).
  noStore();
  try {
    // Artificially delay a response for demo purposes.
    // Don't do this in production :)

    // console.log('Fetching revenue data...');
    // await new Promise((resolve) => setTimeout(resolve, 3000));

    const data = await sql<Revenue>`SELECT * FROM revenue`;

    // console.log('Data fetch completed after 3 seconds.');

    return data.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch revenue data.');
  }
}

export async function fetchLatestInvoices() {
  noStore();
  try {
    const data = await sql<LatestInvoiceRaw>`
      SELECT invoices.amount, customers.name, customers.image_url, customers.email, invoices.id
      FROM invoices
      JOIN customers ON invoices.customer_id = customers.id
      ORDER BY invoices.date DESC
      LIMIT 5`;

    const latestInvoices = data.rows.map((invoice) => ({
      ...invoice,
      amount: formatCurrency(invoice.amount),
    }));
    return latestInvoices;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch the latest invoices.');
  }
}

export async function fetchCardData() {
  noStore();
  try {
    // You can probably combine these into a single SQL query
    // However, we are intentionally splitting them to demonstrate
    // how to initialize multiple queries in parallel with JS.
    const invoiceCountPromise = sql`SELECT COUNT(*) FROM invoices`;
    const customerCountPromise = sql`SELECT COUNT(*) FROM customers`;
    const invoiceStatusPromise = sql`SELECT
         SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END) AS "paid",
         SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END) AS "pending"
         FROM invoices`;

    const data = await Promise.all([
      invoiceCountPromise,
      customerCountPromise,
      invoiceStatusPromise,
    ]);

    const numberOfInvoices = Number(data[0].rows[0].count ?? '0');
    const numberOfCustomers = Number(data[1].rows[0].count ?? '0');
    const totalPaidInvoices = formatCurrency(data[2].rows[0].paid ?? '0');
    const totalPendingInvoices = formatCurrency(data[2].rows[0].pending ?? '0');

    return {
      numberOfCustomers,
      numberOfInvoices,
      totalPaidInvoices,
      totalPendingInvoices,
    };
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch card data.');
  }
}

const ITEMS_PER_PAGE = 8;
export async function fetchFilteredInvoices1(
  query: string,
  currentPage: number,
) {
  noStore();
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const invoices = await sql<InvoicesTable>`
      SELECT
        invoices.id,
        invoices.amount,
        invoices.date,
        invoices.status,
        customers.name,
        customers.email,
        customers.image_url
      FROM invoices
      JOIN customers ON invoices.customer_id = customers.id
      WHERE
        customers.name ILIKE ${`%${query}%`} OR
        customers.email ILIKE ${`%${query}%`} OR
        invoices.amount::text ILIKE ${`%${query}%`} OR
        invoices.date::text ILIKE ${`%${query}%`} OR
        invoices.status ILIKE ${`%${query}%`}
      ORDER BY invoices.date DESC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;

    return invoices.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch invoices.');
  }
}

export async function fetchInvoicesPages1(query: string) {
  noStore();
  try {
    const count = await sql`SELECT COUNT(*)
    FROM invoices
    JOIN customers ON invoices.customer_id = customers.id
    WHERE
      customers.name ILIKE ${`%${query}%`} OR
      customers.email ILIKE ${`%${query}%`} OR
      invoices.amount::text ILIKE ${`%${query}%`} OR
      invoices.date::text ILIKE ${`%${query}%`} OR
      invoices.status ILIKE ${`%${query}%`}
  `;

    const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of invoices.');
  }
}

export async function fetchInvoiceById(id: string) {
  noStore();
  try {
    const data = await sql<InvoiceForm>`
      SELECT
        invoices.id,
        invoices.customer_id,
        invoices.amount,
        invoices.status
      FROM invoices
      WHERE invoices.id = ${id};
    `;

    const invoice = data.rows.map((invoice) => ({
      ...invoice,
      // Convert amount from cents to dollars
      amount: invoice.amount / 100,
    }));
    return invoice[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch invoice.');
  }
}

export async function fetchCustomers() {
  noStore();
  try {
    const data = await sql<CustomerField>`
      SELECT
        id,
        name
      FROM customers
      ORDER BY name ASC
    `;

    const customers = data.rows;
    return customers;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch all customers.');
  }
}

export async function fetchFilteredCustomers(query: string) {
  noStore();
  try {
    const data = await sql<CustomersTableType>`
		SELECT
		  customers.id,
		  customers.name,
		  customers.email,
		  customers.image_url,
		  COUNT(invoices.id) AS total_invoices,
		  SUM(CASE WHEN invoices.status = 'pending' THEN invoices.amount ELSE 0 END) AS total_pending,
		  SUM(CASE WHEN invoices.status = 'paid' THEN invoices.amount ELSE 0 END) AS total_paid
		FROM customers
		LEFT JOIN invoices ON customers.id = invoices.customer_id
		WHERE
		  customers.name ILIKE ${`%${query}%`} OR
        customers.email ILIKE ${`%${query}%`}
		GROUP BY customers.id, customers.name, customers.email, customers.image_url
		ORDER BY customers.name ASC
	  `;

    const customers = data.rows.map((customer) => ({
      ...customer,
      total_pending: formatCurrency(customer.total_pending),
      total_paid: formatCurrency(customer.total_paid),
    }));

    return customers;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch customer table.');
  }
}

//会员余额充值
export async function recharge(params:BillRecord) {
  noStore();
  try {
    const data = await sql`
    UPDATE t_member
    SET amount = amount + ${params.amount* 100}
    WHERE id = ${params.member_id}
    RETURNING amount;
    `;
    //插入一条充值记录到bill_record表
    await sql`
    INSERT INTO bill_record
    (member_id, amount, bill_type, user_id)
    VALUES
    (${params.member_id}, ${params.amount*100}, ${params.bill_type}, ${params.user_id})
    `;
    // await sql`
    // INSERT INTO bill_record
    // (member_id, amount, bill_type, user_id)
    // VALUES
    // (${params.member_id}, ${params.amount}, ${params.bill_type}, ${params.user_id})
    // `;
    return data.rows[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to recharge.');
  }
}
//创建消费账单
export async function createOrders(memberId:string,params:ProjectForm[]) {
  // console.log(middleware)
  let userId=1;
  try {
    //插入一条充值记录到bill_record表
    params.forEach(async (param) => {
      let isNext = true;
      if (param.consumptionType == '4') {
        await sql`
          UPDATE t_member
          SET amount = amount - ${param.amount * 100}
          WHERE id = ${memberId}
          RETURNING amount;
          `;
      } else if (param.consumptionType == '1') {
        //项目充值
        //查询是否有项目充值记录
        const data = await sql`
        SELECT * FROM member_ticket WHERE member_id = ${memberId} AND ticket_id = ${param.ticket_id};
        `;
        let result=data.rows;
        if (result.length) {
          //修改项目充值记录+
          await sql`
            UPDATE member_ticket
            SET nums = nums + ${param.consumptionNumber}
            WHERE member_id = ${memberId} AND ticket_id = ${param.ticket_id};
            `;
        } else {
          //插入项目充值记录
          await sql`
            INSERT INTO member_ticket
            (member_id, ticket_id,amount, nums)
            VALUES
            (${memberId}, ${param.ticket_id}, ${param.amount * 100},${param.consumptionNumber})
            `;
        }
      } else if (param.consumptionType == '2') {
        //项目充值消费
        //查询是否有项目充值记录
        const data = await sql`
          SELECT * FROM member_ticket WHERE member_id = ${memberId} AND ticket_id = ${param.ticket_id};
          `;
        let result=data.rows;
        if (result.length&&result[0].nums>=param.consumptionNumber) {
          //修改项目充值记录
          await sql`
              UPDATE member_ticket
              SET nums = nums - ${param.consumptionNumber}
              WHERE member_id = ${memberId} AND ticket_id = ${param.ticket_id};
              `;
        } else {
          isNext = false;
        }
      }
      if (isNext) {
        await sql`
        INSERT INTO bill_record
        (member_id, amount, bill_type,ticket_id, user_id,count)
        VALUES
        (${memberId}, ${param.amount * 100}, ${param.consumptionType},${param.ticket_id}, ${userId}, ${param.consumptionNumber})
        `;
      }
      return isNext
    });
    // return data.rows[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to recharge.');
  }
  // revalidatePath('/dashboard/orders');//清除缓存，重新验证，获取数据
  // redirect('/dashboard/orders'); //重定向
}
//获取员工列表
export async function fetchFilteredManagements(
  query: string,
  currentPage: number,
) {
  noStore();
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;
  try {
    const users = await sql<ManagementTable>`
      SELECT
        t_user.id,
        t_user.login_name,
        t_user.nickname,
        t_user.status,
        t_user.create_time
      FROM t_user
      WHERE
        t_user.nickname ILIKE ${`%${query}%`} OR
        t_user.login_name ILIKE ${`%${query}%`} 
      ORDER BY t_user.nickname DESC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;
    return users.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch managements.');
  }
}
export async function fetchMangementsPages(query: string) {
  noStore();
  try {
    const count = await sql`SELECT COUNT(*)
    FROM t_user
    WHERE
      t_user.login_name ILIKE ${`%${query}%`} OR
      t_user.nickname ILIKE ${`%${query}%`} 
  `;
//customers.date::text ILIKE ${`%${query}%`} OR
console.log(1213)
    const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of fetchMangementsPages.');
  }
}
export async function fetchManagementById(id: number) {
  noStore();
  try {
    const data = await sql<Management>`
      SELECT
        t_user.id,
        t_user.login_name,
        t_user.nickname,
        t_user.status
      FROM t_user
      WHERE t_user.id = ${id};
    `;
    const invoice = data.rows.map((invoice) => ({
      ...invoice,
    }));
    return invoice[0];
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch all fetchManagementById.');
  }
}
//会员
//获取会员列表
export async function fetchFilteredMembers(
  query: string,
  currentPage: number,
) {
  noStore();
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;
  try {
    const users = await sql<MemberTable>`
      SELECT
        t_member.id,
        t_member.name,
        t_member.amount,
        t_member.phone,
        t_member.create_time
      FROM t_member
      WHERE
        t_member.name ILIKE ${`%${query}%`} OR
        t_member.phone ILIKE ${`%${query}%`} 
      ORDER BY t_member.name DESC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;
    return users.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch member.');
  }
}
export async function fetchMembersPages(query: string) {
  noStore();
  try {
    const count = await sql`SELECT COUNT(*)
    FROM t_member
    WHERE
      t_member.name ILIKE ${`%${query}%`} OR
      t_member.phone ILIKE ${`%${query}%`} 
  `;
//customers.date::text ILIKE ${`%${query}%`} OR
    const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of memberPages.');
  }
}
//获取会员详情
export async function fetchMemberById(id: string) {
  noStore();
  try {
    const data = await sql<Member>`
      SELECT
        t_member.id,
        t_member.name,
        t_member.phone,
        t_member.amount,
        t_member.address,
        t_member.remarks
      FROM t_member
      WHERE t_member.id = ${id};
    `;

    const invoice = data.rows.map((invoice) => ({
      ...invoice,
    }));
    return invoice[0];
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch all fetchMemberById.');
  }
}
export async function getUser(loginName: string) {
  noStore();
  try {
    const user = await sql<User>`SELECT * FROM t_user WHERE login_name = ${loginName}`;
    return user.rows[0];
} catch (error) {
    throw new Error('Failed to fetch user.');
}
}
//获取账单记录
export async function fetchFilteredInvoices(
  query: string,
  currentPage: number,
) {
  noStore();
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const invoices = await sql<BillRecordTable>`
      SELECT
        bill_record.id,
        bill_record.bill_type,
        bill_record.pay_type,
        bill_record.amount,
        bill_record.create_time,
        t_member.name,
        t_member.phone,
        t_user.nickname,
        ticket.ticket_name,
        bill_record.count
      FROM bill_record
      JOIN t_member ON bill_record.member_id = t_member.id
      JOIN t_user ON bill_record.user_id = t_user.id
      LEFT JOIN ticket ON bill_record.ticket_id = ticket.id
      WHERE
        t_member.name ILIKE ${`%${query}%`} OR
        t_member.phone ILIKE ${`%${query}%`} OR
        bill_record.amount::text ILIKE ${`%${query}%`} OR
        bill_record.create_time::text ILIKE ${`%${query}%`}
      ORDER BY bill_record.create_time DESC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;

    return invoices.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch fetchFilteredInvoices.');
  }
}

export async function fetchInvoicesPages(query: string) {
  noStore();
  try {
    const count = await sql`SELECT COUNT(*)
    FROM bill_record
      JOIN t_member ON bill_record.member_id = t_member.id
      JOIN t_user ON bill_record.user_id = t_user.id
      LEFT JOIN ticket ON bill_record.pay_type = ticket.id
    WHERE
      t_member.name ILIKE ${`%${query}%`} OR
      t_member.phone ILIKE ${`%${query}%`} OR
      bill_record.amount::text ILIKE ${`%${query}%`} OR
      bill_record.create_time::text ILIKE ${`%${query}%`}
  `;

    const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of fetchInvoicesPages.');
  }
}


//面板
export async function fetchLatestMembers() {
  noStore();
  try {
    const data = await sql<Member>`SELECT * FROM t_member ORDER BY create_time DESC LIMIT 5`;
    const latestMembers = data.rows.map((member) => ({
      ...member,
      amount: formatCurrency(member.amount),
    }));
    return latestMembers;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch the latest members.');
  }
}
//系统设置
//获取项目列表
export async function fetchFilteredProjects(
  query: string,
  currentPage: number,
) {
  noStore();
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;
  try {
    const users = await sql<Ticket>`
      SELECT
        ticket.id,
        ticket.ticket_name,
        ticket.price,
        ticket.enabled
      FROM ticket
      WHERE
        ticket.ticket_name ILIKE ${`%${query}%`}
      ORDER BY ticket.ticket_name DESC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;
    return users.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch ticket.');
  }
}
export async function fetchProjectsPages(query: string) {
  noStore();
  try {
    const count = await sql`SELECT COUNT(*)
    FROM ticket
    WHERE
    ticket.ticket_name ILIKE ${`%${query}%`} 
  `;
//customers.date::text ILIKE ${`%${query}%`} OR
    const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of fetchProjectsPages.');
  }
}
export async function fetchProjects() {
  noStore();
  const enabled=1;
  try {
    const projects = await sql<Ticket>`
      SELECT
        ticket.id,
        ticket.ticket_name,
        ticket.price
      FROM ticket
      WHERE ticket.enabled = ${enabled}
      ORDER BY ticket.ticket_name DESC
    `;
    return projects.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch ticket.');
  }
}
//查询 member_ticket表里该会员的数据
export async function fetchMemberTickets(memberId:string) {
  noStore();
  try {
    const projects = await sql<MemberTicket>`SELECT * FROM member_ticket WHERE member_id = ${memberId}`;
    return projects.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch ticket.');
  }
}