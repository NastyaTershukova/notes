<?php

    function login($email, $pass) {
        $salt = "ecbccdjcn3474";
        $hashed_password = hash('sha256', $pass . $salt);
        
        $mysql = new mysqli('localhost', 'root', '', 'register-bd');
        // $result = $mysql->query("SELECT `id` FROM `users` WHERE `email` = '$email' AND `pass` = '$hashed_password'");
        // $user = $result->fetch_assoc();

        $result = $mysql->prepare("SELECT id FROM users WHERE email = (?) AND pass = (?)");
        
        if ($result === false) {
            die("MySQL prepare error: " . $mysqli->error);
        }

        $result->bind_param("ss", $email, $hashed_password);

        if(!$result->execute()) {
            echo "error_not_executable";
            exit();
        }

        $result = $result->get_result();
        
        $user = $result->fetch_assoc();
        $token = bin2hex(random_bytes(16));

        if ($user === null) {
            echo "error_user_not_found";
            exit();
        }

        $user = (string) $user['id'];
        
        $token_result = $mysql->prepare("INSERT INTO tokens (token, user_id, expiration_date) VALUES (?, ?, FROM_UNIXTIME(?))");
        
        if ($token_result === false) {
            die("MySQL prepare error: " . $mysqli->error);
        }
        
        // Привязываем параметры для маркера
        $time = time() + (86400 * 180);
        $token_result->bind_param("sis", $token, $user, $time);
        
        // Выполнение подготовленного запроса
        if ($token_result->execute()) {
            echo "login_successful";
        } else {
            echo "error_token_unsuccessful";
        }
        
        // Закрытие выражения
        $token_result->close();

        setcookie('token', $token, time() + (86400 * 180), '/');
        setcookie('is_authorised', 'true', time() + (86400 * 180), '/');
        
        $mysql->close();

        return "login_successful";
        //header('Location: /');
    }

?>