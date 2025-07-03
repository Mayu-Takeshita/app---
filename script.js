document.addEventListener('DOMContentLoaded', () => {
    // --- データ定義 ---
    const dayOrder = ["月曜日", "火曜日", "水曜日", "木曜日", "金曜日", "土曜日", "その他"];
    const subjectsByDay = {
        "月曜日": ["応用数学", "情報工学実験Ⅲ"],
        "火曜日": ["組込システムⅠ", "計測システム", "インターンシップ", "幾何概論Ⅰ"],
        "水曜日": [],
        "木曜日": ["画像処理", "英語特殊講義A", "ソフトウェア工学"],
        "金曜日": ["シュミレーション工学", "情報理論", "応用統計"],
        "土曜日": [],
        "その他": ["（手動で入力する）", "その他"]
    };

    // --- HTML要素取得 ---
    const memoForm = document.getElementById('memo-form');
    const subjectSelect = document.getElementById('subject-select');
    const memoText = document.getElementById('memo-text');
    const memoListContainer = document.getElementById('memo-list-container');
    const searchBox = document.getElementById('search-box');
    const customSubjectWrapper = document.getElementById('custom-subject-wrapper');
    const customSubjectText = document.getElementById('custom-subject-text');
    const memoImageInput = document.getElementById('memo-image');
    const imagePreviewContainer = document.getElementById('image-preview-container');
    const imagePreview = document.getElementById('image-preview');
    const removeImageBtn = document.getElementById('remove-image-btn');
    const themeSwitcher = document.getElementById('theme-switcher');
    const sortOrderSelect = document.getElementById('sort-order');
    const exportBtn = document.getElementById('export-btn');
    const importFile = document.getElementById('import-file');
    
    let currentImageBase64 = null;

    // --- 関数定義 ---

    const loadMemos = () => JSON.parse(localStorage.getItem('memos') || '[]');
    const saveMemos = (memos) => localStorage.setItem('memos', JSON.stringify(memos));

    const populateSubjectDropdown = () => {
        const defaultOption = document.createElement('option');
        defaultOption.value = "";
        defaultOption.textContent = "科目を選択してください";
        defaultOption.disabled = true;
        defaultOption.selected = true;
        subjectSelect.appendChild(defaultOption);

        dayOrder.forEach(day => {
            const subjects = subjectsByDay[day];
            if (subjects && subjects.length > 0) {
                const optgroup = document.createElement('optgroup');
                optgroup.label = `--- ${day} ---`;
                subjects.forEach(subject => {
                    const option = document.createElement('option');
                    if (subject === "（手動で入力する）") {
                        option.value = "__other__";
                    } else {
                        option.value = subject;
                    }
                    option.textContent = subject;
                    optgroup.appendChild(option);
                });
                subjectSelect.appendChild(optgroup);
            }
        });
    };

    const renderMemos = () => {
        const memos = loadMemos();
        const searchTerm = searchBox.value.toLowerCase();
        
        let filteredMemos = memos.filter(memo => 
            memo.subject.toLowerCase().includes(searchTerm) || 
            memo.memo.toLowerCase().includes(searchTerm)
        );

        const sortOrder = sortOrderSelect.value;
        if (sortOrder === 'date-asc') {
            filteredMemos.sort((a, b) => a.id - b.id);
        } else if (sortOrder === 'date-desc') {
            filteredMemos.sort((a, b) => b.id - a.id);
        } else if (sortOrder === 'subject-asc') {
            filteredMemos.sort((a, b) => a.subject.localeCompare(b.subject));
        } else if (sortOrder === 'subject-desc') {
            filteredMemos.sort((a, b) => b.subject.localeCompare(a.subject));
        }
        
        const groupedMemos = filteredMemos.reduce((acc, memo) => {
            const subject = memo.subject;
            if (!acc[subject]) { acc[subject] = []; }
            acc[subject].push(memo);
            return acc;
        }, {});
        
        const sortedSubjects = Object.keys(groupedMemos).sort((a, b) => {
            if (sortOrder.includes('subject')) {
                return a.localeCompare(b);
            }
            // 日付順の場合は、各グループの最新のメモの日付で比較
            const lastMemoA = groupedMemos[a].reduce((prev, curr) => prev.id > curr.id ? prev : curr);
            const lastMemoB = groupedMemos[b].reduce((prev, curr) => prev.id > curr.id ? prev : curr);
            return lastMemoB.id - lastMemoA.id;
        });
        
        memoListContainer.innerHTML = '';
        if (sortedSubjects.length === 0) {
            memoListContainer.innerHTML = '<p>表示するメモはありません。</p>';
            return;
        }

        sortedSubjects.forEach(subject => {
            const memoCount = groupedMemos[subject].length;
            const subjectHeader = document.createElement('h3');
            subjectHeader.className = 'subject-group-header';
            subjectHeader.textContent = `${subject} (${memoCount}件)`;
            memoListContainer.appendChild(subjectHeader);

            const subjectMemoList = document.createElement('ul');
            subjectMemoList.className = 'subject-memo-list';
            memoListContainer.appendChild(subjectMemoList);

            groupedMemos[subject].forEach(memo => {
                const listItem = document.createElement('li');
                listItem.dataset.id = memo.id;
                const memoContentHtml = marked.parse(memo.memo);
                const imageHtml = memo.image ? `<img src="${memo.image}" alt="添付画像" class="memo-image">` : '';

                listItem.innerHTML = `
                    <div class="memo-header">
                        <strong>${memo.subject}</strong>
                        <span>${memo.date}</span>
                    </div>
                    <div class="memo-body">${memoContentHtml}</div>
                    ${imageHtml}
                    <div class="memo-actions">
                        <button class="edit-btn secondary outline">編集</button>
                        <button class="delete-btn secondary">削除</button>
                    </div>
                `;
                subjectMemoList.appendChild(listItem);
            });
        });
    };
    
    const resetImageInput = () => {
        memoImageInput.value = '';
        imagePreviewContainer.classList.add('hidden');
        imagePreview.src = '#';
        currentImageBase64 = null;
    };

    const applyTheme = (isDark) => {
        document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    };

    // --- イベントリスナー ---

    memoForm.addEventListener('submit', (e) => {
        e.preventDefault();
        let subject = subjectSelect.value;
        if (subject === '__other__') { subject = customSubjectText.value.trim(); }
        const memo = memoText.value.trim();
        if (subject && memo) {
            const memos = loadMemos();
            const now = new Date();
            const newMemo = {
                id: Date.now(),
                subject: subject,
                memo: memo,
                date: `${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, '0')}/${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`,
                image: currentImageBase64
            };
            memos.push(newMemo);
            saveMemos(memos);
            renderMemos();
            memoForm.reset();
            subjectSelect.value = "";
            customSubjectWrapper.classList.add('hidden');
            customSubjectText.required = false;
            customSubjectText.value = '';
            resetImageInput();
        } else {
            alert('科目を選択（または入力）し、メモを入力してください。');
        }
    });
    
    subjectSelect.addEventListener('change', (e) => {
        if (e.target.value === '__other__') {
            customSubjectWrapper.classList.remove('hidden');
            customSubjectText.required = true;
            customSubjectText.focus();
        } else {
            customSubjectWrapper.classList.add('hidden');
            customSubjectText.required = false;
            customSubjectText.value = '';
        }
    });
    
    memoListContainer.addEventListener('click', (e) => {
        const target = e.target;
        const listItem = target.closest('li');
        if (!listItem) return;
        const memoId = Number(listItem.dataset.id);

        if (target.classList.contains('delete-btn')) {
            if (confirm('このメモを本当に削除しますか？')) {
                let memos = loadMemos();
                memos = memos.filter(memo => memo.id !== memoId);
                saveMemos(memos);
                renderMemos();
            }
        } else if (target.classList.contains('edit-btn')) {
            const memo = loadMemos().find(m => m.id === memoId);
            const memoBody = listItem.querySelector('.memo-body');
            memoBody.innerHTML = `<textarea class="edit-area">${memo.memo}</textarea>`;
            target.textContent = '保存';
            target.classList.remove('edit-btn', 'outline');
            target.classList.add('save-btn');
        } else if (target.classList.contains('save-btn')) {
            const editArea = listItem.querySelector('.edit-area');
            const newMemoText = editArea.value;
            let memos = loadMemos();
            const memoIndex = memos.findIndex(m => m.id === memoId);
            if (memoIndex > -1) {
                memos[memoIndex].memo = newMemoText;
                saveMemos(memos);
            }
            renderMemos();
        } else if (target.classList.contains('memo-image')) {
            const newWindow = window.open();
            newWindow.document.write(`<body style="margin:0; background-color:#333;"><img src="${target.src}" style="width: 100%; height: auto; display: block; margin: auto;"></body>`);
        }
    });

    memoImageInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) {
            resetImageInput();
            return;
        }
        const reader = new FileReader();
        reader.onload = (event) => {
            currentImageBase64 = event.target.result;
            imagePreview.src = currentImageBase64;
            imagePreviewContainer.classList.remove('hidden');
        };
        reader.onerror = (error) => {
            console.error("File could not be read: " + error);
            alert("画像の読み込みに失敗しました。");
            resetImageInput();
        };
        reader.readAsDataURL(file);
    });
    removeImageBtn.addEventListener('click', resetImageInput);
    searchBox.addEventListener('input', renderMemos);
    sortOrderSelect.addEventListener('change', renderMemos);

    themeSwitcher.addEventListener('change', (e) => applyTheme(e.target.checked));

    exportBtn.addEventListener('click', () => {
        const memos = loadMemos();
        if (memos.length === 0) {
            alert('エクスポートするデータがありません。');
            return;
        }
        const dataStr = JSON.stringify(memos, null, 2);
        const blob = new Blob([dataStr], {type: 'application/json'});
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `memo-app-backup-${new Date().toISOString().slice(0, 10)}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    });

    importFile.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const importedMemos = JSON.parse(event.target.result);
                if (Array.isArray(importedMemos) && confirm(`現在のメモに${importedMemos.length}件のデータを追加しますか？（重複する可能性があります）`)) {
                    const currentMemos = loadMemos();
                    // IDの重複を避けるための簡単な処理
                    const existingIds = new Set(currentMemos.map(m => m.id));
                    const newMemos = importedMemos.filter(m => !existingIds.has(m.id));
                    const combinedMemos = [...currentMemos, ...newMemos];

                    saveMemos(combinedMemos);
                    renderMemos();
                    alert(`${newMemos.length}件の新しいメモをインポートしました。`);
                } else {
                    alert('無効なファイル形式です。');
                }
            } catch (error) {
                alert('ファイルの読み込みに失敗しました。');
            }
        };
        reader.readAsText(file);
        importFile.value = '';
    });

    // --- 初期化処理 ---
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        const isDark = savedTheme === 'dark';
        themeSwitcher.checked = isDark;
        applyTheme(isDark);
    } else {
        // OSの設定に合わせる
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        themeSwitcher.checked = prefersDark;
        applyTheme(prefersDark);
    }
    
    populateSubjectDropdown();
    renderMemos();
});