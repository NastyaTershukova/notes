tab('home')
loadNotesList();
openNote(0);

let title_obj = document.getElementById('note_content-title');
let note_content = document.getElementById('note_content');

function performAction (command) {
    // if (!history.back.length || history.back[history.back.length - 1] != text_obj.innerHTML) {
    //     history.back.push(text_obj.innerHTML);
    // }
    document.execCommand(command, false, null);
    //text_obj.focus();
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

function undo() {
    if (!history.back.length) {
        return;
    }
    history.forward.push(note_content.innerHTML);
    note_content.innerHTML = history.back.pop();
}

function redo() {
    if (!history.forward.length) {
        return;
    } history.back.push(note_content.innerHTML);
    note_content.innerHTML = history.forward.pop();
}

const history = {
    back: [],
    forward: []
};

document.getElementById('context_menu-bold').addEventListener('click', function () {
    performAction('bold');
});
document.getElementById('context_menu-italic').addEventListener('click', function () {
    performAction('italic');
});
document.getElementById('context_menu-underline').addEventListener('click', function () {
    performAction('underline');
});
document.getElementById('context_menu-undo').addEventListener('click', function () {
    undo();
    //text_obj.focus();
});
document.getElementById('context_menu-redo').addEventListener('click', function () {
    redo();
    //text_obj.focus();
});
document.getElementById('context_menu-paste').addEventListener('click', async () => {
    try {
        const text = await navigator.clipboard.readText();
        insertTextAtCursor(text);
    } catch (err) {
        console.error('Ошибка при вставке текста: ', err);
    }
});

document.getElementById('note_content').addEventListener('keydown', function (event) {
    if ((event.key === 'b' || event.key === 'B') && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        performAction('bold');
    } else if ((event.key === 'u' || event.key === 'U') && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        performAction('underline');
    } else if ((event.key === 'i' || event.key === 'I') && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        performAction('italic');
    }

    if ((event.key === 'z' || event.key === 'Z') && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        undo();
    } else if (((event.key === 'y' || event.key === 'Y') && (event.metaKey || event.ctrlKey)) || ((event.key === 'z' || event.key === 'Z') && (event.metaKey || event.ctrlKey) && (event.shiftKey))) {
        event.preventDefault();
        undo();
    } else {
        history.forward.length = [];
        history.back.push(note_content.innerHTML);
    }
    
    
});

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