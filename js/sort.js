let list = document.getElementById('list_notes');
var color_tags = [];
var colors = ['red', 'orange', 'yellow', 'green', 'blue'];

function sortAscending() {
    list.style.flexDirection = "column";
    document.querySelector('#context_menu-sort_ascending').children[0].className = "ph-check-bold";
    document.querySelector('#context_menu-sort_descending').children[0].className = "";
    document.querySelector('#sorting').children[0].className = "ph-sort-ascending";
}
function sortDescending() {
    list.style.flexDirection = "column-reverse";
    document.querySelector('#context_menu-sort_descending').children[0].className = "ph-check-bold";
    document.querySelector('#context_menu-sort_ascending').children[0].className = "";
    document.querySelector('#sorting').children[0].className = "ph-sort-descending";
}

function sortTimeEdited() {
    document.querySelector('#context_menu-sort_date_edited').children[0].className = "ph-check-bold";
    document.querySelector('#context_menu-sort_date_added').children[0].className = "";
    document.querySelector('#context_menu-sort_title').children[0].className = "";
}
function sortTimeAdded() {
    document.querySelector('#context_menu-sort_date_edited').children[0].className = "";
    document.querySelector('#context_menu-sort_date_added').children[0].className = "ph-check-bold";
    document.querySelector('#context_menu-sort_title').children[0].className = "";
}
function sortTitle() {
    document.querySelector('#context_menu-sort_date_edited').children[0].className = "";
    document.querySelector('#context_menu-sort_date_added').children[0].className = "";
    document.querySelector('#context_menu-sort_title').children[0].className = "ph-check-bold";
}
function eventsSortTags() {
    let tag_list = document.querySelector('#sort_tags');
    for (let i=1; i<tag_list.children.length; i++) {
        tag_list.children[i].addEventListener('click', () => {
            clickedOnTagSort = true;
            let index = color_tags.indexOf(colors[i-1]);
            if (index === -1) {
                color_tags.push(colors[i-1]);
            } else {
                color_tags.splice(index, 1);
            }

            if (color_tags.length >= colors.length) { color_tags = []; }

            checkSortTags();
        });
    }
}
function checkSortTags() {
    let tag_list = document.querySelector('#sort_tags');
    let searchTags = document.querySelector('#search_tags');

    let prev_elements = [];

    for (let i=0; i<searchTags.children.length; i++) {
        searchTags.children[i].classList.remove('show');
        prev_elements.push(searchTags.children[i].className);
    }

    searchTags.innerHTML = "";
    for (let i=1; i<tag_list.children.length; i++) {
        let index = color_tags.indexOf(colors[i-1]);
        if (index === -1) {
            tag_list.children[i].children[0].innerHTML = ``;
        } else {
            tag_list.children[i].children[0].innerHTML = `<span class="tag_dot"></span>`;
            let searchTag = document.createElement('div');
            searchTag.className = colors[i-1];
            searchTags.appendChild(searchTag);

            let index = prev_elements.indexOf(colors[i-1]);
            if (index === -1) {
                setTimeout(() => {
                    searchTag.classList.add('show');
                }, 1);
            } else {
                searchTag.classList.add('show');
            }
            
            
        }
    }

    filterNotesList();
}
document.querySelector('#search_tags').addEventListener('click', () => {
    color_tags = [];
    checkSortTags();
});


document.querySelector('#search-field').addEventListener('input', () => {
    filterNotesList();
});
document.querySelector('#search_clear').addEventListener('click', () => {

    document.querySelector('#search-field').value = '';
    document.querySelector('#search_clear').classList.add('hidden');

    for (let i=0; i<list.children.length; i++) {
        list.children[i].classList.remove('search-hidden');
    }

});

function filterNotesList() {
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
        let conditionTitle = list.children[i].querySelector('.note_title').innerText.toLowerCase().includes(value);
        let conditionText = list.children[i].querySelector('.note_text').innerText.toLowerCase().includes(value);
        
        let tagsDetected = 0;
        let noteTagsHTML = list.children[i].querySelector('.note_tags').innerHTML;

        for (let j = 0; j < color_tags.length; j++) {
            if (noteTagsHTML.includes(`tag ${color_tags[j]}`)) {
                tagsDetected++;
            }
        }

        if (tagsDetected < color_tags.length) {
            count++;
            list.children[i].classList.add('search-hidden');
            continue;
        } else {
            list.children[i].classList.remove('search-hidden');
        }

        if (conditionTitle || conditionText) {
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
}