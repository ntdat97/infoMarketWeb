import React, { useEffect, useRef, useState } from 'react';
import { Edit2, Eye, Image, X } from 'react-feather';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { Uploader } from '@components/common/Upload';
import { useTopics } from 'hooks/api/useTopics';
import { useFormik } from 'formik';
import toast, { Toaster } from 'react-hot-toast';
import { useAuth } from 'fb/auth';
import { Topic } from '.prisma/client';
import { useRouter } from 'next/router';
import { Tooltip } from '@components/common/Tooltip';

const RichEditor = dynamic(() => import('@components/common/RichEditor'), {
  ssr: false,
});

export const UpdatePost = ({ user, post }) => {
  const router = useRouter();

  const instanceRef = useRef(null);
  const [coverImage, setCoverImage] = useState<any[]>([]);
  const [isShowUploader, setIsShowUploader] = useState<boolean>(false);

  const { topics, isLoading, isError } = useTopics();

  const formik = useFormik({
    initialValues: {
      title: post.title,
      topicId: post.topicId,
      coverURL: post.coverURL,
    },
    onSubmit: (values) => {
      alert(JSON.stringify(values, null, 2));
    },
  });

  useEffect(() => {
    if (coverImage.length > 0) {
      formik.setFieldValue('coverURL', coverImage[0].response.body.data[0].url);
    } else {
      formik.setFieldValue('coverURL', post.coverURL);
    }
  }, [coverImage]);

  async function handlePendingPost() {
    if (!formik.values.title) {
      return toast.error(`Tiêu đề không được bỏ trống.`);
    }
    if (!formik.values.topicId) {
      return toast.error(`Chủ đề không được bỏ trống.`);
    }
    const token = await user.getIdToken();
    const content = await instanceRef.current.save();
    const req = await fetch('/api/posts/update-post', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        slug: post.slug,
        ...formik.values,
        status: 'PENDING',
        content: JSON.stringify(content),
      }),
    });

    const result = await req.json();

    if (req.ok) {
      toast.success(
        'Đăng bài thành công. Bài viết sẽ được đăng sau khi được duyệt.',
        {
          duration: 4000,
        }
      );
      router.push(`/${result.data.slug}/preview`);
    } else {
      toast.error('Có lỗi xảy ra, Vui lòng thử lại.');
    }
  }

  async function handleDraftPost() {
    if (!formik.values.title) {
      return toast.error(`Tiêu đề không được bỏ trống.`);
    }
    if (!formik.values.topicId) {
      return toast.error(`Chủ đề không được bỏ trống.`);
    }

    const token = await user.getIdToken();
    const content = await instanceRef.current.save();
    const req = await fetch('/api/posts/update-post', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        slug: post.slug,
        ...formik.values,
        status: 'DRAFT',
        content: JSON.stringify(content),
      }),
    });

    const result = await req.json();

    if (req.ok) {
      toast.success('Đã lưu bản nháp thành công.', {
        duration: 4000,
      });
    } else {
      toast.error('Có lỗi xảy ra, Vui lòng thử lại.');
    }
  }

  return (
    <div className="overflow-auto h-screen">
      <div>
        <Toaster />
      </div>
      <div className="w-full sticky top-0 left-0 px-6 bg-white shadow-sm flex justify-between items-center pb-2 z-50">
        <div className="flex item-center mt-2">
          <Link href="/">
            <a href="/">
              <img src="/logo_single.svg" className="h-10" />
            </a>
          </Link>

          <Link
            href={{
              pathname: '/me/articles/[status]',
              query: {
                status: 'all',
              },
            }}
          >
            <a className="ml-8 flex items-center focus:outline-none text-black text-sm py-2 px-5 rounded hover:bg-gray-100 hover:font-semibold">
              Bài viết của tôi
            </a>
          </Link>
        </div>
        <div className="flex items-center">
          <div className="inline-block mr-4 mt-2">
            <Link
              href={{
                pathname: `/[slug]/preview`,
                query: { slug: router.query.slug },
              }}
            >
              <a className="flex items-center">
                <Eye size={16} className="text-gray-400 mr-2" />
                <span className="hover:underline text-sm"> Xem trước</span>
              </a>
            </Link>
          </div>

          <div className="inline-block mr-4 mt-2">
            <button
              onClick={handleDraftPost}
              type="button"
              className="border border-white focus:outline-none text-black text-sm py-2 px-4 rounded hover:bg-gray-100"
            >
              Lưu bản nháp
            </button>
          </div>

          <div className="inline-block mr-2 mt-2">
            <button
              onClick={handlePendingPost}
              type="button"
              className="focus:outline-non text-sm py-2 px-4 rounded border border-gray-800 hover:bg-black hover:text-white text-black"
            >
              Đăng bài
            </button>
          </div>
        </div>
      </div>
      <div
        className="mx-auto max-w-[860px]"
        style={{ height: 'calc(100vh - 56px)' }}
      >
        <div className="mx-8">
          <div className="pt-8 flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={() => setIsShowUploader(true)}
                type="button"
                className="flex items-center focus:outline-none text-black text-base py-2 px-5 rounded-md hover:bg-gray-100"
              >
                <Image size={24} className="text-gray-400" />
                <span className="ml-2">
                  {!formik.values.coverURL ? 'Thêm' : 'Cập nhật'} ảnh bìa
                </span>
                {isShowUploader ? (
                  <Uploader
                    isOpen={isShowUploader}
                    setIsOpen={setIsShowUploader}
                    setOutFile={setCoverImage}
                  />
                ) : null}
              </button>
            </div>

            <select
              name="topicId"
              value={formik.values.topicId}
              onChange={formik.handleChange}
              className=" mt-1 rounded-md bg-gray-100 border-transparent focus:border-gray-500 focus:bg-white focus:ring-0"
            >
              <option>Chọn chủ đề</option>
              {!isLoading &&
                !isError &&
                topics.map((item: Topic) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
            </select>
          </div>

          <div className="my-4">
            {formik.values.coverURL && (
              <div className="relative">
                <img
                  className="rounded-md object-cover h-56 w-full"
                  src={`${formik.values.coverURL}`}
                />
                <button
                  onClick={() => setCoverImage([])}
                  type="button"
                  className="absolute top-1 right-1 p-4 flex items-center focus:outline-none text-black text-base py-2 px-5 rounded-md hover:bg-gray-100"
                >
                  <X size={24} className="text-red-600" />
                  <span className="ml-2">Xóa</span>
                </button>
              </div>
            )}
          </div>
          <div className="mt-4">
            <textarea
              name="title"
              value={formik.values.title}
              onChange={formik.handleChange}
              placeholder="Tiêu đề bài viết..."
              className="border-none focus:outline-none w-full px-4 mt-2 text-3xl font-bold leading-snug bg-transparent appearance-none resize-none text-brand-black dark:text-white placeholder-brand-grey-500"
            ></textarea>
          </div>

          <div className="px-4">
            <RichEditor
              instanceRef={instanceRef}
              placeholder="Nội dung bài viêt..."
              data={JSON.parse(post.content)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
