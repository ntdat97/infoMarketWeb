import { useAuth } from "../../../fb/auth";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import React from "react";
import { ChevronDown } from "react-feather";
import toast from "react-hot-toast";
import { Arrow, useLayer } from "react-laag";

export const MenuAdmin = ({ user }) => {
  const [isOpen, setOpen] = React.useState(false);
  const { signout } = useAuth();

  function close() {
    setOpen(false);
  }

  const { renderLayer, triggerProps, layerProps, arrowProps } = useLayer({
    isOpen,
    onOutsideClick: close,
    onDisappear: close,
    overflowContainer: false,
    auto: true,
    placement: "bottom-end",
    triggerOffset: 12,
    containerOffset: 16,
    arrowOffset: 16,
  });

  return (
    <>
      <button
        {...triggerProps}
        onClick={() => setOpen(!isOpen)}
        className="flex items-center focus:outline-none"
      >
        <img src={user?.photoURL} className="ml-4 rounded-full w-8 h-8" />
        <span className="text-sm mx-2">{user?.displayName}</span>
        <span className="text-xs bg-[#fff7e6] text-[#fa8c16] border-[#ffd591] p-1 mx-1 font-semibold">
          ADMIN
        </span>
        <span className="">
          <ChevronDown size={18} />
        </span>
      </button>
      {renderLayer(
        <AnimatePresence>
          {isOpen && (
            <motion.ul
              {...layerProps}
              className="shadow-xl  bg-white w-52 rounded-md border border-gray-200"
            >
              <Link href="/new">
                <a>
                  <li className="py-2 px-4 mx-0 hover:bg-gray-50 ">
                    Tạo dự án mới
                  </li>
                </a>
              </Link>
              <Link
                href={{
                  pathname: "/my-projects/[status]",
                  query: {
                    status: "all",
                  },
                }}
              >
                <a>
                  <li className="py-2 px-4 mx-0 hover:bg-gray-50 ">
                    Dự án của tôi
                  </li>
                </a>
              </Link>
              <Link href="/admin/projects/all">
                <a>
                  <li className="py-2 px-4 mx-0 hover:bg-gray-50 ">
                    Admin dashboard
                  </li>
                </a>
              </Link>
              <li className="py-2 px-4 mx-0 hover:bg-gray-50 ">
                <button
                  className="block w-full text-left"
                  type="button"
                  onClick={signout}
                >
                  Đăng xuất
                </button>
              </li>
              <span className="border-gray-700">
                <Arrow {...arrowProps} borderColor={"#e5e7eb"} />
              </span>
            </motion.ul>
          )}
        </AnimatePresence>
      )}
    </>
  );
};
