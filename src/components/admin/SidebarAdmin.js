import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { Feather, Grid, Hash, Tag, Users } from "react-feather";

const MENU_SIDEBAR = [
  {
    id: 1,
    label: "Trang chủ",
    icon: <Grid size={18} />,
    link: "/admin/dashboard",
    key: "dashboard",
  },
  {
    id: 2,
    label: "Bài viết",
    icon: <Feather size={18} />,
    key: "posts",
    link: "/admin/posts/all",
  },
  {
    id: 3,
    label: "Thành viên",
    icon: <Users size={18} />,
    link: "/admin/members",
  },
  {
    id: 4,
    label: "Chủ đề",
    icon: <Tag size={18} />,
    link: "/topics",
  },
  {
    id: 5,
    label: "Hashtag",
    icon: <Hash size={18} />,
    link: "/hashtags",
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
