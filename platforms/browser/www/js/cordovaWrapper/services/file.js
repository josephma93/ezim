angular.module('platformCordova')
    .service('fileApi', [
        '$q',
        '$window',
        function barcodeScanerService($q, $window) {
            var FILE_PLUGIN = $window.cordova.plugins.file,
                FORECASED_FILE_SIZE = 256000,
                DB_FILE_NAME = 'db.json',
                fileSystemObj = null;
                
            function _getFileSystem() {
                var result;
                if (fileSystemObj) {
                    result = $q.resolve(fileSystemObj);
                } else {
                    result = requestAccessToFileSystem();
                }
                
                return result;
            }
            
            function _createOrGetDbFile(fs) {
                var deferred = $q.defer();
                
                fs.root.getFile(DB_FILE_NAME, { create: true, exclusive: false }, deferred.resolve, deferred.reject);

                return deferred.promise;
            }
            
            function requestAccessToFileSystem() {
                var deferred = $q.defer();
                
                function successCb(fileSystem) {
                    deferred.resolve(fileSystemObj = fileSystem);
                }
                
                $window.requestFileSystem(LocalFileSystem.PERSISTENT, FORECASED_FILE_SIZE, successCb, deferred.reject);
                
                return deferred.promise;
            }
            
            function readDbFile() {
                
                return _getFileSystem()
                    .then(
                        _createOrGetDbFile,
                        $q.reject.bind($q)
                    )
                    .then(
                        function successCb(fileEntry) {
                            var deferred = $q.defer();
                            
                            fileEntry.file(deferred.resolve, deferred.reject);
                            
                            return deferred.promise;
                        },
                        $q.reject.bind($q)
                    )
                    .then(
                        function successCb(file) {
                            var deferred = $q.defer(),
                                reader = new FileReader();
    
                            reader.onload = function() {
                                deferred.resolve(this.result);
                            };
                            reader.onerror = function() {
                                deferred.reject(this.error);
                            };
                    
                            reader.readAsText(file);
                            
                            return deferred.promise;
                        },
                        $q.reject.bind($q)
                    );
            }
            
            function writeDbFile(newContent) {
                
                return _getFileSystem()
                    .then(
                        _createOrGetDbFile,
                        $q.reject.bind($q)
                    )
                    .then(
                        function successCb(fileEntry) {
                            var deferred = $q.defer();
                            
                            fileEntry.createWriter(deferred.resolve, deferred.reject);
                            
                            return deferred.promise;
                        },
                        $q.reject.bind($q)
                    )
                    .then(
                        function successCb(fileWriter) {
                            var deferred = $q.defer(),
                                blobToWrite = new Blob([JSON.stringify(newContent, null, 0)], { type: 'application/json' });

                            fileWriter.onerror = deferred.reject;

                            if (fileWriter.length > 0) {
                                // Overwrite file contents
                                fileWriter.truncate(0);
                                fileWriter.onwriteend = function writeEnd() {
                                    fileWriter.onwriteend = deferred.resolve;
                                    fileWriter.write(blobToWrite);
                                };
                            } else {
                                // Write for the first time
                                fileWriter.onwriteend = deferred.resolve;
                                fileWriter.write(blobToWrite);
                            }
                            
                            return deferred.promise;
                        },
                        $q.reject.bind($q)
                    );
            }
            
            this.requestAccessToFileSystem = requestAccessToFileSystem;
            this.readDbFile = readDbFile;
            this.writeDbFile = writeDbFile;
            
        }]);