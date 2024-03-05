import Form from '@/app/ui/orders/create-form';
import Breadcrumbs from '@/app/ui/customers/breadcrumbs';
import { fetchInvoiceById, fetchCustomers } from '@/app/lib/data';
import { notFound } from 'next/navigation';
export default async function Page({ params }: { params: { id: string } }) {
    const id = params.id;
    const [invoice, customers] = await Promise.all([
        fetchInvoiceById(id),
        fetchCustomers(),
    ]);
    if (!invoice) {
        notFound();
    }
    return (
        <main>
            <Breadcrumbs
                breadcrumbs={[
                    { label: '会员', href: '/dashboard/customers' },
                    {
                        label: '添加消费记录',
                        href: `/dashboard/orders/${id}/create`,
                        active: true,
                    },
                ]}
            />
            <Form customer={invoice} customers={customers} />
        </main>
    );
}