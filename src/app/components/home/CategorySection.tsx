interface Props {
  emoji: string;
  title: string;
  posts: any[];
  lang: string;
}


export default function CategorySection({ emoji, title, posts = [], lang }: Props) {
  if (!posts.length) return null;

  return (
    <section>
      {/* TITLE */}
      <h2
        className={`text-xl font-bold mb-2 capitalize flex items-center gap-2 border-b-2 pb-2 border-orange-400 text-orange-600`}
      >
        <span>{emoji}</span>
        <span>{title}</span>
      </h2>

      {/* POSTS */}
      <div className="space-y-4 mt-4">
        {posts.map((post) => (
          <a
            key={post.slug}
            href={`/${lang}/${post.category}/${post.slug}`}
            className="flex gap-4 hover:text-orange-500 transition"
          >
            <img
              src={post.image}
              className="w-24 h-18 object-cover rounded"
            />
            <h3 className="font-semibold">
              {post.title}
            </h3>
          </a>
        ))}
      </div>
    </section>
  );
}
