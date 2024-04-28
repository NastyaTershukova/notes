tab('home')
loadNotesList();
openNote(0);

let title_obj = document.getElementById('note_content-title');
let note_content = document.getElementById('note_content');

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

function addPasteListeners(num) {
    for (let i=0; i<note_content.children.length; i++) {
        if (note_content.children[i].tagName == "P") {
            note_content.children[i].addEventListener("paste", function(e) {
                e.preventDefault();
                var text = (e.originalEvent || e).clipboardData.getData('text/plain');
                document.execCommand("insertHTML", false, text);
            });
        }
    }
}

title_obj.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        event.preventDefault();
        note_content.children[0].focus();
    }
});
title_obj.addEventListener('paste', (event) => {
    event.preventDefault();

    const text = (event.clipboardData || window.clipboardData).getData('text');

    const cleanedText = text.replace(/(\r\n|\n|\r)/gm, '');

    document.execCommand('insertText', false, cleanedText);
});


document.getElementById('note_menu').addEventListener('click', function (event) {
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
});

load_note();