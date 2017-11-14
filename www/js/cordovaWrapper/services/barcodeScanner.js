angular.module('platformCordova')
    .service('BarcodeScannerService', [
        '$q',
        '$window',
        'BARCODE_SCANNER_CONFIG',
        function barcodeScanerService($q, $window, BARCODE_SCANNER_CONFIG) {
            var BARCODE_SCANNER = $window.cordova.plugins.barcodeScanner;
            
            function scan() {
                var deferred = $q.defer();
                
                function successCb(result) {
                    deferred.resolve(result);
                }
                
                function errorCb(reason) {
                    deferred.reject(reason);
                }
                
                BARCODE_SCANNER.scan(successCb, errorCb, BARCODE_SCANNER_CONFIG);
                
                return deferred.promise;
            }
            
            this.scan = scan;
        }]);