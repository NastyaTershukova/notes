<?php

function checkToken($token) {
    $mysql = new mysqli('localhost', 'root', '', 'register-bd');
    $request = $mysql->prepare("SELECT user_id FROM `tokens` WHERE token = ? AND expiration_date > FROM_UNIXTIME(?)");

    if ($request === false) {
        die("MySQL prepare error: " . $mysql->error);
    }

    $time = time();
    $request->bind_param('ss', $token, $time);
    $request->execute();
    $result = $request->get_result();

    if ($result) {
        $user = $result->fetch_assoc();
        if ($user) {
            $id = $user['user_id'];
            return $id;
        } else {
            return "error_no_token";
        }
    } else {
        return "error_not_executable";
    }

    $request->close();
}

?>