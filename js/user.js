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

    if (getCookie('is_authorised') == 'true') {
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
            console.log(xhr.responseText);
            if (xhr.responseText == "error_old_session") {
                window.open('login.html', '_self');
            }
            let responseData = JSON.parse(xhr.responseText);
            document.querySelector('#nav_bar-name').innerText = `${responseData.name} ${responseData.lastname}`;
            document.querySelector('#user_photo').src = responseData.picture;
            document.querySelector('#mobile_userphoto').src = responseData.picture;
            document.querySelector('.user_block-picture').src = responseData.picture;

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
        window.open('login.html', '_self');
    }
    
}

function toggleUserBlock() {
    document.querySelector(`.user_block`).classList.toggle('hidden');
}