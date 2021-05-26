import Link from "next/link";
import React from "react";
import { MenuAdmin } from "./MenuAdmin";

export const HeaderAdmin = ({ user }) => {
  return (
    <>
      <div className="flex justify-between items-center h-12 border-b m-auto px-6">
        <div>
          <Link href="/">
            <a>
              <img src="/trove-icon.png" alt="icon.png" className="w-8" />
            </a>
          </Link>
        </div>
        <div>
          <MenuAdmin user={user} />
        </div>
      </div>
    </>
  );
};
