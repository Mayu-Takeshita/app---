// キャッシュの名前を定義します。バージョンが変わったらここを変更すると、新しいキャッシュが作られます。
const CACHE_NAME = 'memo-app-cache-v1';

// アプリを構成する基本的なファイル（オフラインでも表示させたいファイル）のリストです。
const urlsToCache = [
  './', // ルートURL (例: https://your-id.github.io/memo-app/)
  './index.html',
  './style.css',
  './script.js',
  // 使用しているライブラリのCDN URLもキャッシュしておくと、より安定します。
  'https://cdn.jsdelivr.net/npm/@picocss/pico@1/css/pico.min.css',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
  'https://cdn.jsdelivr.net/npm/marked/marked.min.js',
  // アプリアイコンがあれば、それもリストに追加します。
  // './icon-192.png',
  // './icon-512.png'
];

/**
 * 1. インストールイベント
 * PWAが初めてインストールされるとき、またはService Workerのファイルが更新されたときに一度だけ実行されます。
 * ここで、アプリの基本的なファイル（アセット）をキャッシュに保存します。
 */
self.addEventListener('install', (event) => {
  // waitUntilは、中の処理が終わるまでインストールを待機させるためのものです。
  event.waitUntil(
    // caches.openで指定した名前のキャッシュを開きます（なければ新規作成）。
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache and caching assets');
        // addAllで、urlsToCacheリストにあるファイルをすべてキャッシュに追加します。
        return cache.addAll(urlsToCache);
      })
  );
});

/**
 * 2. フェッチイベント
 * アプリがネットワークリクエスト（例: CSSファイルや画像の読み込み）を行うたびに毎回実行されます。
 * このイベントを乗っ取ることで、ネットワークの代わりにキャッシュから応答を返すことができます。
 */
self.addEventListener('fetch', (event) => {
  // respondWithは、ブラウザのデフォルトのfetch処理を上書きし、独自の応答を返すためのものです。
  event.respondWith(
    // caches.matchで、発生したリクエストに一致するキャッシュが既に存在するかどうかを確認します。
    caches.match(event.request)
      .then((response) => {
        // もしキャッシュに一致する応答(response)があれば、それを返します。
        if (response) {
          return response;
        }
        // キャッシュになければ、通常通りネットワークにリクエストを送り、結果を取得します。
        return fetch(event.request);
      })
  );
});

/**
 * 3. アクティベートイベント
 * Service Workerが有効化（アクティベート）されたときに実行されます。
 * 主に、古いバージョンのキャッシュを削除するのに使われます。
 */
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME]; // 新しいキャッシュ名（これだけは残す）

  event.waitUntil(
    // caches.keys()で、現在存在するすべてのキャッシュの名前を取得します。
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          // もしキャッシュ名がホワイトリストに含まれていなければ、それは古いキャッシュです。
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Deleting old cache:', cacheName);
            // caches.deleteで古いキャッシュを削除します。
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});