<?php
session_start();

header('Content-Type: application/json');

require_once 'db_config.php';

// Инициализируем массив для ответа. По умолчанию считаем, что вход не удался
$response = ['success' => false, 'message' => ''];

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    $response['message'] = "Некорректный метод запроса.";
    echo json_encode($response);
    exit();
}

$username = trim($_POST['username'] ?? '');
$password = $_POST['password'] ?? '';

if (empty($username) || empty($password)) {
    $response['message'] = "Пожалуйста, введите логин и пароль.";
    echo json_encode($response);
    exit();
}

//соединение с базой данных
$conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
if ($conn->connect_error) {
    error_log("DB Connection Error: " . $conn->connect_error);
    $response['message'] = "Ошибка подключения к базе данных. Попробуйте позже.";
    echo json_encode($response);
    exit();
}

//устанавливаем кодировку для корректной работы с данными (например, кириллицей)
$conn->set_charset(DB_CHARSET);

// sql запрос
$stmt = $conn->prepare("SELECT id, login, password FROM users WHERE login = ?");

// Проверяем, успешно ли подготовлен запрос
if (!$stmt) {
    error_log("Prepare statement failed: " . $conn->error);
    $response['message'] = "Произошла внутренняя ошибка сервера. Пожалуйста, попробуйте позже.";
    echo json_encode($response);
    $conn->close();
    exit();
}
$stmt->bind_param("s", $username);

//выполнение запроса
$stmt->execute();

//получаем результат запроса.
$result = $stmt->get_result();

//проверка наличия пользователя
if ($result->num_rows === 1) {
    $user = $result->fetch_assoc();
    $hashed_password_from_db = $user['password']; // Извлекаем хэшированный пароль из БД
    if (password_verify($password, $hashed_password_from_db)) {
        //пароль верный
        $response['success'] = true;
        $response['message'] = "Успешный вход!";
        $_SESSION['user_id'] = $user['id'];
        $_SESSION['username'] = $user['login'];

    } else {
        // Пароль неверный.
        $response['message'] = "Неверный логин или пароль.";
    }
} else {
    $response['message'] = "Неверный логин или пароль.";
}

//закрываем запрос и соединение с бд
$stmt->close();
$conn->close();

//JSON  в JavaScript.
echo json_encode($response);
exit();

?>