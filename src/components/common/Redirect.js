import { useRouter } from "next/router";
import { useEffect } from "react";

export const Redirect = ({ to = "/profile" }) => {
  const router = useRouter();
  useEffect(() => {
    router.push(to);
  });
  return <></>;
};
