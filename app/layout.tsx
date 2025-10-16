"use client";

import "./globals.css";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Star,
  Home,
  Globe,
  Laptop,
  BarChart3,
  Clapperboard,
  Search,
} from "lucide-react";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // ===== ライト・ダークモード =====
  const [theme, setTheme] = useState("light");

  // テーマ変更時に <html> に .dark クラスを付与
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  // ダークモード切り替えトグル
  const toggleTheme = () =>
    setTheme((prev) => (prev === "light" ? "dark" : "light"));

  // ===== 検索機能 =====
  const [q, setQ] = useState("");
  const router = useRouter();

  // 検索フォーム送信時の処理
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/news?q=${encodeURIComponent(q.trim())}`);
  };
  
  return (
    <html lang="ja">
      <body className="bg-[rgb(var(--color-bg))] text-[rgb(var(--color-text))] transition duration-300">
        {/* ===== HEADER / NAVBAR ===== */}
        <header className="fixed top-0 left-0 w-full z-50 border-b-2 border-[rgb(var(--color-border))] header-shadow bg-[rgb(var(--color-bg))] text-[rgb(var(--color-text))] transition duration-300">
          <nav className="flex items-center justify-between px-[var(--navbar-padding-x)] py-[var(--navbar-padding-y)]">
            {/* ロゴ + カテゴリ */}
            <div className="flex items-center gap-[var(--navbar-item-gap)]">
              <Link href="/" className="flex items-center">
                <Image
                  src={theme === "dark" ? "/logo/dark-mode.svg" : "/logo/light-mode.svg"}
                  alt="NewsLoop Logo"
                  width={79}
                  height={51}
                  priority
                />
              </Link>
              <ul className="flex gap-[var(--navbar-item-gap)] text-[rgb(var(--color-text))] text-sub">
                <li><Link href="/news?category=top" className="flex items-center"><Star className="category-icon" /> 注目</Link></li>
                <li><Link href="/news?category=national" className="flex items-center"><Home className="category-icon" /> 国内</Link></li>
                <li><Link href="/news?category=world" className="flex items-center"><Globe className="category-icon" /> 国際</Link></li>
                <li><Link href="/news?category=technology" className="flex items-center"><Laptop className="category-icon" /> テック</Link></li>
                <li><Link href="/news?category=business" className="flex items-center"><BarChart3 className="category-icon" /> 経済 / ビジネス</Link></li>
                <li><Link href="/news?category=entertainment" className="flex items-center"><Clapperboard className="category-icon" /> エンタメ</Link></li>
              </ul>
            </div>

            {/* 検索 + ダークモード */}
            <div className="flex items-center">
              <form onSubmit={handleSearch} className="flex items-center">
                <div className="relative flex-1 w-75">
                  <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-[rgb(var(--color-placeholder))] w-5 h-5 pointer-events-none" />
                  <input
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    placeholder="キーワード検索"
                    className="w-full bg-transparent outline-none text-[rgb(var(--color-text))] border-2 rounded-lg border-[rgb(var(--color-border))] pl-12 pr-4 py-3 placeholder-[rgb(var(--color-placeholder))] focus:border-[rgb(var(--color-primary))] transition-colors duration-200"
                  />
                </div>
                <button type="submit" 
                className={`
                  flex items-center justify-center rounded-lg px-6 py-3 ml-2 mr-[var(--space-page)]
                  bg-[rgb(var(--color-primary))] hover:bg-[rgb(var(--color-btn-hover))] transition
                  ${theme === "dark" ? "text-[rgb(var(--color-text))]" : "text-[rgb(var(--color-bg))]"}
                `}
                >
                  検索
                </button>
              </form>

              <button onClick={toggleTheme} className="flex items-center justify-center rounded-full w-12 h-12 border border-[rgb(var(--color-border))] text-[rgb(var(--color-placeholder))]">
                {theme === "dark" ? (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
                  </svg>
                )}
              </button>
            </div>
          </nav>
        </header>

        <main className="mt-[var(--main-news-top)]">{children}</main>

        <footer className="bg-[rgb(var(--color-footer-bg))] text-[rgb(var(--color-text))] border-t-2 border-[rgb(var(--color-border))] mt-12 px-[var(--footer-padding-x)] py-[var(--footer-padding-y)]">
          <div className="flex flex-row justify-between items-center">
            <div>
              <Image src={theme === "dark" ? "/logo/dark-mode.svg" : "/logo/light-mode.svg"} alt="NewsLoop Logo" width={180} height={117} />
              <p className="text-sub pt-[var(--footer-logo-gap)]">©2025 NewsLoop. All rights reserved.</p>
            </div>
            <div className="flex gap-[var(--footer-menu-gap)] text-sub">
              <p>プライバシーポリシー</p>
              <p>個人情報保護方針</p>
              <p>利用規約</p>
              <p>特定商取引法に基づく表記</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
