tab('home')
loadNotes();
openNote(0);

let title_obj = document.getElementById('note_content-title');
let text_obj = document.getElementById('note_content-text');

function performAction (command) {
    if (!history.back.length || history.back[history.back.length - 1] != text_obj.innerHTML) {
        history.back.push(text_obj.innerHTML);
    }
    document.execCommand(command, false, null);
    text_obj.focus();
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

function undo() {
    if (!history.back.length) {
        return;
    }
    history.forward.push(text_obj.innerHTML);
    text_obj.innerHTML = history.back.pop();
}

function redo() {
    if (!history.forward.length) {
        return;
    } history.back.push(text_obj.innerHTML);
    text_obj.innerHTML = history.forward.pop();
}

function contextmenu_click(event) {
    event.preventDefault();

    let x = Math.min(event.pageX, window.innerWidth - 216);
    let y = Math.min(event.pageY - window.scrollY, window.innerHeight - context_menu.clientHeight - 16);

    context_menu.style.top = `${y}px`;
    context_menu.style.left = `${x}px`;

    context_menu.classList.remove("hidden");
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
    text_obj.focus();
});
document.getElementById('context_menu-redo').addEventListener('click', function () {
    redo();
    text_obj.focus();
});
document.getElementById('context_menu-paste').addEventListener('click', async () => {
    try {
        const text = await navigator.clipboard.readText();
        insertTextAtCursor(text);
    } catch (err) {
        console.error('Ошибка при вставке текста: ', err);
    }
});

text_obj.addEventListener('keydown', function (event) {
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
        history.back.push(text_obj.innerHTML);
    }
    
    
});

title_obj.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        event.preventDefault();
        text_obj.focus()
    }
});
title_obj.addEventListener('paste', (event) => {
    event.preventDefault();

    const text = (event.clipboardData || window.clipboardData).getData('text');

    const cleanedText = text.replace(/(\r\n|\n|\r)/gm, '');

    document.execCommand('insertText', false, cleanedText);
});

let context_menu = document.getElementById("context_menu");
text_obj.addEventListener('contextmenu', (event) => {
    contextmenu_click(event);
    context_tab('sec');
    document.addEventListener('click', () => {
        context_menu.classList.add("hidden");
    }, { once: true });
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

function context_tab(name) {
    let tabs = ['sec', 'menu'];

    for (let i=0;i<tabs.length;i++) {
        document.getElementById(`context-${tabs[i]}`).style.display = 'none';
    }

    document.getElementById(`context-${name}`).style.display = 'block';
}