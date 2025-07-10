document.addEventListener('DOMContentLoaded', () => {

    // --- データ定義 ---
    const dayOrder = ["月", "火", "水", "木", "金"];
    const periodCount = 5; // 5限まで
    const timetableData = {
        "月": { 1: "応用数学", 2: "情報工学実験Ⅲ" },
        "火": { 2: "組込システムⅠ", 3: "計測システム", 4: "インターンシップ" },
        "水": { 3: "幾何概論Ⅰ" },
        "木": { 1: "画像処理", 2: "英語特殊講義A", 4: "ソフトウェア工学" },
        "金": { 2: "シュミレーション工学", 3: "情報理論", 5: "応用統計" }
    };

    // --- HTML要素取得 ---
    const themeSwitcher = document.getElementById('theme-switcher');
    const timetablePage = document.getElementById('timetable-page');
    const memoPage = document.getElementById('memo-page');
    const timetableGrid = document.getElementById('timetable-grid');
    const gotoMemoPageBtn = document.getElementById('goto-memo-page-btn');
    const gotoTimetablePageBtn = document.getElementById('goto-timetable-page-btn');
    const appContainer = document.getElementById('app-container');

    // --- 関数定義 ---

    /** 時間割グリッドを生成する関数 */
    const renderTimetable = () => {
        timetableGrid.innerHTML = '';
        const timeSlots = Array.from({length: periodCount}, (_, i) => `<div class="day-header">${i + 1}</div>`).join('');
        timetableGrid.insertAdjacentHTML('beforebegin', timeSlots);

        for (let period = 1; period <= periodCount; period++) {
            for (const day of dayOrder) {
                const subject = timetableData[day]?.[period] || null;
                const cell = document.createElement('div');
                cell.className = 'class-cell';
                if (subject) {
                    cell.textContent = subject;
                    cell.dataset.subject = subject;
                    cell.classList.add('filled');
                }
                timetableGrid.appendChild(cell);
            }
        }
    };
    
    /** ページを切り替える関数 */
    const switchPage = (pageToShow) => {
        document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
        pageToShow.classList.add('active');
    };

    /** テーマを適用し、設定を保存する関数 */
    const applyTheme = (isDark) => {
        document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    };

    // --- イベントリスナー ---
    
    themeSwitcher.addEventListener('change', (e) => {
        applyTheme(e.target.checked);
    });

    gotoMemoPageBtn.addEventListener('click', () => {
        switchPage(memoPage);
    });

    gotoTimetablePageBtn.addEventListener('click', () => {
        switchPage(timetablePage);
    });

    timetableGrid.addEventListener('click', (e) => {
        if (e.target.classList.contains('filled')) {
            const subject = e.target.dataset.subject;
            // TODO: 次のステップで、この科目名でフィルタリングした状態でメモページに移動する
            console.log(`「${subject}」のメモページに移動し、メモを表示します。`);
            switchPage(memoPage);
        }
    });

    // --- 初期化処理 ---
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        const isDark = savedTheme === 'dark';
        themeSwitcher.checked = isDark;
        applyTheme(isDark);
    } else {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        themeSwitcher.checked = prefersDark;
        applyTheme(prefersDark);
    }

    renderTimetable();
});