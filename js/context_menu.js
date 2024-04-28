function add_context_menus() {
    let note = document.getElementById('note_content');

    for (let i=0; i<note.children.length; i++) {
        note.children[i].addEventListener('contextmenu', (event) => {
            summon_context_menu(event, note.children[i].tagName)
        });
    }
}
function context_tab(name) {
    let tabs = ['sec', 'menu', 'basic', 'img'];

    for (let i=0;i<tabs.length;i++) {
        document.getElementById(`context-${tabs[i]}`).style.display = 'none';
    }

    switch (name) {
        case "P":
            document.getElementById(`context-sec`).style.display = 'block';
            document.getElementById(`context-basic`).style.display = 'block';
            break;
        case "IMG":
            document.getElementById(`context-img`).style.display = 'block';
            document.getElementById(`context-basic`).style.display = 'block';
            break;
        case "menu":
            document.getElementById(`context-menu`).style.display = 'block';
            break;
    }
}

function summon_context_menu(event, tagName) {
    contextmenu_click(event);
    context_tab(tagName);
    document.addEventListener('click', () => {
        context_menu.classList.add("hidden");
    }, { once: true });
} 

function contextmenu_click(event) {
    event.preventDefault();
    let context_menu = document.getElementById("context_menu");

    let x = Math.min(event.pageX, window.innerWidth - 216);
    let y = Math.min(event.pageY - window.scrollY, window.innerHeight - context_menu.clientHeight - 16);

    context_menu.style.top = `${y}px`;
    context_menu.style.left = `${x}px`;

    context_menu.classList.remove("hidden");
}

function get_object_count(obj) {
    let note_content = document.getElementById('note_content');
    let count = 0;
    for (let i=0; i<note_content.children.length; i++) {
        if (note_content.children[i].tagName == obj) {
            count++;
        }
    }

    return count;
}

function createImage() {
    let obj = document.createElement("img");

    let image_num = get_object_count("IMG");
    obj.id = `image${image_num}`;
    obj.src = `img/Cover.jpg`;
    obj.tabIndex = "0";

    note_content.appendChild(obj);
    document.getElementById(`image${image_num}`).focus();
    document.getElementById(`image${image_num}`).scrollIntoView(false);
    document.getElementById(`image${image_num}`).addEventListener('contextmenu', (event) => {
        summon_context_menu(event, "IMG")
    });
    document.getElementById(`image${image_num}`).addEventListener('focus', (event) => {
        let obj = document.getElementById(`image${image_num}`);

        if (event.key === 'Backspace') {
            obj.remove();
        }
    });

    createParagraph(false);
}

function createParagraph(doFocus) {
    let obj = document.createElement("p");

    let text_num = get_object_count("P");
    obj.id = `paragraph${text_num}`;
    obj.contentEditable = "true";
    obj.role = "textbox";

    note_content.appendChild(obj);

    if (doFocus != false) {
        document.getElementById(`paragraph${text_num}`).focus();
        document.getElementById(`paragraph${text_num}`).scrollIntoView(false);
        document.getElementById(`paragraph${text_num}`).addEventListener('contextmenu', (event) => {
            summon_context_menu(event, "P")
        });
        document.getElementById(`paragraph${text_num}`).addEventListener('keydown', (event) => {
            let obj = document.getElementById(`paragraph${text_num}`);
            // const selection = window.getSelection();
            // const range = selection.getRangeAt(0);
            // const clonedRange = range.cloneRange();
            // clonedRange.selectNodeContents(contentEle);
            // clonedRange.setEnd(range.endContainer, range.endOffset);

            // let cursor_pos = clonedRange.toString().length;
            let text_length = obj.innerText.length;
            console.log(`Длина текста: ${text_length}`);

            if (event.key === 'Enter' && !event.shiftKey) {
                event.preventDefault();
                createParagraph();
            } else if (event.key === 'Backspace' && obj.innerHTML == "") {
                obj.remove();
            }
        });
    }
}

document.getElementById('context_menu-image').addEventListener('click', createImage);

document.getElementById('context_menu-paragraph').addEventListener('click', createParagraph);