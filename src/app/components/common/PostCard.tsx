import { Post } from "@/types/post"
import Link from "next/link"

export default function PostCard({ post }: { post: Post }) {
  return (
     <article className="flex gap-4 ">
      <Link
        href={`/${post.category}/${post.slug}`}
        className="flex gap-4"
      >
        <div className="relative w-32 h-24 rounded-md overflow-hidden flex-shrink-0">
          <img
            src={post.image}
            alt={post.title}
            className="object-cover group-hover:scale-105 w-full h-full transition duration-300"
          />
        </div>

        <div>
          <h3 className="font-semibold leading-snug group-hover:text-red-600 transition">
            {post.title}
          </h3>
        </div>
      </Link>
    </article>
  )
}
