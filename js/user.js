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
    // Получение основной информации о пользователе
    let xhr = new XMLHttpRequest();

    xhr.onload = function() {
    if (xhr.status >= 200 && xhr.status < 300) {
        console.log(xhr.responseText);
        let responseData = JSON.parse(xhr.responseText);
        console.log(responseData);

    } else {
        console.error('Request failed with status ', xhr.status);
    }
    };

    let url = 'php/userdata.php';
    xhr.open('GET', url);
    xhr.setRequestHeader('Content-Type', 'application/json');

    xhr.send();
}