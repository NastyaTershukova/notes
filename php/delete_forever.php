<?php
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

if (!isset($_POST['uuid'])) {
    echo "error_uuid_required";
    exit;
}

$mysql = new mysqli('localhost', 'root', '', 'register-bd');
$request = $mysql->prepare("DELETE FROM `notes` WHERE owner = ? AND uuid = ?");

session_start();

if ($request === false) {
    die("MySQL prepare error: " . $mysqli->error);
}

$request->bind_param("is", $_SESSION['user_id'], $_POST['uuid']);
if ($mysql->error) {
    echo "Error: " . $mysql->error;
    exit();
}
if(!$request->execute()) {
    echo "error_not_executable";
    exit();
}

$mysql->close();
