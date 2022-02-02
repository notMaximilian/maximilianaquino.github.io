const KEY_CODE_LEFT = 65;
const KEY_CODE_RIGHT = 68;
const KEY_CODE_SPACE = 32;

const GAME_WIDTH = window.innerWidth - 50;
const GAME_HEIGHT = window.innerHeight;

const PLAYER_WIDTH = 20;
const PLAYER_MAX_SPEED = 300.0;
const LASER_MAX_SPEED = 600.0;
const LASER_COOLDOWN = 0.5;

const headers_PER_ROW = 10;
const header_HORIZONTAL_PADDING = 80;
const header_VERTICAL_PADDING = 70;
const header_VERTICAL_SPACING = 80;
const header_COOLDOWN = 5.0;

const GAME_STATE = {
    lastTime: Date.now(),
    leftPressed: false,
    rightPressed: false,
    spacePressed: false,
    playerX: 0,
    playerY: 0,
    playerCooldown: 0,
    lasers: [],
    headers: [],
    headerLasers: [],
    gameOver: false
  };



function rectsIntersect(r1, r2) {
    return !(
        r2.left > r1.right ||
        r2.right < r1.left ||
        r2.top > r1.bottom ||
        r2.bottom < r1.top
    );
}

function setSize($element, width){
    $element.style.width = `${width}px`;
    $element.style.height = "auto";
  }

function setPosition(el, x, y) {
    el.style.transform = `translate(${x}px, ${y}px)`;
}

function clamp(v, min, max) {
    if (v < min) {
      return min;
    } else if (v > max) {
      return max;
    } else {
      return v;
    }
}

function rand(min, max) {
    // if (min === undefined) min = 0;
    // if (max === undefined) max = 1;
    // return min + Math.random() * (max - min);
  }
  
  function createPlayer($container) {
    GAME_STATE.playerX = GAME_WIDTH / 2;
    GAME_STATE.playerY = GAME_HEIGHT - 200;
    const $player = document.createElement("img");
    $player.src = "img/player.png";
    $player.className = "player";
    $container.appendChild($player);
    setPosition($player, GAME_STATE.playerX, GAME_STATE.playerY);
    setSize($player, 100)
  }

  function destroyPlayer($container, player) {
    $container.removeChild(player);
    GAME_STATE.gameOver = true;
    const audio = new Audio("sound/sfx-lose.ogg");
    audio.play();
  }
  
  function updatePlayer(dt, $container) {
    if (GAME_STATE.leftPressed) {
      GAME_STATE.playerX -= dt * PLAYER_MAX_SPEED;
    }
    if (GAME_STATE.rightPressed) {
      GAME_STATE.playerX += dt * PLAYER_MAX_SPEED;
    }
  
    GAME_STATE.playerX = clamp(
      GAME_STATE.playerX,
      PLAYER_WIDTH,
      GAME_WIDTH - PLAYER_WIDTH
    );
  
    if (GAME_STATE.spacePressed && GAME_STATE.playerCooldown <= 0) {
      createLaser($container, (GAME_STATE.playerX + 29.5 ), GAME_STATE.playerY-25);
      GAME_STATE.playerCooldown = LASER_COOLDOWN;
    }
    if (GAME_STATE.playerCooldown > 0) {
      GAME_STATE.playerCooldown -= dt;
    }
  
    const player = document.querySelector(".player");
    setPosition(player, GAME_STATE.playerX, GAME_STATE.playerY);
  }
  
  function createLaser($container, x, y) {
    const $element = document.createElement("img");
    $element.src = "img/laser-blue-1.png";
    $element.className = "laser";
    $container.appendChild($element);
    const laser = { x, y, $element };
    GAME_STATE.lasers.push(laser);
    const audio = new Audio("sound/sfx-laser1.ogg");
    audio.play();
    setPosition($element, x, y);
  }
  
  function updateLasers(dt, $container) {
    const lasers = GAME_STATE.lasers;
    for (let i = 0; i < lasers.length; i++) {
      const laser = lasers[i];
      laser.y -= dt * LASER_MAX_SPEED;
      if (laser.y < 0) {
        destroyLaser($container, laser);
      }
      setPosition(laser.$element, laser.x, laser.y);
      const r1 = laser.$element.getBoundingClientRect();
      const headers = GAME_STATE.headers;
      for (let j = 0; j < headers.length; j++) {
        const header = headers[j];
        if (header.isDead) continue;
        const r2 = header.$element.getBoundingClientRect();
        if (rectsIntersect(r1, r2)) {
          // header was hit
          destroyheader($container, header);
          destroyLaser($container, laser);
          break;
        }
      }
    }
    GAME_STATE.lasers = GAME_STATE.lasers.filter(e => !e.isDead);
  }
  
  function destroyLaser($container, laser) {
    $container.removeChild(laser.$element);
    laser.isDead = true;
  }
  
  function createHeader($container, x, y) {
      
    for (let x=0; x < 5; x++){
        const $element = document.createElement("img");
        let img = "img/card" + x + ".png"
        $about.src = img;
        $about.className = "header";
    }
    
    
    
    $container.appendChild($about);
    const header = {
      x,
      y,
      cooldown: rand(0.5, header_COOLDOWN),
      $about
    };
    GAME_STATE.headers.push(header);
    setPosition($element, x, y);
    setSize($element, 200)
  }
  
  function updateheaders(dt, $container) {
    const dx = Math.sin(GAME_STATE.lastTime / 1000.0) * 50;
    const dy = Math.cos(GAME_STATE.lastTime / 1000.0) * 10;
  
    const headers = GAME_STATE.headers;
    for (let i = 0; i < headers.length; i++) {
      const header = headers[i];
      const x = header.x + dx;
      const y = header.y + dy;
      setPosition(header.$element, x, y);
      header.cooldown -= dt;
      if (header.cooldown <= 0) {
        createHeaderLaser($container, x, y);
        header.cooldown = header_COOLDOWN;
      }
    }
    GAME_STATE.headers = GAME_STATE.headers.filter(e => !e.isDead);
  }
  
  function destroyheader($container, header) {
    $container.removeChild(header.$element);
    header.isDead = true;
    // window.location.href = "http://stackoverflow.com";
    
  }
  
  function createHeaderLaser($container, x, y) {
    const $element = document.createElement("img");
    $element.src = "img/laser-red-5.png";
    $element.className = "header-laser";
    $container.appendChild($element);
    const laser = { x, y, $element };
    GAME_STATE.headerLasers.push(laser);
    setPosition($element, x, y);
  }
  
  function updateheaderLasers(dt, $container) {
    const lasers = GAME_STATE.headerLasers;
    for (let i = 0; i < lasers.length; i++) {
      const laser = lasers[i];
      laser.y += dt * LASER_MAX_SPEED;
      if (laser.y > GAME_HEIGHT) {
        destroyLaser($container, laser);
      }
      setPosition(laser.$element, laser.x, laser.y);
      const r1 = laser.$element.getBoundingClientRect();
      const player = document.querySelector(".player");
      const r2 = player.getBoundingClientRect();
      if (rectsIntersect(r1, r2)) {
        // Player was hit
        destroyPlayer($container, player);
        break;
      }
    }
    GAME_STATE.headerLasers = GAME_STATE.headerLasers.filter(e => !e.isDead);
  }
  
  function init() {
    const $container = document.querySelector(".game");
    createPlayer($container);
    createHeader($container, (GAME_WIDTH / 2) + 400, GAME_HEIGHT - 580);

  }
  
  
  
  function playerHasWon() {
    return GAME_STATE.headers.length === 0;
  }
  
  
  function update(e) {
    const currentTime = Date.now();
    const $container = document.querySelector(".game");

    const dt = (currentTime - GAME_STATE.lastTime) / 1000.0;
  
    if (GAME_STATE.gameOver) {
      document.querySelector(".game-over").style.display = "block";
      return;
    }
  
    if (playerHasWon()) {
      document.querySelector(".congratulations").style.display = "block";
      const player = document.querySelector(".player");
      destroyPlayer($container, player)
      return;
    }
  
    
    updatePlayer(dt, $container);
    updateLasers(dt, $container);
    updateheaders(dt, $container);
    updateheaderLasers(dt, $container);
  
    GAME_STATE.lastTime = currentTime;
    window.requestAnimationFrame(update);
  }
  
  function onKeyDown(e) {
    if (e.keyCode === KEY_CODE_LEFT) {
      GAME_STATE.leftPressed = true;
    } else if (e.keyCode === KEY_CODE_RIGHT) {
      GAME_STATE.rightPressed = true;
    } else if (e.keyCode === KEY_CODE_SPACE) {
      GAME_STATE.spacePressed = true;
    }
  }
  
  function onKeyUp(e) {
    if (e.keyCode === KEY_CODE_LEFT) {
      GAME_STATE.leftPressed = false;
    } else if (e.keyCode === KEY_CODE_RIGHT) {
      GAME_STATE.rightPressed = false;
    } else if (e.keyCode === KEY_CODE_SPACE) {
      GAME_STATE.spacePressed = false;
    }
  }
  

intro = document.querySelector('.intro')
let name = document.querySelector('.name-header')
let logoSpan = document.querySelectorAll('.name')

 window.addEventListener('DOMContentLoaded', () =>{

    setTimeout(()=>{
        logoSpan.forEach((span, idx)=>{
            setTimeout(()=>{
                span.classList.add('active')
            }, (idx + 1) * 400)
        })
   
   
        setTimeout(()=>{
            logoSpan.forEach((span, idx)=>{
                setTimeout(()=>{
                    span.classList.remove('active')
                    span.classList.add('fade')
                }, (idx + 1) * 400)
            })          
        },2000)

        setTimeout(()=>{
            intro.style.top = '-100vh';
            window.addEventListener("keydown", onKeyDown);
            window.addEventListener("keyup", onKeyUp);
            window.requestAnimationFrame(update);
            init();
        }, 2300)

    })
 })