tab('home')
initializeSettings();

var isTrashBinOpened = 0;

let title_obj = document.getElementById('note_content-title');
let note_content = document.getElementById('note_content');

function loadingSpinner(state) {
    if (state == true) {
        document.getElementById('nav_bar-loading').classList.add('show');
    } else {
        document.getElementById('nav_bar-loading').classList.remove('show');
    }
}

function insertTextAtCursor(text) {
    const sel = window.getSelection();
    if (sel.rangeCount) {
        const range = sel.getRangeAt(0);
        range.deleteContents(); // Удаляем выбранный контент, если есть
        range.insertNode(document.createTextNode(text));
        range.collapse(false); // Перемещаем курсор в конец вставленного текста

        // Обновляем выделение
        const newRange = document.createRange();
        newRange.setStartAfter(range.endContainer);
        newRange.setEndAfter(range.endContainer);
        sel.removeAllRanges();
        sel.addRange(newRange);
    }
}

title_obj.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        event.preventDefault();
        note_content.children[0].focus();
    }
});
title_obj.addEventListener('input', () => {
    setNoteChanged();
    let value = "Новая заметка";

    if (getParagraphLength(title_obj) > 0) {
        value = title_obj.innerText;
        document.getElementById('note_content-title_placeholder').style.display = "none";
    } else {
        document.getElementById('note_content-title_placeholder').style.display = "block";
    }

    document.querySelector(`#list_note${currentNote}`).children[0].innerText = value;
});
title_obj.addEventListener('paste', (event) => {
    setNoteChanged();
    event.preventDefault();

    const text = (event.clipboardData || window.clipboardData).getData('text');

    const cleanedText = text.replace(/(\r\n|\n|\r)/gm, '');

    document.execCommand('insertText', false, cleanedText);
});


document.getElementById('note_menu').addEventListener('click', (event) => {note_menu_button(event) });
document.getElementById('note_menu_mobile').addEventListener('click', (event) => {note_menu_button(event) });

function note_menu_button(event) {
    if (!context_menu.classList.contains('hidden')) {
        context_menu.classList.add("hidden");
    } else {
        contextmenu_click(event);
        context_tab('menu')
        setTimeout(() => {
            document.addEventListener('click', () => {
                context_menu.classList.add("hidden");
            }, { once: true });
        }, 1);
    }
}

var clickedOnTagSort = false;
document.getElementById('sorting').addEventListener('click', (event) => {
    if (!context_menu.classList.contains('hidden')) {
        context_menu.classList.add("hidden");
        clickedOnTagSort = false;
    } else {
        contextmenu_click(event, undefined, 64);
        context_tab('sort')
        setTimeout(() => {
            eventSortingExit();
        }, 1);
    }
});

eventsSortTags();

function eventSortingExit() {
    document.addEventListener('click', () => {
        if (!clickedOnTagSort) {
            context_menu.classList.add("hidden");
            clickedOnTagSort = false;
        } else {
            setTimeout(() => {
                eventSortingExit();
                clickedOnTagSort = false;
            }, 1);
        }
        
    }, { once: true });
}

document.querySelector('#new_paragraph').addEventListener('click', () => {
    note_content.children[note_content.children.length - 1].focus();
    createParagraph();
});

login();

let settings_sortby = localStorage.getItem('sort-by');
if (settings_sortby == 'time_created') {
    sortTimeAdded();
}
let settings_order = localStorage.getItem('sort-order');
if (settings_order == 'descending') {
    sortDescending();
}

function brokenNotePopup(status) {
    let popup = document.querySelector('.broken_note_popup');
  
    if (status == false) {
      popup.classList.add('hidden');
      return;
    }

    popup.classList.remove('hidden');

    if (status == 'broken') {
        popup.querySelector('.popup_window').innerHTML = `
            <div class="flex-center"> <i class="ph-warning-fill popup_icon_big yellow"></i> </div>
            <h3>Эта заметка окончательно повреждена</h3>
            <p class="popup_text">Заметка, которую вы пытаетесь открыть, имеет необратимые повреждения.</p>
            <div class="popup_buttons">
                <button class="accent" onclick="brokenNotePopup(false)">Удалить навсегда</button>
                <button onclick="brokenNotePopup(false)">Закрыть</button>
            </div>
        `;
        return;
    }

    popup.querySelector('.popup_window').innerHTML = `
        <div class="flex-center"> <i class="ph-warning-fill popup_icon_big yellow"></i> </div>
        <h3>Эта заметка повреждена</h3>
        <p class="popup_text">Заметка, которую вы пытаетесь открыть, возможно имеет повреждения. Вы можете попробовать открыть эту заметку и сохранить её, чтобы устранить проблемы.</p>
        <div class="popup_buttons">
            <button onclick="openNote('${status}'); brokenNotePopup(false)" class="accent">
                Открыть
            </button>
            <button onclick="brokenNotePopup(false)">Не открывать</button>
        </div>
    `;
}