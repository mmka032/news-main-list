import dynamic from "next/dynamic";

// クライアントサイト / サーバーサイト の切り分け → 情報搾取の防止
const NewsClient = dynamic (() => import("./NewsClient"), {ssr:!!false}) 

export type ArticleProps = {
  title: string;
  description: string;
  url: string;
  image?: string;
  publishedAt: string;
  source?: { name: string; url: string };
  topic?: string;
};

export default async function NewsPage() {
  // サーバー側ではfetchしない。クライアントでuseSearchParams()からfetchする想定。
  return <NewsClient />;
}