<?php
    function login() {
        $email = filter_var(
            trim($_POST['email']),
            FILTER_UNSAFE_RAW
        );
        $pass = filter_var(
            trim($_POST['pass']),
            FILTER_UNSAFE_RAW
        );
        $pass = $_POST['pass'];
        $salt = "ecbccdjcn3474";
        $hashed_password = hash('sha256', $pass . $salt);
        
        $mysql = new mysqli('localhost', 'root', '', 'register-bd');
        $result = $mysql->query("SELECT `id` FROM `users` WHERE `email` = '$email' AND `pass` = '$hashed_password'");
        $user = $result->fetch_assoc();
        if($user === null) {
            echo "user_not_found";
            exit();
        }
        
        if ($mysql->error) {
            echo "Error: " . $mysql->error;
            exit();
        }
        $token = bin2hex(random_bytes(16));
        $user = (string) $mysql->real_escape_string($user['id']);
        
        $token_result = $mysql->prepare("INSERT INTO tokens (token, user_id, expiration_date) VALUES (?, ?, FROM_UNIXTIME(?))");
        
        if ($token_result === false) {
            die("MySQL prepare error: " . $mysqli->error);
        }
        
        // Привязываем параметры для маркера
        $time = time();
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
        //header('Location: /');
    }

    login();
?>