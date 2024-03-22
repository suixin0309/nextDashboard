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
  MemberTicket,
  MaterialTable,
  MaterialTypeTable,
  InRecordsTable
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
    // await new Promise((resolve) => setTimeout(resolve, 3000));
    // group by month
    // const data = await sql<Revenue>`SELECT * FROM revenue`;
    const data = await sql<BillRecord>`
    select to_char(create_time, 'YYYY-MM-DD') as month, sum(amount) as amount 
    from bill_record 
    where bill_type = 1 or bill_type = 3 
    group by month;`
    // FROM bill_record 
    // where bill_type = 1 or bill_type = 3 
    // group by date_trunc('month', create_time AT TIME ZONE 'UTC') 
    // order by month`;
    let revenue: any = data.rows.map((row) => {
      let item = {
        month: row.month,
        revenue: row.amount / 100
      }
      return item
    })
    return revenue;
    // return data.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch revenue data.');
  }
}

export async function fetchCardData() {
  noStore();
  try {
    // You can probably combine these into a single SQL query
    // However, we are intentionally splitting them to demonstrate
    // how to initialize multiple queries in parallel with JS.
    const newIntoShop = await sql`SELECT COUNT(*) 
    FROM t_member 
    where DATE_TRUNC('month', create_time AT TIME ZONE 'UTC') = DATE_TRUNC('month', CURRENT_DATE  AT TIME ZONE 'UTC')`;
    const IntoShop = await sql`SELECT COUNT(DISTINCT member_id) AS count
    FROM bill_record
    WHERE EXTRACT(YEAR FROM create_time) = EXTRACT(YEAR FROM CURRENT_DATE)
      AND EXTRACT(MONTH FROM create_time) = EXTRACT(MONTH FROM CURRENT_DATE);
    `;
    const currentd = await sql`
    select sum(amount) as count
    from bill_record
    where bill_type in (1, 3) and create_time > date_trunc('month', current_date)
    `;
    const currentInvoiceCountData = await sql`
    select sum(price) as count
    from inrecords
    where create_time > date_trunc('month', current_date)
    `;
    const data = await Promise.all([
      IntoShop,
      newIntoShop,
      currentd,
      currentInvoiceCountData,
    ]);
    const numberOfInvoices = Number(data[0].rows[0].count ?? '0');
    const numberOfCustomers = Number(data[1].rows[0].count ?? '0');
    const totalPaidInvoices = formatCurrency(data[2].rows[0].count ?? '0');
    const totalPendingInvoices = formatCurrency(data[3].rows[0].count ?? '0');

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
export async function fetchStatistics() {
  noStore();
  try {
    const data = await sql<BillRecord>`
    select ticket_name type, CAST(COUNT(*) AS INTEGER) as value
    from bill_record b
    join t_member m on b.member_id = m.id
    join ticket t on b.ticket_id=t.id
    where b.create_time > date_trunc('month', current_date)
    group by ticket_name
    `
    return data.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch fetchStatistics data.');
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
export async function recharge(params: BillRecord) {
  noStore();
  try {
    const data = await sql`
    UPDATE t_member
    SET amount = amount + ${params.amount * 100}
    WHERE id = ${params.member_id}
    RETURNING amount;
    `;
    //插入一条充值记录到bill_record表
    await sql`
    INSERT INTO bill_record
    (member_id, amount, bill_type, user_id)
    VALUES
    (${params.member_id}, ${params.amount * 100}, ${params.bill_type}, ${params.user_id})
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
export async function createOrders(memberId: string, params: ProjectForm[]) {
  // console.log(middleware)
  let userId = 1;
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
        let result = data.rows;
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
        let result = data.rows;
        if (result.length && result[0].nums >= param.consumptionNumber) {
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
//根据material表的数据 ，获取耗材的过滤列表
export async function fetchFilteredMaterials(
  query: string,
  currentPage: number
) {
  noStore();
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;
  try {
    const materials = await sql<MaterialTable>`
      SELECT
        material.id,
        material.name,
        material.nums,
        material.create_time,
        material.remarks,
        material.type_id,
        material_type.type_name
      FROM material
      JOIN material_type ON material.type_id = material_type.id
      WHERE
        material.name ILIKE ${`%${query}%`} OR
        material_type.type_name ILIKE ${`%${query}%`} 
      ORDER BY material.create_time DESC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;
    return materials.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch fetchFilteredMaterials.');
  }
}
//根据material表的数据 ，获取耗材的分页列表
export async function fetchMaterialsPages(query: string) {
  noStore();
  try {
    const count = await sql`SELECT COUNT(*)
    FROM material
    WHERE
      material.name ILIKE ${`%${query}%`} 
  `;
    const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of fetchMaterialsPages.');
  }
}
//根据inrecords表的数据 ，获取耗材的过滤列表
export async function fetchFilteredInRecords(
  query: string,
  currentPage: number
) {
  noStore();
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;
  try {
    const inrecords = await sql<InRecordsTable>`
      SELECT
        inrecords.id,
        inrecords.price,
        inrecords.nums,
        inrecords.create_time,
        material.name,
        material_type.type_name
      FROM inrecords
      JOIN material ON inrecords.material_id = material.id
      JOIN material_type ON inrecords.material_type_id = material_type.id
      WHERE
        material.name ILIKE ${`%${query}%`} OR
        inrecords.price::text ILIKE ${`%${query}%`} OR
        inrecords.create_time::text ILIKE ${`%${query}%`}
      ORDER BY inrecords.create_time DESC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;
    return inrecords.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch fetchFilteredInRecords.');
  }
}
//根据inrecords表的数据 ，获取耗材的分页列表
export async function fetchInRecordsPages(query: string) {
  noStore();
  try {
    const count = await sql`SELECT COUNT(*)
    FROM inrecords
      JOIN material ON inrecords.material_id = material.id
    WHERE
      material.name ILIKE ${`%${query}%`} OR
      inrecords.price::text ILIKE ${`%${query}%`} OR
      inrecords.create_time::text ILIKE ${`%${query}%`}
  `;
    const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of fetchInRecordsPages.');
  }
}
//根据outrecords表的数据 ，获取耗材的过滤列表
export async function fetchFilteredOutRecords(
  query: string,
  currentPage: number
) {
  noStore();
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;
  try {
    const outrecords = await sql<InRecordsTable>`
      SELECT
        outrecords.id,
        outrecords.nums,
        outrecords.create_time,
        material.name,
        material_type.type_name
      FROM outrecords
      JOIN material ON outrecords.material_id = material.id
      JOIN material_type ON outrecords.material_type_id = material_type.id
      WHERE
        material.name ILIKE ${`%${query}%`} OR
        outrecords.create_time::text ILIKE ${`%${query}%`}
      ORDER BY outrecords.create_time DESC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;
    return outrecords.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch fetchFilteredOutRecords.');
  }
}
//根据outrecords表的数据获取耗材的分页列表
export async function fetchOutRecordsPages(query: string) {
  noStore();
  try {
    const count = await sql`SELECT COUNT(*)
    FROM outrecords
      JOIN material ON outrecords.material_id = material.id
    WHERE
      material.name ILIKE ${`%${query}%`} OR
      outrecords.create_time::text ILIKE ${`%${query}%`}
  `;
    const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of fetchOutRecordsPages.');
  }
}

//面板
export async function fetchLatestMembers() {
  noStore();
  try {
    const data = await sql<Member>`SELECT * 
    FROM t_member 
    ORDER BY update_time DESC LIMIT 5`;
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
  const enabled = 1;
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
export async function fetchMemberTickets(memberId: string) {
  noStore();
  try {
    const projects = await sql<MemberTicket>`SELECT * FROM member_ticket WHERE member_id = ${memberId}`;
    return projects.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch ticket.');
  }
}
//根据material_type表，获取耗材类型的过滤列表
export async function fetchFilteredMaterialTypes(
  query: string,
  currentPage: number
) {
  noStore();
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;
  try {
    const materialTypes = await sql<MaterialTypeTable>`
      SELECT
        material_type.id,
        material_type.type_name,
        material_type.status,
        material_type.create_time
      FROM material_type
      WHERE
        material_type.name ILIKE ${`%${query}%`} 
      ORDER BY material_type.create_time DESC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;
    return materialTypes.rows;
  } catch (error) {
    console.error('Database Error:', error);
  }
}

//根据material_type表，获取耗材类型的分页列表
export async function fetchMaterialTypesPages(query: string) {
  noStore();
  try {
    const count = await sql`SELECT COUNT(*)
    FROM material_type
    WHERE
      material_type.name ILIKE ${`%${query}%`} 
  `;
    const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of fetchMaterialTypesPages.');
  }
}
export async function fetchMaterialTypes() {
  noStore();
  const enabled = 1;
  try {
    const types = await sql<MaterialTypeTable>`
      SELECT
        material_type.id,
        material_type.type_name,
        material_type.status
      FROM material_type
      WHERE material_type.status = ${enabled}
      ORDER BY material_type.type_name DESC
    `;
    return types.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch fetchMaterialTypes.');
  }
}