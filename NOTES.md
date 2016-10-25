`meteor add cordova:cordova-screenshot@https://github.com/gitawego/cordova-screenshot/tarball/39bc1dff938c6f31684929c9308ea995d2f813de`

    // From https://github.com/gitawego/cordova-screenshot/issues/95 to avoid blocking error, but doesn't seem to help
    - (void)myPluginMethod:(CDVInvokedUrlCommand*)command { // Check command.arguments here.
        [self.commandDelegate runInBackground:^{ NSString* payload = nil; // Some blocking logic...
            CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:payload]; // The sendPluginResult method is thread-safe.
            [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
        }];
    }
