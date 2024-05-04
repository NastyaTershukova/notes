<?php

function encryptToken($token, $key) {
    $iv = openssl_random_pseudo_bytes(openssl_cipher_iv_length('aes-256-cbc'));
    $encrypted = openssl_encrypt($token, 'aes-256-cbc', $key, 0, $iv);
    // Возвращаем зашифрованный токен и iv, объединенные в одну строку для удобства хранения
    return base64_encode($iv . $encrypted);
}

function decryptToken($encryptedToken, $key) {
    $data = base64_decode($encryptedToken);
    $ivSize = openssl_cipher_iv_length('aes-256-cbc');
    $iv = substr($data, 0, $ivSize);
    $encrypted = substr($data, $ivSize);
    return openssl_decrypt($encrypted, 'aes-256-cbc', $key, 0, $iv);
}

function checkRefreshToken($mysql, $userId, $refresh_token) {
    $sql = "SELECT token, refresh_expiration_date FROM tokens WHERE refresh_token = ?";
    $req = $mysql->prepare($sql);
    $req->bind_param("s", $refresh_token);
    if(!$req->execute()) {
        echo "error_not_executable";
        return false;
        exit();
    }

    $tokenData = $req->get_result()->fetch_assoc();

    if ($tokenData && new DateTime() < new DateTime($tokenData['refresh_expiration_date'])) {
        return true;
    }
    return false;
}

function refreshToken() {
    session_start();

    $mysql = new mysqli('localhost', 'root', '', 'register-bd');
    $refresh_key = 'fsqA1!fmsd-2OW94msdfA012gmkWQ)$f,sdf';
    $refresh_token = decryptToken($_SESSION['refresh_token'], $refresh_key);

    if (!checkRefreshToken($mysql, $_SESSION['user_id'], $refresh_token)) {
        echo "error_old_fresh_token";
        exit; 
    }


    $refresh_key = 'fsqA1!fmsd-2OW94msdfA012gmkWQ)$f,sdf';
    $new_token = bin2hex(random_bytes(16));

    $result = $mysql->prepare("UPDATE tokens SET token = ?, expiration_date = DATE_ADD(NOW(), INTERVAL 30 MINUTE) WHERE user_id = ? AND refresh_token = ?");
    
    if ($result === false) {
        die("MySQL prepare error: " . $mysqli->error);
    }

    $result->bind_param("sis", $new_token, $_SESSION['user_id'], $refresh_token);

    if(!$result->execute()) {
        echo "error_not_executable";
        exit();
    }
    setcookie('token', $new_token, time() + 1800, '/');
    setcookie('is_authorised', 'true', time() + (86400 * 180), '/');

    
    
    $mysql->close();

    return "refresh_successful";
}

?>