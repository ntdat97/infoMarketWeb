import { Loading } from '@components/common/Loading';
import { Redirect } from '@components/common/Redirect';
import { EditPost } from '@components/Posts/EditPost';
import { useAuth } from 'fb/auth';
import React from 'react';

export const PostPreviewPage = () => {
  const { user } = useAuth();

  if (user === null) {
    return <Loading />;
  }

  if (user === false) {
    return <Redirect />;
  }

  return <EditPost user={user} />;
};

export default PostPreviewPage;
