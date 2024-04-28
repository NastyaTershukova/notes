function load_note() {

    document.getElementById('loading_note').style.display = "flex";
    document.getElementsByClassName('written_note')[0].style.display = "none";

    let content = document.getElementById('note_content');
    content.innerHTML = '';
    let note_string = '{"title":"Тестирование загрузки заметок из JSON","date":"16.01.2024","time":"10:11","content":[{"type":"paragraph","value":"Тут идет первый параграф..."},{"type":"image","value":"http://localhost:9000/img/Cover.jpg"},{"type":"paragraph","value":"Тут идет второй параграф..."},{"type":"paragraph","value":"Ну а тут третий. LOL Ha-Ha"}]}';

    convert_from_json(JSON.parse(note_string));

    add_context_menus();

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