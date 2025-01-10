const player = document.getElementById('player');
    const boss = document.getElementById('boss');
    const gameContainer = document.getElementById('gameContainer');
    const bossHealthElement = document.getElementById('enemyHealthValue');
    const playerHealthElement = document.getElementById('playerHealthValue');

    let playerLeft = 175;
    let playerTop = 500;

    let bossLeft = 175;
    let bossTop = 50;

    let startBossHealth = 100; // 初始Boss血量
    let bossHealth = startBossHealth; // 初始Boss血量
    let startPlayerHealth = 100; // 初始玩家血量
    let playerHealth = startPlayerHealth;

    let verticalSpeedRate = 1;
    let horizontalSpeedRate = 1;
    const bossVerticalSpeed = 1;
    const bossHorizontalSpeed = 1;

    const horizontalSpeed = 2.5;
    const verticalSpeed = 3.5;


    const bullets = [];
    const enemyBullets = [];
    const enemies = [];
    const keys = {};
    var bossAttackMode = 0;
    let isSpacePressed = false;
    let lastShotTime = 0;
    const shootCooldown = 150;

    document.addEventListener('keydown', (e) => {
        keys[e.key] = true;
        if(e.key === ' ') {
            isSpacePressed = true;
            e.preventDefault();
        }
    });

    document.addEventListener('keyup', (e) => {
        keys[e.key] = false;
        if(e.key === ' ') {
            isSpacePressed = false;
        }
    });

    function bossAttackModeChangeLogic()
    {
        bossAttackMode = Math.random();
    }

    // 创建子弹组
    function createBullets() {
        // 子弹间距
        const spacing = 15;

        // 创建三发子弹
        for(let i = -1; i <= 1; i++) {
            const bullet = document.createElement('img');
            bullet.src = './src/img/our_bullet2.png';
            bullet.className = 'bullet';

            // 计算子弹位置，中间子弹在飞机正上方，两侧子弹略微偏移
            const bulletLeft = playerLeft + player.offsetWidth/2 - 5 + (i * spacing);
            bullet.style.left = bulletLeft + 'px';
            bullet.style.top = (playerTop - 20) + 'px';

            gameContainer.appendChild(bullet);

            // 为两侧子弹添加横向运动
            const horizontalSpeed = i * 0.5; // 子弹横向扩散速度

            bullets.push({
                element: bullet,
                top: playerTop - 20,
                left: bulletLeft,
                horizontalSpeed: horizontalSpeed // 新增横向速度属性
            });
        }
    }

    function bossMoveLogic()
    {
        verticalSpeedRate = 1 - 2 * Math.random();
        horizontalSpeedRate = 1 - 2 * Math.random();
    }

    let Angle = 0;
    function bossAttackLogic()
    {
        if(bossAttackMode <= 0.45) 
        {
            for(let i = 0; i < 20; i++)
            {
                const enemyBullet = document.createElement('img');
                enemyBullet.src = './src/img/boss_bullet2.png';
                enemyBullet.className = 'bullet';
                enemyBullet.style.left = bossLeft + 'px';
                enemyBullet.style.top = bossTop + 'px';
                const horizontalSpeed = Math.cos(i / 20 * 2 * Math.PI);
                const verticalSpeed = Math.sin(i / 20 * 2 * Math.PI);

                gameContainer.appendChild(enemyBullet);

                enemyBullets.push({
                    element: enemyBullet,
                    top: bossTop,
                    left: bossLeft,
                    horizontalSpeed: horizontalSpeed,
                    verticalSpeed: verticalSpeed
                });
            }
        }
        else if(bossAttackMode <= 0.9)
        {
            
            for(let i = 0; i < 20; i++)
            {
                const enemyBullet = document.createElement('img');
                enemyBullet.src = './src/img/boss_bullet2.png';
                enemyBullet.className = 'bullet';
                enemyBullet.style.left = bossLeft + 'px';
                enemyBullet.style.top = bossTop + 'px';
                const horizontalSpeed = Math.cos(i / 20 * 0.5 * Math.PI + Angle/2 * Math.PI);
                const verticalSpeed = Math.sin(i / 20 * 0.5 * Math.PI + Angle/2 * Math.PI);

                gameContainer.appendChild(enemyBullet);

                enemyBullets.push({
                    element: enemyBullet,
                    top: bossTop,
                    left: bossLeft,
                    horizontalSpeed: horizontalSpeed,
                    verticalSpeed: verticalSpeed
                });
            }
            Angle += 1;
            Angle = Angle % 4;

        }
    }
    function isColliding(rect1, rect2) {
        return !(rect1.right < rect2.left ||
            rect1.left > rect2.right ||
            rect1.bottom < rect2.top ||
            rect1.top > rect2.bottom);
    }

    function gameLoop() {
        const currentTime = Date.now();
        //角色移动
        if (isSpacePressed && currentTime - lastShotTime >= shootCooldown) 
        {
            createBullets();
            lastShotTime = currentTime;
        }

        if(keys['ArrowLeft'] && playerLeft > 0) {
            playerLeft -= horizontalSpeed;
        }
        if(keys['ArrowRight'] && playerLeft < gameContainer.offsetWidth - player.offsetWidth) {
            playerLeft += horizontalSpeed;
        }
        if(keys['ArrowUp'] && playerTop > 0) {
            playerTop -= verticalSpeed;
        }
        if(keys['ArrowDown'] && playerTop < gameContainer.offsetHeight - player.offsetHeight) {
            playerTop += verticalSpeed;
        }


        // 更新角色位置
        player.style.left = playerLeft + 'px';
        player.style.top = playerTop + 'px';

        //boss移动
        if(bossTop < gameContainer.offsetHeight - boss.offsetHeight && verticalSpeedRate > 0)
        {
            bossTop += bossVerticalSpeed * verticalSpeedRate;
        }
        if(bossTop > 0 && verticalSpeedRate < 0)
        {
            bossTop += bossVerticalSpeed* verticalSpeedRate;
        }
        if(bossLeft < gameContainer.offsetWidth - boss.offsetWidth && horizontalSpeedRate > 0)
        {
            bossLeft += bossHorizontalSpeed* horizontalSpeedRate;
        }
        if(bossLeft > 0 && horizontalSpeedRate < 0)
        {
            bossLeft += bossHorizontalSpeed * horizontalSpeedRate;
        }
        //bossTop += verticalSpeed * verticalSpeedRate;
        //bossLeft += horizontalSpeed * horizontalSpeedRate;
        // 更新boss位置
        boss.style.left = bossLeft + 'px';
        boss.style.top = bossTop + 'px';

        // 更新子弹位置
        for(let i = bullets.length - 1; i >= 0; i--) {
            const bullet = bullets[i];
            bullet.top -= 8; // 垂直移动速度
            bullet.left += bullet.horizontalSpeed; // 添加横向移动

            // 更新子弹位置
            bullet.element.style.top = bullet.top + 'px';
            bullet.element.style.left = bullet.left + 'px';

            // 移除超出边界的子弹
            if(bullet.top <= -20 || bullet.left < -10 || bullet.left > gameContainer.offsetWidth) {
                bullet.element.remove();
                bullets.splice(i, 1);
                continue;
            }
            if(isColliding(bullet.element.getBoundingClientRect(),boss.getBoundingClientRect())) 
            {
                bullet.element.remove();
                bullets.splice(i, 1);

                bossHealth -= 1;
                bossHealthElement.textContent = bossHealth;
            }
            if(bossHealth <= 0) 
            {
                alert('游戏结束！\n你赢了！你剩余血量：' + playerHealth);
                location.reload();
                return;
            }
        }

        


        // 更新敌人子弹位置
        for(let i = enemyBullets.length - 1; i >= 0; i--)
        {
            const enemyBullet = enemyBullets[i];
            enemyBullet.top += enemyBullet.verticalSpeed; // 垂直移动速度
            enemyBullet.left += enemyBullet.horizontalSpeed; // 添加横向移动

            // 更新子弹位置
            enemyBullet.element.style.top = enemyBullet.top + 'px';
            enemyBullet.element.style.left = enemyBullet.left + 'px';

            // 移除超出边界的子弹
            if(enemyBullet.top <= -20 || enemyBullet.left < -10 || enemyBullet.left > gameContainer.offsetWidth) {
                enemyBullet.element.remove();
                enemyBullets.splice(i, 1);
                continue;
            }

            if(isColliding(enemyBullet.element.getBoundingClientRect(),player.getBoundingClientRect()))
            {
                enemyBullet.element.remove();
                enemyBullets.splice(i, 1);

                playerHealth -= 1;
                playerHealthElement.textContent = playerHealth;

            }
            if(playerHealth <= 0) 
            {
                alert('游戏结束！\n你ga了！敌人剩余血量：' + bossHealth);
                location.reload();
                return;
            }
        }

        requestAnimationFrame(gameLoop);
    }


    setInterval(bossMoveLogic, 150);
    setInterval(bossAttackLogic, 1000);
    setInterval(bossAttackModeChangeLogic,5000);
    gameLoop();


    //LZX completed this script on 2025/01/10
    //LZX-TC-VSCode-2025-01-10-001