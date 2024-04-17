function toggle_navbar() {

  let nav_bar = document.getElementById('nav_bar');
  nav_bar.classList.toggle('opened');
  document.getElementsByTagName('body')[0].classList.toggle('page_width');

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