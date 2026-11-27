// オフラインで あそべるようにする（この /study-game/ の中だけ）。
// 本体は「まずキャッシュ」、問題のJSONは「まずネット、だめならキャッシュ」。
const VERSION = "sg-v8"; // 版を上げると、古いキャッシュを捨てて 新しいファイルを とりにいく
const CORE = [
  "index.html",
  "css/base.css?v=1",
  "css/screens.css?v=1",
  "js/app.js",
  "js/util.js",
  "js/audio.js",
  "js/speech.js",
  "js/icons.js",
  "js/moya-art.js",
  "js/moya-art-jp.js",
  "js/moya-art-m2.js",
  "js/moya-art-m3.js",
  "js/moya-art-jp2.js",
  "js/moya-art-jp3.js",
  "js/moya-art-g2.js",
  "js/hiragana-strokes.js",
  "js/katakana-strokes.js",
  "js/figure.js",
  "js/figure2.js",
  "js/figure3.js",
  "js/building-art-m2.js",
  "js/building-art-m3.js",
  "js/content.js",
  "js/store.js",
  "js/data.js",
  "js/srs.js",
  "js/session.js",
  "js/savecode.js",
  "js/quiz.js",
  "js/rpg.js",
  "js/trace.js",
  "js/subject.js",
  "js/debug.js",
  "js/screens/start.js",
  "js/screens/town.js",
  "js/screens/map.js",
  "js/screens/battle.js",
  "js/screens/result.js",
  "js/screens/collection.js",
  "js/screens/settings.js",
  "data/manifest.json?v=1",
  "app.webmanifest",
  "icon.svg",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(VERSION).then(async (cache) => {
      // 1つ失敗しても 全部が だめにならないように 1つずつ入れる
      await Promise.all(
        CORE.map((url) => cache.add(new Request(url, { cache: "reload" })).catch(() => null)),
      );
      self.skipWaiting();
    }),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k)));
      await self.clients.claim();
    })(),
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== location.origin || !url.pathname.startsWith("/study-game/")) return;

  const isData = url.pathname.includes("/data/");
  if (isData) {
    event.respondWith(
      fetch(req)
        .then((res) => {
          caches.open(VERSION).then((c) => c.put(req, res.clone()));
          return res;
        })
        .catch(() => caches.match(req, { ignoreSearch: true })),
    );
    return;
  }
  // まずキャッシュを見せて、うしろで新しいものを取っておく。
  // こうすると、つぎに開いたときには 新しい版になっている（更新が とどかない事故を ふせぐ）。
  event.respondWith(
    caches.match(req, { ignoreSearch: true }).then((hit) => {
      const network = fetch(req)
        .then((res) => {
          if (res && res.ok) caches.open(VERSION).then((c) => c.put(req, res.clone()));
          return res;
        })
        .catch(() => hit);
      return hit || network;
    }),
  );
});
