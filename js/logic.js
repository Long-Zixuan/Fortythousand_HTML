const player = document.getElementById('player');
    const boss = document.getElementById('boss');
    const gameContainer = document.getElementById('gameContainer');
    const bossHealthElement = document.getElementById('bossHealthValue');
    const playerHealthElement = document.getElementById('playerHealthValue');
    const restartButton = document.getElementById('restart-button');
    const pauseButton = document.getElementById('pause-button');
    const restartButtonTextElement = document.getElementById('ButtonText');
    const pauseButtonTextElement = document.getElementById('PauseText');
    const gameEndTextElement = document.getElementById('gameEndMsgText');

    const bgm = document.getElementById("bgMusic");

    //const bossBulletsCount = document.getElementById('bossBulletsCount');//Debug

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
    const bossBullets = [];
    const enemies = [];
    const keys = {};
    var bossAttackMode = 0;
    let isSpacePressed = false;
    let lastShotTime = 0;
    const shootCooldown = 150;


    let gameStateMachine = 0;
    const GAME_RUNNING = 0;
    const GAME_WIN = 1;
    const GAME_DIE = -1;
    const GAME_PAUSE = 2;

    

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
        if(gameStateMachine != GAME_RUNNING){return;}
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
        if(gameStateMachine != GAME_RUNNING){return;}
        verticalSpeedRate = 1 - 2 * Math.random();
        horizontalSpeedRate = 1 - 2 * Math.random();
    }

    let Angle = 0;
    function bossAttackLogic()
    {
        if(gameStateMachine != GAME_RUNNING){return;}
        if(bossAttackMode <= 0.45) 
        {
            let createbulletCount = 20;
            for(let i = 0; i < createbulletCount; i++)
            {
                const bossBullet = document.createElement('img');
                bossBullet.src = './src/img/boss_bullet2.png';
                bossBullet.className = 'bullet';
                bossBullet.style.left = bossLeft + 'px';
                bossBullet.style.top = bossTop + 'px';
                const horizontalSpeed = Math.cos(i / createbulletCount * 2 * Math.PI);
                const verticalSpeed = Math.sin(i / createbulletCount * 2 * Math.PI);

                gameContainer.appendChild(bossBullet);

                bossBullets.push({
                    element: bossBullet,
                    top: bossTop,
                    left: bossLeft,
                    horizontalSpeed: horizontalSpeed,
                    verticalSpeed: verticalSpeed
                });
            }
        }
        else if(bossAttackMode <= 0.9)
        {
            let createBulletCount = 20;
            for(let i = 0; i < createBulletCount; i++)
            {
                const bossBullet = document.createElement('img');
                bossBullet.src = './src/img/boss_bullet2.png';
                bossBullet.className = 'bullet';
                bossBullet.style.left = bossLeft + 'px';
                bossBullet.style.top = bossTop + 'px';
                const horizontalSpeed = Math.cos(i / createBulletCount * 0.5 * Math.PI + Angle/2 * Math.PI);
                const verticalSpeed = Math.sin(i / createBulletCount * 0.5 * Math.PI + Angle/2 * Math.PI);

                gameContainer.appendChild(bossBullet);

                bossBullets.push({
                    element: bossBullet,
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
    let hadTellPlayer = false;

    function updateBullets()
    {
        /*Debug End*/
        //bossBulletsCount.textContent = bossBullets.length;
        console.log("Boss bullets count:\t" + bossBullets.length);
        console.log("Player bullets count:\t" + bullets.length);
        console.log(" ");
        /*Debug End*/

        if(gameStateMachine != GAME_RUNNING) {return;}
        // 更新子弹位置
        for(let i = bullets.length - 1; i >= 0; i--) {
            const bullet = bullets[i];
            bullet.top -= 8; // 垂直移动速度
            bullet.left += bullet.horizontalSpeed; // 添加横向移动

            // 更新子弹位置
            bullet.element.style.top = bullet.top + 'px';
            bullet.element.style.left = bullet.left + 'px';

            // 移除超出边界的子弹
            if(bullet.top <= -20 || bullet.left < -10 || bullet.left > gameContainer.offsetWidth || bullet.top > gameContainer.offsetHeight) {
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
            if(bossHealth == startBossHealth / 2 && !hadTellPlayer)
            {
                for(key in keys)
                {
                    keys[key] = false;
                }
                isSpacePressed = false;
                hadTellPlayer = true;
                alert("坚持住，Boss只剩下半血了！");
            }
            if(bossHealth <= 0) 
            {
                gameStateMachine = GAME_WIN;
               // requestAnimationFrame(winLogic)
               // alert('游戏结束！\n你赢了！你剩余血量：' + playerHealth);
               // isGameOver = true;
               // location.reload();
                return;
            }
        }

        


        // 更新敌人子弹位置
        for(let i = bossBullets.length - 1; i >= 0; i--)
        {
            const bossBullet = bossBullets[i];
            bossBullet.top += bossBullet.verticalSpeed; // 垂直移动速度
            bossBullet.left += bossBullet.horizontalSpeed; // 添加横向移动

            // 更新子弹位置
            bossBullet.element.style.top = bossBullet.top + 'px';
            bossBullet.element.style.left = bossBullet.left + 'px';

            // 移除超出边界的子弹
            if(bossBullet.top <= -20 || bossBullet.left < -10 || bossBullet.left > gameContainer.offsetWidth || bossBullet.top > gameContainer.offsetHeight) {
                bossBullet.element.remove();
                bossBullets.splice(i, 1);
                continue;
            }

            if(isColliding(bossBullet.element.getBoundingClientRect(),player.getBoundingClientRect()))
            {
                bossBullet.element.remove();
                bossBullets.splice(i, 1);

                playerHealth -= 1;
                playerHealthElement.textContent = playerHealth;

            }
            if(playerHealth <= 0) 
            {
                gameStateMachine = GAME_DIE;
                //isGameOver = true;
                return;
            }
        }

    }

    function pauseButtonLogic()
    {
        if(gameStateMachine == GAME_PAUSE)
        {
            gameStateMachine = GAME_RUNNING;
            bgm.play();
        }
        else if(gameStateMachine == GAME_RUNNING)
        {
            gameStateMachine = GAME_PAUSE;
            bgm.pause();
        }
    }

    function pauseLogic()
    {
        if(keys['Escape'] && gameStateMachine == GAME_RUNNING)
        {
            gameStateMachine = GAME_PAUSE;
            bgm.pause();
        }
        else if(keys['Escape'] && gameStateMachine == GAME_PAUSE)
        {
            gameStateMachine = GAME_RUNNING;
            bgm.play();
        }

        if(gameStateMachine == GAME_PAUSE)
        {
            pauseButtonTextElement.textContent = "继续";
            gameEndTextElement.textContent = "游戏已暂停";     
        }
        else if(gameStateMachine == GAME_RUNNING)
        {
            pauseButtonTextElement.textContent = "暂停";
            gameEndTextElement.textContent = "";
        }

    }

    function winLogic()
    {
        bgm.pause();
        boss.src = './src/img/boss_die.png';
        restartButton.style.bottom = '10px';
        restartButton.style.left = '50%';
        //restartButtonTextElement.textContent = "你赢了！重新开始"
        gameEndTextElement.textContent = "你赢了!你剩余血量："+playerHealth;
        
    }


    function dieLogic()
    {
        bgm.pause();
        player.src = './src/img/player_die.png';
        restartButton.style.bottom = '10px';
        restartButton.style.left = '50%';
        //restartButtonTextElement.textContent = "你ga了。重新开始"
        gameEndTextElement.textContent = "你ga了。Boss剩余血量："+bossHealth;
    }

    function updatePlayer()
    {
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
    }

    function updateBoss()
    {
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
    }

    function update()
    {
        bgm.play();// 用户进行交互后才有bgm，别问，问就是HTML特性
        updatePlayer();
        updateBoss();
    }

    function gameLoop() 
    {
        //updateBullets();
        
        pauseLogic();

        if(gameStateMachine == GAME_RUNNING)
        {
            update();
        }

        if(gameStateMachine == GAME_PAUSE || gameStateMachine == GAME_RUNNING)
        {
            requestAnimationFrame(gameLoop);
        }

        if(gameStateMachine == GAME_WIN)
        {
            requestAnimationFrame(winLogic);
            //alert('游戏结束！\n你赢了！敌人剩余血量：' + playerHealth);
            //location.reload();
        }

        if(gameStateMachine == GAME_DIE)
        {
            requestAnimationFrame(dieLogic);
        }
    }

    restartButton.addEventListener('click', function() {
        location.reload();
    });
    pauseButton.addEventListener('click',pauseButtonLogic);
    setInterval(updateBullets, 10);
    setInterval(bossMoveLogic, 150);
    setInterval(bossAttackLogic, 1000);
    setInterval(bossAttackModeChangeLogic,5000);
    
    gameLoop();


    //LZX completed this script on 2025/01/10
    //LZX-TC-VSCode-2025-01-10-001