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

function encryptImage($imageData, $key) {
    $data = base64_decode($imageData);
    $iv = random_bytes(16);
    $encryptedData = openssl_encrypt($data, 'aes-256-cbc', $key, 0, $iv);
    return base64_encode($iv . $encryptedData);
}

function saveImage($imageData, $filename) {
    // Проверка существования директории и создание, если она не существует
    $directory = dirname($filename);
    if (!is_dir($directory)) {
        mkdir($directory, 0755, true);
    }
    file_put_contents($filename, $imageData);

    return true;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    if (!$input) {
        echo json_encode(['error' => 'Invalid JSON input']);
        exit;
    }
    $imageData = $input['image'];

    session_start();
    if (!isset($_SESSION['contents_key'])) {
        echo json_encode(['error' => 'Session key not found']);
        exit;
    }

    $contents_encrypt_key = 'FSK10-klFA_01;ASFDyio[sDLVm, w45we51!!@m';
    $contents_key = decryptToken($_SESSION['contents_key'], $contents_encrypt_key);
    if ($contents_key === false) {
        echo json_encode(['error' => 'Failed to decrypt session key']);
        exit;
    }

    // Извлечение данных изображения из base64-строки
    $imageData = str_replace(['data:image/png;base64,', 'data:image/jpeg;base64,', ' '], ['', '', '+'], $imageData);
    $decodedImageData = base64_decode($imageData);
    if ($decodedImageData === false) {
        echo json_encode(['error' => 'Invalid base64 data']);
        exit;
    }

    // Проверка MIME-типа файла
    $finfo = new finfo(FILEINFO_MIME_TYPE);
    $mimeType = $finfo->buffer($decodedImageData);
    $allowedMimeTypes = ['image/jpeg', 'image/png', 'image/heic', 'image/heif', 'image/gif', 'image/bmp', 'image/webp'];
    if (!in_array($mimeType, $allowedMimeTypes)) {
        echo json_encode(['error' => 'Invalid file type']);
        exit;
    }

    // Проверка размера файла (не больше 15MB)
    $maxFileSize = 15 * 1024 * 1024;
    if (strlen($decodedImageData) > $maxFileSize) {
        echo json_encode(['error' => 'File is too large']);
        exit;
    }

    $encryptedImage = encryptImage($imageData, $contents_key);
    if ($encryptedImage === false) {
        echo json_encode(['error' => 'Encryption failed']);
        exit;
    }

    // Генерация имени файла
    $filename_raw = 'encrypted_image_' . time() . '.enc';
    $filename = __DIR__ . '/../uploads/' . $filename_raw;
    if (!saveImage($encryptedImage, $filename)) {
        echo json_encode(['error' => 'Failed to save image']);
        exit;
    }

    echo json_encode(['success' => $filename_raw]);
}
?>
