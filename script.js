document.addEventListener('DOMContentLoaded', () => {

    // ★★★★★ ここから変更 ★★★★★
    // 曜日の表示順を定義する配列
    const dayOrder = ["月曜日", "火曜日", "水曜日", "木曜日", "金曜日", "その他"];

    // 曜日ごとの科目リスト（オブジェクト形式）
    const subjectsByDay = {
        "月曜日": [
            "応用数学",
            "情報工学実験Ⅲ"
        ],
        "火曜日": [
            "組込システムⅠ",
            "計測システム",
            "インターンシップ",
            "幾何概論Ⅰ"
        ],
        "水曜日": [
            // 水曜日の授業がなければ空のまま
        ],
        "木曜日": [
            "画像処理",
            "英語特殊講義A",
            "ソフトウェア工学"
        ],
        "金曜日": [
            "シュミレーション工学",
            "情報理論",
            "応用統計"
        ],
        "土曜日": [
            // 土曜日の授業がなければ空のまま
        ],
        
    };
    // ★★★★★ ここまで変更 ★★★★★
    // 1. 必要なHTML要素をIDで取得
    const memoForm = document.getElementById('memo-form');
    const subjectSelect = document.getElementById('subject-select');
    const memoText = document.getElementById('memo-text');
    const memoListContainer = document.getElementById('memo-list-container');
    const searchBox = document.getElementById('search-box');

    // 2. 処理で使う関数を定義

        // script.js の populateSubjectDropdown 関数

    /** 科目リストのプルダウンを曜日グループ付きで生成する関数 */
    const populateSubjectDropdown = () => {
        // 最初に「選択してください」という項目を追加
        const defaultOption = document.createElement('option');
        defaultOption.value = "";
        defaultOption.textContent = "科目を選択してください";
        defaultOption.disabled = true;
        defaultOption.selected = true;
        subjectSelect.appendChild(defaultOption);

        // dayOrderの順番で曜日をループ
        dayOrder.forEach(day => {
            const subjects = subjectsByDay[day]; // その曜日の科目リストを取得

            // その曜日に科目が1つ以上存在する場合のみ、グループ（<optgroup>）を作成
            if (subjects && subjects.length > 0) {
                // <optgroup>要素（曜日の見出し）を作成
                const optgroup = document.createElement('optgroup');
                optgroup.label = `--- ${day} ---`; // ラベルに曜日名を設定

                // 科目リストをループして<option>要素を作成
                subjects.forEach(subject => {
                    const option = document.createElement('option');
                    option.value = subject;
                    option.textContent = subject;
                    // optionをoptgroupに追加
                    optgroup.appendChild(option);
                });

                // 完成したoptgroupをselect要素に追加
                subjectSelect.appendChild(optgroup);
            }
        });
    };
    

    /** LocalStorageからメモの配列を取得する関数 */
    const loadMemos = () => {
        const memosJSON = localStorage.getItem('memos');
        return memosJSON ? JSON.parse(memosJSON) : [];
    };

    /** メモの配列をLocalStorageに保存する関数 */
    const saveMemos = (memos) => {
        const memosJSON = JSON.stringify(memos);
        localStorage.setItem('memos', memosJSON);
    };

    /** メモの一覧を科目ごとにグループ化して表示する（検索機能付き） */
    const renderMemos = () => {
        const memos = loadMemos();
        memoListContainer.innerHTML = '';

        const searchTerm = searchBox.value.toLowerCase();
        const filteredMemos = memos.filter(memo => 
            memo.subject.toLowerCase().includes(searchTerm) || 
            memo.memo.toLowerCase().includes(searchTerm)
        );

        const groupedMemos = filteredMemos.reduce((acc, memo) => {
            const subject = memo.subject;
            if (!acc[subject]) {
                acc[subject] = [];
            }
            acc[subject].push(memo);
            return acc;
        }, {});

        const sortedSubjects = Object.keys(groupedMemos).sort();

        if (sortedSubjects.length === 0) {
            memoListContainer.innerHTML = '<p>表示するメモはありません。</p>';
            return;
        }

        sortedSubjects.forEach(subject => {
            const subjectHeader = document.createElement('h3');
            subjectHeader.className = 'subject-group-header';
            subjectHeader.textContent = subject;
            memoListContainer.appendChild(subjectHeader);

            const subjectMemoList = document.createElement('ul');
            subjectMemoList.className = 'subject-memo-list';
            memoListContainer.appendChild(subjectMemoList);

            const memosForSubject = groupedMemos[subject].sort((a, b) => b.id - a.id);

            memosForSubject.forEach(memo => {
                const listItem = document.createElement('li');
                const memoContent = memo.memo.replace(/\n/g, '<br>');

                listItem.innerHTML = `
                    <div class="memo-header">
                        <strong>${memo.subject}</strong>
                        <span>${memo.date}</span>
                    </div>
                    <p>${memoContent}</p>
                    <button class="delete-btn" data-id="${memo.id}">削除</button>
                `;
                subjectMemoList.appendChild(listItem);
            });
        });
    };

    // 3. イベントの処理を記述

    // ■ フォームが送信されたときの処理
    memoForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const subject = subjectSelect.value;
        const memo = memoText.value.trim();

        if (subject && memo) {
            const memos = loadMemos();
            const now = new Date();
            const newMemo = {
                id: Date.now(),
                subject: subject,
                memo: memo,
                date: `${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, '0')}/${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
            };

            memos.push(newMemo);
            saveMemos(memos);
            renderMemos();
            memoForm.reset();
            subjectSelect.value = ""; // プルダウンもリセット
        } else {
            alert('科目を選択し、メモを入力してください。');
        }
    });

    // ■ 削除ボタンがクリックされたときの処理
    memoListContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('delete-btn')) {
            if (confirm('このメモを本当に削除しますか？')) {
                const idToDelete = Number(e.target.dataset.id);
                let memos = loadMemos();
                memos = memos.filter(memo => memo.id !== idToDelete);
                saveMemos(memos);
                renderMemos();
            }
        }
    });

    // ■ 検索ボックスに入力があったときの処理
    searchBox.addEventListener('input', renderMemos);

    // 4. 初期表示
    populateSubjectDropdown();
    renderMemos();
});