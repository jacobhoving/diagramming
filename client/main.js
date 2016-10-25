import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './main.html';

var screens = ['space', 'actor', 'force', 'save'];
var num_images = [6, 6, 6];

Template.body.onCreated(function helloOnCreated() {
  Session.set({
    screen_num: -1,
    space_image: 0,
    actor_image: 0,
    force_image: 0,
  })
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
      return screens[Session.get('screen_num')];
    }
  },
  next_screen() {
    return screens[Session.get('screen_num') + 1];
  },
});

Template.body.events({
  'click .footer-next'(event, instance) {

    // Update the current screen number. Footer will update automatically because
    // screen_num is a reactive variable.
    Session.set('screen_num', Session.get('screen_num') + 1);
    var screen_name = screens[Session.get('screen_num')];

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
      console.log('Saving screenshot');
      navigator.screenshot.save(function(error,res){
        if (error) {
          console.error(error);
        } else {
          console.log('Saved screenshot', res.filePath);
        }
      });
    }

  },
});

Template.screen.helpers({
  image() {
    var screen_name = this;
    var image_num = Session.get(screen_name + '_image');
    if (image_num == 0) {
      return '';
    }
    else {
      return `<img src="/${screen_name}/${screen_name}${image_num}.png">`;
    }
  }
})
