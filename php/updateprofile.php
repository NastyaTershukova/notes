<?php

if (!isset($_GET['name'])) {
    echo "Name is not set";
    exit;
}
if (!isset($_GET['lastname'])) {
    echo "Last name is not set";
    exit;
}
include "checktoken.php";
include "session.php";

if (!isset($_COOKIE['token'])) {
    refreshToken();
    echo "token_reloaded";
    exit;
}


$token = $_COOKIE['token'];

$id = checkToken($token);

if ($id == "error_no_token") {
    echo "token_expired";
    exit();
}
if ($id == "error_not_executable") {
    echo "not_executable";
    exit();
}

$mysql = new mysqli('localhost', 'u2695624_backend', 'dixkyj-1gUjje-qagdog', 'u2695624_graduate_notes');

$result = $mysql->prepare("UPDATE users SET name = ?, lastname = ? WHERE id = ".$id."");

if ($result === false) {
    die("MySQL prepare error: " . $mysqli->error);
}

$result->bind_param("ss", $_GET['name'], $_GET['lastname']);

if(!$result->execute()) {
    echo "error_not_executable";
    exit();
}
$mysql->close();

?>