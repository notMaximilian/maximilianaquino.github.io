const KEY_CODE_LEFT = 65;
const KEY_CODE_RIGHT = 68;
const KEY_CODE_SPACE = 32;

const WINDOW_WIDTH = window.innerWidth - 50;
const WINDOW_HEIGHT = window.innerHeight;

const ROCKET_WIDTH = 20;
const ROCKET_MAX_SPEED = 300.0;
const LASER_MAX_SPEED = 600.0;
const LASER_COOLDOWN = 0.5;

const headers_PER_ROW = 10;
const header_HORIZONTAL_PADDING = 80;
const header_VERTICAL_PADDING = 70;
const header_VERTICAL_SPACING = 80;
const header_COOLDOWN = 5.0;

// positioning for website header
const coords = [
    {x: (WINDOW_WIDTH / 2) + 50, y: (WINDOW_HEIGHT - 580)},
    {x: (WINDOW_WIDTH / 2) + 50 , y: (WINDOW_HEIGHT - 580)},
    {x: (WINDOW_WIDTH / 2) , y: (WINDOW_HEIGHT - 580)}
]

// create user controlled rocket for selecting header elements
function createRocket($container) {
    WINDOW_STATE.rocketX = WINDOW_WIDTH / 2;
    WINDOW_STATE.rocketY = WINDOW_HEIGHT - 200;
    const $rocket = document.createElement("img");
    $rocket.src = "img/rocket.png";
    $rocket.className = "rocket";
    $container.appendChild($rocket);
    setPosition($rocket, WINDOW_STATE.rocketX, WINDOW_STATE.rocketY);
    setSize($rocket, 100)
}

function destroyRocket($container, rocket) {
    $container.removeChild(rocket);
    WINDOW_STATE.finalState = true;
    const audio = new Audio("sound/sfx-lose.ogg");
    audio.play();
}


const WINDOW_STATE = {
    lastTime: Date.now(),
    leftPressed: false,
    rightPressed: false,
    spacePressed: false,
    rocketX: 0,
    rocketY: 0,
    rocketCooldown: 0,
    lasers: [],
    headers: [],
    headerLasers: [],
    finalState: false
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
  



  
  function updateRocket(dt, $container) {
    if (WINDOW_STATE.leftPressed) {
      WINDOW_STATE.rocketX -= dt * ROCKET_MAX_SPEED;
    }
    if (WINDOW_STATE.rightPressed) {
      WINDOW_STATE.rocketX += dt * ROCKET_MAX_SPEED;
    }


    WINDOW_STATE.rocketX = clamp(
      WINDOW_STATE.rocketX,
      ROCKET_WIDTH,
      WINDOW_WIDTH - ROCKET_WIDTH
    );
  
  
    if (WINDOW_STATE.spacePressed && WINDOW_STATE.rocketCooldown <= 0) {
      createLaser($container, WINDOW_STATE.rocketX - 50, WINDOW_STATE.rocketY-20);
      console.log(WINDOW_STATE.rocketX)
      WINDOW_STATE.rocketCooldown = LASER_COOLDOWN;
    }
    if (WINDOW_STATE.rocketCooldown > 0) {
      WINDOW_STATE.rocketCooldown -= dt;
    }
  
    const rocket = document.querySelector(".rocket");
    setPosition(rocket, WINDOW_STATE.rocketX, WINDOW_STATE.rocketY);
  }
  
  function createLaser($container, x, y) {
    const $element = document.createElement("img");
    $element.src = "img/laser-blue-1.png";
    $element.className = "laser";
    $element.style.position = "absolute"
    $container.appendChild($element);
    const laser = { x, y, $element };
    WINDOW_STATE.lasers.push(laser);
    const audio = new Audio("sound/sfx-laser1.ogg");
    audio.play();
    setPosition($element, x, y);
  }
  
  function updateLasers(dt, $container) {
    const lasers = WINDOW_STATE.lasers;
    for (let i = 0; i < lasers.length; i++) {
      const laser = lasers[i];
      laser.y -= dt * LASER_MAX_SPEED;
      if (laser.y < 0) {
        destroyLaser($container, laser);
      }
      setPosition(laser.$element, laser.x, laser.y);
      const r1 = laser.$element.getBoundingClientRect();
      const headers = WINDOW_STATE.headers;
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
    WINDOW_STATE.lasers = WINDOW_STATE.lasers.filter(e => !e.isDead);
  }
  
  function destroyLaser($container, laser) {
    $container.removeChild(laser.$element);
    laser.isDead = true;
  }
  
  function createHeader($container) {
    for (let i=0; i < 3; i++){
        let $element = document.createElement("img");
        let img = "img/card" + (i+1) + ".png"
        $element.src = img;
        $element.className = "header";
        $element.style.position = "absolute"
        $container.appendChild($element);
        

        let x = coords[i].x
        let y = coords[i].y

        let header = {
            x,
            y,
            cooldown: rand(0.5, header_COOLDOWN),
            $element
          };

          WINDOW_STATE.headers.push(header);
          setPosition($element, x, y);
          setSize($element, 200)
    }
  }
  
  function updateheaders(dt, $container) {
    const dx = Math.sin(WINDOW_STATE.lastTime / 1000.0) * 50;
    const dy = Math.cos(WINDOW_STATE.lastTime / 1000.0) * 10;
  
    const headers = WINDOW_STATE.headers;
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
    WINDOW_STATE.headers = WINDOW_STATE.headers.filter(e => !e.isDead);
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
    WINDOW_STATE.headerLasers.push(laser);
    setPosition($element, x, y);
  }
  
  function updateheaderLasers(dt, $container) {
    const lasers = WINDOW_STATE.headerLasers;
    for (let i = 0; i < lasers.length; i++) {
      const laser = lasers[i];
      laser.y += dt * LASER_MAX_SPEED;
      if (laser.y > WINDOW_HEIGHT) {
        destroyLaser($container, laser);
      }
      setPosition(laser.$element, laser.x, laser.y);
      const r1 = laser.$element.getBoundingClientRect();
      const rocket = document.querySelector(".rocket");
      const r2 = rocket.getBoundingClientRect();
      if (rectsIntersect(r1, r2)) {
        // Rocket was hit
        destroyRocket($container, rocket);
        break;
      }
    }
    WINDOW_STATE.headerLasers = WINDOW_STATE.headerLasers.filter(e => !e.isDead);
  }
  
  function init() {
    const $container = document.querySelector(".game");
    createRocket($container);
    createHeader($container);

  }
  
  
  
  function rocketHasWon() {
    // return WINDOW_STATE.headers.length === 0;
  }
  
  
  function update(e) {
    const currentTime = Date.now();
    const $container = document.querySelector(".game");

    const dt = (currentTime - WINDOW_STATE.lastTime) / 1000.0;
  
    if (WINDOW_STATE.finalState) {
      document.querySelector(".game-over").style.display = "block";
      return;
    }
  
    if (rocketHasWon()) {
      document.querySelector(".congratulations").style.display = "block";
      const rocket = document.querySelector(".rocket");
      destroyRocket($container, rocket)
      return;
    }
  
    
    updateRocket(dt, $container);
    updateLasers(dt, $container);
    updateheaders(dt, $container);
    updateheaderLasers(dt, $container);
  
    WINDOW_STATE.lastTime = currentTime;
    window.requestAnimationFrame(update);
  }
  
  function onKeyDown(e) {
    if (e.keyCode === KEY_CODE_LEFT) {
      WINDOW_STATE.leftPressed = true;
    } else if (e.keyCode === KEY_CODE_RIGHT) {
      WINDOW_STATE.rightPressed = true;
    } else if (e.keyCode === KEY_CODE_SPACE) {
      WINDOW_STATE.spacePressed = true;
    }
  }
  
  function onKeyUp(e) {
    if (e.keyCode === KEY_CODE_LEFT) {
      WINDOW_STATE.leftPressed = false;
    } else if (e.keyCode === KEY_CODE_RIGHT) {
      WINDOW_STATE.rightPressed = false;
    } else if (e.keyCode === KEY_CODE_SPACE) {
      WINDOW_STATE.spacePressed = false;
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