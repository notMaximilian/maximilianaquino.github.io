
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