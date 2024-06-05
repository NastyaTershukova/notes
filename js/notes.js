var currentNote = -1;
var currentNoteTags = [];
var isNoteChanged = false;
var isNoteSynced = false;

function closeNote() {
    if (currentNote != -1 && !isNoteSynced) {
        syncNote();
    }
    eraseHistory();
    isNoteOpened(false);
}

async function openNote(id, object) {
    let result = 'synced';
    
    if (currentNote != -1 && !isNoteSynced) {
        result = await syncNote(); // Вызывать и ждать syncNote только если это нужно
    }

    if (result == 'synced') {
        isNoteOpened(true);
        eraseHistory();
        imagePaths = {};

        let notes = document.getElementsByClassName("note");
        let note_num = document.getElementsByClassName("note").length;
        for (let i=0;i<note_num;i++) {
            notes[i].classList.remove("selected");
        }

        if (object != undefined) {
            object.classList.add("selected");
        } else {
            document.getElementById(`list_note${id}`).classList.add("selected");
        }

        currentNote = id;
        isNoteChanged = false;
        isNoteSynced = true;

        load_note(id);
    } else if (result == 'error') {
        console.log('Не получилось сохранить заметку. Пожалуйста, попробуйте еще раз.');
    }
}

function setNoteChanged() {
    let note_content = document.getElementById('note_content');

    isNoteChanged = true;
    isNoteSynced = false;
    document.querySelector('#context_menu-save').innerHTML = `<i class="ph-cloud-bold"></i> Синхронизировать`;
    document.querySelector(`#list_notes${currentNote}-edit_icon`).style.display = "block";
    document.querySelector(`#list_notes${currentNote}-edit_date`).innerText = "Сейчас";
    document.getElementById('note_content-date').innerText = note_date + ` • Изменено`;

    let card = document.querySelector(`#list_note${currentNote}`);
    card.parentNode.insertBefore(card, card.parentNode.firstChild);

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
    loadingSpinner(true);
    return new Promise((resolve, reject) => {
        let note = convert_to_json();
        let xhr = new XMLHttpRequest();

        xhr.onload = function() {
        if (xhr.status >= 200 && xhr.status < 300) {
            if (xhr.responseText == "token_reloaded") {
                console.log('Token is reloaded. Retry in 300ms...');
                setTimeout(() => {
                    syncNote();
                }, 300);
                return "token_reloaded";
            }

            document.querySelector('#context_menu-save').innerHTML = `<i class="ph-cloud-check-bold"></i> Синхронизировано`;
            document.getElementById('note_content-date').innerText = note_date;
            document.getElementById(`list_notes${currentNote}-edit_icon`).style.display = "none";
            document.getElementById(`list_note${currentNote}`).classList.remove('broken');


            isNoteChanged = false;
            isNoteSynced = true;

            let note_tags = '';
            if (note.preview_json.tags != undefined) {
                note_tags = note.preview_json.tags;
            }
            notesList[currentNote] = {
                title: note.preview_json.title,
                content: note.preview_json.text,
                tags: note_tags
            };

            resolve('synced');
            loadingSpinner(false);
            
        } else {
            console.error('Request failed with status ', xhr.status);
            reject('error');
        }
        };

        let url = 'php/updatenote.php';
        xhr.open('POST', url);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.send(`id=${currentNote}&contents=${note.contents}&preview=${note.preview}`);
    });
}
document.querySelector('#context_menu-save').addEventListener('click', () => {
    syncNote();
});

function deleteNote(uuid, isRecover) {
    loadingSpinner(true);
    let note = convert_to_json();
    let xhr = new XMLHttpRequest();

    if (uuid == 0) {
        uuid = currentNote;
    }

    xhr.onload = function() {
    if (xhr.status >= 200 && xhr.status < 300) {
        console.log(xhr.responseText);
        if (xhr.responseText == "token_reloaded") {
            console.log('Token is reloaded. Retry in 300ms...');
            setTimeout(() => {
                deleteNote(uuid);
            }, 300);
            return "token_reloaded";
        }

        let doUpdate = true;
        let loadNote = undefined;
        if (uuid == currentNote) {
            loadNote = 0;
            doUpdate = false;
            closeNote();
        }

        loadNotesList(loadNote, doUpdate);
        
    } else {
        console.error('Request failed with status ', xhr.status);
    }
    };

    let url = 'php/delete.php';
    xhr.open('POST', url);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    
    if (isRecover == true) {
        xhr.send(`uuid=${uuid}&recover=1`);
    } else {
        xhr.send(`uuid=${uuid}`);
    }
    
}
function deleteNoteForever(uuid) {
    loadingSpinner(true);
    let note = convert_to_json();
    let xhr = new XMLHttpRequest();

    if (uuid == 0) {
        uuid = currentNote;
    }

    xhr.onload = function() {
    if (xhr.status >= 200 && xhr.status < 300) {
        console.log(xhr.responseText);
        if (xhr.responseText == "token_reloaded") {
            console.log('Token is reloaded. Retry in 300ms...');
            setTimeout(() => {
                deleteNoteForever(uuid);
            }, 300);
            return "token_reloaded";
        }

        let doUpdate = true;
        let loadNote = undefined;
        if (uuid == currentNote) {
            loadNote = 0;
            doUpdate = false;
            closeNote();
        }

        loadNotesList(loadNote, doUpdate);
        
    } else {
        console.error('Request failed with status ', xhr.status);
    }
    };

    let url = 'php/delete_forever.php';
    xhr.open('POST', url);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.send(`uuid=${uuid}`);
}
document.querySelector('#context_menu-save').addEventListener('click', () => {
    syncNote();
});

function isNoteOpened(status) {
    if (status == true) {
        document.querySelector('.second_part_screen').classList.add('opened');
        document.querySelector('.menu_note').classList.add('opened');
        document.querySelector('.menu_mainpage').classList.add('hidden');
        document.querySelector('.note_hint').classList.add('hidden');
        document.querySelector('.written_note').classList.remove('hidden');
        document.querySelector('.written_note').classList.remove('hidden');
    } else {
        document.querySelector('.second_part_screen').classList.remove('opened');
        document.querySelector('.menu_note').classList.remove('opened');
        document.querySelector('.menu_mainpage').classList.remove('hidden');
        document.querySelector('.note_hint').classList.remove('hidden');
        document.querySelector('.written_note').classList.add('hidden');
    }
}

document.querySelector('#search-field').addEventListener('input', () => {

    let list = document.getElementById('list_notes');

    let value = document.querySelector('#search-field').value.trim().toLowerCase();

    let clear_btn = document.querySelector('#search_clear');
    if (value != '') {
        clear_btn.classList.remove('hidden');
    } else {
        clear_btn.classList.add('hidden');
    }
    let count = 0;

    for (let i=0; i<list.children.length; i++) {
        if (list.children[i].querySelector('.note_title').innerText.toLowerCase().includes(value)) {
            list.children[i].classList.remove('search-hidden');
        } else {
            list.children[i].classList.add('search-hidden');
            count++;
        }
    }

    if (count >= list.children.length) {
        toggleLeftHints('search_empty');
    } else {
        toggleLeftHints(false);
    }
});
document.querySelector('#search_clear').addEventListener('click', () => {

    document.querySelector('#search-field').value = '';
    document.querySelector('#search_clear').classList.add('hidden');

    for (let i=0; i<list.children.length; i++) {
        list.children[i].classList.remove('search-hidden');
    }

});


function toggleLeftHints(value) {
    // let list = document.querySelector('.left_side_hints');
    // let notes = document.querySelector('.first_part_screen');
    // if (value == false) {
    //     list.classList.add('hidden');
    //     notes.classList.remove('hidden');
        
    //     return;
    // }

    // list.classList.remove('hidden');
    // notes.classList.add('hidden');

    // for (let i=0; i<list.children.length; i++) {
    //     list.children[i].classList.add('hidden');
    // }
    // document.querySelector(`#hint_${value}`).classList.remove('hidden');
}

function syncNotePreview(uuid) {
    loadingSpinner(true);
    return new Promise((resolve, reject) => {

        if (notesList[uuid] == undefined) {
            reject('error');
            return;
        }
        let xhr = new XMLHttpRequest();

        xhr.onload = function() {
        if (xhr.status >= 200 && xhr.status < 300) {
            if (xhr.responseText == "token_reloaded") {
                console.log('Token is reloaded. Retry in 300ms...');
                setTimeout(() => {
                    syncNotePreview(uuid);
                }, 300);
                return "token_reloaded";
            }
            console.log(xhr.responseText);
            resolve('synced');
            loadingSpinner(false);
            
        } else {
            console.error('Request failed with status ', xhr.status);
            reject('error');
        }
        };

        let url = 'php/updatenote.php';
        xhr.open('POST', url);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.send(`id=${uuid}&preview=${JSON.stringify(notesList[uuid])}`);
    });
}