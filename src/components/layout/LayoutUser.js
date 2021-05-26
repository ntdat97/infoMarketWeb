import React, { ReactNode } from "react";

export const LayoutUser = ({
  header,
  sidebar,
  main,
  shadow = false,
  widthFull = false,
}) => {
  return (
    <div>
      {header}
      <div className="">
        {/*  <div className="w-1/6 sticky top-14 mt-3 border-r border-[#e6e6e6]  self-start">
          {sidebar}
        </div>
 */}
        <section>
          <div
            className={`${
              widthFull ? "max-w-full" : "max-w-[1108px]"
            } mx-auto mt-3 ${shadow ? "shadow" : ""}`}
          >
            {main}
          </div>
        </section>
      </div>
    </div>
  );
};
