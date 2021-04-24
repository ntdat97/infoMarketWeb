import { Footer } from '@components/common/Footer';
import { Header } from '@components/common/header';
import { PostLayout } from '@components/Layout/LayoutPost';
import { ViewPost } from '@components/Posts/ViewPost';
import { Prisma } from '@prisma/client';
import React from 'react';

type PostWithAuthorAndTopic = Prisma.PostGetPayload<{
  include: { author: true; topic: true };
}>;

export interface PostPageProps {
  post: PostWithAuthorAndTopic;
}

export const PostPage = ({ post }: PostPageProps) => {
  return (
    <PostLayout
      header={<Header />}
      main={<ViewPost post={post} />}
      footer={<Footer />}
    />
  );
};

export async function getServerSideProps(ctx) {
  const slug = ctx.query.slug;

  const req = await fetch(
    `http://localhost:3000/api/posts/view-post?slug=${slug}`
  );

  const post = await req.json();

  if (!req.ok) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      post,
    },
  };
}

export default PostPage;
