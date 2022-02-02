const KEY_CODE_LEFT = 65;
const KEY_CODE_RIGHT = 68;
const KEY_CODE_SPACE = 32;

const GAME_WIDTH = window.innerWidth;;
const GAME_HEIGHT = window.innerHeight;

const PLAYER_WIDTH = 20;
const PLAYER_MAX_SPEED = 600.0;
const LASER_MAX_SPEED = 600.0;
const LASER_COOLDOWN = 0.5;

const ENEMIES_PER_ROW = 10;
const ENEMY_HORIZONTAL_PADDING = 80;
const ENEMY_VERTICAL_PADDING = 70;
const ENEMY_VERTICAL_SPACING = 80;
const ENEMY_COOLDOWN = 5.0;

const GAME_STATE = {
    lastTime: Date.now(),
    leftPressed: false,
    rightPressed: false,
    spacePressed: false,
    playerX: 0,
    playerY: 0,
    playerCooldown: 0,
    lasers: [],
    enemies: [],
    enemyLasers: [],
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
        }, 2300)
    })
 })