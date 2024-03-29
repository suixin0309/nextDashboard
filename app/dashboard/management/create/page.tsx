import Form from '@/app/ui/management/create-form';
import Breadcrumbs from '@/app/ui/customers/breadcrumbs';
import { fetchCustomers } from '@/app/lib/data';
 
export default async function Page() {
  const customers = await fetchCustomers();
 
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: '员工管理', href: '/dashboard/management' },
          {
            label: '创建员工',
            href: '/dashboard/management/create',
            active: true,
          },
        ]}
      />
      <Form customers={customers} />
    </main>
  );
}