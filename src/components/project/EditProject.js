import { useState, useEffect } from "react";
import { useAuth } from "../../fb/auth";
import { useRouter } from "next/router";
import { Loading } from "../../components/common/Loading";
import UpdateProject from "./UpdateProject";
const EditProject = () => {
  const [status, setStatus] = useState(undefined);
  const [post, setPost] = useState(undefined);
  const [payment, setPayment] = useState(undefined);
  const { user } = useAuth();
  //fetch post
  const router = useRouter();
  const slug = router.query.slug;
  const fetchPost = async () => {
    setStatus("loading");
    if (!slug) return;
    const req = await fetch(`/api/posts/edit-post?slug=${slug}`, {
      headers: {
        Authorization: `Bearer ${await user.getIdToken(true)}`,
      },
    });
    let payment = await fetch("/api/profile/get-payment-method", {
      headers: {
        "Content-Type": "application/json",
      },
    });
    const paymentJson = await payment.json();
    const data = await req.json();
    if (!req.ok) {
      setStatus("error");
    }
    setPayment(paymentJson);
    setPost(data);
    setStatus("ok");
  };
  useEffect(() => {
    fetchPost();
  }, [slug]);
  if (status === "ok" && post.status === "DELETED") {
    return <div> Bài viết đã xóa không thể chỉnh sửa</div>;
  }
  if (status === "ok" && post?.id === "unauth") {
    return <div> Bạn không có quyền sửa bài viết này</div>;
  }
  return (
    <>
      {status === "loading" ? (
        <Loading />
      ) : status === "ok" ? (
        <>
          <UpdateProject post={post} user={user} payment={payment} />
        </>
      ) : (
        <p>Something went wrong.</p>
      )}
    </>
  );
};
export default EditProject;
