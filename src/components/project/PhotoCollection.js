import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { LayoutUser } from "..//userProject/LayoutUser";
import SideBar from "../common/SideBar";
import Header from "../common/Header";
import { Loading } from "../common/Loading";
import { MainUser } from "../userProject/MainUser";
import { PhotoCollectionMain } from "./PhotoCollectionMain";
import { HeaderCollection } from "./HeaderCollection";
import { Redirect } from "..//common/Redirect";
import { useAuth } from "../../fb/auth";

export const PhotoCollection = () => {
  const [status, setStatus] = useState(undefined);
  const [post, setPost] = useState(undefined);
  const { user } = useAuth();
  const router = useRouter();
  const slug = router.query.slug;
  const fetchPost = async () => {
    setStatus("loading");
    if (!slug) return;
    const req = await fetch(`/api/posts/photo-collection?slug=${slug}`, {
      headers: {
        Authorization: `Bearer ${await user.getIdToken(true)}`,
      },
    });

    const data = await req.json();
    console.log(data);
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
      <LayoutUser
        header={<Header />}
        sidebar={<SideBar />}
        main={
          status === "loading" ? (
            <Loading />
          ) : status === "ok" ? (
            <MainUser
              subHeader={<HeaderCollection data={post} user={user} />}
              content={<PhotoCollectionMain data={post} user={user} />}
            />
          ) : (
            <p>Something went wrong.</p>
          )
        }
      />
    </>
  );
};
