const history = {
    back: [],
    forward: []
};

// let note_content = document.getElementById('note_content');

function pushToHistory() {
    if (!history.back.length || history.back[history.back.length - 1] != note_content.innerHTML) {
        history.back.push(note_content.innerHTML);
    }
}

function performAction (command) {
    pushToHistory();
    document.execCommand(command, false, null);
    
    document.getElementById(currentFocus).focus();
}

function undo() {
    if (!history.back.length) {
        return;
    }
    history.forward.push(note_content.innerHTML);
    note_content.innerHTML = history.back.pop();

    fixElementEvents();
    document.getElementById(currentFocus).focus();
}

function redo() {
    if (!history.forward.length) {
        return;
    } history.back.push(note_content.innerHTML);
    note_content.innerHTML = history.forward.pop();

    fixElementEvents();
    document.getElementById(currentFocus).focus();
}

document.addEventListener('keydown', function (event) {
    handleKeydown(event);
});

function handleKeydown(event) {
    if ((event.key === 'b' || event.key === 'B') && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        performAction('bold');
    } else if ((event.key === 'u' || event.key === 'U') && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        performAction('underline');
    } else if ((event.key === 'i' || event.key === 'I') && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        performAction('italic');
    }

    if ((event.key === 'z' || event.key === 'Z') && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        undo();
    } else if (((event.key === 'y' || event.key === 'Y') && (event.metaKey || event.ctrlKey)) || ((event.key === 'z' || event.key === 'Z') && (event.metaKey || event.ctrlKey) && (event.shiftKey))) {
        event.preventDefault();
        redo();
    } else {
        history.forward.length = [];
        history.back.push(note_content.innerHTML);
    }
}

function fixElementEvents() {
    add_context_menus();
    for (let i in note_content.children) {
        if (note_content.children[i].tagName == "P") {
            addEventsToText(note_content.children[i]);
        } else if (note_content.children[i].tagName == "IMG") {
            addEventsToImg(note_content.children[i]);
        }
    }
}