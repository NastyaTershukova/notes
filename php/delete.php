<?php
include "checktoken.php";
include "session.php";

session_start();

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

echo $_POST['uuid'];

$mysql = new mysqli('localhost', 'u2695624_backend', 'dixkyj-1gUjje-qagdog', 'u2695624_graduate_notes');
$request = $mysql->prepare("UPDATE `notes` SET is_deleted = 1, delete_time = DATE_ADD(NOW(), INTERVAL 14 DAY) WHERE owner = ? AND uuid = ?");

if (isset($_POST['recover'])) {
    $request = $mysql->prepare("UPDATE `notes` SET is_deleted = 0, delete_time = NULL WHERE owner = ? AND uuid = ?");
}

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
