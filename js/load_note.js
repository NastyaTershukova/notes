
function load_note(id) {

    loadingSpinner(true);

    document.getElementById('loading_note').style.display = "flex";
    document.getElementsByClassName('written_note')[0].style.display = "none";

    let content = document.getElementById('note_content');
    content.innerHTML = '';
    let xhr = new XMLHttpRequest();

    xhr.onload = function() {
    if (xhr.status >= 200 && xhr.status < 300) {
        if (xhr.responseText == "token_reloaded") {
            setTimeout(() => {
                load_note(id);
                console.log('Token is reloaded. Retry in 300ms...');
            }, 300);
            return;
        }
        let data = JSON.parse(xhr.responseText).map(item => {
            try {
              return JSON.parse(item); // Пытаемся разобрать каждый элемент как JSON
            } catch (e) {
              return item; // Если не получается, возвращаем исходный элемент
            }
          });
        console.log(xhr.responseText);
        convert_from_json(data);

        add_context_menus();
        eraseHistory();
        pushToHistory();

        hideLoadingScreen();
        document.getElementsByClassName('written_note')[0].style.display = "block";
    } else {
        console.error('Request failed with status ', xhr.status);
    }
    };

    let url = 'php/getnote.php';
    xhr.open('POST', url);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.send(`id=${id}`);

}

async function newNote() {
    let url = 'php/newnote.php';
    loadingSpinner(true);

    try {
        const response = await fetch(url);
        const text = await response.text();
        console.log(text);

        if (text == "token_reloaded") {
            console.log('Token is reloaded. Retry in 300ms...');
            setTimeout(newNote, 300);
        } else {
            loadingSpinner(false);
            loadNotesList(0);
        }
    } catch (error) {
        console.error('Request failed:', error);
    }
}

function loadNotesList(selectNote, doUpdate) {
    loadingSpinner(true);
    let xhr = new XMLHttpRequest();

    xhr.onload = function() {
    if (xhr.status >= 200 && xhr.status < 300) {
        if (xhr.responseText == "token_reloaded") {
            setTimeout(() => {
                loadNotesList(selectNote);
                console.log('Token is reloaded. Retry in 300ms...');
            }, 300);
            return;
        }

        let data = JSON.parse(xhr.responseText).map(item => {
            // item[0] - строка JSON, которую нужно разобрать
            let note = JSON.parse(item[0]);
            // Добавим теги, даты создания и обновления как свойства объекта note
            note.date_edited = item[1];
            note.date_created = item[2];
            note.tags = item[3];
            note.uuid = item[4];
            return note;
        });

        
        let list = document.getElementById('list_notes');
        list.innerHTML = "";
        for (let i=0;i<data.length;i++) {
            let preview = data[i];
            addListCard(preview);
        }
        try {
            if (doUpdate && currentNote != -1) {
                document.getElementById(`list_note${currentNote}`).classList.add('selected');
                if (isNoteChanged) {
                    document.getElementById(`list_notes${currentNote}-edit_date`).innerText = 'Сейчас';
                    document.getElementById(`list_notes${currentNote}-edit_icon`).style.display = 'block';
                    list.prepend(document.getElementById(`list_note${currentNote}`));
                }
            }
        } catch(e) {
            console.log(e);
        }
        
        document.getElementById('loading-screen').classList.add('hidden');

        if (selectNote != undefined) {

            if (typeof selectNote == "number") {
                //openNote(data[selectNote].uuid);
            } else {
                openNote(selectNote);
            }
            
        }
        loadingSpinner(false);

        setTimeout(() => {
            loadNotesList(undefined, true);
        }, 60000);

    } else {
        console.error('Request failed with status ', xhr.status);
    }
    };

    let sortby = "time_edited";
    let settings_sortby = localStorage.getItem('sort-by')
    if (settings_sortby != undefined) {
        sortby = settings_sortby;
    }

    let url = `php/noteslist.php?sortby=${sortby}&is_deleted=${isTrashBinOpened}`;
    xhr.open('GET', url);
    xhr.setRequestHeader('Content-Type', 'application/json');

    xhr.send();
}

function addListCard(preview, place) {
    let list = document.getElementById('list_notes');
    let card = document.createElement("div");
    let title = preview.title;
    if (title == "") {
        title = "Новая заметка";
    }
    let text = preview.text;
    if (text == "") {
        text = "[Пустая заметка]";
    }
    let date = new Date(preview.date_edited);

    card.innerHTML = `
        <p class="note_title">${title}</p>
        <p class="note_text">${text}</p>
        <div class="bottom_row">
            <i id="list_notes${preview.uuid}-edit_icon" class="ph-pencil-simple-line-bold"></i>
            <p id='list_notes${preview.uuid}-edit_date' class="note_time">${formatRelativeDate(date.getTime() / 1000)}</p>
        </div>
        
    `;
    card.className = "note";
    card.id = `list_note${preview.uuid}`;
    card.setAttribute("onclick", `openNote('${preview.uuid}', this)`);

    let uuid = preview.uuid;

    card.addEventListener('contextmenu', (event) => {
        summon_context_menu(event, "list", uuid);
    });

    if (place != undefined) {
        list.insertBefore(card, list.children[place+1]);
    } else {
        list.appendChild(card);
    }
}

function pluralize(n, forms) {
    return forms[(n % 10 === 1 && n % 100 !== 11) ? 0 : (n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20)) ? 1 : 2];
}

function formatRelativeDate(timestamp) {
    const now = new Date();
    const date = convertTimestamp(timestamp);
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
  
    const diff = now - date; // Разница в миллисекундах
    const diffMinutes = Math.round(diff / 60000); // Разница в минутах
    const diffHours = Math.round(diff / 3600000); // Разница в часах
  
    if (diff < 60000) {
      return "Только что";
    } else if (diff < 3600000) {
      return `${diffMinutes} ${pluralize(diffMinutes, ['минуту', 'минуты', 'минут'])} назад`;
    } else if (diff < 86400000 && now.getDate() === date.getDate()) {
      return `${diffHours} ${pluralize(diffHours, ['час', 'часа', 'часов'])} назад`;
    } else if (yesterday.getDate() === date.getDate() &&
               yesterday.getMonth() === date.getMonth() &&
               yesterday.getFullYear() === date.getFullYear()) {
      return "Вчера";
    } else {
      return formatDate(date, now.getFullYear());
    }
}
  
function formatDate(date, currentYear) {
    const day = date.getDate();
    const month = date.toLocaleString('ru-RU', { month: 'long' });
    const year = date.getFullYear();

    if (year === currentYear) {
        return `${day} ${month}`;
    } else {
        return `${day} ${month} ${year}г.`;
    }
}

function convertTimestamp(timestamp) {
    const date = new Date(timestamp * 1000);
    return date;
}

function hideLoadingScreen() {
    document.getElementById('loading_note').style.opacity = "0";
    setTimeout(() => {
        document.getElementById('loading_note').style.display = "none";
        document.getElementById('loading_note').style.opacity = "1";
    }, 250);
}

function formatFullDate(dateString) {
    const date = new Date(dateString);
    
    const day = date.toLocaleString('ru-RU', { day: 'numeric' });
    const months = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
    const month = months[date.getMonth()];
    const year = date.toLocaleString('ru-RU', { year: 'numeric' });
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');

    // Формирование итоговой строки
    return `${day} ${month} ${year}г. в ${hours}:${minutes}`;
}