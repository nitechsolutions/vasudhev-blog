interface Props {
  posts: any[];
  lang: string;
}

export default function FeaturedSection({ posts = [], lang }: Props) {
  if (!posts.length) return null;

  const [mainPost] = posts;

  return (
    <section>
      <a href={`/${lang}/${mainPost.category}/${mainPost.slug}`}>
        <img
          src={mainPost.image}
          className="w-full h-[230px] object-cover rounded"
        />
        <h2 className="text-2xl font-bold mt-4">{mainPost.title}</h2>
        <p className="text-gray-600 mt-2">{mainPost.excerpt}</p>
      </a>
    </section>
  );
}
