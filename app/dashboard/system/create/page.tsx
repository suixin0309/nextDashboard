import Form from '@/app/ui/system/create-form';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import { fetchCustomers } from '@/app/lib/data';
 
export default async function Page() {
  const customers = await fetchCustomers();
 
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: '系统管理', href: '/dashboard/system' },
          {
            label: '创建项目',
            href: '/dashboard/system/create',
            active: true,
          },
        ]}
      />
      <Form customers={customers} />
    </main>
  );
}