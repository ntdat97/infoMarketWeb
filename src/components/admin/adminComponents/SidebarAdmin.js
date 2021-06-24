import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { Users, Image, Folder, DollarSign, CreditCard } from "react-feather";

const MENU_SIDEBAR = [
  {
    id: 1,
    label: "Dự án",
    icon: <Folder size={18} />,
    key: "posts",
    link: "/admin/projects/all",
  },
  {
    id: 2,
    label: "Hình ảnh",
    icon: <Image size={18} />,
    link: "/admin/contribute/all",
  },
  {
    id: 3,
    label: "Thành viên",
    icon: <Users size={18} />,
    link: "/admin/members/all",
  },
  {
    id: 4,
    label: "Rút tiền",
    icon: <DollarSign size={18} />,
    link: "/admin/payment/all",
  },
  {
    id: 5,
    label: "Nạp tiền",
    icon: <CreditCard size={18} />,
    link: "/admin/deposit/all",
  },
];

export const SidebarAdmin = ({ user }) => {
  const router = useRouter();
  return (
    <>
      <div
        className="border-r overflow-auto"
        style={{ height: "calc(100vh - 48px)" }}
      >
        <ul className="py-4">
          {MENU_SIDEBAR.map((item) => (
            <li className="text-gray-600" key={item.id}>
              <Link href={item.link}>
                <a
                  className={
                    router.pathname.includes(item.key)
                      ? "py-3 px-6 text-sm  flex items-center hover:bg-gray-100 bg-gray-100 border-r-2 border-black"
                      : "py-3 px-6 text-sm  flex items-center hover:bg-gray-100"
                  }
                >
                  {item.icon}
                  <span className="ml-2">{item.label}</span>
                </a>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};
