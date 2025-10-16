"use client"; 
// このコンポーネントはクライアント側で動くように指定
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

// ニュース記事1件分の型定義（データの形を決めるやつ）
type Article = {
  title: string;
  description: string;
  url: string;
  image?: string;
  publishedAt: string;
  source?: { name: string; url: string };
  topic?: string;
};

// カテゴリ名 → APIで使うトピック名 の対応表
const CATEGORY_TO_TOPIC: Record<string, string> = {
  top: "top",
  national: "national",
  world: "world",
  technology: "technology",
  business: "business",
  entertainment: "entertainment",
};

export default function NewsClient() {
  // 🔍 URLパラメータ（検索クエリやカテゴリ）を取得
  const searchParams = useSearchParams();
  const query = searchParams.get("q") ?? ""; // 検索キーワード
  const category = searchParams.get("category") ?? ""; // カテゴリ名

  // 🌀 状態管理：ロード中・ニュース記事一覧・エラーメッセージ
  const [loading, setLoading] = useState(false);
  const [articles, setArticles] = useState<Article[]>([]);
  const [error, setError] = useState<string | null>(null);

  // ページ上部タイトル（検索結果 or カテゴリ or トップニュース）
  const title = query.trim()
    ? "検索結果"
    : category
    ? `カテゴリ: ${category}`
    : "トップニュース";

  // ニュースを取得する関数（API叩く部分）
  async function load(searchQuery: string) {
    setLoading(true);
    setError(null);

    // API用のクエリパラメータ作成
    const params = new URLSearchParams({ lang: "ja", country: "jp", max: "10" });
    if (searchQuery.trim()) params.set("q", searchQuery.trim());
    if (category && CATEGORY_TO_TOPIC[category]) {
      params.set("topic", CATEGORY_TO_TOPIC[category]);
    }

    try {
      // 🧠 実際にAPI叩く
      const res = await fetch(`/api/news?${params.toString()}`, { cache: "no-store" });
      const data = await res.json();

      if (!res.ok) throw new Error(data?.error ?? "ニュースの取得に失敗しました");

      // 記事リストをstateにセット
      setArticles(data.articles ?? []);
    } catch (e: unknown) {
      // エラー時の処理
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      // ローディング終了
      setLoading(false);
    }
  }

  // ページの最初の読み込み + クエリやカテゴリ変更時に再取得
  useEffect(() => {
    load(query);
  }, [query, category]);

  // 表示用に記事を3つのカテゴリに分割
  const topNews = articles.slice(0, 1);
  const subNews = articles.slice(1, 3);
  const otherNews = articles.slice(3, 9);

  return (
    <div className="bg-[rgb(var(--color-bg))] transition-colors duration-300 mx-[var(--space-page)]">
      {/* ローディング */}
      {loading && (
        <div className="flex flex-col items-center justify-center min-h-[70vh] text-center p-4 bg-body text-main transition-colors duration-300">
          <img
            src="/undraw_data-at-work_3tbf.svg"
            alt="Loading Illustration"
            className="w-102 animate-pulse mb-6"
          />
          <p className="h2 animate-bounce">ただいまニュースを集めています…</p>
        </div>
      )}

      {/* エラー */}
      {error && (
        <div className="flex flex-col items-center justify-center min-h-[70vh] text-center p-4 bg-body text-main transition-colors duration-300">
          <img
            src="/undraw_page-eaten_b2rt.svg"
            alt="Error Illustration"
            className="w-44 mb-6"
          />
          <h2 className="text-error-number mb-3">404</h2>
          <p className="text-button-error mb-6">ニュースが迷子です…</p>
          <button
            onClick={() => load(query)}
            className="text-button-error bg-[rgb(var(--color-primary))] text-white px-8 py-4 rounded-common hover:bg-[rgb(var(--color-btn-hover))] active:bg-[rgb(var(--color-btn-active))] focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-btn-focus))] transition"
          >
            再試行
          </button>
        </div>
      )}

      {/* ニュースリスト */}
      {!loading && !error && articles.length > 0 && (
        <>
          {/* トップニュース */}
          {topNews.length > 0 && (
            <section className="mb-[var(--space-section)] max-w-[1376px]">
              <h1 className="h1 mb-[var(--space-page)]">{title}</h1>
              <div className="grid grid-cols-1 gap-[var(--space-card-gap)]">
                {topNews.map((a, i) => (
                  <a
                    key={i}
                    href={a.url}
                    target="_blank"
                    rel="noreferrer"
                    className="block rounded-top overflow-hidden shadow-box bg-[rgb(var(--color-bg))] border-3 border-[rgb(var(--color-border))] hover:shadow-lg transition"
                    >
                    {a.image && (
                      <img
                        src={a.image}
                        alt={a.title}
                        className="w-full h-[459px] object-cover"
                      />
                    )}
                    <div className="p-[var(--topnews-padding)]">
                      {a.topic && <span className="category-top">{a.topic}</span>}
                      <h2 className="h1 mt-2 mb-4">{a.title}</h2>
                      {a.description && <p className="text-body mb-2">{a.description}</p>}
                      <div className="text-sub">
                        {a.source?.name && <span>{a.source.name}</span>}
                        {a.publishedAt && (
                          <span className="ml-2">
                            {new Date(a.publishedAt).toLocaleDateString("ja-JP")}
                          </span>
                        )}
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </section>
          )}

          {/* サブニュース */}
          {subNews.length > 0 && (
            <section className="mb-[var(--space-section)]">
              <h2 className="h2 mb-[var(--space-page)]">サブニュース</h2>
              <div className="grid grid-cols-2 gap-[var(--space-card-gap)]">
                {subNews.map((a, i) => (
                  <a
                    key={i}
                    href={a.url}
                    target="_blank"
                    rel="noreferrer"
                    className="block rounded-top overflow-hidden shadow-box bg-[rgb(var(--color-bg))] border-3 border-[rgb(var(--color-border))] hover:shadow-lg transition"
                    >
                    {a.image && (
                      <img
                        src={a.image}
                        alt={a.title}
                        className="w-full h-[249px] object-cover"
                      />
                    )}
                    <div className="p-4">
                      <h3 className="h2 my-2">{a.title}</h3>
                      <div className="text-sub">
                        {a.source?.name && <span>{a.source.name}</span>}
                        {a.publishedAt && (
                          <span className="ml-2">
                            {new Date(a.publishedAt).toLocaleDateString("ja-JP")}
                          </span>
                        )}
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </section>
          )}

          {/* その他ニュース */}
          {otherNews.length > 0 && (
            <section>
              <h3 className="h3 mb-[var(--space-page)]">その他のニュース</h3>
              <div className="grid grid-cols-3 gap-[var(--space-card-gap)]">
                {otherNews.map((a, i) => (
                  <a
                    key={i}
                    href={a.url}
                    target="_blank"
                    rel="noreferrer"
                    className="block rounded-top overflow-hidden shadow-box bg-[rgb(var(--color-bg))] border-3 border-[rgb(var(--color-border))] hover:shadow-lg transition"
                    >
                    {a.image && (
                      <img
                        src={a.image}
                        alt={a.title}
                        className="w-full h-40 object-cover"
                      />
                    )}
                    <div className="p-4">
                      <h3 className="h3 mt-2 mb-1">{a.title}</h3>
                      <div className="text-sub text-[rgb(var(--color-text))]">
                        {a.source?.name && <span>{a.source.name}</span>}
                        {a.publishedAt && (
                          <span className="ml-1">
                            {new Date(a.publishedAt).toLocaleDateString("ja-JP")}
                          </span>
                        )}
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}
