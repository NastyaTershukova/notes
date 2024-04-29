var currentNote = -1;
var isNoteChanged = false;
var isNoteSynced = false;
function openNote(id) {
    if (currentNote != -1) {
        syncNote();
    }

    let note_num = document.getElementsByClassName("note").length;
    for (let i=0;i<note_num;i++) {
        document.getElementsByClassName("note")[i].classList.remove("selected");
    }

    document.getElementsByClassName("note")[id].classList.add("selected");

    currentNote = id;
    isNoteChanged = false;
    isNoteSynced = true;

    load_note(id);
}

function loadNotesList() {
    let list = document.getElementById('list_notes');

    list.innerHTML = "";

    for (let i=0;i<6;i++) {
        let card = document.createElement("div");
        card.innerHTML = `
            <p class="note_title">Очень крутой тайтл заметки.</p>
            <p class="note_text">Это описание заметки. Fr? Чай не к чаю, а спех к чаю блинЭто описание заметки. Fr? Чай не к чаю, а спех к чаю блин...</p>
            <div class="bottom_row">
                <i id="list_notes${i}-edit_icon" class="ph-pencil-simple-line-bold"></i>
                <p class="note_time">Вчера</p>
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
}

function setNoteChanged() {
    let note_content = document.getElementById('note_content');

    isNoteChanged = true;
    isNoteSynced = false;
    document.querySelector('#context_menu-save').innerHTML = `<i class="ph-cloud-bold"></i> Синхронизировать`;
    document.querySelector(`#list_notes${currentNote}-edit_icon`).style.display = "block";
    document.getElementById('note_content-date').innerText = note_date + ` • Изменено`;

    let first_paragraph = "[Пустая заметка]";

    for (let i in note_content.children) {
        if (note_content.children[i].tagName == "P" && getParagraphLength(note_content.children[i]) > 0) {
            first_paragraph = note_content.children[i].innerText;
            break;
        }
    }
    document.querySelector(`#list_note${currentNote}`).children[1].innerText = first_paragraph;
    handleNewParagraph();
    
}

function handleNewParagraph() {
    if (note_content.children[note_content.children.length - 1].tagName != "P") {
        document.getElementById('new_paragraph').classList = 'show';
    } else {
        document.getElementById('new_paragraph').classList = 'hide';
    }
}

function syncNote() {
    isNoteChanged = false;
    isNoteSynced = true;
    document.querySelector('#context_menu-save').innerHTML = `<i class="ph-cloud-check-bold"></i> Синхронизировано`;
    document.getElementById('note_content-date').innerText = note_date;
    document.querySelector(`#list_notes${currentNote}-edit_icon`).style.display = "none";
}
document.querySelector('#context_menu-save').addEventListener('click', () => {
    syncNote();
});