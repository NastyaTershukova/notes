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
    let tabs = ['sec', 'menu', 'basic', 'img'];

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
    }
}

function summon_context_menu(event, tagName) {
    contextmenu_click(event);
    context_tab(tagName);
    document.addEventListener('click', () => {
        context_menu.classList.add("hidden");
    }, { once: true });
} 

function contextmenu_click(event) {
    event.preventDefault();
    let context_menu = document.getElementById("context_menu");

    let x = Math.min(event.pageX, window.innerWidth - 216);
    let y = Math.min(event.pageY - window.scrollY, window.innerHeight - context_menu.clientHeight - 16);

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