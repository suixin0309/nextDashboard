import Form from '@/app/ui/management/edit-form';
import Breadcrumbs from '@/app/ui/customers/breadcrumbs';
// import { fetchMember } from '@/app/lib/data';
import { fetchManagementById } from '@/app/lib/data';
import { notFound } from 'next/navigation';
export default async function Page({ params }: { params: { id: number } }) {
    const id = params.id;
    console.log(id)
    const [invoice] = await Promise.all([
        fetchManagementById(id),
    ]);
    console.log(23456)
    console.log(invoice)
    if (!invoice) {
        notFound();
    }
    return (
        <main>
            <Breadcrumbs
                breadcrumbs={[
                    { label: '员工管理', href: '/dashboard/management' },
                    {
                        label: '编辑员工',
                        href: `/dashboard/management/${id}/edit`,
                        active: true,
                    },
                ]}
            />
            <Form management={invoice} />
        </main>
    );
}