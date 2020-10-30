"use strict";

var countiesEvent = ['臺北市', '新北市', '桃園市', '臺中市', '臺南市', '高雄市'];
var countiesEventCode = ['tpe', 'ntpc', 'tyn', 'txg', 'tnn', 'khh'];
$(document).ready(function () {
  var url = location.href;
  var nowCounty = url.substring(url.indexOf('events-') + 7, url.indexOf('.html'));

  for (var i = 0; i < countiesEvent.length; i++) {
    var selected = countiesEventCode[i] == nowCounty ? 'selected' : '';
    $('#county').append("<option value=".concat(countiesEventCode[i], " ").concat(selected, ">").concat(countiesEvent[i], "</option>"));
  }

  $('#county').on('change', function () {
    //console.log()
    $('.select-dummy').text($('#county option:selected').text());
    $('.game__city .city').text($('#county option:selected').text());
    if ($(this).val() != nowCounty) location.href = 'https://change.greenpeace.org.tw/2020/petition/zh-TW.2020.climate.emergency.signup.mc/events-' + $(this).val() + '.html';
  }).trigger('change');
  var eventsSlider = new Swiper('.events-slider .swiper-container', {
    loop: true,
    slidesPerView: 1,
    spaceBetween: 30,
    navigation: {
      prevEl: '.swiper-button-prev',
      nextEl: '.swiper-button-next'
    },
    breakpoints: {
      780: {
        slidesPerView: 3
      }
    }
  }); // gotop

  $(".hash-top").click(function (e) {
    e.preventDefault();
    $('body, html').animate({
      scrollTop: 0
    }, 500);
  });
  $(window).scroll(function () {
    if ($(this).scrollTop() > 240) {
      $(".hash-top").fadeIn();
    } else {
      $(".hash-top").fadeOut();
    }
  });
  $('.gotop').on('click', function (e) {
    e.preventDefault();
    $('html,body').animate({
      scrollTop: 0
    }, 500);
  });
  $(window).on('scroll', function (e) {
    var scrollTop = $(window).scrollTop();
    $('.gotop').toggleClass('show', scrollTop > 300);

    if (scrollTop + $(window).height() * .8 >= $('.footer').offset().top + $('.footer').outerHeight()) {
      $('.gotop').removeClass('fixed');
    } else {
      $('.gotop').addClass('fixed');
    }
  }).trigger('scroll');
});