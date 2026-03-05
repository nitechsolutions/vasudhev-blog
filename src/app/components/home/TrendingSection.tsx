import { posts } from "@/data/posts"
import PostCard from "../common/PostCard"

export default function TrendingSection() {
  const trending = posts.filter(p => p.is_trending)

  return (
    <div>
      <h2 className="text-xl font-bold mb-4 pb-2 text-red-600 border-b">
        Trending
      </h2>
      <div className="space-y-4">
        {trending.map(post => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  )
}
