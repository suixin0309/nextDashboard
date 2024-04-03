import Form from '@/app/ui/customers/edit-form';
import Breadcrumbs from '@/app/ui/customers/breadcrumbs';
// import { fetchMember } from '@/app/lib/data';
import { fetchProjects, fetchMemberTickets,fetchMemberById } from '@/app/lib/data';
import { notFound } from 'next/navigation';
export default async function Page({ params }: { params: { id: string } }) {
    console.log(params)
    console.log(23456)
    const id = params.id;
    const [invoice, projects, tickets] = await Promise.all([
        fetchMemberById(id),
        fetchProjects(),
        fetchMemberTickets(id)
    ]);
    console.log(invoice)
    if (!invoice) {
        notFound();
    }
    return (
        <main>
            <Breadcrumbs
                breadcrumbs={[
                    { label: '会员管理', href: '/dashboard/customers' },
                    {
                        label: '编辑会员',
                        href: `/dashboard/customers/${id}/edit`,
                        active: true,
                    },
                ]}
            />
            <Form customer={invoice} projects={projects} tickets={tickets} />
        </main>
    );
}