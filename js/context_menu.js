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

function context_tab(name, data) {
    let tabs = ['sec', 'menu', 'basic', 'img', 'list', 'sort', 'list_trash'];

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
            if (isTrashBinOpened == 0) {
                document.getElementById(`context-list`).style.display = 'block';
                document.getElementById('context-list').innerHTML = '';

                let tags_row = `<div class="tags"><i class="ph-tag-bold"></i>`;
                for (let i=0; i<colors.length; i++) {
                    if (notesList[data] != undefined && notesList[data].tags.includes(colors[i])) {
                        tags_row += `<button onclick="toggleTag('${data}', '${colors[i]}')" class="tag ${colors[i]}"> <div><span class="tag_dot"></span></div> </button>`;
                    } else {
                        tags_row += `<button onclick="toggleTag('${data}', '${colors[i]}')" class="tag ${colors[i]}"> <div></div> </button>`;
                    }
                }
                tags_row += '</div>';

                document.getElementById('context-list').innerHTML = `
                    <button id="context_menu-select"><i class="ph-check-circle-bold"></i> Выбрать</button>
                    <button id="context_menu-list_share" style="display: none"><i class="ph-export-bold"></i> Поделиться...</button>
                    <button id="context_menu-duplicate" style="display: none"><i class="ph-copy-bold"></i> Дублировать</button>
                    <button id="context_menu-list_update"><i class="ph-arrows-clockwise-bold"></i> Обновить список</button>
                    <button id="context_menu-pin" style="display: none"><i class="ph-push-pin-bold"></i> Закрепить</button>
        
                    ${tags_row}
        
                    <hr>
        
                    <button id="context_menu-list_delete" class="red"><i class="ph-trash-simple-bold"></i> Удалить заметку</button>    
                `;

                document.getElementById('context_menu-list_delete').addEventListener('click', function() {
                    deleteNote(data);
                });
                document.getElementById('context_menu-list_update').addEventListener('click', () => {
                    loadNotesList(undefined, true);
                });
            } else {
                document.getElementById(`context-list_trash`).style.display = 'block';

                document.getElementById('context-list_trash').innerHTML = '';
                document.getElementById('context-list_trash').innerHTML = `
                    <button id="context_menu-trash_select"><i class="ph-check-circle-bold"></i> Выбрать</button>
                    <button id="context_menu-trash_list_update"><i class="ph-arrows-clockwise-bold"></i> Обновить список</button>
                    <button id="context_menu-trash_recover"><i class="ph-file-arrow-up-bold"></i> Восстановить заметку</button>
        
                    <hr>
        
                    <button id="context_menu-delete_forever" class="red"><i class="ph-trash-simple-bold"></i> Удалить окончательно</button>
                `;
                document.getElementById('context_menu-delete_forever').addEventListener('click', function() {
                    deleteNoteForever(data);
                });
                document.getElementById('context_menu-trash_list_update').addEventListener('click', () => {
                    loadNotesList(undefined, true);
                });
                document.getElementById('context_menu-trash_recover').addEventListener('click', function() {
                    deleteNote(data, true);
                });
            }
            break;
        case "sort":
            document.getElementById(`context-sort`).style.display = 'block';
            break;
    }
}

function toggleTag(uuid, color) {
    let tags_array = []
    try {
      tags_array = notesList[uuid].tags ? notesList[uuid].tags.split(',').filter(tag => tag.trim() !== '') : [] // Преобразование строки в массив и удаление пустых элементов
    } catch (e) {
    }
  
    const colorIndex = tags_array.indexOf(color);
  
    if (colorIndex !== -1) {
      // Удаление элемента
      tags_array.splice(colorIndex, 1);
    } else {
      // Добавление элемента
      tags_array.push(color);
    }
  
    // Присвоение измененной строки обратно в notesList
    if (notesList[uuid] == undefined) {
        notesList[uuid] = {};
    }
    notesList[uuid].tags = tags_array.filter(tag => tag.trim() !== '').join(',');

    document.getElementById(`tags${uuid}`).innerHTML = tagsToIcons(notesList[uuid].tags);
  
    syncNotePreview(uuid);
}
  

var contextMenuData = -1;
function summon_context_menu(event, tagName, data) {
    contextMenuData = data;
    context_tab(tagName, data);
    contextmenu_click(event);
    document.addEventListener('click', () => {
        context_menu.classList.add("hidden");
        contextMenuData = -1;
    }, { once: true });
} 

function contextmenu_click(event, xx, yy) {
    event.preventDefault();
    let context_menu = document.getElementById("context_menu");

    let rect = context_menu.getBoundingClientRect();

    let x = Math.min(event.clientX, window.innerWidth - rect.width - 16);
    let y = Math.min(event.clientY, window.innerHeight - rect.height - 16);

    if (rect.height > 500) {
        y = event.clientY;
    }

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
document.getElementById('mobile_image').addEventListener('click', createImage);

//document.getElementById('context_menu-paragraph').addEventListener('click', createParagraph);

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

document.getElementById('context_menu-upload_img').addEventListener('click', () => {
    setNoteChanged();
    newImagePopup(true);
     lastCreatedImage = currentFocus;
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
    localStorage.setItem('sort-order', 'ascending');
});
document.getElementById('context_menu-sort_descending').addEventListener('click', () => {
    sortDescending();
    localStorage.setItem('sort-order', 'descending');
});
document.getElementById('context_menu-sort_date_edited').addEventListener('click', () => {
    localStorage.setItem('sort-by', 'time_edited');
    sortTimeEdited();
    loadNotesList(undefined, true);
});
document.getElementById('context_menu-sort_date_added').addEventListener('click', () => {
    localStorage.setItem('sort-by', 'time_created');
    sortTimeAdded();
    loadNotesList(undefined, true);
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

document.getElementById('context_menu-delete').addEventListener('click', () => {
    deleteNote(0);
});

document.getElementById('context_menu-trash_list_update').addEventListener('click', () => {
    loadNotesList(undefined, true);
});
document.getElementById('context_menu-delete_forever').addEventListener('click', () => {
    deleteNoteForever(0);
});
document.getElementById('context_menu-trash_recover').addEventListener('click', () => {
    deleteNote(0, true);
});

document.getElementById('mobile_cursor').addEventListener('click', (event) => {
    let focusTag = 'P';
    if (currentFocus != -1) {
        focusTag = document.getElementById(currentFocus).tagName;
    }
    if (!(focusTag == 'P' || focusTag == 'IMG')) {
        focusTag = 'P';
    }

    if (!context_menu.classList.contains('hidden')) {
        context_menu.classList.add("hidden");
    } else {
        contextmenu_click(event);
        context_tab(focusTag);
        setTimeout(() => {
            document.addEventListener('click', () => {
                context_menu.classList.add("hidden");
            }, { once: true });
        }, 1);
    }
    
});
