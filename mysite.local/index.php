<?
require_once 'db_config.php'; 
require_once 'script.php'; 
?>
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Search_lo_Games</title>
    <link rel="stylesheet" href="main.css">
</head>
<body>
    <!-- хедер -->
    <div id="header-placeholder"></div>

    <!-- основная страница -->
    <main class="main-content">
        <div class="content-container">

            <!-- левая часть -->
            <div class="image-section">
                <div class="game-image">
                    <img src="pictures\banner.jpg" alt="game banner">
                </div>
            </div>

            <!-- правая часть  -->
            <div class="content-section">                
                <!-- Рекомендуемые игры -->
                <section class="games-section">
                    <h2 class="section-title">рекомендуемые позиции:</h2>
                    
                    <?php if (!empty($error_message)): ?>
                        <p class="error-message"><?php echo htmlspecialchars($error_message); ?></p>
                    <?php endif; ?>

                    <div class="games-list">
                        <?php if (!empty($games)): ?>
                            <?php foreach ($games as $game): ?>
                                <a href="game_pages.html?gameId=<?php echo htmlspecialchars($game['game_id']); ?>" 
                                   class="game-card" 
                                   id="<?php echo htmlspecialchars($game['game_id']); ?>">
                                    <div class="game-content">
                                        <div class="game-info">
                                            <h3 class="game-title"><?php echo htmlspecialchars($game['title']); ?></h3>
                                            <p class="game-price">цена: <?php echo htmlspecialchars(number_format($game['price'], 2, ',', ' ')); ?> р.</p>
                                        </div>
                                        <div class="game-image-container">
                                            <img src="<?php echo htmlspecialchars($game['image_path']); ?>" 
                                                 alt="<?php echo htmlspecialchars($game['title']); ?>" 
                                                 class="game-image-right">
                                        </div>
                                    </div>
                                </a>
                            <?php endforeach; ?>
                        <?php else: ?>
                            <?php if (empty($error_message)): ?>
                                <p class="no-games">В каталоге рекомендуемых игр пока нет.</p>
                            <?php endif; ?>
                        <?php endif; ?>
                    </div>
                </section>
            </div>
        </div>
    </main>
    <!-- футер -->
    <div id="footer-placeholder"></div>
    <script src="script.js"></script>
</body>
</html>