export type OfficialLink = {
  name: string;
  url: string;
  description: string;
  whenToUse: string;
};

export const officialLinks: OfficialLink[] = [
  {
    name: "文部科学省",
    url: "https://www.mext.go.jp/",
    description:
      "学習指導要領や教育施策など、教育に関する国の公式情報を発信しているサイトです。",
    whenToUse: "指導要領の内容を確認したいとき、国の教育施策の最新情報を調べたいときに。",
  },
  {
    name: "NHK for School",
    url: "https://www.nhk.or.jp/school/",
    description:
      "NHKが提供する、授業で使える教科別の動画・クリップ教材のポータルです。",
    whenToUse: "授業で使える映像教材を探したいとき、視聴覚教材で理解を助けたいときに。",
  },
  {
    name: "国立教育政策研究所（NIER）",
    url: "https://www.nier.go.jp/",
    description:
      "教育に関する調査研究を行う国の機関のサイトです。学力調査の結果なども公開されています。",
    whenToUse: "教育に関する調査データや研究成果を確認したいときに。",
  },
  {
    name: "政府広報オンライン",
    url: "https://www.gov-online.go.jp/",
    description:
      "各種制度・手続きなど、政府からのお知らせをまとめて発信している公式サイトです。",
    whenToUse: "教員向け制度に限らず、国の制度・手続き全般について調べたいときに。",
  },
];

export const officialLinksNote =
  "都道府県・市町村の教育委員会サイトは自治体ごとに異なります。お住まいの自治体名＋「教育委員会」で検索して、最新の公式情報をご確認ください。";
