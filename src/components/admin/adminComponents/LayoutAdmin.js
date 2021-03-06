import React, { ReactNode } from "react";

export const LayoutAdmin = ({ header, sidebar, main }) => {
  return (
    <div>
      {header}
      <div className="flex">
        <div className="w-1/6 sticky top-12 border-r border-[#e6e6e6]  self-start">
          {sidebar}
        </div>

        <section className="w-11/12">
          <div className="max-w-[1108px] mx-auto ">{main}</div>
        </section>
      </div>
    </div>
  );
};
