import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './main.html';

var screens = ['space', 'actor', 'force', 'save'];
var num_images = [66, 66, 66];

function start_over() {
  Session.set({
    screen_num: -1,
    space_image: 0,
    actor_image: 0,
    force_image: 0,
    title: ''
  });
  $('.screen').hide();
}

function get_screen_name() {
  return screens[Session.get('screen_num')];
}

Template.body.onCreated(function helloOnCreated() {
  start_over();
});

Template.body.helpers({
  screens() {
    return screens;
  },
  current_screen() {
    if (Session.get('screen_num') == -1) {
      return '';
    }
    else {
      return get_screen_name();
    }
  },
  next_screen() {
    return screens[Session.get('screen_num') + 1];
  },
  footer() {
    if (get_screen_name() == 'save') {
      return false;
    }
    else {
      return true;
    }
  },
  save() {
    if (get_screen_name() == 'save') {
      return true;
    }
    else {
      return false;
    }
  },
  title() {
    return Session.get('title');
  }
});

Template.body.events({
  'click .footer-next'(event, instance) {

    // Update the current screen number. Footer will update automatically because
    // screen_num is a reactive variable.
    Session.set('screen_num', Session.get('screen_num') + 1);
    var screen_name = get_screen_name();
    console.log(screen_name);

    if (screen_name == 'save') {
      save_screenshot();
    }
    else {
      spawn_image();
    }

    // Show the new screen
    $(`.${screen_name}`).show();

    function spawn_image() {
      // Set a random image for this screen
      var max_image = num_images[Session.get('screen_num')];
      Session.set(screen_name + '_image', Math.floor(Math.random() * max_image) + 1);

      // Remove any previous interactables
      interact('.screen').unset();

      // Make it draggable
      interact(`.${screen_name}`)
        .draggable({
          // enable inertial throwing
          inertia: true,
          // call this function on every dragmove event
          onmove: dragMoveListener,
          // call this function on every dragend event
          onend: function (event) { }
        });

      function dragMoveListener (event) {
        var target = $(event.target).find('.translate');
        var x = parseFloat(target.data('x') || 0) + event.dx;
        var y = parseFloat(target.data('y') || 0) + event.dy;

        // translate the element
        var transform = 'translate(' + x + 'px, ' + y + 'px)';
        target.css({webkitTransform: transform, transform: transform});

        // update the posiion attributes
        target.data({x: x, y: y});
      }

      window.dragMoveListener = dragMoveListener;

      // Make it rotatable
      interact(`.${screen_name}`).gesturable({
        onmove: function (event) {
          var target = $(`.${screen_name}`).find('.rotate');
          var angle = parseFloat(target.data('angle') || 0) + event.da;

          var transform = 'rotate(' + angle + 'deg)';
          target.css({webkitTransform: transform, transform: transform});

          target.data('angle', angle);
        }
      });
    }

    function save_screenshot() {
      Session.set('title', window.prompt("Title", "diagram"));
      setTimeout(function() {
        if (navigator && navigator.screenshot) {
          console.log('Saving screenshot');
          navigator.screenshot.save(function(error, res){
            if (error) {
              console.error("Couldn't save screenshot", error);
            } else {
              console.log('Saved screenshot', res.filePath);
              window.cordova.plugins.imagesaver.saveImageToGallery(res.filePath, function() {
                console.log('Saved to camera roll');
                start_over();
              }, function(error) {
                console.log("Couldn't save to camera roll", error);
                start_over();
              });
            }
          }, 'jpg', 100); // jpeg 100% quality        }
        }
        else {
          console.log('No screenshotting available');
          start_over();
        }
      }, 1000); // 1 second delay before taking screenshot
    }

  },
});

Template.screen.helpers({
  image() {
    var screen_name = this;
    var image_num = Session.get(screen_name + '_image');
    if (image_num == 0 || screen_name == 'save') {
      return '';
    }
    else {
      return `<img src="/${screen_name}/${screen_name}${image_num}.png">`;
    }
  }
});
