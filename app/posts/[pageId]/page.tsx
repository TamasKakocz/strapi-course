"use client";
import Link from "next/link";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const API_URL = "http://localhost:1337";

type Post = {
  data: {
    id: number;
    attributes: {
      description: string;
      likes: number;
      image: {
        data: {
          attributes: {
            url: string;
          };
        };
      };
    };
  };
};

type Posts = {
  data: Post[];
};

const FirstPage = ({ params: { pageId } }: { params: { pageId: string } }) => {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [post, setPost] = useState<Post | null>(null);

  console.log(pageId);

  useEffect(() => {
    const getPost = async () => {
      const res = await fetch(
        `http://localhost:1337/api/posts/${pageId}?populate=*`
      );
      const data = await res.json();

      setPost(data);
    };

    getPost();
  }, [pageId]);

  console.log(post, "data");

  const onDeletePostClick = async () => {
    const res = await fetch(`http://localhost:1337/api/posts/${pageId}`, {
      method: "DELETE",
    });
    const message = await res.json();
    if (!message.error) {
      router.back();
    }

    setMessage(message);
  };

  console.log(message, "message");

  const formatImageUrl = (url: string) => `${API_URL}${url}`;
  // console.log(posts.data && posts?.data[0].attributes.likes, "data");
  return (
    <main className="flex flex-col items-center justify-center p-24">
      <button
        onClick={() => router.back()}
        className="bg-black rounded-full hover:opacity-70 transition-all duration-500 hover:-translate-x-2 text-white font-bold p-2 mb-5 px-4"
      >
        Back
      </button>
      {/* @ts-ignore */}
      {post?.data && (
        <div className="flex flex-col max-w-[300px] max-h-[300px] min-h-[300px] m-6">
          <div className="flex bg-black rounded-xl p-3 max-h-[200px] min-h-[200px]">
            <img
              alt={post.data.attributes?.description}
              src={formatImageUrl(
                post?.data.attributes?.image.data.attributes.url
              )}
              width={300}
              height={300}
            />
          </div>

          <div className="flex flex-col bg-white rounded-lg p-4 w-full shadow mt-2">
            <span className="text-center mb-2">
              {post.data.attributes.description}
            </span>
            <span className="text-xl font-bold mx-auto">
              Likes: {post.data.attributes.likes}
            </span>
          </div>

          <button
            onClick={() => onDeletePostClick()}
            className="bg-red-700 p-2 px-4 hover:opacity-80 transition-all duration-300 rounded-md mt-2 text-white font-bold"
          >
            Delete Post
          </button>
        </div>
      )}
    </main>
  );
};

export default FirstPage;
