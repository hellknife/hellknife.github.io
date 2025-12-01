
document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM Content Loaded: script.js запущен.");

    // Для логина
    const loginInput = document.getElementById('loginInput');
    const passwordInput = document.getElementById('passwordInput');
    const loginSubmitButton = document.getElementById('loginSubmitButton');
    const regSubmitButton = document.getElementById('regSubmitButton');
    const errorMessageDiv = document.getElementById('errorMessageDiv'); 
    const sucsessMessageDiv = document.getElementById('sucsessMessageDiv'); 


    // --- Функция для очистки и отображения сообщения ---
    function displayMessage(divElement, message, isSuccess) {
        // Сначала скрываем оба сообщения, если они существуют
        if (errorMessageDiv) {
            errorMessageDiv.textContent = '';
            errorMessageDiv.style.display = 'none';
            errorMessageDiv.classList.remove('input-error'); // Удаляем класс ошибки
        }
        if (sucsessMessageDiv) {
            sucsessMessageDiv.textContent = '';
            sucsessMessageDiv.style.display = 'none';
            sucsessMessageDiv.classList.remove('input-sucsess'); // Удаляем класс успеха
        }

        // Затем отображаем нужное
        if (divElement) { // Проверяем, что элемент существует
            divElement.textContent = message;
            divElement.style.display = 'block';
            if (isSuccess) {
                divElement.classList.add('sucsess-message');
                divElement.classList.remove('error-message');
            } else {
                divElement.classList.add('error-message');
                divElement.classList.remove('sucsess-message');
            }
        }
    }


    console.log("Попытка найти элементы для логина:");
    console.log("loginInput:", loginInput);
    console.log("passwordInput:", passwordInput);
    console.log("loginSubmitButton:", loginSubmitButton);
    console.log("errorMessageDiv:", errorMessageDiv);

    if (loginInput && passwordInput && loginSubmitButton && errorMessageDiv) {
        console.log("Все элементы для логина найдены. Добавляем обработчик событий.");

        loginSubmitButton.addEventListener('click', async (event) => {
            event.preventDefault(); //gредотвращаем стандартное действие
            console.log("Кнопка 'Войти' нажата.");

            const enteredLogin = loginInput.value.trim();
            const enteredPassword = passwordInput.value.trim();

            displayMessage(errorMessageDiv, '', false); // Очищаем сообщения перед новой попыткой
            loginInput.classList.remove('input-error');
            passwordInput.classList.remove('input-error');

            const phoneRegex = /^\+\d{11}$/; // Валидация номера телефона
            if (!phoneRegex.test(enteredLogin)) {
                console.log("Неверный формат логина.");
                displayMessage(errorMessageDiv, 'Вы ввели не номер телефона!', false);
                loginInput.classList.add('input-error');
                return;
            }

            try {
                // Отправляем данные на сервер с помощью Fetch API
                const response = await fetch('enter_check.php', { // <-- Здесь указываем твой новый PHP-файл
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded', // Важно для PHP $_POST
                    },
                    // Отправляем логин и пароль в теле запроса
                    body: `username=${encodeURIComponent(enteredLogin)}&password=${encodeURIComponent(enteredPassword)}`
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    console.error('Ошибка HTTP:', response.status, errorText);
                    displayMessage(errorMessageDiv, `Ошибка сервера: ${response.status}. Пожалуйста, попробуйте позже.`, false);
                    loginInput.classList.add('input-error');
                    passwordInput.classList.add('input-error');
                    return;
                }

                const data = await response.json(); // Парс JSON-ответ от сервера

                if (data.success) {
                    console.log("Вход успешен. Перенаправление на index.php...");
                    window.location.href = 'index.php'; // Перенаправляем на главную страницу
                } else {
                    console.log("Вход не удался:", data.message);
                    displayMessage(errorMessageDiv, data.message, false); // Отображаем сообщение об ошибке от сервера
                    loginInput.classList.add('input-error');
                    passwordInput.classList.add('input-error');
                }
            } catch (error) {
                console.error('Ошибка при выполнении запроса:', error);
                displayMessage(errorMessageDiv, 'Произошла ошибка сети или сервера. Пожалуйста, попробуйте еще раз.', false);
                loginInput.classList.add('input-error');
                passwordInput.classList.add('input-error');
            }
        });

        passwordInput.addEventListener('keypress', (event) => {
            if (event.key === 'Enter') {
                console.log("Нажат Enter в поле пароля.");
                event.preventDefault();
                loginSubmitButton.click();
            }
        });
    } else {
        console.warn("Один или несколько элементов для логина не найдены на этой странице. Логика входа не будет работать.");
    }

    // --- Блок фильтров/сортировки ---
    const filterButton = document.querySelector('.filter');
    const sortButton = document.querySelector('.sort');
    const filterMenu = document.querySelector('.filter_menu');
    const sortMenu = document.querySelector('.sort_menu');


    if (filterButton && sortButton && filterMenu && sortMenu) {
        console.log("Все элементы для фильтров/сортировки найдены. Добавляем обработчики.");
        const allMenus = [filterMenu, sortMenu];

        function toggleMenu(menu) {
            allMenus.forEach(m => {
                if (m !== menu && m.classList.contains('visible')) {
                    m.classList.remove('visible');
                }
            });
            menu.classList.toggle('visible');
        }

        filterButton.addEventListener('click', (event) => {
            console.log("Нажата кнопка 'фильтры'.");
            event.stopPropagation();
            toggleMenu(filterMenu);
        });

        sortButton.addEventListener('click', (event) => {
            console.log("Нажата кнопка 'сортировка'.");
            event.stopPropagation();
            toggleMenu(sortMenu);
        });

        document.addEventListener('click', (event) => {
            if (!event.target.closest('.filter_menu') && !event.target.closest('.sort_menu') &&
                !event.target.closest('.filter') && !event.target.closest('.sort')) {
                console.log("Клик вне меню или кнопок. Закрываем меню.");
                allMenus.forEach(menu => {
                    menu.classList.remove('visible');
                });
            }
        });

        const menuItems = document.querySelectorAll('.menu_item');
        menuItems.forEach(item => {
            item.addEventListener('click', () => {
                const clickedText = item.textContent;
                console.log(`Выбран пункт меню: ${clickedText}`);
                allMenus.forEach(menu => {
                    menu.classList.remove('visible');
                });
            });
        });
    } else {
        console.warn("Один или несколько элементов для фильтров/сортировки не найдены на этой странице. Логика меню не будет работать.");
    }


    const headerPlaceholder = document.getElementById('header-placeholder');
    const headerHTML = `
        <header class="header">
            <div class="header-container">
                <a href="index.php" class="logo">
                    <img src="pictures/logo.png" alt="Search_lo_Games" class="logo-image">
                </a>
                <div class="header-right">
                    <div class="nav-buttons">
                        <a href="index.php" class="nav-button">Главная</a>
                        <a href="market.html" class="nav-button">Магазин</a>
                        <a href="about.html" class="nav-button">О нас</a>
                        <a href="enter.html" class="nav-button">Войти</a>
                    </div>
                    <a href="enter.html" class="profile-button">
                        <img src="pictures/profile.png" alt="Профиль">
                    </a>
                </div>
            </div>
        </header>
    `;
    if (headerPlaceholder) {
        headerPlaceholder.innerHTML = headerHTML;
    }

    const footerPlaceholder = document.getElementById('footer-placeholder');
    const footerHTML = `
    <footer class="footer">
        <div class="footer-content">
            <p class="contact-info">тел. 8 800 555 35 35</p>
            <p class="contact-info">mail: Search_lo@mail.ru</p>
        </div>
    </footer>
    `;
    if (footerPlaceholder) {
        footerPlaceholder.innerHTML = footerHTML;
    }

    const gamesData = {
        "minecraft": {
            pageTitle: "Minecraft - Search_lo_Games",
            galleryImages: [
                "pictures/minecraft_gallery/1.jpg",
                "pictures/minecraft_gallery/2.jpg",
                "pictures/minecraft_gallery/3.jpg",
                "pictures/minecraft_gallery/4.jpg",
                "pictures/minecraft_gallery/5.jpg"
            ],
            price: "2000 р.",
            bannerImage: "pictures/minecraft_banner.jpg",
            gameTitle: "Minecraft:",
            description: "Minecraft — это игра в жанре песочницы с открытым миром, разработанная Mojang Studios. Она позволяет игрокам строить из различных блоков, исследовать миры, собирать ресурсы, создавать предметы и сражаться с монстрами. Игра известна своей пиксельной графикой, бесконечными возможностями для творчества и огромным сообществом. Доступны различные режимы игры, включая выживание, творчество и приключение.",
            rating: "Рейтинг: 9/10 (IGN)",
            developer: "Разработчик: Mojang Studios",
            recentReviews: "Недавние обзоры: Очень положительные (95% игроков рекомендуют)",
            releaseDate: "Дата выхода: 18 ноября 2011"
        },
        "CS_GO": {
            pageTitle: "CS_GO - Search_lo_Games",
            galleryImages: [
                "pictures/CS_GO_gallery/1.jpg",
                "pictures/CS_GO_gallery/2.jpg",
                "pictures/CS_GO_gallery/3.jpg",
                "pictures/CS_GO_gallery/4.jpg",
                "pictures/CS_GO_gallery/5.jpg"
            ],
            price: "500 р.",
            bannerImage: "pictures/csgo_banner.jpg",
            gameTitle: "CS_GO :",
            description: "CS_GO  — это многопользовательский командный шутер от первого лица, в котором две команды (террористы и спецназ) сражаются друг с другом, выполняя задачи или уничтожая противников.",
            rating: "Рейтинг: 8/10",
            developer: "Разработчик: Valve",
            recentReviews: "Недавние обзоры: В основном положительные",
            releaseDate: "Дата выхода: 21 августа 2012 года"
        },
        "Hollow_knight": {
            pageTitle: "The Hollow knight: Wild Hunt - Search_lo_Games",
            galleryImages: [
                "pictures/Hollow_knight_gallery/1.jpg",
                "pictures/Hollow_knight_gallery/2.jpg",
                "pictures/Hollow_knight_gallery/3.jpg",
                "pictures/Hollow_knight_gallery/4.jpg",
                "pictures/Hollow_knight_gallery/5.jpg"
            ],
            price: "1000 р.",
            bannerImage: "pictures/Hollow_knight_banner.jpg",
            gameTitle: "The Hollow knight:",
            description: "The Hollow knight: Игра рассказывает о приключениях и открытиях безымянного рыцаря в давно заброшенном королевстве насекомых Халлоунест.",
            rating: "Рейтинг: 10/10",
            developer: "Разработчик: Team Cherry",
            recentReviews: "Недавние обзоры: Подавляюще положительные",
            releaseDate: "Дата выхода: 24 февраля 2017"
        }
    };
    let currentGalleryIndex = 0;
    let currentGalleryImages = [];
    function loadGamePage(gameId) { const game = gamesData[gameId];

        // Если игра не найдена, показываем сообщение об ошибке
        if (!game) {
            document.getElementById('pageTitle').textContent = "Игра не найдена";
            // Очищаем основной контент и выводим сообщение об ошибке
            const mainContain = document.querySelector('.main_contain');
            if (mainContain) {
                mainContain.innerHTML = `<div style="text-align: center; padding: 50px;">
                                            <h1>Ошибка: Игра с ID "${gameId}" не найдена.</h1>
                                            <p>Пожалуйста, проверьте URL или выберите другую игру.</p>
                                            <img src="pictures/game_not_found.jpg" alt="Игра не найдена" style="max-width: 500px; margin-top: 20px;">
                                        </div>`;
            }
            return;
        }

        document.getElementById('pageTitle').textContent = game.pageTitle;

        const mainGameImage = document.getElementById('mainGameImage');
        const gamePrice = document.getElementById('gamePrice');

        currentGalleryImages = game.galleryImages;

        const galleryThumbnails = document.querySelectorAll('#galleryThumbnails .pic');
        galleryThumbnails.forEach((picElement, index) => {
            if (index < currentGalleryImages.length) {
                picElement.src = currentGalleryImages[index];
                picElement.alt = `${game.gameTitle} превью ${index + 1}`;
                picElement.style.display = 'block'; // Показываем превью
                // Добавляем обработчик клика для каждой превью
                picElement.onclick = () => displayGalleryImage(index);
            } else {
                picElement.style.display = 'none'; // Скрываем лишние превью
                picElement.onclick = null; // Удаляем обработчик, чтобы не было ошибок
            }
        });


        // Обновляем цену
        gamePrice.textContent = `цена: ${game.price}`;

        // Обновляем информацию в правой секции
        document.getElementById('gameBanner').src = game.bannerImage;
        document.getElementById('gameBanner').alt = game.gameTitle + " баннер";

        document.getElementById('gameTitle').textContent = game.gameTitle;
        document.getElementById('gameDescription').textContent = game.description;

        // Обновляем дополнительную информацию об игре
        document.getElementById('gameRating').textContent = game.rating;
        document.getElementById('gameDeveloper').textContent = game.developer;
        document.getElementById('gameReviews').textContent = game.recentReviews;
        document.getElementById('gameReleaseDate').textContent = game.releaseDate;


        // --- Логика галереи (перелистывание и выбор превью) ---
        const prevArrow = document.getElementById('prevArrow');
        const nextArrow = document.getElementById('nextArrow');

        // Функция для отображения изображения в главной области галереи
        function displayGalleryImage(index) {
            currentGalleryIndex = index;
            mainGameImage.src = currentGalleryImages[currentGalleryIndex];
            mainGameImage.alt = `${game.gameTitle} изображение ${currentGalleryIndex + 1}`;
            updateActiveGalleryThumbnail();
        }

        // Функция для переключения на следующее изображение
        function showNextGalleryImage() {
            currentGalleryIndex = (currentGalleryIndex + 1) % currentGalleryImages.length;
            displayGalleryImage(currentGalleryIndex);
        }

        // Функция для переключения на предыдущее изображение
        function showPrevGalleryImage() {
            currentGalleryIndex = (currentGalleryIndex - 1 + currentGalleryImages.length) % currentGalleryImages.length;
            displayGalleryImage(currentGalleryIndex);
        }

        // Функция для обновления активного превью
        function updateActiveGalleryThumbnail() {
            document.querySelectorAll('#galleryThumbnails .pic').forEach((picElement, i) => {
                if (i === currentGalleryIndex) {
                    picElement.classList.add('active');
                } else {
                    picElement.classList.remove('active');
                }
            });
        }

        // Привязываем обработчики событий к стрелкам и главному изображению
        prevArrow.onclick = showPrevGalleryImage;
        nextArrow.onclick = showNextGalleryImage;

        // Инициализируем галерею
        displayGalleryImage(0); // Показываем первое изображение
     }

    const urlParams = new URLSearchParams(window.location.search);
    const gameIdFromUrl = urlParams.get('gameId');

    const gamePageTitleElement = document.getElementById('pageTitle'); // Это был источник ошибки
    const gameDetailContainer = document.getElementById('game-detail-container'); // Или другой уникальный элемент на game_pages.php

    if (gamePageTitleElement || gameDetailContainer) { // Если найден хоть один игровой элемент
        if (gameIdFromUrl) {
            loadGamePage(gameIdFromUrl);
        } else {
            console.warn("Параметр 'gameId' не найден в URL. Загрузка игры по умолчанию (Minecraft).");
            loadGamePage('minecraft'); // Если нет ID, но мы на игровой странице, загружаем Minecraft
        }
    } else {
        console.log("Страница не является страницей деталей игры. Логика loadGamePage пропущена.");
    }


    // --- Блок регистрации ---
    console.log("Попытка найти элементы для регистрации:");
    console.log("loginInput (для регистрации):", loginInput);
    console.log("passwordInput (для регистрации):", passwordInput);
    console.log("regSubmitButton:", regSubmitButton);
    console.log("errorMessageDiv (для регистрации):", errorMessageDiv);
    console.log("sucsessMessageDiv (для регистрации):", sucsessMessageDiv);

    // Проверяем, существуют ли элементы для регистрации на текущей странице
    if (loginInput && passwordInput && regSubmitButton && errorMessageDiv && sucsessMessageDiv) { // Добавил sucsessMessageDiv
        console.log("Все элементы для регистрации найдены. Добавляем обработчик событий.");

        regSubmitButton.addEventListener('click', async (event) => { 
            event.preventDefault(); // Предотвращаем стандартное действие ссылки
            console.log("Кнопка 'зарегистрироваться' нажата.");
            const enteredLogin = loginInput.value.trim();
            const enteredPassword = passwordInput.value.trim();

            // Очищаем сообщения перед новой попыткой
            displayMessage(errorMessageDiv, '', false);
            displayMessage(sucsessMessageDiv, '', true);

            // Сбрасываем классы ошибок/успеха с полей ввода
            loginInput.classList.remove('input-error', 'input-sucsess');
            passwordInput.classList.remove('input-error', 'input-sucsess');


            // Клиентская валидация 
            const phoneRegex = /^\+\d{11}$/;
            if (!phoneRegex.test(enteredLogin)) {
                console.log("Неверный формат логина.");
                displayMessage(errorMessageDiv, 'Вы ввели не номер телефона!', false);
                loginInput.classList.add('input-error');
                return;
            }
            if (enteredPassword.length < 6) {
                console.log("Короткий пароль.");
                displayMessage(errorMessageDiv, 'Пароль должен быть не менее 6 символов!', false);
                passwordInput.classList.add('input-error');
                return;
            }

            try {
                const response = await fetch('register.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: `login=${encodeURIComponent(enteredLogin)}&password=${encodeURIComponent(enteredPassword)}`
                });

                const contentType = response.headers.get("content-type");
                if (!response.ok || !contentType || !contentType.includes("application/json")) {
                    const errorText = await response.text();
                    console.error('Ошибка HTTP или не JSON ответ от сервера:', response.status, errorText);
                    displayMessage(errorMessageDiv, `Ошибка сервера: ${response.status}. ${errorText.substring(0, 100)}...`, false);
                    loginInput.classList.add('input-error');
                    passwordInput.classList.add('input-error');
                    return; // Выходим
                }

                const data = await response.json(); 

                if (data.success) {
                    displayMessage(sucsessMessageDiv, data.message, true);
                    loginInput.value = '';
                    passwordInput.value = '';
                    loginInput.classList.add('input-sucsess');
                    passwordInput.classList.add('input-sucsess');
                } else {
                    displayMessage(errorMessageDiv, data.message, false);
                    loginInput.classList.add('input-error');
                    passwordInput.classList.add('input-error');
                }
            } catch (error) {
                console.error('Ошибка при отправке или обработке запроса:', error);
                displayMessage(errorMessageDiv, 'Произошла ошибка при отправке запроса или обработке ответа. Попробуйте еще раз.', false);
                loginInput.classList.add('input-error');
                passwordInput.classList.add('input-error');
            }
        });

        passwordInput.addEventListener('keypress', (event) => {
            if (event.key === 'Enter') {
                console.log("Нажат Enter в поле пароля.");
                event.preventDefault();
                regSubmitButton.click();
            }
        });
    } else {
        console.warn("Один или несколько элементов для регистрации не найдены на этой странице. Логика регистрации не будет работать.");
    }
});