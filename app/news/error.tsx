"use client";

export default function Error({ error, reset }: { error: Error; reset: () => void}){
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center p-4 bg-body text-main transition-colors duration-300">
      {/* エラーイラスト */}
      <img
        src="/undraw_page-eaten_b2rt.svg"
        alt="Error Illustration"
        className="w-44 mb-6"
      />

      {/* 見出し */}
      <h2 className="text-error-number mb-3">404</h2>

      {/* エラーメッセージ */}
      <p className="text-button-error mb-6">ニュースが迷子です…</p>

      {/* 再試行ボタン */}
      <button
        onClick={() => reset()}
        className="text-button-error bg-[rgb(var(--color-primary))] text-white px-8 py-4 rounded-common hover:bg-[rgb(var(--color-btn-hover))] active:bg-[rgb(var(--color-btn-active))] focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-btn-focus))] transition"
      >
        トップページへ戻る
      </button>
    </div>
  );
}
