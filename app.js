/*global angular, self, Blob, URL, Worker, XMLHttpRequest, console*/
var app = angular.module('core', []);

app.controller('sampleController', ['$scope', '$http', '$timeout', '$window', function ($scope, $http, $timeout, $window) {
    'use strict';
    
    $scope.load = function (useWebWorkers) {
        var i = 0, item, worker;
        
        $scope.items = [];
        
        for (i = 0; i < 6; i += 1) {
            $scope.items.push({message: 'Loading data...'});
        }
        
        function requester() {
            self.addEventListener('message', function (e) {
                
                var xhr = new XMLHttpRequest();
                
                console.log(xhr);
                
                xhr.open('POST', 'http://localhost:8080/slowXHR', true);
                xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
                
                xhr.onreadystatechange = function () {
                    if (xhr.readyState == 4) {
                        self.postMessage(JSON.parse(xhr.responseText).id);
                    }
                }
                
                var obj = {};
                obj.id = e.data;
                
                xhr.send(JSON.stringify(obj));
                
            });
        }
        
        if (useWebWorkers) {
            // create worker
            var blobWorker = new Blob(['(', requester.toString(), ')()'], { type: 'application/javascript' }),
                urlWorker = URL.createObjectURL(blobWorker);
            
            console.log('Creating web worker [' + requester.name + ']...');
            
            worker = new Worker(urlWorker);
            
            worker.addEventListener('message', function (e) {
                console.log(e.data);
                
                $timeout(function () {
                    $scope.items[parseInt(e.data)].message = 'Loaded.';
                });
            }, false);
            
            for (i = 0; i < $scope.items.length; i += 1) {
                worker.postMessage(i);
            }
            
        } else {
            for (i = 0; i < $scope.items.length; i += 1) {
                
                $http.post('http://localhost:8080/slowHTTP', { id: i }).success(function (result) {
                    $scope.items[result.id].message = 'Loaded.';
                });
            }
        }
    };
    
    $scope.fireRequest = function () {
        $scope.output = 'Max connections reached. Waiting for processing...';
        
        $http.get('http://localhost:8080/quick').success(function () {
            $scope.output = 'Processed!';
        });
    };
}]);