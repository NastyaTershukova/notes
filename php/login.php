<?php
    include "session.php";
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
        $refresh_token = bin2hex(random_bytes(16));

        if ($user === null) {
            echo "error_user_not_found";
            exit();
        }

        $user = (string) $user['id'];
        
        $token_result = $mysql->prepare("INSERT INTO tokens (token, user_id, expiration_date, refresh_token) VALUES (?, ?, FROM_UNIXTIME(?), ?)");
        
        if ($token_result === false) {
            die("MySQL prepare error: " . $mysqli->error);
        }
        
        $time = time() + 1800; //30 минут для обычного токена
        $token_result->bind_param("siss", $token, $user, $time, $refresh_token);
        
        // Выполнение подготовленного запроса
        if ($token_result->execute()) {
            echo "login_successful";
        } else {
            echo "error_token_unsuccessful";
        }
        
        // Закрытие выражения
        $token_result->close();

        $refresh_key = 'fsqA1!fmsd-2OW94msdfA012gmkWQ)$f,sdf';

        session_set_cookie_params(86400 * 180);
        ini_set('session.gc_maxlifetime', 86400 * 180);
        session_start();
        $_SESSION['refresh_token'] = encryptToken($refresh_token, $refresh_key);
        $_SESSION['user_id'] = $user;

        setcookie('token', $token, time() + 1800, '/');
        setcookie('is_authorised', 'true', time() + (86400 * 180), '/');


        
        $mysql->close();

        return "login_successful";
        //header('Location: /');
    }

?>