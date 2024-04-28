function convert_to_json() {
    let note = document.getElementById('note_content');
    let json_struct = {
        title: document.getElementById('note_content-title').innerText,
        date: "01.08.2004",
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

function convert_from_json() {
    
}