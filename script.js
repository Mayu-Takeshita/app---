document.addEventListener('DOMContentLoaded', () => {

    // --- データ定義 ---
    const dayOrder = ["月", "火", "水", "木", "金"];
    const periodCount = 5;
    const timetableData = {
        "月": { 1: "応用数学", 2: "情報工学実験Ⅲ", 3: "情報工学実験Ⅲ" },
        "火": { 2: "組込システムⅠ", 3: "計測システム", 4: "インターンシップ", 5: "幾何概論Ⅰ" },
        "水": {},
        "木": { 1: "画像処理", 2: "英語特殊講義A", 3: "ソフトウェア工学" },
        "金": { 1: "シュミレーション工学", 2: "情報理論", 3: "応用統計" }
    };
    const dayOrderForSelect = ["月曜日", "火曜日", "水曜日", "木曜日", "金曜日", "その他"];
    const subjectsByDay = {
        "月曜日": ["応用数学", "情報工学実験Ⅲ"],
        "火曜日": ["組込システムⅠ", "計測システム", "インターンシップ", "幾何概論Ⅰ"],
        "水曜日": [],
        "木曜日": ["画像処理", "英語特殊講義A", "ソフトウェア工学"],
        "金曜日": ["シュミレーション工学", "情報理論", "応用統計"],
        "その他": ["（手動で入力する）", "その他"]
    };

    // --- HTML要素取得 ---
    const themeSwitcher = document.getElementById('theme-switcher');
    const timetablePage = document.getElementById('timetable-page');
    const memoPage = document.getElementById('memo-page');
    const timetableContainer = document.getElementById('timetable-container');
    const gotoMemoPageBtn = document.getElementById('goto-memo-page-btn');
    const gotoTimetablePageBtn = document.getElementById('goto-timetable-page-btn');
    const memoForm = document.getElementById('memo-form');
    const subjectSelect = document.getElementById('subject-select');
    const memoText = document.getElementById('memo-text');
    const memoListContainer = document.getElementById('memo-list-container');
    const searchBox = document.getElementById('search-box');
    const customSubjectWrapper = document.getElementById('custom-subject-wrapper');
    const customSubjectText = document.getElementById('custom-subject-text');
    const memoImageInput = document.getElementById('memo-image');
    const imagePreviewContainer = document.getElementById('image-preview-container');
    const removeImageBtn = document.getElementById('remove-image-btn');
    const sortOrderSelect = document.getElementById('sort-order');
    const exportBtn = document.getElementById('export-btn');
    const importFile = document.getElementById('import-file');
    const showAllBtn = document.getElementById('show-all-btn');
    let currentImages = [];

    // --- 関数定義 ---
    const switchPage = (pageToShow) => {
        document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
        pageToShow.classList.add('active');
    };
    const applyTheme = (isDark) => {
        document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    };
    const loadMemos = () => JSON.parse(localStorage.getItem('memos') || '[]');
    const saveMemos = (memos) => localStorage.setItem('memos', JSON.stringify(memos));

    const renderTimetable = () => {
        timetableContainer.innerHTML = '';
        timetableContainer.appendChild(document.createElement('div'));
        dayOrder.forEach(day => {
            const dayCell = document.createElement('div');
            dayCell.className = 'day-header'; dayCell.textContent = day;
            timetableContainer.appendChild(dayCell);
        });
        for (let period = 1; period <= periodCount; period++) {
            const timeCell = document.createElement('div');
            timeCell.className = 'time-slot'; timeCell.textContent = period;
            timetableContainer.appendChild(timeCell);
            dayOrder.forEach(day => {
                const subject = timetableData[day]?.[period] || null;
                const subjectCell = document.createElement('div');
                subjectCell.className = 'class-cell';
                if (subject) {
                    subjectCell.textContent = subject;
                    subjectCell.dataset.subject = subject;
                    subjectCell.classList.add('filled');
                } else {
                    subjectCell.classList.add('empty');
                }
                timetableContainer.appendChild(subjectCell);
            });
        }
    };
    
    const populateSubjectDropdown = () => {
        subjectSelect.innerHTML = '';
        const defaultOption = document.createElement('option');
        defaultOption.value = ""; defaultOption.textContent = "科目を選択してください";
        defaultOption.disabled = true; defaultOption.selected = true;
        subjectSelect.appendChild(defaultOption);
        dayOrderForSelect.forEach(day => {
            const subjects = subjectsByDay[day];
            if (subjects && subjects.length > 0) {
                const optgroup = document.createElement('optgroup');
                optgroup.label = `--- ${day} ---`;
                subjects.forEach(subject => {
                    const option = document.createElement('option');
                    option.value = subject === "（手動で入力する）" ? "__other__" : subject;
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
        let filteredMemos = memos;
        if (searchTerm) {
            filteredMemos = memos.filter(memo => memo.subject.toLowerCase().includes(searchTerm) || memo.memo.toLowerCase().includes(searchTerm));
        }
        const sortOrder = sortOrderSelect.value;
        if (sortOrder === 'date-asc') { filteredMemos.sort((a, b) => a.id - b.id); } 
        else if (sortOrder === 'date-desc') { filteredMemos.sort((a, b) => b.id - a.id); } 
        else if (sortOrder === 'subject-asc') { filteredMemos.sort((a, b) => a.subject.localeCompare(b.subject)); } 
        else if (sortOrder === 'subject-desc') { filteredMemos.sort((a, b) => b.subject.localeCompare(a.subject)); }
        
        const groupedMemos = filteredMemos.reduce((acc, memo) => { (acc[memo.subject] = acc[memo.subject] || []).push(memo); return acc; }, {});
        const sortedSubjects = Object.keys(groupedMemos).sort((a, b) => {
            if (!groupedMemos[a]?.length || !groupedMemos[b]?.length) return 0;
            if (sortOrder.includes('subject')) return sortOrder === 'subject-asc' ? a.localeCompare(b) : b.localeCompare(a);
            const lastMemoA = groupedMemos[a].reduce((p, c) => p.id > c.id ? p : c);
            const lastMemoB = groupedMemos[b].reduce((p, c) => p.id > c.id ? p : c);
            return sortOrder === 'date-desc' ? lastMemoB.id - lastMemoA.id : lastMemoA.id - lastMemoB.id;
        });
        
        memoListContainer.innerHTML = '';
        if (sortedSubjects.length === 0) { memoListContainer.innerHTML = '<p>表示するメモはありません。</p>'; return; }
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
                let imageHtml = '';
                if (memo.images && memo.images.length > 0) {
                    const imageGrid = memo.images.map(imgData => `<img src="${imgData}" alt="添付画像" class="memo-image">`).join('');
                    imageHtml = `<div class="memo-image-grid">${imageGrid}</div>`;
                }
                listItem.innerHTML = `<div class="memo-header"><strong>${memo.subject}</strong><span>${memo.date}</span></div><div class="memo-body">${marked.parse(memo.memo)}</div>${imageHtml}<div class="memo-actions"><button class="edit-btn">編集</button><button class="delete-btn">削除</button></div>`;
                subjectMemoList.appendChild(listItem);
            });
        });
    };

    const resetImageInput = () => {
        memoImageInput.value = '';
        imagePreviewContainer.innerHTML = '';
        imagePreviewContainer.classList.add('hidden');
        currentImages = [];
    };

    const renderImagePreviews = () => {
        imagePreviewContainer.innerHTML = '';
        currentImages.forEach((image, index) => {
            const previewItem = document.createElement('div');
            previewItem.className = 'preview-item';
            previewItem.innerHTML = `<img src="${image.base64}" alt="${image.name}"><button type="button" class="remove-preview-btn" data-index="${index}">×</button>`;
            imagePreviewContainer.appendChild(previewItem);
        });
    };

    // --- イベントリスナー ---
    themeSwitcher.addEventListener('change', e => applyTheme(e.target.checked));
    gotoMemoPageBtn.addEventListener('click', () => { searchBox.value = ''; renderMemos(); switchPage(memoPage); });
    gotoTimetablePageBtn.addEventListener('click', () => switchPage(timetablePage));
    timetableContainer.addEventListener('click', e => {
        if (e.target.classList.contains('filled')) {
            const subject = e.target.dataset.subject;
            switchPage(memoPage);
            setTimeout(() => {
                subjectSelect.value = subject;
                customSubjectWrapper.classList.add('hidden');
                customSubjectText.required = false;
                searchBox.value = subject;
                renderMemos();
                window.scrollTo(0, 0);
            }, 50);
        }
    });
    showAllBtn.addEventListener('click', () => {
        searchBox.value = '';
        renderMemos();
    });
    memoForm.addEventListener('submit', e => {
        e.preventDefault();
        let subject = subjectSelect.value;
        if (subject === '__other__') { subject = customSubjectText.value.trim(); }
        const memo = memoText.value.trim();
        if (!subject || !memo) { alert('科目とメモの両方を入力してください。'); return; }
        const memos = loadMemos();
        const now = new Date();
        memos.push({ id: Date.now(), subject, memo, images: currentImages.map(img => img.base64), date: `${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, '0')}/${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}` });
        saveMemos(memos); renderMemos(); memoForm.reset(); subjectSelect.value = "";
        customSubjectWrapper.classList.add('hidden'); customSubjectText.required = false; resetImageInput();
    });
    subjectSelect.addEventListener('change', e => {
        const isOther = e.target.value === '__other__';
        customSubjectWrapper.classList.toggle('hidden', !isOther);
        customSubjectText.required = isOther;
        if (isOther) customSubjectText.focus();
    });
    memoListContainer.addEventListener('click', e => {
        const target = e.target;
        const listItem = target.closest('li');
        if (!listItem) return;
        const memoId = Number(listItem.dataset.id);
        if (target.classList.contains('delete-btn')) {
            if (confirm('このメモを本当に削除しますか？')) { saveMemos(loadMemos().filter(m => m.id !== memoId)); renderMemos(); }
        } else if (target.classList.contains('edit-btn')) {
            const memo = loadMemos().find(m => m.id === memoId);
            listItem.querySelector('.memo-body').innerHTML = `<textarea class="edit-area">${memo.memo}</textarea>`;
            target.textContent = '保存'; target.classList.replace('edit-btn', 'save-btn');
        } else if (target.classList.contains('save-btn')) {
            const newMemoText = listItem.querySelector('.edit-area').value;
            let memos = loadMemos();
            const memoIndex = memos.findIndex(m => m.id === memoId);
            if (memoIndex > -1) { memos[memoIndex].memo = newMemoText; saveMemos(memos); }
            renderMemos();
        } else if (target.classList.contains('memo-image')) {
            const newWindow = window.open();
            newWindow.document.write(`<body style="margin:0; background:#111;"><img src="${target.src}" style="width:100%;"></body>`);
        }
    });
    memoImageInput.addEventListener('change', (e) => {
        const files = e.target.files; if (!files || files.length === 0) return;
        resetImageInput();
        imagePreviewContainer.classList.remove('hidden');
        const filePromises = Array.from(files).map(file => {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = e => resolve({ base64: e.target.result, name: file.name });
                reader.onerror = err => reject(err);
                reader.readAsDataURL(file);
            });
        });
        Promise.all(filePromises).then(results => { currentImages = results; renderImagePreviews(); })
            .catch(err => { alert("画像の読み込みに失敗しました。"); });
    });
    imagePreviewContainer.addEventListener('click', e => {
        if (e.target.classList.contains('remove-preview-btn')) {
            const indexToRemove = parseInt(e.target.dataset.index, 10);
            currentImages.splice(indexToRemove, 1);
            renderImagePreviews();
        }
    });
    searchBox.addEventListener('input', renderMemos);
    sortOrderSelect.addEventListener('change', renderMemos);
    exportBtn.addEventListener('click', () => {
        const memos = loadMemos(); if (memos.length === 0) { alert('エクスポートするデータがありません。'); return; }
        const dataStr = JSON.stringify(memos, null, 2);
        const blob = new Blob([dataStr], {type: 'application/json'});
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a'); a.href = url; a.download = `memo-app-backup-${new Date().toISOString().slice(0, 10)}.json`;
        a.click(); URL.revokeObjectURL(url);
    });
    importFile.addEventListener('change', e => {
        const file = e.target.files[0]; if (!file) return;
        const reader = new FileReader();
        reader.onload = e => {
            try {
                const importedMemos = JSON.parse(e.target.result);
                if (Array.isArray(importedMemos) && confirm(`${importedMemos.length}件のデータを追加しますか？`)) {
                    const currentMemos = loadMemos();
                    const newMemos = importedMemos.filter(m => !currentMemos.some(em => em.id === m.id));
                    saveMemos([...currentMemos, ...newMemos]); renderMemos(); alert(`${newMemos.length}件の新しいメモをインポートしました。`);
                } else { alert('無効なファイル形式です。'); }
            } catch { alert('ファイルの読み込みに失敗しました。'); }
        };
        reader.readAsText(file); e.target.value = '';
    });

    // --- 初期化処理 ---
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) { const isDark = savedTheme === 'dark'; themeSwitcher.checked = isDark; applyTheme(isDark); } 
    else { const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches; themeSwitcher.checked = prefersDark; applyTheme(prefersDark); }
    renderTimetable();
    populateSubjectDropdown();
    renderMemos();
});