<?php
// Файл: register.php
header('Content-Type: application/json'); // Указываем, что ответ будет в формате JSON

// Подключаем скрипт для соединения с базой данных
require_once 'database.php';

$response = ['success' => false, 'message' => ''];

// Проверяем, что запрос пришел методом POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    $response['message'] = 'Неверный метод запроса.';
    echo json_encode($response);
    exit();
}

// Получаем данные из POST-запроса
$login = $_POST['login'] ?? '';
$password = $_POST['password'] ?? '';

// --- Валидация данных ---
if (empty($login) || empty($password)) {
    $response['message'] = 'Пожалуйста, заполните все поля.';
    echo json_encode($response);
    exit();
}

if (strlen($login) > 20) {
    $response['message'] = 'Логин не может быть длиннее 20 символов.';
    echo json_encode($response);
    exit();
}

// Дополнительные проверки пароля (например, минимальная длина)
if (strlen($password) < 6) { // Пример: минимальная длина пароля 6 символов
    $response['message'] = 'Пароль должен быть не менее 6 символов.';
    echo json_encode($response);
    exit();
}
$hashedPassword = password_hash($password, PASSWORD_DEFAULT);

if ($hashedPassword === false) {
    $response['message'] = 'Произошла ошибка при хэшировании пароля.';
    echo json_encode($response);
    exit();
}

// --- Запись данных в базу данных ---
try {
    //подготовленные запросы для предотвращения инъекций
    $stmt = $pdo->prepare("INSERT INTO users (login, password) VALUES (:login, :password)");
    $stmt->execute([':login' => $login, ':password' => $hashedPassword]);

    $response['success'] = true;
    $response['message'] = 'Регистрация прошла успешно!';

} catch (PDOException $e) {//если есть уже пользователь
    if ($e->getCode() == '23000') {
        $response['message'] = 'Пользователь с таким логином уже существует.';
    } else {
        //ошибки бд
        $response['message'] = 'Ошибка при регистрации: ' . $e->getMessage();
    }
}

echo json_encode($response);
?>