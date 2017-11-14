angular.module('platformCordova', [])
    .constant('BARCODE_SCANNER_CONFIG', {
        preferFrontCamera : false, // iOS and Android
        showFlipCameraButton : true, // iOS and Android
        showTorchButton : true, // iOS and Android
        torchOn: false, // Android, launch with the torch switched on (if available)
        saveHistory: true, // Android, save scan history (default false)
        prompt : "Place a barcode inside the scan area", // Android
        resultDisplayDuration: 500, // Android, display scanned text for X ms. 0 suppresses it entirely, default 1500
        formats : "QR_CODE,PDF_417,EAN_8,EAN_13", // default: all but PDF_417 and RSS_EXPANDED
        disableAnimations : true, // iOS
        disableSuccessBeep: false // iOS
    });