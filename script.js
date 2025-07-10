document.addEventListener('DOMContentLoaded', () => {

    // --- データ定義 ---
    const dayOrder = ["月", "火", "水", "木", "金"];
    const periodCount = 5; // 5限まで

    // 時間割データ: { 曜日: { 時限: "科目名" } }
    const timetableData = {
        "月": { 1: "応用数学", 2: "情報工学実験Ⅲ" },
        "火": { 2: "組込システムⅠ", 3: "計測システム", 4: "インターンシップ" },
        "水": { 3: "幾何概論Ⅰ" },
        "木": { 1: "画像処理", 2: "英語特殊講義A", 4: "ソフトウェア工学" },
        "金": { 2: "シュミレーション工学", 3: "情報理論", 5: "応用統計" }
    };

    // --- HTML要素取得 ---
    const timetablePage = document.getElementById('timetable-page');
    const memoPage = document.getElementById('memo-page');
    const timetableGrid = document.getElementById('timetable-grid');
    const gotoMemoPageBtn = document.getElementById('goto-memo-page-btn');
    const gotoTimetablePageBtn = document.getElementById('goto-timetable-page-btn');

    // --- 関数定義 ---

    /** 時間割グリッドを生成する関数 */
    const renderTimetable = () => {
        timetableGrid.innerHTML = ''; // グリッドをクリア

        // CSS Gridのために1から(5x5)+1のセルを生成
        for (let i = 0; i < (periodCount * dayOrder.length); i++) {
            const period = Math.floor(i / dayOrder.length) + 1;
            const dayIndex = i % dayOrder.length;
            const day = dayOrder[dayIndex];
            
            const subject = timetableData[day]?.[period] || null;
            
            const cell = document.createElement('div');
            cell.className = 'class-cell';

            if (subject) {
                cell.textContent = subject;
                cell.dataset.subject = subject; // 科目名をデータとして保持
                cell.classList.add('filled');
            } else {
                cell.classList.add('empty');
            }
            timetableGrid.appendChild(cell);
        }
    };
    
    /** ページを切り替える関数 */
    const switchPage = (pageToShow) => {
        // 全てのページからactiveクラスを削除
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });
        // 指定されたページにactiveクラスを追加
        pageToShow.classList.add('active');
    };

    // --- イベントリスナー ---

    // 「メモを書く・見る」ボタンが押されたとき
    gotoMemoPageBtn.addEventListener('click', () => {
        switchPage(memoPage);
    });

    // 「時間割に戻る」ボタンが押されたとき
    gotoTimetablePageBtn.addEventListener('click', () => {
        switchPage(timetablePage);
    });

    // 時間割のコマがクリックされたとき
    timetableGrid.addEventListener('click', (e) => {
        if (e.target.classList.contains('filled')) {
            const subject = e.target.dataset.subject;
            console.log(`「${subject}」のメモページに移動します`); // 動作確認用
            // TODO: 次のステップで、この科目名でフィルタリングした状態でメモページに移動する
            switchPage(memoPage);
        }
    });

    // --- 初期化処理 ---
    renderTimetable(); // アプリ起動時に時間割を描画
});