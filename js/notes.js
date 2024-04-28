function openNote(id) {

    let note_num = document.getElementsByClassName("note").length;
    for (let i=0;i<note_num;i++) {
        document.getElementsByClassName("note")[i].classList.remove("selected");
    }

    document.getElementsByClassName("note")[id].classList.add("selected");
}

function loadNotesList() {
    let list = document.getElementById('list_notes');

    list.innerHTML = "";

    for (let i=0;i<6;i++) {
        let card = document.createElement("div");
        card.innerHTML = `
            <p class="note_title">Очень крутой тайтл заметки.</p>
            <p class="note_text">Это описание заметки. Fr? Чай не к чаю, а спех к чаю блин...</p>
            <p class="note_time">Вчера</p>
        `;
        card.className = "note";
        card.id = `list_note${i}`;
        card.setAttribute("onclick", `openNote(${i})`);

        list.appendChild(card);
    }
}