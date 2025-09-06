import dynamic from "next/dynamic";

// クライアントサイト / サーバーサイト の切り分け → 情報搾取の防止
const NewsClient = dynamic (() => import("./NewsClient"), {ssr:!!false}) 

type ArticleProps = {
  title: string;
  description: string;
  url: string;
  image?: string;
  publishedAt: string;
  source?: { name: string; url: string };
};

async function fetchTopHeadlines() {
  const API_PATH = "/api/news?lang=ja&country=jp&max=10";
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL ?? ""}${API_PATH}`,
    {
      cache: "no-store",
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch news headlines.");
  }

  const data = await res.json();
  return data.articles ?? [];
}

export default async function NewsPage() {
  const articles: ArticleProps[] = await fetchTopHeadlines();

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1>ニュース検索</h1>
      <NewsClient/>
      <h1 className="text-2xl font-bold mb-6">最新ニュース</h1>
      <ul className="space-y-6">
        {articles.map((a) => (
          <li
            key={a.url}
            className="border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition"
          >
            <a href={a.url} target="_blank" rel="noreferrer" className="block">
              {a.image && (
                <img
                  src={a.image}
                  alt={a.title}
                  className="w-full rounded-md mb-4 object-cover"
                />
              )}
              <h2 className="text-xl font-semibold text-blue-600 hover:underline mb-2">
                {a.title}
              </h2>
            </a>
            <p className="mb-2 text-gray-700">{a.description}</p>
            <div className="text-sm text-gray-500">
              {a.source?.name && <span>{a.source.name}</span>}
              {a.source?.name && a.publishedAt && <span> | </span>}
              {a.publishedAt && (
                <span>
                  {new Date(a.publishedAt).toLocaleDateString("ja-JP")}
                </span>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}