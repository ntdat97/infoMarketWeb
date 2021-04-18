import { ReactNode } from "react";

export const MainAdmin = ({ subHeader, content }) => {
  return (
    <div style={{ height: "calc(100vh - 48px)" }} className="overflow-auto">
      {subHeader}
      {content}
    </div>
  );
};
