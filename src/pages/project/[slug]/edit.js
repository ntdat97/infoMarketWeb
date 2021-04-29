import React from "react";
import EditProject from "../../../components/project/EditProject";
import { Redirect } from "../../../components/common/Redirect";
import { Loading } from "../../../components/common/Loading";
import { useAuth } from "../../../fb/auth";

const Edit = () => {
  const { user } = useAuth();
  if (user === null) {
    return <Loading />;
  }

  if (user === false) {
    return <Redirect />;
  }

  return <EditProject />;
};
export default Edit;
