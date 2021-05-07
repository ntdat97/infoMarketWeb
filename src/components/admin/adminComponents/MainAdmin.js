import { ReactNode } from "react";

export const MainAdmin = ({ subHeader, content }) => {
  return (
    <div className="overflow-auto">
      {subHeader}
      {content}
    </div>
  );
};
