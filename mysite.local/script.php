<?php
//шаблон страницы игры передача данных
require_once 'db_config.php';

$games = [];
$error_message = ''; //переменная для сообщений об ошибках

try {//подключение
    $dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=" . DB_CHARSET;
    $pdo = new PDO($dsn, DB_USER, DB_PASS);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Установка режима получения данных по умолчанию (ассоциативный массив)
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
    $stmt = $pdo->prepare("SELECT id, game_id, title, price, image_path FROM games ORDER BY id DESC");
    
    // выполнение запроса
    $stmt->execute();
    $games = $stmt->fetchAll();

} catch (PDOException $e) {
    // в случае ошибки подключения или выполнения запроса
    error_log("Database Error in script.php: " . $e->getMessage()); // Логируем ошибку
    $error_message = "Ошибка при загрузке данных об играх: " . $e->getMessage();
    $games = []; // Очищаем массив, чтобы на странице не отображались некорректные данные
}
?>