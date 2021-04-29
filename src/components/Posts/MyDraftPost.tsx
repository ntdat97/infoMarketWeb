import { Loading } from '@components/common/Loading';
import { useAsyncList } from '@react-stately/data';
import Link from 'next/link';
import React from 'react';

export const MyDraftPost = ({ user }) => {
  let list = useAsyncList({
    async load() {
      let res = await fetch('/api/posts/my-post?status=DRAFT', {
        headers: {
          Authorization: `Bearer ${await user.getIdToken()}`,
        },
      });

      let json = await res.json();
      return { items: json };
    },
  });

  return (
    <>
      {list.isLoading ? (
        <Loading />
      ) : (
        <div
          className="flex flex-col p-4 mx-auto"
          style={{
            maxWidth: '1128px',
          }}
        >
          <div className="flex justify-between items-center mt-6">
            <h1 className="text-3xl font-bold py-6">Bài viết của tôi</h1>
          </div>
          <div className="border-b pb-2">
            <a className="mr-6  border-black border-b pb-2.5" href="#">
              Bản nháp
            </a>
            <a className="mr-6" href="#">
              Đang chờ duyệt
            </a>
            <a className="mr-6" href="#">
              Đã đăng
            </a>
            <a className="mr-6" href="#">
              Lưu trữ
            </a>
          </div>

          {!list.items.length && (
            <div className="h-80 grid place-items-center">
              <div>
                <span className="font-semibold">Bạn chưa có bài đăng nào.</span>{' '}
                <Link href="/new">
                  <a className="hover:underline">Click vào đây để đăng bài.</a>
                </Link>
              </div>
            </div>
          )}

          {list.items.length > 0 &&
            (list.items as any).map((item) => (
              <div
                className="flex items-center justify-between border-b py-3"
                key={item.id}
              >
                <div className="flex items-center">
                  <a className="text-center" href="#">
                    <img
                      src={item.coverURL}
                      className="w-14 h-14 object-cover rounded-md"
                    />
                  </a>
                  <div className="ml-4">
                    <a
                      className="text-xl font-semibold hover:underline"
                      href="#"
                    >
                      {item.title}
                    </a>
                    <p className="text-gray-600 text-sm">{item.updatedAt}</p>
                  </div>
                </div>
                <div className="text-center">
                  <button className="focus:outline-none bg-gradient-to-r from-blue-400 to-blue-600 text-sm py-2 px-5 rounded-md text-white transform hover:from-blue-600 hover:to-blue-400 mr-5">
                    Chỉnh sửa
                  </button>
                  <button className="focus:outline-none bg-gradient-to-r from-red-400 to-red-600 text-sm py-2 px-5 rounded-md text-white transform hover:from-red-600 hover:to-red-400">
                    Xóa
                  </button>
                </div>
              </div>
            ))}
        </div>
      )}
    </>
  );
};
