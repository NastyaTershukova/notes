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

var note_date = 0;
function convert_from_json(object) {
    let note_content = document.getElementById('note_content');

    document.getElementById('note_content-title').innerText = object.title;
    if (getParagraphLength(document.getElementById('note_content-title')) > 0) {
        document.getElementById('note_content-title_placeholder').style.display = "none";
    }
    note_date = `${object.date} г. в ${object.time}`;
    document.getElementById('note_content-date').innerText = note_date;
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

    if (object.content.length == 0) {
        createParagraph(false);
    }
    
}

function insertAfter(newNode, referenceNode) {
    if (referenceNode.nextSibling) {
      // Если у referenceNode есть следующий элемент, вставляем перед ним
      referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
    } else {
      // Если нет следующего элемента, значит referenceNode последний, и мы добавляем в конец
      referenceNode.parentNode.appendChild(newNode);
    }
  }

function createImage(doFocus, content) {

    let note_content = document.getElementById('note_content');
    let obj = document.createElement("img");

    let image_num = get_object_count("IMG");
    obj.id = `image${image_num}`;
    obj.src = `/img/Cover.jpg`;
    obj.tabIndex = "0";
    
    if (content != undefined) {
        obj.src = content;
    }

    if (doFocus != false) {
        pushToHistory();
        insertAfter(obj, document.getElementById(currentFocus));
    } else {
        note_content.appendChild(obj);
    }

    let img_obj = document.getElementById(`image${image_num}`);

    if (doFocus != false) {
        setNoteChanged();
        img_obj.focus();
        img_obj.scrollIntoView(false);
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

    if (doFocus != false) {
        pushToHistory();
        insertAfter(obj, document.getElementById(currentFocus));
    } else {
        note_content.appendChild(obj);
    }

    

    let par_obj = document.getElementById(`paragraph${text_num}`);
    if (doFocus != false) {
        setNoteChanged();
        par_obj.focus();
        par_obj.scrollIntoView(false);
    }

    addEventsToText(par_obj);
}

function addEventsToImg(obj) {

    obj.addEventListener('focus', function() {
        currentFocus = obj.id;
    });

    obj.addEventListener('contextmenu', (event) => {
        summon_context_menu(event, "IMG")
    });

    obj.addEventListener('keydown', (event) => {

        currentFocus = obj.id;

        if (event.key === 'Backspace') {
            setNoteChanged();
            event.preventDefault();

            let previous_element = getElementOrder(obj) - 1;

            if (previous_element >= 0) {
                let prev_obj = note_content.children[previous_element];
                prev_obj.focus();
                if (prev_obj.tagName == "P") {
                    setCursorAtPosition(prev_obj, getParagraphLength(prev_obj));
                }

                pushToHistory();
                obj.remove();
                handleNewParagraph();
            } else {
                pushToHistory();
                obj.remove();
                createParagraph();
            }
            
            
            
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

    obj.addEventListener('focusout', function() {
        console.log('focusout');
        if (getParagraphLength(obj) == 0 && getElementOrder(obj) + 1 == note_content.children.length && getElementOrder(obj) > 0) {
            obj.remove();
        }
    });
    
    obj.addEventListener("paste", function (e) {
        setNoteChanged();
        e.preventDefault();
        var text = (e.originalEvent || e).clipboardData.getData('text/plain');
        document.execCommand("insertText", false, text);
    });

    obj.addEventListener('contextmenu', (event) => {
        summon_context_menu(event, "P")
    });
    obj.addEventListener('input', () => {
        currentFocus = obj.id;
        setNoteChanged();
    });
    obj.addEventListener('keydown', (event) => {
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

            let previous_element = getElementOrder(obj) - 1;

            if (previous_element >= 0) {
                pushToHistory();
                note_content.children[previous_element].focus();
                obj.remove();
            }  
            handleNewParagraph();
        }
    });
}

function getElementOrder(obj) {
    for (let i=0; i<note_content.children.length; i++) {
        if (note_content.children[i].id == obj.id) {
            return i;
        }
    }
}