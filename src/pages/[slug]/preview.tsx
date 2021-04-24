import { Footer } from "@components/common/Footer";
import { Loading } from "@components/common/Loading";
import { Redirect } from "@components/common/Redirect";
import { PostLayout } from "@components/Layout/LayoutPost";
import { HeaderPreview } from "@components/Posts/HeaderPreview";
import { PreviewPost } from "@components/Posts/PreviewPost";
import { useAuth } from "fb/auth";
import React from "react";

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
      footer={<Footer />}
    />
  );
};

export default PostPreviewPage;
