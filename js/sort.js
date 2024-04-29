let list = document.getElementById('list_notes');

function sortAscending() {
    list.style.flexDirection = "column";
    document.querySelector('#context_menu-sort_ascending').children[0].className = "ph-check-bold";
    document.querySelector('#context_menu-sort_descending').children[0].className = "";
}
function sortDescending() {
    list.style.flexDirection = "column-reverse";
    document.querySelector('#context_menu-sort_descending').children[0].className = "ph-check-bold";
    document.querySelector('#context_menu-sort_ascending').children[0].className = "";
}