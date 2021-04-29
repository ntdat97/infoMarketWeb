import { ReactNode } from "react";

export const MainUser = ({ subHeader, content }) => {
  return (
    <div className="overflow-auto">
      {subHeader}
      {content}
    </div>
  );
};
