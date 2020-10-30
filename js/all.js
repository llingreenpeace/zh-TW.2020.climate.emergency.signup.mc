// menu control
$('.menu-btn, .nav__cover').on('click', function(e){
  e.preventDefault()
  $('.nav').toggleClass('on')
})