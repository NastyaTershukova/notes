function load_note(id) {

    document.getElementById('loading_note').style.display = "flex";
    document.getElementsByClassName('written_note')[0].style.display = "none";

    let content = document.getElementById('note_content');
    content.innerHTML = '';
    //let note_string = '{"title":"Тестирование загрузки заметок из JSON","date":"16.01.2024","time":"10:11","content":[{"type":"paragraph","value":"Тут идет первый параграф..."},{"type":"image","value":"http://localhost:9000/img/Cover.jpg"},{"type":"paragraph","value":"Тут идет второй параграф..."},{"type":"paragraph","value":"Ну а тут третий. LOL Ha-Ha"}]}';

    let xhr = new XMLHttpRequest();

    xhr.onload = function() {
    if (xhr.status >= 200 && xhr.status < 300) {
        if (xhr.responseText == "token_reloaded") {
            setTimeout(() => {
                newNote();
                console.log('Token is reloaded. Retry in 300ms...');
            }, 300);
            return;
        }
        let data = JSON.parse(xhr.responseText);
        convert_from_json(data);
        note_date = formatRelativeDate(data.date)

        add_context_menus();
        eraseHistory();
        pushToHistory();

        setTimeout(() => {
            hideLoadingScreen();
        }, 500);
        document.getElementsByClassName('written_note')[0].style.display = "block";
    } else {
        console.error('Request failed with status ', xhr.status);
    }
    };

    let url = 'php/getnote.php';
    xhr.open('POST', url);
    xhr.send(`id=${id}`);

}

function hideLoadingScreen() {
    document.getElementById('loading_note').style.opacity = "0";
    setTimeout(() => {
        document.getElementById('loading_note').style.display = "none";
        document.getElementById('loading_note').style.opacity = "1";
    }, 250);
}

function newNote() {
    let xhr = new XMLHttpRequest();

    xhr.onload = function() {
    if (xhr.status >= 200 && xhr.status < 300) {
        console.log(xhr.responseText);
        if (xhr.responseText == "token_reloaded") {
            setTimeout(() => {
                newNote();
                console.log('Token is reloaded. Retry in 300ms...');
            }, 300);
            return;
        }
        loadNotesList();

    } else {
        console.error('Request failed with status ', xhr.status);
    }
    };

    let url = 'php/newnote.php';
    xhr.open('GET', url);

    xhr.send();
}

function convertTimestamp(timestamp) {
    const date = new Date(timestamp * 1000);
    return date;
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
  

function loadNotesList(selectNote) {
    let xhr = new XMLHttpRequest();

    xhr.onload = function() {
    if (xhr.status >= 200 && xhr.status < 300) {
        //console.log(xhr.responseText);
        if (xhr.responseText == "token_reloaded") {
            setTimeout(() => {
                newNote();
                console.log('Token is reloaded. Retry in 300ms...');
            }, 300);
            return;
        }

        let data = JSON.parse(xhr.responseText).map(item => {
            // item[0] - строка JSON, которую нужно разобрать
            let note = JSON.parse(item[0]);
            // Добавим даты создания и обновления как свойства объекта note
            note.date_edited = item[1];
            note.date_created = item[2];
            return note;
          });

        
        let list = document.getElementById('list_notes');

        list.innerHTML = "";

        for (let i=0;i<data.length;i++) {
            let card = document.createElement("div");
            let preview = data[i];
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
                    <i id="list_notes${i}-edit_icon" class="ph-pencil-simple-line-bold"></i>
                    <p id='list_notes${i}-edit_date' class="note_time">${formatRelativeDate(date.getTime() / 1000)}</p>
                </div>
                
            `;
            card.className = "note";
            card.id = `list_note${i}`;
            card.setAttribute("onclick", `openNote(${i})`);

            card.addEventListener('contextmenu', (event, i) => {
                summon_context_menu(event, "list", i)
            });

            list.appendChild(card);
        }

        if (selectNote != undefined) {
            openNote(selectNote);
        }

    } else {
        console.error('Request failed with status ', xhr.status);
    }
    };

    let url = 'php/noteslist.php';
    xhr.open('GET', url);
    xhr.setRequestHeader('Content-Type', 'application/json');

    xhr.send();
}