function convert_to_json() {
    let note = document.getElementById('note_content');
    let json_struct = {
        title: document.getElementById('note_content-title').innerText,
        date: "16.01.2024",
        time: "10:11",
        content: []
    }

    for (let i=0; i<note.children.length; i++) {

        let c = json_struct.content.length;

        let content_type = null;
        let content_value = null;
        switch (note.children[i].tagName) {
            case "P":
                content_type = "paragraph";
                content_value = note.children[i].innerHTML;
                break;
            case "IMG":
                content_type = "image";
                content_value = note.children[i].src;
                break;
            case "TEXTAREA":
                content_type = "code";
                content_value = note.children[i].value;
                break;
            
        }
    
        if (content_type != null) {
            json_struct.content[c] = {
                type: content_type,
                value: content_value
            }
        } else {
            console.log("Ошибка: недопустимый тег: "+note.children[i].tagName);
        }
    }

    console.log(JSON.stringify(json_struct));
}

function convert_from_json(object) {
    let note_content = document.getElementById('note_content');

    document.getElementById('note_content-title').innerText = object.title;
    if (getParagraphLength(document.getElementById('note_content-title')) > 0) {
        document.getElementById('note_content-title_placeholder').style.display = "none";
    }
    document.getElementById('note_content-date').innerText = `${object.date}г в ${object.time}`;
    for (let i in object.content) {
        switch (object.content[i].type) {
            case "paragraph":
                createParagraph(false, object.content[i].value);
                break;
            case "image":
                createImage(false, object.content[i].value);
                break;
            default:
                console.error(`Произошла ошибка при загрузке элемента типа ${object.content[i].content_type}.`);
        }
    }
    
}

function createImage(doFocus, content) {

    let note_content = document.getElementById('note_content');
    let obj = document.createElement("img");

    let image_num = get_object_count("IMG");
    obj.id = `image${image_num}`;
    obj.src = `img/Cover.jpg`;
    obj.tabIndex = "0";
    
    if (content != undefined) {
        obj.src = content;
    }

    note_content.appendChild(obj);

    let img_obj = document.getElementById(`image${image_num}`);

    if (doFocus != false) {
        setNoteChanged();
        img_obj.focus();
        img_obj.scrollIntoView(false);

        pushToHistory();
    }

    addEventsToImg(img_obj);
}

function createParagraph(doFocus, content) {
    let note_content = document.getElementById('note_content');
    let obj = document.createElement("p");

    let text_num = get_object_count("P");
    obj.id = `paragraph${text_num}`;
    obj.contentEditable = "true";
    obj.role = "textbox";
    if (content != undefined) {
        obj.innerHTML = content;
    }

    note_content.appendChild(obj);

    let par_obj = document.getElementById(`paragraph${text_num}`);
    if (doFocus != false) {
        setNoteChanged();
        par_obj.focus();
        par_obj.scrollIntoView(false);

        pushToHistory();
    }

    addEventsToText(par_obj);
}

function addEventsToImg(obj) {

    obj.addEventListener('focus', function() {
        currentFocus = obj.id;
    });

    obj.addEventListener('keydown', (event) => {

        if (event.key === 'Backspace') {
            setNoteChanged();
            event.preventDefault();

            let previous_element = -1;
            let image_num = get_object_count("IMG") - 1;

            for (let i=0; i<note_content.children.length; i++) {
                if (note_content.children[i].id == `image${image_num}` && i != 0) {
                    previous_element = i - 1;
                }
            }

            let prev_obj = note_content.children[previous_element];
            prev_obj.focus();
            if (prev_obj.tagName == "P") {
                setCursorAtPosition(prev_obj, getParagraphLength(prev_obj));
            }
            obj.remove();

            pushToHistory();
        } else if (event.key === 'Enter') {
            event.preventDefault();
            createParagraph();
        }
    });
}

var currentFocus = -1;
function addEventsToText(obj) {

    obj.addEventListener('focus', function() {
        currentFocus = obj.id;
    });
    
    obj.addEventListener("paste", function(e) {
        setNoteChanged();
        e.preventDefault();
        var text = (e.originalEvent || e).clipboardData.getData('text/plain');
        console.log(text);
        document.execCommand("insertText", false, text);
    });

    obj.addEventListener('contextmenu', (event) => {
        summon_context_menu(event, "P")
    });
    obj.addEventListener('input', () => {
        setNoteChanged();
    });
    obj.addEventListener('keydown', (event) => {
        let text_num = get_object_count("P") - 1;

        // const selection = window.getSelection();
        // const range = selection.getRangeAt(0);
        // const clonedRange = range.cloneRange();
        // clonedRange.selectNodeContents(contentEle);
        // clonedRange.setEnd(range.endContainer, range.endOffset);

        // let cursor_pos = clonedRange.toString().length;
        let text_length = getParagraphLength(obj);
        
        //console.log(`Длина текста: ${text_length}`);

        if (event.key === 'Enter' && !event.shiftKey && text_length > 0) {
            setNoteChanged();
            event.preventDefault();
            createParagraph();
        } else if (event.key === 'Backspace' && text_length == 0) {
            setNoteChanged();
            event.preventDefault();
            console.log(text_length);

            let previous_element = -1;
            for (let i=0; i<note_content.children.length; i++) {
                if (note_content.children[i].id == `paragraph${text_num}` && i != 0) {
                    previous_element = i - 1;
                }
            }

            if (previous_element >= 0) {
                note_content.children[previous_element].focus();
                obj.remove();
                pushToHistory();
            }   
        }
    });
}