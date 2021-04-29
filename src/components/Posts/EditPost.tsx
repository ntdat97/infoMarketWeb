import { Loading } from '@components/common/Loading';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { UpdatePost } from './UpdatePost';

export const EditPost = ({ user }) => {
  const [status, setStatus] = useState(undefined);
  const [post, setPost] = useState(undefined);
  const router = useRouter();

  const slug = router.query.slug;

  const fetchPost = async () => {
    setStatus('loading');
    if (!slug) return;
    const req = await fetch(`/api/posts/preview-post?slug=${slug}`, {
      headers: {
        Authorization: `Bearer ${await user.getIdToken()}`,
      },
    });

    const data = await req.json();

    if (!req.ok) {
      setStatus('error');
    }
    setPost(data);
    setStatus('ok');
  };

  useEffect(() => {
    fetchPost();
  }, [slug]);


  return (
    <>
      {status === 'loading' ? (
        <Loading />
      ) : status === 'ok' ? (
        <>
          <UpdatePost post={post} user={user} />
        </>
      ) : (
        <p>Something went wrong.</p>
      )}
    </>
  );
};
