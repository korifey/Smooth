/**
 * Created by kascode on 16.06.15.
 */

function hamburgerInit () {
  var trigger = $('#hamburger');

  trigger.click(burgerTime);

  function burgerTime() {
    if ($(this).hasClass('is-open') == true) {
      trigger.removeClass('is-open');
      trigger.addClass('is-closed');
    } else {
      trigger.removeClass('is-closed');
      trigger.addClass('is-open');
    }
  }
}

function initDash () {
  $('.dash-select a[data-target^=p]').click(function () {
    var t = $(this);
    var target = $('.' + t.data('target'));

    if (t.hasClass('active')) {
      t.removeClass('active');
      target.removeClass('active');
    } else {
      $('.panel-dash *').removeClass('active');
      t.addClass('active');
      target.addClass('active');
    }

    route_manager.clearPoints();
    route_manager.clearRoute();

    $('.close-panel').addClass('active');
  });

  $('.all-obstacles').click(function (e) {
    $.ajax('/obstacle/all', {
      method: 'POST',
      success: function (data) {
        console.log("Get all obstacles:", data);

        if (route_manager.obstacles) {
          while (route_manager.obstacles.length) {
            route_map.map.removeLayer(route_manager.obstacles[0]);
            route_manager.obstacles.splice(0, 1);
          }
        }

        route_manager.obstacles = [];

        var lines = data.split('\n');
        for (var i = 0; i < lines.length - 1; i++) {
          var line = lines[i];
          console.log("line " + i, line);
          route_manager.obstacles[i] = L.marker({lat: parseFloat(line.split(' ')[2]), lng: line.split(' ')[1]}, {
            icon: route_manager.obstacleIcon,
            draggable: false
          });
          route_manager.obstacles[i].addTo(route_map.map);
        }

      }
    });
  });

  $('.close-panel').click(function () {
    $(this).removeClass('active');
    $('.panel.active form')[0].reset();
    $('.panel.active').removeClass('active');
    $('.dash-select a').removeClass('active');
    $('.panel-obstacle form > [class^=step]').hide();
    $('.panel-obstacle form > .step1').show();
    $('.close-panel.active').removeClass('active');

    route_manager.currentState = null;
  });

  $('.add-obstacle').click(function () {
    route_manager.clearRoute();
    route_manager.clearPoints();

    route_manager.currentState = 'obstacle';

    var center = route_map.map.getCenter();

    Obstacle.set(center.lat, center.lng);
    Obstacle.try(center.lat, center.lng)
      .then(function (data) {
        console.log("TRY data\n", data);
        route_manager.clearRoute();
        route_manager.parseRouteData(data);
        route_manager.displayLines('#ff3333');
      });
  });

  $('.obstacle-confirm').click(function (e) {
    var parentStep = $(this).parents('[class^=step]');
    parentStep.hide();
    parentStep.siblings('.step2').show();
    e.preventDefault();
  });

  $('.button-file input').change(function () {
    console.log("file input change");
    if ($(this).val() !== '') {
      var parentStep = $(this).parents('[class^=step]');
      parentStep.hide();
      parentStep.siblings('.step3').show();
    }
  });

  $('.send-obstacle').click(function (e) {
    $('.obstacle-form').submit();
    route_manager.currentState = null;
    var parentStep = $(this).parents('[class^=step]');
    parentStep.hide();
    $('.close-panel').removeClass('active');
    $('.panel').removeClass('active');
    e.preventDefault();
  });

  $('.obstacle-form').submit(function (e) {
    if ($('.obstacle-form input[type=file]').val() !== '') {
      var sendData = new FormData(document.querySelector('.obstacle-form'));

      $.ajax('/obstacle/add?' + $(this).find('input[name=lng]').val() + '&' + $(this).find('input[name=lat]').val(), {
        method: 'POST',
        success: function (data) {
          console.log('/obstacle/add?' + $(this).find('input[name=lng]').val() + '&'
            + $(this).find('input[name=lat]').val() + "\nObstacle add response:", data);
        }
      });

      //var sendReq = new XMLHttpRequest();
      //sendReq.open("POST", "/obstacle", true);
      //sendReq.onload = function (e) {
      //  if (sendReq.status == 200) {
      //    console.log("success", JSON.parse(sendReq.responseText));
      //    $('.obstacle-form')[0].reset();
      //    $('.step3').hide();
      //    $('.step1').show();
      //    $('.panel-obstacle').removeClass('active');
      //    $('.add-obstacle').removeClass('active');
      //    route_manager.clearPoints();
      //  } else {
      //    console.log("error");
      //  }
      //};
      //
      //sendReq.send(sendData);
    }


    e.preventDefault();
  });

  $('.route-form').submit(function (e) {
    e.preventDefault();
  });

  $('.route-address-confirm').click(function () {
    var t = $(this);
    var input = t.siblings('input');

    if (input.val().length > 0) {
      route_map.getCoordsByAddress(input.val())
        .then(function (response) {
          route_map.placeRoutePin({lat: response.lat, lng: response.lng}, input.data('point-type'));
          input.val(response.address);
          t.addClass('set').removeClass('error');
        }, function () {
          t.addClass('error').removeClass('set');
        });
    }
  });

  $('.calculate-route').click(function (e) {
    var $t = $(this);
    var $form = $t.parents('form');

    $form.find('input').each(parseUserInput);
  });
}

function parseUserInput (index, el) {
  $input = $(el);
  var input_type = $input.data('point-type');
  if ($input.val().length > 0) {
    console.log("Point type:", input_type);
    route_map.getCoordsByAddress($input.val())
      .then(function (response) {
        console.log("Point type:", input_type);
        route_map.placeRoutePin({lat: response.lat, lng: response.lng}, input_type);
        //$input.val(response.address);
        //t.addClass('set').removeClass('error');
      }, function () {
        //t.addClass('error').removeClass('set');
      });
  } else {
    route_manager.clearPoints();
    route_manager.clearRoute();
    alert('Не заполнено поле адреса');
  }
}

function setObstacle (coords) {

}

$(function () {
  $('.toggle').click(function () {
    $(this).siblings('.toggle-content').toggle();
  });

  $('.to-routing').click(function hideIntroPanels () {
    $('.intro').hide(250);
  });

  $('.help-development').click(function showHowToHelp() {
    $('.intro__left, .intro__right').hide(250);
    $('.intro__full').show(250);
  });

  $('.shadow').click(function hideOverlayedLayer() {
    $(this).parent().hide();
  });

  $('.open-osm-form').click(function () {
    $('.osm-form').toggle();
  });

  $('.osm-form__submit').click(function (e) {
    var $input = $('#osm-login');
    if ($input.val().length > 0) {
      $.ajax('/contributor', {
        method: 'POST',
        data: {
          username: $input.val()
        },
        success: function (res) {
          res = JSON.parse(res);
          console.log("res", res, res.status);
          if (res.status === 'OK') {
            $input.hide();
            $('.osm-form__submit').text('Спасибо! Мы вас запомнили :)');
            setTimeout(function () {
              $('.osm-form__submit').hide();
            }, 2000);
          }
        }
      });
    }
    e.preventDefault();
  })
});

