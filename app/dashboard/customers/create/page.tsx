import Form from '@/app/ui/customers/create-form';
import Breadcrumbs from '@/app/ui/customers/breadcrumbs';
 
export default async function Page() {
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: '会员管理', href: '/dashboard/customers' },
          {
            label: '创建会员',
            href: '/dashboard/customers/create',
            active: true,
          },
        ]}
      />
      <Form />
    </main>
  );
}