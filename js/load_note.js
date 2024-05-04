function load_note(id) {

    document.getElementById('loading_note').style.display = "flex";
    document.getElementsByClassName('written_note')[0].style.display = "none";

    let content = document.getElementById('note_content');
    content.innerHTML = '';
    let note_string = '{"title":"Тестирование загрузки заметок из JSON","date":"16.01.2024","time":"10:11","content":[{"type":"paragraph","value":"Тут идет первый параграф..."},{"type":"image","value":"http://localhost:9000/img/Cover.jpg"},{"type":"paragraph","value":"Тут идет второй параграф..."},{"type":"paragraph","value":"Ну а тут третий. LOL Ha-Ha"}]}';

    convert_from_json(JSON.parse(note_string));

    add_context_menus();
    eraseHistory();
    pushToHistory();

    setTimeout(() => {
        hideLoadingScreen();
    }, 500);
    document.getElementsByClassName('written_note')[0].style.display = "block";
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
        //loadNotesList();

    } else {
        console.error('Request failed with status ', xhr.status);
    }
    };

    let url = 'php/newnote.php';
    xhr.open('GET', url);

    xhr.send();
}

function loadNotesList() {
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

        let data = JSON.parse(xhr.responseText);
        
        let list = document.getElementById('list_notes');

        list.innerHTML = "";

        for (let i=0;i<6;i++) {
            let card = document.createElement("div");
            let title = data[i].preview.title;
            if (title == "") {
                title = "Новая заметка";
            }
            let text = data[i].preview.text;
            if (text == "") {
                text = "[Пустая заметка]";
            }

            card.innerHTML = `
                <p class="note_title">${title}</p>
                <p class="note_text">${text}</p>
                <div class="bottom_row">
                    <i id="list_notes${i}-edit_icon" class="ph-pencil-simple-line-bold"></i>
                    <p class="note_time">${data[i].preview.time}</p>
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

    } else {
        console.error('Request failed with status ', xhr.status);
    }
    };

    let url = 'php/noteslist.php';
    xhr.open('GET', url);
    xhr.setRequestHeader('Content-Type', 'application/json');

    xhr.send();
}