const KEY_CODE_LEFT = 37;
const KEY_CODE_RIGHT = 39;
const KEY_CODE_SPACE = 32;
let inverted = false;
const WINDOW_WIDTH = window.innerWidth - 50;
const WINDOW_HEIGHT = window.innerHeight;

const ROCKET_WIDTH = 20;
const ROCKET_MAX_SPEED = 300.0;
const LASER_MAX_SPEED = 600.0;
const LASER_COOLDOWN = 0.5;
let rocketSpawn = false;
const HEADERS_PER_ROW = 10;
const HEADER_HORIZONTAL_PADDING = 80;
const HEADER_VERTICAL_PADDING = 70;
const HEADER_VERTICAL_SPACING = 80;
const HEADER_COOLDOWN = 5.0;


const WINDOW_STATE = {
    lastTime: Date.now(),
    leftPressed: false,
    rightPressed: false,
    spacePressed: false,
    rocketX: WINDOW_WIDTH / 2,
    rocketY: WINDOW_HEIGHT - 300,
    rocketCooldown: 0,
    lasers: [],
    headers: [],
    headerLasers: [],
    fullscreen: false
  };

function setSize($element, width){
    $element.style.width = `${width}vw`;
    $element.style.height = "auto";
  }

function setPosition(el, x, y) { 
    if(el == null){console.log('NULL') 
    return;}
    el.style.transform = `translate(${x}px, ${y}px)`;
}

function setHeaderPosition(el, x, y) { 
  if(el == null){console.log('NULL') 
  return;}
  el.style.transform = `translate(${x}vw, ${y}vh)`;
}

// create user controlled rocket for selecting header elements
function createRocket($container) {
    rocketSpawn = true;
    const $rocket = document.createElement("img");
    if(inverted == true){$rocket.src = "img/rocket-inverted.png";}
    else{$rocket.src = "img/rocket.png";}
    $rocket.className = "rocket";
    if (WINDOW_WIDTH + 50 == 1920){
      setSize($rocket,9)
    }
    else{
      setSize($rocket, 7)
    }
    
    WINDOW_STATE.rocketY = 440;
    $container.appendChild($rocket);
}

function destroyRocket($container, rocket) {
    rocketSpawn = false;
    $container.removeChild(rocket);
    WINDOW_STATE.finalState = true;
    const audio = new Audio("sound/sfx-lose.ogg");
    audio.play();
}

function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
}


function rectsIntersect(r1, r2) {
    return !(
        r2.left > r1.right ||
        r2.right < r1.left ||
        r2.top > r1.bottom ||
        r2.bottom < r1.top
    );
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
      createLaser($container, WINDOW_STATE.rocketX - 79,  WINDOW_STATE.rocketY-20);
      console.log(WINDOW_STATE.rocketX)
      WINDOW_STATE.rocketCooldown = LASER_COOLDOWN;
    }
    if (WINDOW_STATE.rocketCooldown > 0) {
      WINDOW_STATE.rocketCooldown -= dt;
    }
  
    const rocket = document.querySelector(".rocket");
    if(rocket == null){return;}
    setPosition(rocket, WINDOW_STATE.rocketX, WINDOW_STATE.rocketY + 200);
  }
  
  function createLaser($container, x, y) {
    if(rocketSpawn == false) {return;}
    const $element = document.createElement("img");
    console.log($element)
    if(inverted == true){$element.src="img/laser-inverted.png"}
    else{$element.src = "img/laser.png";}
    $element.className = "laser";
    $element.style.position = "absolute"
    $container.appendChild($element);
    const laser = { x, y, $element };
    WINDOW_STATE.lasers.push(laser);
    const audio = new Audio("sound/sfx-laser1.ogg");
    audio.play();
    setPosition($element, x, y);
  }

  function destroyHeader($container, header) {
    $container.removeChild(header.$element);
    header.isDead = true;
  }
  
  function destroyAll($container){
    const background = document.querySelector(".game-wrapper");
    background.style.background = 'white';
    const headers = WINDOW_STATE.headers;
    for (let x = 0; x < headers.length; x++){
      let head = headers[x];
      if (head.dead == true){continue}
      head.$element.style.opacity = 0;
      head.$element.style.transition = 'ease-in-out 0.5s';
      destroyHeader($container, head)      
    }
    // destroyLaser($container, laser);
    const rocket = document.querySelector('.rocket')
    rocket.style.opacity = 0;
    rocket.style.transition = 'ease-in-out 0.5s'
    destroyRocket($container, rocket)
    WINDOW_STATE.lasers = WINDOW_STATE.lasers.filter(e => !e.isDead); 
  }

  function updateLasers(dt, $container) {
    if(rocketSpawn == false) {return;}
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
          if (header.name == 'more' || header.name == 'back'){
              
              for (let x = 0; x < headers.length; x++){
              let head = headers[x];
              if (head.dead == true){continue}
              head.$element.style.opacity = 0;
              head.$element.style.transition = 'ease-in-out 0.5s';
              destroyHeader($container, head)
            }
            destroyLaser($container, laser);
            
            const rocket = document.querySelector('.rocket')
            rocket.style.opacity = 0;
            rocket.style.transition = 'ease-in-out 0.5s'
            destroyRocket($container, rocket)

            console.log(inverted)
            if(inverted == false){
              setTimeout(()=>{    
                initInvert($container)
              },10)
            }
            else{
              setTimeout(()=>{    
                init()
              },10)
            }
            WINDOW_STATE.lasers = WINDOW_STATE.lasers.filter(e => !e.isDead); 
            return;
          }
        if (header.name == 'project'){
          WINDOW_STATE.fullscreen = false;
        }
          destroyHeader($container, header);
          
          break;
        }
      }
    }
    WINDOW_STATE.lasers = WINDOW_STATE.lasers.filter(e => !e.isDead);
  }
  
function destroyLaser($container, laser) {
    console.log('attempting to destroy')
    $container.removeChild(laser.$element);
    laser.isDead = true;
}
  
function createHeader($container, name, x, y, size) {

    let $element = document.createElement("h2");
    let content = document.createTextNode(name);
    $element.appendChild(content)
    $element.className = "header";
    $element.style.position = "relative";
    // setHeaderPosition($element, x, y);
    setSize($element, size)
    $element.style.transition = "all .2s ease-in-out";


    let header = {
        x,
        y,
        cooldown: rand(0.5, HEADER_COOLDOWN),
        $element,
        name,
        dead: false
    };

    // header.$element.addEventListener('mouseenter', ()=>{
    //   if (name == "about"){
    //     $element.style.width = "450px";
    //   }
    //   else if(name == "skills"){
    //     $element.style.width = "230px"
    //   }
    //   else if(name == "project"){
    //     $element.style.width = "350px"
    //   }
    //   else if(name == "more"){
    //     $element.style.width = "250px"
    //   }
    // })

    // header.$element.addEventListener('mouseleave', ()=>{
    //   if (name == "about"){
    //     $element.style.width = "400px"
    //   }
    //   else if(name == "skills"){
    //     $element.style.width = "180px"
    //   }
    //   else if(name == "project"){
    //     $element.style.width = "300px"
    //   }
    //   else if(name == "more"){
    //     $element.style.width = "200px"
    //   }
      
    // })

    $container.appendChild($element);
    WINDOW_STATE.headers.push(header);
  }
  
  function updateHeaders(dt, $container) {
    const dx = Math.sin(WINDOW_STATE.lastTime / 1000.0) * 50;
    const dy = Math.cos(WINDOW_STATE.lastTime / 1000.0) * 10;
  
    const headers = WINDOW_STATE.headers;
    for (let i = 0; i < headers.length; i++) {
      const header = headers[i];
      const x = header.x + dx;
      const y = header.y + dy;
    //   setPosition(header.$element, x, y);
      header.cooldown -= dt;
      if (header.cooldown <= 0) {
        createHeaderLaser($container, x, y);
        header.cooldown = HEADER_COOLDOWN;
      }
    }
    WINDOW_STATE.headers = WINDOW_STATE.headers.filter(e => !e.isDead);
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
    document.body.style.zoom = (window.innerWidth / window.outerWidth)
    inverted = false;
    const width = WINDOW_WIDTH + 50;
    const background = document.querySelector(".game-wrapper");
    console.log(width);
    if (width >= 1920){
      // background.style.backgroundImage = "url('img/background-white.png')";
      WINDOW_STATE.fullscreen = true;
    }
    else if (width == 1366){
      // background.style.backgroundImage = "url('img/background-white-1366x768.png')";
      WINDOW_STATE.fullscreen = true;
    }
    else{
      WINDOW_STATE.fullscreen == false
      document.querySelector(".congratulations").style.display = "block";
      return;
    }
  

    const $container = document.querySelector(".game");
    createRocket($container);
    createHeader($container, 'Project', 10 -2.5, 20  , 10);
    createHeader($container, 'About me', 30 -2.5, 20,  10);
    createHeader($container, 'skills', 56 -2.5, 20, 10);
    createHeader($container, 'more', 70 -2.5, 20, 10);
  }
  
  function initInvert($container,x ,y){
    inverted = true;
    const background = document.querySelector(".game-wrapper");
    const width = WINDOW_WIDTH + 50;
    console.log(width)
    if (width >= 1920){
      background.style.backgroundImage = "url('img/background-black.png')";
      WINDOW_STATE.fullscreen = true;
    }
    else if (width == 1366){
      background.style.backgroundImage = "url('img/background-black-1366x768.png')";
      WINDOW_STATE.fullscreen = true;
    }
    else{
      WINDOW_STATE.fullscreen == false
      document.querySelector(".congratulations").style.display = "block";
      return;
    }
    createRocket($container);
    createHeader($container, '2', 10 -2.5, 20 , 'img/inverted-card2.png', 17);
    createHeader($container, '1', 30 -2.5, 18 , 'img/inverted-card1.png', 23);
    createHeader($container, '3', 56 -2.5, 19.5 , 'img/inverted-card5.png', 10);
    createHeader($container, 'back', 70 -2.5, 19.5, 'img/inverted-card4.png', 10);
  }
  
  
  function rocketHasWon() {
    // return WINDOW_STATE.headers.length === 0;
  }
  
  
  function update(e) {
    const currentTime = Date.now();
    const $container = document.querySelector(".game");

    const dt = (currentTime - WINDOW_STATE.lastTime) / 1000.0;
  
    if (WINDOW_STATE.fullscreen == false) {
      destroyAll($container)
      // document.querySelector(".congratulations").style.display = "block";

      return;
    }
  
    // if (rocketHasWon()) {
    //   document.querySelector(".congratulations").style.display = "block";

    //   return;
    // }
  
    
    updateRocket(dt, $container);
    updateLasers(dt, $container);
    updateHeaders(dt, $container);
    updateheaderLasers(dt, $container);
  
    WINDOW_STATE.lastTime = currentTime;
    window.requestAnimationFrame(update);
  }
  
  function onKeyDown(e) {
    if (e.keyCode === KEY_CODE_LEFT ) {
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