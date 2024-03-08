'use server';
import { z } from 'zod';//类型验证库
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { signIn,auth } from '@/auth';
import { AuthError } from 'next-auth';
import bcrypt from 'bcrypt';
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
  id: z.string(),
  // managementId: z.string(),
  nickName: z.string({
    invalid_type_error: '必须提供员工姓名',
  }),
  loginName: z.string({
    invalid_type_error: '必须提供员工联系方式',
  }),
  date: z.string(),
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
    // managementId: formData.get('managementId'),
    nickName: formData.get('nickName'),
    loginName: formData.get('loginName'),
  });
  //返回一个包含 asuccess或error字段的对象
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Invoice.',
    };
  }
  const { nickName, loginName  } = validatedFields.data;
  const date = new Date().toISOString().split('T')[0];
  let initPwd='111111';
  let pwd=bcrypt.hashSync(initPwd, 5);
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
//创建会员
const MemberFormSchema = z.object({
  id: z.string(),
  // managementId: z.string(),
  name: z.string({
    invalid_type_error: '必须提供会员姓名',
  }),
  phone: z.string({
    invalid_type_error: '必须提供员工联系方式',
  }),
  address: z.string(),
  remarks: z.string(),
  date: z.string(),
});
const CreateMember = MemberFormSchema.omit({ id: true, date: true });
const UpdateMember = MemberFormSchema.omit({ id: true, date: true });
export type MemberState = {
  errors?: {
    name?: string[];
    phone?: string[];
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
  const { name, phone, address ,remarks} = validatedFields.data;
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
  
  // try {
  //   await sql`
  //   INSERT INTO users (Name,Email,Password)
  //   VALUES (${managementName}, ${tel},${pwd})
  //   `;

  // } catch (error) {
  //   return {
  //     message: 'Database error: ' + error,
  //   }
  // }
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
export async function updateInvoice(id: string,prev: State, formData: FormData) {
  const validatedFields = CreateInvoice.safeParse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });
  if(!validatedFields.success){
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
  // managementId: z.string(),
  ticket_name: z.string({
    invalid_type_error: '必须提供项目名',
  }),
  price: z.string({
    invalid_type_error: '必须提供项目价格',
  }),
});
const CreateProject = ProjectFormSchema.omit({ id: true });
const UpdateProject = ProjectFormSchema.omit({ id: true});
export type ProjectState = {
  errors?: {
    ticket_name?: string;
    price?: string|number;
  };
  message?: string | null;
};
export async function createProject(prevState: ProjectState, formData: FormData) {
  const validatedFields = CreateProject.safeParse({
    ticket_name: formData.get('ticket_name'),
    price: formData.get('price'),
  });
  //返回一个包含 asuccess或error字段的对象
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create createProject.',
    };
  }
  const { ticket_name,price} = validatedFields.data;
  try {
    await sql`
    INSERT INTO ticket (ticket_name,price)
    VALUES ( ${ticket_name},${price})
    `;
  } catch (error) {
    return {
      message: 'Database error: ' + error,
    }
  }
  revalidatePath('/dashboard/system/projects');//清除缓存，重新验证，获取数据
  redirect('/dashboard/system/projects'); //重定向
}

//验证身份
export async function authenticate(prevState:string|undefined,formData:FormData) {
  try{
    const user = await signIn('credentials', formData);
  }catch(error){
    if(error instanceof AuthError){
      switch(error.type){
        case 'CredentialsSignin':
          return 'Invalid credentials';
        default:
          return 'Something went wrong';
      }
    }
    throw error;
  }
}