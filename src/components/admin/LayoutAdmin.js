import React, { ReactNode } from "react";

export const LayoutAdmin = ({ header, sidebar, main }) => {
  return (
    <div>
      {header}
      <div className="flex">
        <div className="w-1/6">{sidebar}</div>

        <section className="w-5/6">{main}</section>
      </div>
    </div>
  );
};
