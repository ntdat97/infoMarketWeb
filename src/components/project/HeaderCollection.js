import React from "react";
import { useRouter } from "next/router";
import { ArrowLeft } from "react-feather";
export const HeaderCollection = ({ data, user }) => {
  const router = useRouter();
  return (
    <>
      <div className="sticky top-0 right-0">
        {data.length > 0 ? (
          <div className="flex flex-row justify-between items-center p-4 border-b">
            <div>
              <button
                type="button"
                className="flex items-center text-gray-500 hover:text-gray-900"
                onClick={() => router.back()}
              >
                <ArrowLeft size={18} />
                <span className="ml-4 text-sm">Trở về</span>
              </button>
            </div>
            <div className="text-2xl font-semibold">
              {data[0].project.projectName}
            </div>
            <div>
              <button className="text-center text-white shadow bg-[#2e43ff] justify-center items-center rounded-xl h-full py-1 px-2">
                Xác nhận
              </button>
            </div>
          </div>
        ) : (
          <div> </div>
        )}
      </div>
    </>
  );
};
