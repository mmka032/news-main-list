"use client";

import { useEffect, useState } from "react";

type Article = {
    title: string;
    description: string;
    url: string;
    image?: string;
    publishedAt: string;
    source?: { name: string; url: string };
}

const TOPICS =[
   { key: "", label:"全て"},
   { key: "busines", label:"ビジネス"},
   { key: "tecnology", label:"テクノロジー"},
   { key: "entertainment", label:"エンタメ"},
   { key: "sports", label:"スポーツ"},
   { key: "science", label:"サイエンス"},
   { key: "health", label:"ヘルス"},
]

export default function NewsClient() {
    const [q, setQ] = useState("")
    const [topic , setTopic] = useState("")
    const [loading, setLoading] = useState(false)
    const [articles, setArticles] = useState<Article[]>([]);
    const [error, setError] = useState<string | null>(null)

    async function load() {
        setLoading(true); setError(null);
        const p = new URLSearchParams ({ lang: "ja", country: "jp", max:"10" })
        if(q.trim()) p.set("q", q.trim())
        if(topic) p.set("topic", topic)

        try {
            const res = await fetch(`/api/news?{${ p.toString() }}`, { cache: "no-store" })
            const data = await res.json();
                if(!res.ok) throw new Error(data?.error ?? "not fetched")
                    setArticles(data.articles ?? [])
        } catch (e:any) {
            setError(e?.message ?? "エラーが発生しました")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {load}, []) 
    return(
        <div>
            <form>
                <input/>
                <select>
                    <option>

                    </option>
                </select>
                <button>

                </button>
            </form>
            <p></p>
            <p></p>

            <ul>
                <li>
                    <img/>
                    <a/>
                    <p></p>
                    <div>
                        <span>
                            
                        </span>
                    </div>
                </li>
            </ul>
        </div>
    )
}

