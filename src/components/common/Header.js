import { HeaderGuess } from "./HeaderGuess";
import { HeaderLogin } from "./HeaderLogin";
import { useAuth } from "../../fb/auth";
import { UserBennedModal } from "../modal/UserBannedModal";
import React, { useState } from "react";
export function Header() {
  const [modalBannedVisible, setModalBannedVisible] = useState(false);
  const { user } = useAuth();
  const { signout } = useAuth();
  const HeaderUser = () => {
    if (user?.userState === "BANNED") {
      signout();
      setModalBannedVisible(true);
      return <HeaderGuess />;
    } else {
      if (user) {
        return <HeaderLogin user={user} />;
      } else {
        return <HeaderGuess />;
      }
    }
  };
  return (
    <>
      <UserBennedModal
        modalVisible={modalBannedVisible}
        setModalVisible={setModalBannedVisible}
      />
      <HeaderUser />
    </>
  );
}
