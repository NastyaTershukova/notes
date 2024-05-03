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
    let email = decodeURIComponent(getCookie('user_id'));
    let pass = decodeURIComponent(getCookie('password'));

    let xhr = new XMLHttpRequest();

    let requestData = {
        email: email,
        pass: pass
    };

    xhr.onload = function() {
    if (xhr.status >= 200 && xhr.status < 300) {
        let responseData = JSON.parse(xhr.responseText);
        console.log(responseData);

    } else {
        console.error('Request failed with status ', xhr.status);
    }
    };

    let url = 'php/login.php';
    xhr.open('POST', url);
    xhr.setRequestHeader('Content-Type', 'application/json');

    xhr.send(JSON.stringify(requestData));
}