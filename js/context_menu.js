function add_context_menus() {
    let note = document.getElementById('note_content');

    for (let i=0; i<note.children.length; i++) {
        note.children[i].addEventListener('contextmenu', (event) => {
            summon_context_menu(event, note.children[i].tagName)
        });
    }
}

function setCursorAtPosition(element, position) {
    // Проверить, поддерживает ли браузер необходимые API
    if (window.getSelection && document.createRange) {
      // Создать новый диапазон
      const range = document.createRange()
  
      // Установить начальную и конечную точки диапазона
      range.setStart(element.childNodes[0], position)
      range.setEnd(element.childNodes[0], position)
  
      // Получить текущий выбор
      const selection = window.getSelection()
  
      // Очистить текущий выбор, если он существует
      selection.removeAllRanges()
  
      // Добавить новый диапазон в выбор
      selection.addRange(range)
    }
}

function getParagraphLength(obj) {
    return obj.innerText.replaceAll(/^\n/g, '').length;
}

function context_tab(name) {
    let tabs = ['sec', 'menu', 'basic', 'img', 'list', 'sort'];

    for (let i=0;i<tabs.length;i++) {
        document.getElementById(`context-${tabs[i]}`).style.display = 'none';
    }

    switch (name) {
        case "P":
            document.getElementById(`context-sec`).style.display = 'block';
            document.getElementById(`context-basic`).style.display = 'block';
            break;
        case "IMG":
            document.getElementById(`context-img`).style.display = 'block';
            document.getElementById(`context-basic`).style.display = 'block';
            break;
        case "menu":
            document.getElementById(`context-menu`).style.display = 'block';
            break;
        case "list":
            document.getElementById(`context-list`).style.display = 'block';
            break;
        case "sort":
            document.getElementById(`context-sort`).style.display = 'block';
            break;
    }
}

var contextMenuData = -1;
function summon_context_menu(event, tagName, data) {
    contextMenuData = data;
    contextmenu_click(event);
    context_tab(tagName);
    document.addEventListener('click', () => {
        context_menu.classList.add("hidden");
        contextMenuData = -1;
    }, { once: true });
} 

function contextmenu_click(event, xx, yy) {
    event.preventDefault();
    let context_menu = document.getElementById("context_menu");

    let x = Math.min(event.pageX, window.innerWidth - 216);
    let y = Math.min(event.pageY - window.scrollY, window.innerHeight - context_menu.clientHeight - 16);

    if (xx != undefined) { x = xx; }
    if (yy != undefined) { y = yy; }

    context_menu.style.top = `${y}px`;
    context_menu.style.left = `${x}px`;

    context_menu.classList.remove("hidden");
}

function get_object_count(obj) {
    let note_content = document.getElementById('note_content');
    let count = 0;
    for (let i=0; i<note_content.children.length; i++) {
        if (note_content.children[i].tagName == obj) {
            count++;
        }
    }

    return count;
}

document.getElementById('context_menu-image').addEventListener('click', createImage);

document.getElementById('context_menu-paragraph').addEventListener('click', createParagraph);

document.getElementById('context_menu-json').addEventListener('click', () => {
    convert_to_json();
});

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
        setNoteChanged();
        const text = await navigator.clipboard.readText();
        insertTextAtCursor(text);
    } catch (err) {
        console.error('Ошибка при вставке текста: ', err);
    }
});

document.getElementById('context_menu-remove_img').addEventListener('click', () => {
    pushToHistory();
    let previous_element = -1;
    for (let i=0; i<note_content.children.length; i++) {
        if (note_content.children[i].id == currentFocus && i != 0) {
            previous_element = i - 1;
        }
    }

    document.getElementById(currentFocus).remove();
    note_content.children[previous_element].focus();

    handleNewParagraph();
});
document.getElementById('context_menu-sort_ascending').addEventListener('click', () => {
    sortAscending();
});
document.getElementById('context_menu-sort_descending').addEventListener('click', () => {
    sortDescending();
});
document.getElementById('context_menu-sort_date_edited').addEventListener('click', () => {
    sortTimeEdited();
});
document.getElementById('context_menu-sort_date_added').addEventListener('click', () => {
    sortTimeAdded();
});
document.getElementById('context_menu-sort_title').addEventListener('click', () => {
    sortTitle();
});
document.getElementById('context_menu-sort_reset').addEventListener('click', () => {
    sortAscending();
    sortTimeEdited();
    color_tags = [];
    checkSortTags();
});