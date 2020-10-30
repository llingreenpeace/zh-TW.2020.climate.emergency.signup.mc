"use strict";

var counties = ['臺北市', '新北市', '桃園市', '臺中市', '臺南市', '高雄市'];
var countiesCode = ['tpe', 'ntpc', 'tyn', 'txg', 'tnn', 'khh'];
var nowStep = 0;
var gameStarted = false;
var readyTimer = setTimeout(function () {}, 0);
var readyToStartTimer = setTimeout(function () {}, 0);
$(document).ready(function () {
  // set game intro counties select
  for (var i = 0; i < counties.length; i++) {
    var selected = i === 0 ? 'selected' : '';
    $('#county').append("<option value=".concat(countiesCode[i], " ").concat(selected, ">").concat(counties[i], "</option>"));
  }

  $('#county').on('change', function () {
    //console.log()
    $('.select-dummy').text($('#county option:selected').text());
    $('.game__city .city').text($('#county option:selected').text());
    $('.gomap').attr('href', 'https://change.greenpeace.org.tw/2020/petition/zh-TW.2020.climate.emergency.signup.mc/events-' + $(this).val() + '.html');
  }).trigger('change'); // index to game

  $('#goGame').on('click', function (e) {
    e.preventDefault();
    changeSection('#trans', 1);
    setTimeout(function () {
      if (nowStep === 1) changeSection('#trans', 2);
    }, 3000);
  }); //changeSection('#trans', 2)
  // select stories

  $('.stories__btn').on('click', function (e) {
    e.preventDefault();
    var story = $(this).attr('data-story');
    changeSection('.game', 3);
    $('.game__intro').attr('class', 'game__intro');
    $('.game__intro').addClass('game__intro--' + story); //$('.game').attr('class', 'section game')

    $('.game').addClass('game--' + story); //$('.game__inner').removeClass('on')

    $('.game__inner--ready').removeClass('on');
    $(".game__ticker").removeClass('show');
    $('.game__inst').attr('data-story', story).show().removeClass('play');
    $('.game__intro, .game__inner--select').addClass('on');
    setGame(stories[story], false);
  });
  $('#startGame').on('click', function (e) {
    e.preventDefault();
    gameStarted = false;
    $('.game__intro').addClass('game__intro--ready');
    $('.game__inner').removeClass('on');
    $('.game__inner--ready').addClass('on');
    $('.game__intro--ready').on('keydown touchstart click', skipReady);
    $('.game__inst').addClass('play');
    setTimeout(function () {
      if (gameStarted) return;
      $('.game__inst').fadeOut(500, function () {
        $(".game__ticker").addClass('show');
      });
    }, 1800);
    readyTimer = setTimeout(function () {
      if (gameStarted) return;
      $('.game__intro').removeClass('on');
      $('.header').addClass('on');
      $('.game__intro--ready').off('keydown touchstart click', skipReady);
    }, 4500);
    readyToStartTimer = setTimeout(function () {
      if (gameStarted) return;
      startGame();
      gameStarted = true;
    }, 5000); //startGame()
  });

  function skipReady(e) {
    console.log($('.game__inner--ready').css('opacity'));
    if (Number($('.game__inner--ready').css('opacity')) < .7) return;
    gameStarted = true;
    $('.game__intro').removeClass('on');
    $('.header').addClass('on');
    clearTimeout(readyTimer);
    clearTimeout(readyToStartTimer);
    startGame();
    $('.game__intro--ready').off('keydown touchstart click', skipReady);
  } // index show more btns


  $('.showmore-btn').click(function (e) {
    e.preventDefault();
    $(this).nextAll('span').slideToggle(300);
  }); // $('.section').removeClass('on')
  // $('.section.game').addClass('on')

  $('.goretry').on('click', function (e) {
    e.preventDefault();
    gameStarted = false;
    $('.game-end').fadeOut();
    nowStep = 1;
    changeSection('#trans', 2);
    $('body').removeClass('noscroll');
  });
});

function changeSection(to, step) {
  nowStep = step;
  $('.section').removeClass('on');
  $(to).addClass('on');

  switch (step) {
    case 1:
      var bg = Math.floor(Math.random() * 3) + 1;
      var bgurl = "https://change.greenpeace.org.tw/2020/petition/zh-TW.2020.climate.emergency.signup.mc/images/bg-trans".concat(bg == 1 ? '' : '-' + bg, ".jpg");
      $('.trans').css('background-image', "url(".concat(bgurl, ")"));
      $('.trans__content').removeClass('on');
      $('.trans__content--slogan').addClass('on');
      break;

    case 2:
      $('.trans__content').removeClass('on');
      $('.trans__content--stories').addClass('on');
      $(to).one('transitionend', function () {
        if (nowStep === 3) return;
        $('.header').addClass('on');
      });
      break;

    case 3:
      $(to).removeClass('game--housewife game--retire game--salary game--parents');
      $('.header, .game__intro').addClass('on');
      $('.header').removeClass('on');
      break;
  }
}