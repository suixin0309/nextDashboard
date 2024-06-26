'use client';
import {
  UserGroupIcon,
  HomeIcon,
  DocumentDuplicateIcon,
  Cog6ToothIcon,
  BookmarkSquareIcon,
  UserIcon,
  ArrowRightStartOnRectangleIcon,
  ArrowRightEndOnRectangleIcon,
  ArchiveBoxIcon,
  QueueListIcon,
  ChartBarSquareIcon,
  BookmarkIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import { Accordion, AccordionItem, divider } from "@nextui-org/react";
// Map of links to display in the side navigation.
// Depending on the size of the application, this would be stored in a database.
import { useSession } from "next-auth/react"
// 从session里获取user员工的id

const links = [
  { name: '面板', href: '/dashboard', icon: ChartBarSquareIcon,auth:1 },
  { name: '会员管理', href: '/dashboard/customers', icon: UserGroupIcon,auth:2 },
  { name: '账单记录', href: '/dashboard/orders', icon: BookmarkIcon,auth:2  },
  { name: '员工管理', href: '/dashboard/management', icon: UserIcon ,auth:1 },
  {
    name: '耗材管理',
    href: '/dashboard/inventory',
    icon: ArchiveBoxIcon,
    auth:2 ,
    children: [
      {
        name: '耗材管理列表',
        href: '/dashboard/inventory/list',
        icon: QueueListIcon,
        auth:2 ,
      },
      {
        name: '入库列表',
        href: '/dashboard/inventory/inRecord',
        icon: ArrowRightStartOnRectangleIcon,
        auth:2 ,
      },
      
      {
        name: '出库列表',
        href: '/dashboard/inventory/outRecord',
        icon: ArrowRightEndOnRectangleIcon,
        auth:2 ,
      },
    ]
  },
  {
    name: '系统管理',
    href: '/dashboard/system',
    icon: Cog6ToothIcon,
    auth:2 ,
    children: [
      {
        name: '菜单项目管理',
        href: '/dashboard/system/projects',
        icon: BookmarkSquareIcon,
        auth:2 ,
      }, {
        name: '耗材类型管理',
        href: '/dashboard/system/inventory',
        icon: BookmarkSquareIcon,
        auth:2 ,
      }
    ]
  },
];

export default function NavLinks() {
  const pathname = usePathname();
  const session = useSession()?.data;
let user = session?.user?.id;
if(user){
  if (typeof window !== 'undefined') {
    localStorage.setItem('user', user);
  }
}else{
  if (typeof window !== 'undefined') {
    let user1=localStorage.getItem('user');
    user=user1?user1:'1';
  }
}
  let lateLinks=links;
if(user&&Number(user)!=1){
   lateLinks=links.filter((link)=>link.auth==2)
}
  return (
    <>
      <div className=''>
        {lateLinks.map((link) => {
          const LinkIcon = link.icon;
          if (link.children) {
            return (
              <Accordion key={link.name}
                className="text-sm font-semibold weight-500 rounded-md bg-gray-50 p-0 pr-2"
                style={{ fontSize: '14px',paddingTop:0,paddingBottom:0 }}
                isCompact
              >
                <AccordionItem key={link.name} aria-label={link.name}
                  className="rounded-md text-sm font-medium"
                  startContent={
                    <Link
                      key={link.name}
                      href="#"
                      className="flex h-[32px] grow items-center justify-center pl-3 gap-2 rounded-md bg-gray-50 text-sm font-medium hover:text-blue-600"
                    >
                      <LinkIcon className="w-6" />
                      <p className="hidden md:block">{link.name}</p>
                    </Link>
                  }
                >
                  {link.children.map((child) => {
                    let ChildLinkIcon = child.icon;
                    return (
                      <Link
                        key={child.name}
                        href={child.href}
                        className={clsx(
                          "flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 pl-5 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start",
                          { 'bg-sky-100 text-blue-600': pathname === child.href, }
                        )}
                      >
                        <ChildLinkIcon className="w-6" />
                        <p className="hidden md:block">{child.name}</p>
                      </Link>
                    )
                  })}
                </AccordionItem>
              </Accordion>
            )
          }
          else {
            return (
              <Link
                key={link.name}
                href={link.href}
                className={clsx(
                  "flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3",
                  { 'bg-sky-100 text-blue-600': pathname === link.href, }
                )}

              >
                <LinkIcon className="w-6" />
                <p className="hidden md:block">{link.name}</p>
              </Link>
            );
          }
        })}
      </div>
    </>
  );
}
