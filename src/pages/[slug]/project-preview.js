import { Loading } from "../../components/common/Loading";
import { Redirect } from "../../components/common/Redirect";
import { PostLayout } from "../../components/layout/LayoutPost";
import { HeaderPreview } from "../../components/Posts/HeaderPreview";
import Project from "../../components/layout/Project";
import { PreviewPost } from "../../components/userProject/PreviewPost";
import { useAuth } from "../../fb/auth";
import React from "react";
import { useRouter } from "next/router";
import { useAsyncList } from "@react-stately/data";
export const PostPreviewPage = () => {
  const { user } = useAuth();

  if (user === null) {
    return <Loading />;
  }

  if (user === false) {
    return <Redirect />;
  }

  return (
    <PostLayout
      header={<HeaderPreview user={user} />}
      main={<PreviewPost user={user} />}
      /* footer={<Footer />} */
    />
  );
};

export default PostPreviewPage;
