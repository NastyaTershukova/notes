function getCookie(name) {
    // Разбиваем строку с куками на отдельные куки
    var cookies = document.cookie.split(';');
    
    // Перебираем куки
    for (var i = 0; i < cookies.length; i++) {
        // Удаляем пробелы с начала и конца строки куки
        var cookie = cookies[i].trim();
        
        // Проверяем, начинается ли куки с нужного имени
        if (cookie.indexOf(name + '=') === 0) {
            // Если да, возвращаем значение куки
            return cookie.substring(name.length + 1);
        }
    }
    
    // Если куки с заданным именем не найдено, возвращаем null
    return null;
}


function login() {

    loadingSpinner(true);

    if (true || getCookie('is_authorised') == 'true') {
        // Получение основной информации о пользователе
        let xhr = new XMLHttpRequest();

        xhr.onload = function() {
        if (xhr.status >= 200 && xhr.status < 300) {
            if (xhr.responseText == "token_reloaded") {
                setTimeout(() => {
                    login();
                    console.log('Token is reloaded. Retry in 300ms...');
                }, 300);
                return;
            }
            if (xhr.responseText == "error_old_session") {
                window.open('login.html', '_self');
            }
            let responseData = JSON.parse(xhr.responseText);
            document.querySelector('#nav_bar-name').innerText = `${responseData.name} ${responseData.lastname}`;
            document.querySelector('.user_block-name').innerText = `${responseData.name} ${responseData.lastname}`;
            document.querySelector('#edit_profile-name').value = responseData.name;
            document.querySelector('#edit_profile-lastname').value = responseData.lastname;
            document.querySelector('.user_block-email').innerText = responseData.email;

            let img = '/img/no_profile_image.png'

            if (responseData.picture != "") {
                img = '/userpictures/'+responseData.picture;
            }
            document.querySelector('#user_photo').src = img;
            document.querySelector('#mobile_userphoto').src = img;
            document.querySelector('.user_block-picture').src = img;
            document.querySelector('#edit_profile-image').src = img;

            loadingSpinner(false);
            loadNotesList();

        } else {
            console.error('Request failed with status ', xhr.status);
        }
        };

        let url = 'php/userdata.php';
        xhr.open('GET', url);
        xhr.setRequestHeader('Content-Type', 'application/json');

        xhr.send();
    } else {
        window.open('about.html', '_self');
    }
    
}
function logout() {
    let xhr = new XMLHttpRequest();

    xhr.onload = function() {
    if (xhr.status >= 200 && xhr.status < 300) {
        window.open('about.html', '_self');
    } else {
        console.error('Request failed with status ', xhr.status);
    }
    };

    let url = 'php/logout.php';
    xhr.open('GET', url);
    xhr.setRequestHeader('Content-Type', 'application/json');

    xhr.send();
}

function toggleUserBlock() {
    document.querySelector('.settings_block').classList.add('hidden');
    document.querySelector(`.user_block`).classList.toggle('hidden');
}
function editProfile(arg) {

    document.querySelector(`.user_block`).classList.add('hidden');

    let popup = document.querySelector('.edit_profile_popup');
    if (arg == false) {
        popup.classList.add('hidden');
        return;
    }
    if (arg == true) {
        popup.classList.remove('hidden');
        return;
    }

    loadingSpinner(true);

    let xhr = new XMLHttpRequest();

    xhr.onload = function() {
    if (xhr.status >= 200 && xhr.status < 300) {
        if (xhr.responseText == "token_reloaded") {
            setTimeout(() => {
                editProfile();
                console.log('Token is reloaded. Retry in 300ms...');
            }, 300);
            return;
        }

        //console.log(xhr.responseText);

        location.reload();
    } else {
        console.error('Request failed with status ', xhr.status);
    }
    };
    let name = document.querySelector('#edit_profile-name').value.trim();
    let lastname = document.querySelector('#edit_profile-lastname').value.trim();
    let url = `php/updateprofile.php?name=${name}&lastname=${lastname}`;
    xhr.open('GET', url);
    xhr.setRequestHeader('Content-Type', 'application/json');

    xhr.send();
}