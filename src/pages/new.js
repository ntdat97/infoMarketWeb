import React from "react";
import CreateProject from "../components/project/CreateProject";
import { Redirect } from "../components/common/Redirect";
import { Loading } from "../components/common/Loading";
import { useAuth } from "../fb/auth";

const NewPostPage = () => {
  const { user } = useAuth();
  if (user === null) {
    return <Loading />;
  }

  if (user === false) {
    return <Redirect />;
  }

  return <CreateProject />;
};
export default NewPostPage;
