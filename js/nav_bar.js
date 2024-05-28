function toggle_navbar() {

  let nav_bar = document.getElementById('nav_bar');
  nav_bar.classList.toggle('opened');
  document.getElementsByClassName('container_notes')[0].classList.toggle('navbar_opened');
  document.getElementsByTagName('body')[0].classList.toggle('page_width');
  if (nav_bar.classList.contains('opened')) {
    document.documentElement.setAttribute('nav_bar_shown', 'true');
  } else {
    document.documentElement.setAttribute('nav_bar_shown', 'false');
  }
  
}

function tab(tab) {

  let tabs = ['home', 'trash', 'create', 'help'];

  for (var i = 0; i < tabs.length; i++) {
    document.getElementById(`page_${tabs[i]}`).style.display='none';
    document.getElementById(`btn_${tabs[i]}`).className='';
  }

  document.getElementById(`btn_${tab}`).className='selected';
  document.getElementById(`page_${tab}`).style.display='block';

}

function openTrash(status) {
  let tabs = ['home', 'trash', 'create', 'help'];

  for (var i = 0; i < tabs.length; i++) {
    document.getElementById(`btn_${tabs[i]}`).className='';
  }
  let tab = 'trash'

  document.getElementById('hint_home').style.display = 'none';
  document.getElementById('hint_trash').style.display = 'none';
  if (status == 0) {
    tab = 'home';
    document.getElementById('mobile-trash_btn').style.display = 'flex';
    document.getElementById('mobile-home_btn').style.display = 'none';
  } else {
    document.getElementById('mobile-trash_btn').style.display = 'none';
    document.getElementById('mobile-home_btn').style.display = 'flex';
  }
  document.getElementById(`btn_${tab}`).className='selected';
  document.getElementById(`hint_${tab}`).style.display = 'flex';

  isTrashBinOpened = status;

  closeNote();

  loadNotesList();
}
