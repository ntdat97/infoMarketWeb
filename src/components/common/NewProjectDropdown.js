import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import React from "react";
import { ChevronDown } from "react-feather";
import toast from "react-hot-toast";
import { Arrow, useLayer } from "react-laag";
import { useAuth } from "../../fb/auth";
export const NewProjectDropdown = () => {
  const [isOpen, setOpen] = React.useState(false);
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
        <div className="text-center shadow bg-[#21b532] justify-center items-center rounded-xl h-full py-1 px-2">
          <div className="text-white">Thêm mới</div>
          {/*           <span className="">
            <ChevronDown size={18} />
          </span> */}
        </div>
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
                    Dự án thu thập hình ảnh
                  </li>
                </a>
              </Link>
              <Link href="/new-map-project">
                <a>
                  <li className="py-2 px-4 mx-0 hover:bg-gray-50 ">
                    Dự án thu thập hình ảnh trên bản đồ
                  </li>
                </a>
              </Link>

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
