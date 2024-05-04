var currentNote = -1;
var isNoteChanged = false;
var isNoteSynced = false;
function openNote(id, object) {
    if (currentNote != -1) {
        syncNote();
    }

    let note_num = document.getElementsByClassName("note").length;
    for (let i=0;i<note_num;i++) {
        document.getElementsByClassName("note")[i].classList.remove("selected");
    }

    if (object != undefined) {
        object.classList.add("selected");
    } else {
        document.getElementsByClassName("note")[id].classList.add("selected");
    }
    

    currentNote = id;
    isNoteChanged = false;
    isNoteSynced = true;

    load_note(id);
}

function setNoteChanged() {
    let note_content = document.getElementById('note_content');

    isNoteChanged = true;
    isNoteSynced = false;
    document.querySelector('#context_menu-save').innerHTML = `<i class="ph-cloud-bold"></i> Синхронизировать`;
    document.querySelector(`#list_notes${currentNote}-edit_icon`).style.display = "block";
    document.querySelector(`#list_notes${currentNote}-edit_date`).innerText = "Сейчас";
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
    //document.querySelector(`#list_notes${currentNote}-edit_icon`).style.display = "none";
}
document.querySelector('#context_menu-save').addEventListener('click', () => {
    syncNote();
});