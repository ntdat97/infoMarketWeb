import { Loading } from "../common/Loading";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Project from "../layout/Project";

export const PreviewPost = ({ user }) => {
  const [status, setStatus] = useState(undefined);
  const [post, setPost] = useState(undefined);
  const router = useRouter();

  const slug = router.query.slug;

  const fetchPost = async () => {
    setStatus("loading");
    if (!slug) return;
    const req = await fetch(`/api/posts/preview-post?slug=${slug}`, {
      headers: {
        Authorization: `Bearer ${await user.getIdToken()}`,
      },
    });

    const data = await req.json();

    if (!req.ok) {
      setStatus("error");
    }
    setPost(data);
    setStatus("ok");
  };

  useEffect(() => {
    fetchPost();
  }, [slug]);

  return (
    <>
      {status === "loading" ? (
        <Loading />
      ) : status === "ok" ? (
        <>
          {/* {console.log(post.status)}
          {post.status === "DRAFT" && (
            <p className="bg-red-300 text-center p-2">
              <span className="font-medium text-sm">
                Bài viết chưa được đăng.
              </span>{" "}
              <Link
                href={{
                  pathname: "/[slug]/edit",
                  query: { slug },
                }}
              >
                <a className="hover:underline text-sm">
                  Click vào đây để chỉnh sửa
                </a>
              </Link>
            </p>
          )} */}

          {post.status === "PENDING" && (
            <p className="bg-red-200 text-center p-2">
              <span className="font-medium text-sm">
                Bài viết đang chờ kiểm duyệt.
              </span>{" "}
              <Link href={`/project/${slug}/edit`}>
                <a className="hover:underline text-sm">
                  Click vào đây để cập nhật.
                </a>
              </Link>
            </p>
          )}
          {post.status === "PUBLISHED" && (
            <p className="bg-green-200 text-center p-2">
              <span className="font-medium text-sm">Bài viết đã đăng.</span>{" "}
              <Link href={`/project/${slug}/edit`}>
                <a className="hover:underline text-sm">
                  Click vào đây để cập nhật.
                </a>
              </Link>
            </p>
          )}
          {post.status === "DELETED" && (
            <p className="bg-red-400 text-center p-2">
              <span className="font-medium text-sm">
                Bài viết đã được lưu trữ.
              </span>{" "}
            </p>
          )}
          <Project />
        </>
      ) : (
        <p>Something went wrong.</p>
      )}
    </>
  );
};
