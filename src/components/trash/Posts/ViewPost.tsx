import Blocks from 'editorjs-blocks-react-renderer';
import { dateFromNow } from 'libs/dateFromNow';
import Link from 'next/link';
import { PostPageProps } from 'pages/[slug]';
import React from 'react';
import { Facebook, Instagram, Youtube, Linkedin } from 'react-feather';

export const ViewPost = ({ post }: PostPageProps) => {

  return (
    <>
      <div className="flex mx-auto max-w-[1118px] mb-8">
        <div className="w-2/12  mt-48">
          <div className="flex flex-col items-start justify-start">
            <Link href="/profile">
              <a>
                <img
                  src="/default_profile.png"
                  className="rounded-full w-16 h-16 mb-3"
                />
              </a>
            </Link>
            <Link href="/profile">
              <a className="mb-2 font-semibold text-base text-[#222b45]">
                {post.author.name}
              </a>
            </Link>
            <div className="text-gray-400 text-xs mb-4">
              {dateFromNow(post.createdAt)}
            </div>
            <a
              className="text-gray-600 font-semibold uppercase text-sm hover:underline"
              href="#"
            >
              {post.topic.name}
            </a>
          </div>
          <div className="sticky top-20 left-0 mt-60 flex flex-col items-start">
            <a
              href="https://www.facebook.com"
              className="p-3 bg-[#f1f2fc] hover:bg-white rounded-full mb-6"
            >
              <Facebook size={18} />
            </a>
            <a
              href="https://www.instagram.com"
              className="p-3 bg-[#f1f2fc] hover:bg-white rounded-full mb-6"
            >
              <Instagram size={18} />
            </a>
            <a
              href="https://www.youtube.com"
              className="p-3 bg-[#f1f2fc] hover:bg-white rounded-full mb-6"
            >
              <Youtube size={18} />
            </a>
            <a
              href="https://www.linkedin.com"
              className="p-3 bg-[#f1f2fc] hover:bg-white rounded-full mb-6"
            >
              <Linkedin size={18} />
            </a>
          </div>
        </div>
        <div className="w-10/12 bg-white rounded-sm  px-10 py-10  min-w-5xl  overflow-x-hidden xl:overflow-visible  place-items-center">
          <div className="font-bold text-4xl text-center text-[#222b45] leading-snug">
            {post.title}
          </div>
          <img src={post.coverURL} className="w-full rounded-md my-10" />
          <article className="prose items-center">
            <Blocks data={JSON.parse(post.content)} />
          </article>
        </div>
        <div className="w-1/12"></div>
      </div>
    </>
  );
};
