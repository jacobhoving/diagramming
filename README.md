Initial configuration:

    meteor install-sdk ios
    meteor add-platform ios
    meteor add cordova:cordova-screenshot@https://github.com/gitawego/cordova-screenshot/tarball/39bc1dff938c6f31684929c9308ea995d2f813de
    meteor add cordova:cordova-plugin-save-image@0.2.3

Open in Xcode so you can deploy to device:

    meteor reset
    meteor run ios-device
    In Xcode, select your Personal Team from TARGETS --> Signing (while the top-level project is selected)
    Plug the phone in, select it from the dropdown in upper left, and press play
    If you get a trust error, on the phone go to Settings --> General --> Device Management and trust yourself, then run again

Open in Simulator (doesn't always work):

    meteor reset
    meteor run ios

TODO: Fullscreen/remove top bar



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
