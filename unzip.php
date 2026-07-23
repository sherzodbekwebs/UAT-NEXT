<?php
$zipFile = 'deploy.zip';
$extractTo = './';

$zip = new ZipArchive;
if ($zip->open($zipFile) === TRUE) {
    $zip->extractTo($extractTo);
    $zip->close();
    echo "✅ Muvaffaqiyatli ochildi! deploy.zip o'chirilmoqda...";
    unlink($zipFile); // Zipni o'chirib tashlaydi
} else {
    echo "❌ Xato: Zip faylni ochib bo'lmadi.";
}
// Xavfsizlik uchun skriptni o'zini ham o'chirib tashlashingiz mumkin:
// unlink(__FILE__); 
?>