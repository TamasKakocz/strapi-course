"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const API_URL = "http://localhost:1337";

type Post = {
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

type Posts = {
  data: Post[];
};

export default function Home() {
  const [posts, setPosts] = useState<Posts | null>(null);

  useEffect(() => {
    const getPost = async () => {
      const res = await fetch("http://localhost:1337/api/posts?populate=*");
      const data = await res.json();

      setPosts(data);
    };

    getPost();
  }, []);

  const formatImageUrl = (url: string) => `${API_URL}${url}`;
  // console.log(posts.data && posts?.data[0].attributes.likes, "data");
  return (
    <main className="flex min-h-screen items-center justify-center p-24">
      <div className="grid grid-cols-2">
        {/* @ts-ignore */}
        {posts?.data.map((post, index) => (
          <Link
            href={`posts/${post.id}`}
            key={index}
            className="flex flex-col max-w-[300px] max-h-[300px] min-h-[300px] m-6 group"
          >
            <div className="flex bg-black rounded-xl p-3 max-h-[200px] min-h-[200px] overflow-hidden">
              <img
                alt={post.attributes.description}
                src={formatImageUrl(post.attributes.image.data.attributes.url)}
                width={300}
                height={300}
                className="group-hover:scale-125 duration-500 transition-all"
              />
            </div>

            <div className="flex flex-col bg-white rounded-lg p-4 w-full shadow mt-2 min-h-[120px] justify-center">
              <span className="text-center mb-2">
                {post.attributes.description}
              </span>
              <span className="text-xl font-bold mx-auto">
                Likes: {post.attributes.likes}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
