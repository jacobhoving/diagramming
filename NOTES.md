<<<<<<< HEAD
TODO: After you start over, images are no longer draggable or rotatable. Maybe
interact.js needs to be removed and then re-added.
TODO: Filenames can't persist in camera roll. Either use some other data store that
doesn't need a server, like iCloud Drive or Dropbox or email or something. Or just
put a little label on the image. Either way, don't set the local filename if not necessary.
TODO: Fullscreen/remove top bar

    meteor add cordova:cordova-screenshot@https://github.com/gitawego/cordova-screenshot/tarball/39bc1dff938c6f31684929c9308ea995d2f813de

    meteor add cordova:cordova-plugin-save-image@0.2.3

http://blog.differential.com/debug-a-meteor-cordova-app/

An alternate approach could be to use https://github.com/devgeeks/Canvas2ImagePlugin, which can
save canvas tag directly to the camera roll. Either with the screenshotting plugin, or it's
probably possible to take our own screenshot to a canvas using pure JS.

Regarding the blocking warning:

    // "add this to the end of screenshot.m"
    // From https://github.com/gitawego/cordova-screenshot/issues/95
    - (void)myPluginMethod:(CDVInvokedUrlCommand*)command { // Check command.arguments here.
        [self.commandDelegate runInBackground:^{ NSString* payload = nil; // Some blocking logic...
            CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:payload]; // The sendPluginResult method is thread-safe.
            [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
        }];
    }

... but that warning isn't a problem so far so this isn't worth doing, and we'd need
to fork the plugin
