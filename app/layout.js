import "./globals.css";

export const metadata = {
  title: "年間耕作スケジュール",
  description: "作物ごとの年間農作業スケジュール管理アプリ",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
