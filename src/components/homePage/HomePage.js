import Card from "./Card";
import { Loading, LoadingSmall } from "../common/Loading";
import React, { useEffect } from "react";

import { useAsyncList } from "@react-stately/data";
export default function HomePage() {
  let list = useAsyncList({
    async load() {
      let res = await fetch("/api/publicPost/all", {
        headers: {
          ContentType: "application/json",
        },
      });
      let json = await res.json();
      return { items: json };
    },
  });
  return (
    <>
      {list.isLoading ? (
        <div className="">
          <Loading />
        </div>
      ) : (
        <>
          {list.items.length > 0 ? (
            <div className="grid-col-1 md:grid-cols-2 grid p-1.5 mb-4 ">
              {list.items.map((item, index) => (
                <Card data={item} key={index} />
              ))}
            </div>
          ) : (
            <p>Chưa có Project</p>
          )}
        </>
      )}
    </>
  );
}
