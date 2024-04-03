'use server';
import { z } from 'zod';//类型验证库
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { signIn, auth } from '@/auth';
import { AuthError } from 'next-auth';
import bcrypt from 'bcrypt';
import {
  ProjectForm,
} from './definitions';
const FormSchema = z.object({
  id: z.string(),
  customerId: z.string({
    invalid_type_error: '必须提供客户ID',
  }),
  amount: z.coerce.number().gt(0, { message: '金额必须大于0' }), //强制更改为数字类型
  status: z.enum(['pending', 'paid'], {
    invalid_type_error: '必须提供状态',
  }),
  date: z.string(),
});

const CreateInvoice = FormSchema.omit({ id: true, date: true });
const UpdateInvoice = FormSchema.omit({ id: true, date: true });
export type State = {
  errors?: {
    customerId?: string[];
    amount?: string[];
    status?: string[];
  };
  message?: string | null;
};
//创建员工、账号
const ManagementFormSchema = z.object({
  id: z.number(),
  // managementId: z.string(),
  nickName: z.string({
    invalid_type_error: '必须提供员工姓名',
  }),
  loginName: z.string({
    invalid_type_error: '必须提供员工联系方式',
  }),
  status: z.number(),
  pwdReset: z.string(),
});
const CreateManagement = ManagementFormSchema.omit({ id: true, date: true });
const UpdateManagement = ManagementFormSchema.omit({ id: true, date: true });
export type ManagementState = {
  errors?: {
    // managementId?: string[];
    nickName?: string[];
    loginName?: string[];
  };
  message?: string | null;
};
export async function createManagement(prevState: ManagementState, formData: FormData) {
  const validatedFields = CreateManagement.safeParse({
    nickName: formData.get('nickName'),
    loginName: formData.get('loginName'),
  });
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Invoice.',
    };
  }
  const { nickName, loginName } = validatedFields.data;
  const date = new Date().toISOString().split('T')[0];
  let initPwd = '111111';
  let pwd = bcrypt.hashSync(initPwd, 5);
  try {
    await sql`
    INSERT INTO t_user (login_name,login_password, nickname)
    VALUES ( ${loginName},${pwd},${nickName})
    `;
  } catch (error) {
    return {
      message: 'Database error: ' + error,
    }
  }
  revalidatePath('/dashboard/management');//清除缓存，重新验证，获取数据
  redirect('/dashboard/management'); //重定向
}
export async function updateManagement(id: number, prevState: ManagementState, formData: FormData) {
  const validatedFields = CreateManagement.safeParse({
    nickName: formData.get('nickName'),
    loginName: formData.get('loginName'),
    status: formData.get('status') ? 1 : 0,
    pwdReset: formData.get('pwdReset') ? '1' : '0'
  });
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Invoice.',
    };
  }
  const { nickName, loginName, status, pwdReset } = validatedFields.data;
  if (pwdReset) {
    let initPwd = '111111';
    let pwd = bcrypt.hashSync(initPwd, 5);
    try {
      await sql`
      UPDATE t_user
      SET login_password = ${pwd}
      WHERE id = ${id}
    `;
    } catch (error) {
      return {
        message: 'Database error: ' + error,
      }
    }
  }
  try {
    await sql`
    UPDATE t_user
    SET login_name = ${loginName}, nickname = ${nickName},status = ${status}
    WHERE id = ${id}
  `;
  } catch (error) {
    return {
      message: 'Database error: ' + error,
    }
  }
  revalidatePath('/dashboard/management');//清除缓存，重新验证，获取数据
  redirect('/dashboard/management'); //重定向

  //
}
//创建会员
const MemberFormSchema = z.object({
  id: z.string(),
  // managementId: z.string(),
  name: z.string({
    invalid_type_error: '必须提供会员姓名',
  }),
  phone: z.string(),
  address: z.string(),
  remarks: z.string(),
  date: z.string(),
});
const CreateMember = MemberFormSchema.omit({ id: true, date: true });
export type MemberState = {
  errors?: {
    name?: string[];
  };
  message?: string | null;
};
export async function createMember(prevState: MemberState, formData: FormData) {
  const validatedFields = CreateMember.safeParse({
    name: formData.get('name'),
    phone: formData.get('phone'),
    address: formData.get('address'),
    remarks: formData.get('remarks'),
  });
  //返回一个包含 asuccess或error字段的对象
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Invoice.',
    };
  }
  const { name, phone, address, remarks } = validatedFields.data;
  const date = new Date().toISOString().split('T')[0];
  try {
    await sql`
    INSERT INTO t_member (name,phone, address,remarks)
    VALUES ( ${name},${phone},${address},${remarks})
    `;

  } catch (error) {
    return {
      message: 'Database error: ' + error,
    }
  }
  revalidatePath('/dashboard/customers');//清除缓存，重新验证，获取数据
  redirect('/dashboard/customers'); //重定向
}
export async function updateMember(id: string,prevState: MemberState, formData: FormData) {
  const validatedFields = CreateMember.safeParse({
    name: formData.get('name'),
    phone: formData.get('phone'),
    address: formData.get('address'),
    remarks: formData.get('remarks'),
  });
  //返回一个包含 asuccess或error字段的对象
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Update data.',
    };
  }
  const { name, phone, address, remarks } = validatedFields.data;
  const date = new Date().toISOString().split('T')[0];
  try {
    await sql`
    UPDATE t_member
    SET name = ${name}, phone = ${phone},address = ${address},remarks = ${remarks}
    WHERE id = ${id}
    `;

  } catch (error) {
    return {
      message: 'Database error: ' + error,
    }
  }
  revalidatePath('/dashboard/customers');//清除缓存，重新验证，获取数据
  redirect('/dashboard/customers'); //重定向
}
export async function createInvoice(prevState: State, formData: FormData) {
  const validatedFields = CreateInvoice.safeParse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });
  //返回一个包含 asuccess或error字段的对象
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Invoice.',
    };
  }
  const { customerId, amount, status } = validatedFields.data;
  const amountInCents = amount * 100;
  const date = new Date().toISOString().split('T')[0];
  try {
    await sql`
    INSERT INTO invoices (customer_id, amount, status, date)
    VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
    `;

  } catch (error) {
    return {
      message: 'Database error: ' + error,
    }
  }
  revalidatePath('/dashboard/invoices');//清除缓存，重新验证，获取数据
  redirect('/dashboard/invoices'); //重定向

}
export async function updateInvoice(id: string, prev: State, formData: FormData) {
  const validatedFields = CreateInvoice.safeParse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Update Invoice.',
    };
  }
  const { customerId, amount, status } = validatedFields.data;
  const amountInCents = amount * 100;
  try {
    await sql`
    UPDATE invoices
    SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
    WHERE id = ${id}
  `;
  } catch (error) {
    return {
      message: 'Database error: ' + error,
    }
  }
  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}
export async function deleteInvoice(id: string) {
  try {
    await sql`DELETE FROM invoices WHERE id = ${id}`;
  } catch (error) {
    return {
      message: 'Database error: ' + error,
    }
  }
  revalidatePath('/dashboard/invoices');
}


//系统管理
//添加菜单项目
const ProjectFormSchema = z.object({
  id: z.string(),
  ticket_name: z.string({
    invalid_type_error: '必须提供项目名',
  }),
  price: z.string({
    invalid_type_error: '必须提供项目价格',
  }),
  enabled: z.number(),
});
const CreateProject = ProjectFormSchema.omit({ id: true });
export type ProjectState = {
  errors?: {
    ticket_name?: string[];
    price?: string[];
    enabled?: number[];
  };
  message?: string | null;
};
export async function createProject(prevState: ProjectState, formData: FormData) {
  const validatedFields = CreateProject.safeParse({
    ticket_name: formData.get('ticket_name'),
    price: formData.get('price'),
    enabled: 1,
  });
  //返回一个包含 asuccess或error字段的对象
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create createProject.',
    };
  }
  const { ticket_name, price } = validatedFields.data;
  const priceLast = Number(price) * 100;
  try {
    await sql`
    INSERT INTO ticket (ticket_name,price)
    VALUES ( ${ticket_name},${priceLast})
    `;
  } catch (error) {
    return {
      message: 'Database error: ' + error,
    }
  }
  revalidatePath('/dashboard/system/projects');//清除缓存，重新验证，获取数据
  redirect('/dashboard/system/projects'); //重定向
}
export async function updateProject(id: string, prevState: ProjectState, formData: FormData) {
  const validatedFields = CreateProject.safeParse({
    ticket_name: formData.get('ticket_name'),
    price: formData.get('price'),
    enabled: formData.get('enabled') ? 1 : 0,
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Update updateProject.',
    };
  }
  const { ticket_name, price, enabled } = validatedFields.data;
  const priceLast = Number(price) * 100;
  try {
    await sql`
    UPDATE ticket
    SET ticket_name = ${ticket_name}, price = ${priceLast},enabled = ${enabled}
    WHERE id = ${id}
  `;
  } catch (error) {
    return {
      message: 'Database error: ' + error,
    }
  }
  revalidatePath('/dashboard/system/projects');//清除缓存，重新验证，获取数据
  redirect('/dashboard/system/projects'); //重定向
}
//创建耗材类型
// MaterialTypeTable
const MaterialTypeFormSchema = z.object({
  id: z.string(),
  // managementId: z.string(),
  name: z.string({
    invalid_type_error: '必须提供类型名',
  }),
  status: z.number(),
});
const CreateMaterialType = MaterialTypeFormSchema.omit({ id: true });
export type MaterialTypeState = {
  errors?: {
    name?: string[];
    status?: string[];
  };
  message?: string | null;
};
export async function createMaterialType(prevState: MaterialTypeState, formData: FormData) {
  const validatedFields = CreateMaterialType.safeParse({
    name: formData.get('typeName'),
    status: 1,
  });
  //返回一个包含 asuccess或error字段的对象
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create createMaterialType.',
    };
  }
  const { name } = validatedFields.data;
  try {
    await sql`
    INSERT INTO material_type (type_name)
    VALUES ( ${name})
    `;
  } catch (error) {
    return {
      message: 'Database error: ' + error,
    }
  }
  revalidatePath('/dashboard/system/inventory');//清除缓存，重新验证，获取数据
  redirect('/dashboard/system/inventory'); //重定向
}
export async function updateMaterialType(id: string, prevState: MaterialTypeState, formData: FormData) {
  const validatedFields = CreateMaterialType.safeParse({
    name: formData.get('typeName'),
    status: formData.get('status') ? 1 : 0,
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Update updateMaterialType.',
    };
  }
  const { name, status } = validatedFields.data;
  try {
    await sql`
    UPDATE material_type
    SET type_name = ${name}, status = ${status}
    WHERE id = ${id}
  `;
  } catch (error) {
    return {
      message: 'Database error: ' + error,
    }
  }
  revalidatePath('/dashboard/system/inventory');//清除缓存，重新验证，获取数据
  redirect('/dashboard/system/inventory'); //重定向
}
//创建消费账单
export async function createOrders(memberId: string, params: ProjectForm[]) {
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
        let result=data.rows[0];
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
        let result=data.rows[0];
        if (result.length&&result.nums>=param.consumptionNumber) {
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
    });
    // return data.rows[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to recharge.');
  }
  revalidatePath('/dashboard/orders');//清除缓存，重新验证，获取数据
  redirect('/dashboard/orders'); //重定向
}
//创建耗材 material
const MaterialFormSchema = z.object({
  id: z.string(),
  // managementId: z.string(),
  material_name: z.string({
    invalid_type_error: '必须提供耗材名',
  }),
  material_type: z.string({
    invalid_type_error: '必须提供耗材名字',
  }),
  remarks: z.string(),
});
const CreateMaterial = MaterialFormSchema.omit({ id: true });
export type MaterialState = {
  errors?: {
    material_name?: string[];
    material_type?: string[];
  };
  message?: string | null;
};
export async function createMaterial(prevState: MaterialState, formData: FormData) {
  const validatedFields = CreateMaterial.safeParse({
    material_name: formData.get('material_name'),
    material_type: formData.get('material_type'),
    remarks: formData.get('remarks'),
  });
  //返回一个包含 asuccess或error字段的对象
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create createMaterial.',
    };
  }
  const { material_name, material_type ,remarks} = validatedFields.data;
  try {
    await sql`
    INSERT INTO material (name,type_id,remarks)
    VALUES ( ${material_name},${material_type},${remarks})
    `;
  } catch (error) {
    return {
      message: 'Database error: ' + error,
    }
  }
  revalidatePath('/dashboard/inventory/list');//清除缓存，重新验证，获取数据
  redirect('/dashboard/inventory/list'); //重定向
}
export async function updateMaterial(id: string, prevState: MaterialState, formData: FormData) {
  const validatedFields = CreateMaterial.safeParse({
    material_name: formData.get('material_name'),
    material_type: formData.get('material_type'),
    remarks: formData.get('remarks'),
  });
  //返回一个包含 asuccess或error字段的对象
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create updateMaterial.',
    };
  }
  const { material_name, material_type ,remarks} = validatedFields.data;
  try {
    await sql`
    UPDATE material
    SET name = ${material_name}, type_id = ${material_type},remarks = ${remarks}
    WHERE id = ${id}
  `;
  } catch (error) {
    return {
      message: 'Database error: ' + error,
    }
  }
  revalidatePath('/dashboard/inventory/list');//清除缓存，重新验证，获取数据
  redirect('/dashboard/inventory/list'); //重定向
}
//入库 material
const InMaterialFormSchema = z.object({
  id: z.string(),
  nums: z.string({
    invalid_type_error: '必须提供入库数量',
  }),
  price: z.string({
    invalid_type_error: '必须提供入库价格',
  }),
  remarks: z.string(),
  material_type: z.string(),
});
const outMaterialFormSchema = z.object({
  id: z.string(),
  nums: z.string({
    invalid_type_error: '必须提供出库数量',
  }),
  remarks: z.string(),
  material_type: z.string(),
});
const CreateInMaterial = InMaterialFormSchema.omit({ id: true });
const CreateOutMaterial = outMaterialFormSchema.omit({ id: true });
export type InMaterialState = {
  errors?: {
    nums?: string[];
    price?: string[];
  };
  message?: string | null;
};
export type outMaterialState = {
  errors?: {
    nums?: string[];
  };
  message?: string | null;
};
export async function createInMaterial(id:number,prevState: InMaterialState, formData: FormData) {
  const validatedFields = CreateInMaterial.safeParse({
    nums: formData.get('nums'),
    price: formData.get('price'),
    material_type: formData.get('material_type'),
    remarks: formData.get('remarks'),
  });
  //返回一个包含 asuccess或error字段的对象
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create createInMaterial.',
    };
  }
  const { material_type,nums, price ,remarks} = validatedFields.data;
  //accound_id?
  const lastPrice = Number(price) * 100;
  try {
    await sql`
    INSERT INTO inrecords (material_id,nums,price,material_type_id,remarks)
    VALUES ( ${id},${nums},${lastPrice},${material_type},${remarks})
    `;
    await sql`
          UPDATE material
          SET nums = nums + ${nums}
          WHERE id = ${id}
          RETURNING nums;
          `;
  } catch (error) {
    return {
      message: 'Database error: ' + error,
    }
  }
  revalidatePath('/dashboard/inventory/list');//清除缓存，重新验证，获取数据
  redirect('/dashboard/inventory/list'); //重定向
}
export async function createOutMaterial(id:number,prevState: outMaterialState, formData: FormData) {
  const validatedFields = CreateOutMaterial.safeParse({
    nums: formData.get('nums'),
    material_type: formData.get('material_type'),
    remarks: formData.get('remarks'),
  });
  console.log(formData)
  //返回一个包含 asuccess或error字段的对象
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create createOutMaterial.',
    };
  }
  const { material_type,nums,remarks} = validatedFields.data;
  //in_accound_id?
  try {
    await sql`
    INSERT INTO outrecords (material_id,nums,material_type_id,remarks)
    VALUES ( ${id},${nums},${material_type},${remarks})
    `;
    await sql`
          UPDATE material
          SET nums = nums - ${nums}
          WHERE id = ${id}
          RETURNING nums;
          `;
  } catch (error) {
    return {
      message: 'Database error: ' + error,
    }
  }
  revalidatePath('/dashboard/inventory/list');//清除缓存，重新验证，获取数据
  redirect('/dashboard/inventory/list'); //重定向
}
//验证身份
export async function authenticate(prevState: string | undefined, formData: FormData) {
  try {
    const user = await signIn('credentials', formData);
    return user;
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials';
        default:
          return 'Something went wrong';
      }
    }
    throw error;
  }
}