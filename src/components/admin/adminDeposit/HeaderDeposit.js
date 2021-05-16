import { ActiveLink } from "../../common/ActiveLink";
import { useAsyncList } from "@react-stately/data";
import React from "react";

export const HeaderDeposit = ({ user }) => {
  let list = useAsyncList({
    async load() {
      let res = await fetch("/api/admin/payment/withdraw-count", {
        headers: {
          Authorization: `Bearer ${await user.getIdToken(true)}`,
        },
      });

      let json = await res.json();
      return { items: json };
    },
  });
  /*  if (!list.isLoading && list.items.length > 0) {
    console.log(list.items)
    return <div>Bạn không có quyền để xem thông tin này</div>;
  } */
  return (
    <div className="flex px-6 py-3 border-b mt-2">
      <div className="pb-2 mx-3 text-sm ">
        <h2 className="font-bold text-xl mr-2">Thanh toán</h2>
      </div>
      <div className="border-l pl-2">
        <div className="ml-8">
          <ActiveLink
            href={{
              pathname: "/admin/payment/[status]",
              query: { status: "all" },
            }}
            activeClassName="border-b border-b-2 border-black font-semibold"
          >
            <a className="py-2 mx-3 text-sm">
              tất cả (
              {!list.isLoading &&
                list.items.length > 0 &&
                list.items[0]?.totalWithdrawStatusALL}
              )
            </a>
          </ActiveLink>

          <ActiveLink
            href={{
              pathname: "/admin/payment/[status]",
              query: { status: "paying" },
            }}
            activeClassName="border-b border-b-2 border-black font-semibold"
          >
            <a className="py-2 mx-3 text-sm">
              Chưa thanh toán (
              {!list.isLoading &&
                list.items.length > 0 &&
                list.items[0]?.totalWithdrawStatusPAYING}
              )
            </a>
          </ActiveLink>
          <ActiveLink
            href={{
              pathname: "/admin/payment/[status]",
              query: { status: "paid" },
            }}
            activeClassName="border-b border-b-2 border-black font-semibold"
          >
            <a className="py-2 mx-3 text-sm">
              Đã thanh toán (
              {!list.isLoading &&
                list.items.length > 0 &&
                list.items[0]?.totalWithdrawStatusPAID}
              )
            </a>
          </ActiveLink>

          <ActiveLink
            href={{
              pathname: "/admin/payment/[status]",
              query: { status: "reject" },
            }}
            activeClassName="border-b border-b-2 border-black font-semibold"
          >
            <a className="py-2 mx-3 text-sm">
              Đã từ chối (
              {!list.isLoading &&
                list.items.length > 0 &&
                list.items[0]?.totalWithdrawStatusREJECT}
              )
            </a>
          </ActiveLink>
        </div>
      </div>
    </div>
  );
};
