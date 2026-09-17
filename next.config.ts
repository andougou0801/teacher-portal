import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // 学級レク特集の公開直後に、slugの「-rec」接尾辞をやめたときの後始末。
      ...["color-tag", "shadow-tag", "handkerchief-drop", "lion-hunt"].map((slug) => ({
        source: `/lessons/recreations/${slug}-rec`,
        destination: `/lessons/recreations/${slug}`,
        permanent: true,
      })),
      // くつとばし大会は安全面の理由で取り下げ、紙ひこうきとばし大会に置きかえた。
      {
        source: "/lessons/recreations/shoe-toss",
        destination: "/lessons/recreations/paper-plane",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
