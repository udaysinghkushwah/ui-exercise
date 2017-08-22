var uiApp = angular.module('uiApp', ['ui.router', '720kb.datepicker']);

uiApp.config(function($stateProvider, $urlRouterProvider) {
    $stateProvider.
    state('home', {
        url: '/home',
        templateUrl: 'partials/home.html',
        controller: 'HomeCtrl'
    })
    $urlRouterProvider.otherwise("/home");
});


uiApp.controller('HomeCtrl', function($scope, dataService) {
    $scope.title = 'Home Page';

    $scope.filterDimension = {
        assetType: [],
        venueType: [],
        propertyState: []
    }
    $scope.realEstateData = [];
    dataService.realEstateData().then(function(response) {
        $scope.realEstateData = response.data.calendar.calendar_list;
        var parseData = {
            assetType: [],
            propertyState: [],
            venueType: []
        };
        for (var index = 0; index < $scope.realEstateData.length; index++) {
            var assetType = $scope.realEstateData[index]['asset_label'];
            var propertyState = $scope.realEstateData[index]['property_state'];
            var venueType = $scope.realEstateData[index]['event_type'];
            parseData.assetType[assetType] = assetType;
            parseData.propertyState[propertyState] = propertyState;
            parseData.venueType[venueType] = venueType;
        }
        for (var data in parseData.assetType) {
            $scope.filterDimension.assetType.push(data);
        }
        for (var data in parseData.propertyState) {
            $scope.filterDimension.propertyState.push(data);
        }
        for (var data in parseData.venueType) {
            $scope.filterDimension.venueType.push(data);
        }

    });
});

uiApp.factory('dataService', function($http) {
    var _realEstateData = function() {
        return $http.get('data/calendar.json')
            .success(function(data) {
                return data;
            })
            .error(function(error) {
                return error
            });

    }
    return {
        realEstateData: _realEstateData
    };

});

uiApp.filter('formatDate', function($filter) {
    return function(myDate) {
        var formatDate = '';
        if (typeof myDate === 'undefined') {
            return myDate;
        }
        var dates = myDate.split(",");
        var datesHold = [];
        for (var index = 0; index < dates.length; index++) {
            var tempDateFormat = $filter('date')(dates[index], 'MMM-dd');

            if (datesHold[tempDateFormat]) {
                continue;
            } else if (!datesHold[tempDateFormat]) {
                if (formatDate != '')
                    formatDate += ' and ';
                datesHold[tempDateFormat] = tempDateFormat;
                formatDate += tempDateFormat;
            }
        }
        return formatDate;
    };
});

uiApp.filter('myDateFormat', function($filter) {
    return function(myDate) {
        if (typeof myDate === 'undefined') {
            return myDate;
        }
        var dateTokens = myDate.split("-");
        var month = parseInt(dateTokens[0]) - 1;
        var day = parseInt(dateTokens[1]);
        var year = parseInt(dateTokens[2]);
        var jsDate = new Date(year, month, day, 0, 0, 0, 0);
        return $filter('date')(jsDate.getTime(), 'yyyy-MM-dd');
    };
});