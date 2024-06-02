<?php

include "session.php";

function decryptImage($encryptedImageData, $key) {
    $data = base64_decode($encryptedImageData);
    $iv = substr($data, 0, 16);
    $encryptedData = substr($data, 16);
    return openssl_decrypt($encryptedData, 'aes-256-cbc', $key, 0, $iv);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    if (!$input || !isset($input['filename'])) {
        echo json_encode(['error' => 'Invalid input']);
        exit;
    }
    $filename = $input['filename'];

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

    $filePath = __DIR__ . '/../uploads/' . $filename;
    if (!file_exists($filePath)) {
        echo json_encode(['error' => 'File not found']);
        exit;
    }

    $encryptedImageData = file_get_contents($filePath);
    if ($encryptedImageData === false) {
        echo json_encode(['error' => 'Failed to read file']);
        exit;
    }

    $decryptedImage = decryptImage($encryptedImageData, $contents_key);
    if ($decryptedImage === false) {
        echo json_encode(['error' => 'Decryption failed']);
        exit;
    }

    // Возвращаем расшифрованное изображение в формате base64
    echo json_encode(['image' => base64_encode($decryptedImage)]);
}
?>
