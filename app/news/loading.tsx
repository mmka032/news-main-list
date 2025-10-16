export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center p-4 bg-body text-main transition-colors duration-300">
      {/* ローディングイラスト */}
      <img
      src="/undraw_data-at-work_3tbf.svg"
      alt="Loading Illustration"
      className="w-102 animate-pulse mb-6"
      />

      {/* メッセージ */}
      <p className="h2 animate-bounce">
        ただいまニュースを集めています…
      </p>
    </div>
  );
}