angular.module('starter.controllers', [])

.controller('LoginCtrl', function ($scope, $rootScope, $location, $ionicLoading,
                                   $http, appUtils, appConfig, gcmService, $ionicPopup) {

    // Set text and init some data
    $scope.loginData = {
        username: "",
        password: "",
        hasError: false,
        errorText: $rootScope.getLocaleText('Login.AccountRequired')
    };
    $rootScope.notLoggedIn = true;

    // Execute service to get GCM registration ID
    var _gcmService = new gcmService($scope);
    _gcmService.initialize(function () {
        //alert('Init done');
    });

    var __loginFn = function () {
        $scope.hasError = false;
        if (typeof $scope.loginData.username == 'undefined' ||
            $scope.loginData.username.length == 0) {
            $scope.loginData.errorText =  $rootScope.getLocaleText('Login.UserNameRequired');
            $scope.hasError = true;
            return;
        }
        if (typeof $scope.loginData.password == 'undefined' ||
            $scope.loginData.password.length == 0) {
            $scope.loginData.errorText =  $rootScope.getLocaleText('Login.PasswordRequired');
            $scope.hasError = true;
            return;
        }
        if (!checkMail($scope.loginData.username)) {
            $scope.loginData.errorText =  $rootScope.getLocaleText('Login.ErrorEmail');
            $scope.hasError = true;
            return;
        }
        appUtils.callPostRemoteMethod('api/v1/Authenticate',
            {
                Name: $scope.loginData.username,
                Password: $scope.loginData.password,
                GcsRegistrationId: $rootScope.gcsRegistrationId
            },
            function (data) {
                if (angular.isObject(data.Data)) {
                    $rootScope.accessToken = data.Data.Token;
                    $rootScope.notLoggedIn = false;
                    $rootScope.loginName = data.Data.DisplayName;
                    $location.path("/tab/dash");
                } else {
                    $scope.loginData.errorText =  $rootScope.getLocaleText('Login.InvalidAccount');
                    $scope.hasError = true;
                }
            },
            function () {
                $scope.hasError = true;
            }, appConfig.authorizedInProgressMessage);
    };
    var checkMail = function (email){
        var regexEmail = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
        return regexEmail.test(email);
    }
    $scope.login = function () {

        if (!_gcmService.enableLogin()) {
            $ionicPopup.confirm({
                title: appConfig.gcmTexts.commonTitle,
                template: appConfig.gcmTexts.inProgress,
                okText: appConfig.okButtonText,
                cancelText: appConfig.cancelText
            }).then(function (result) {
                if (result) {
                    __loginFn();
                }
            });
            return;
        }

        __loginFn();
    };
})

.controller('LogoutCtrl', function ($scope, $rootScope, $location, $ionicViewService,
    $ionicLoading, $http, appUtils, appConfig) {
    appUtils.callPostRemoteMethod('api/v1/SignOut',
        {
            Token: $rootScope.accessToken,
            GcsRegistrationId: $rootScope.gcsRegistrationId
        },
        function (data) {
            if (angular.isObject(data.Data)) {
                $rootScope.accessToken = null;
                $ionicViewService.nextViewOptions({ disableBack: true });
                $location.path("/login");
            } else {
                $scope.hasError = true;
            }
        },
        function () {
            $scope.hasError = true;
        }, appConfig.signOutInProgressMessage);

})

.controller('HomeCtrl', function ($scope, HomeService) {
    $scope.summaryData = HomeService.all();
})

.controller('GroupsCtrl', function ($scope, $stateParams, GroupService) {
    $scope.groups = GroupService.all();
})

.controller('GroupDetailCtrl', function ($scope, $stateParams, GroupService) {
    $scope.groups = GroupService.get($stateParams.groupId);
})

.controller('GroupMembersCtrl', function ($scope, $stateParams, GroupService) {
    $scope.members = GroupService.members($stateParams.groupId);
})

.controller('GroupMemberCtrl', function ($scope, $stateParams, GroupService) {
    $scope.member = GroupService.member($stateParams.groupId, $stateParams.memberId);
})

.controller('TasksCtrl', function ($scope, $stateParams, TaskService) {
    $scope.tasks = TaskService.all($stateParams.type, $stateParams.groupId, $stateParams.memberId);
})

.controller('TaskDetailCtrl', function ($scope, $stateParams, TaskService) {
    $scope.task = TaskService.get($stateParams.taskId);
})

.controller('EventsCtrl', function ($scope, $stateParams, EventService) {
    $scope.events = EventService.all($stateParams.days);
})

.controller('EventDetailCtrl', function ($scope, $stateParams, EventService) {
    $scope.event = EventService.get($stateParams.eventId);
})

.controller('AlertsCtrl', function ($scope, $stateParams, AlertService, $timeout, $location) {
    var days = $stateParams.days;
    if (days > 0) {
        $scope.Title = 'Thông báo (trong ' + days + ' ngày)';
    } else {
        $scope.Title = 'Thông báo';
        days = 365;
    }
    $scope.Alerts = [];

    var buildItem = function (item) {
        return {
            user: item.ActorName,
            avatar: item.AvatarUrl,
            title: item.Text,
            target: item.ObjectName,
            time: item.CreatedOn,
            days: item.Days,
            objectType: item.ObjectType,
            objectId: item.ObjectId,
            link: item.ObjectType == 1 ? ('task/' + item.ObjectId) : ('event/' + item.ObjectId)
        };
    };
    $scope.moreDataCanBeLoaded = true;
    $scope.emptyResult = false;
    var page = 1;
    $scope.getItemHeight = function (item, index) {
        //Make evenly indexed items be 10px taller, for the sake of example
        return (index % 2) === 0 ? 50 : 55;
    };
    $scope.loadMore = function () {
        console.log("load more");
        $timeout(function () {
            AlertService.getNotification(days, page, function (actionResult) {
                for (var idx in actionResult) {
                    $scope.Alerts.push(buildItem(actionResult[idx]));
                }
                $scope.moreDataCanBeLoaded = actionResult.length != 0;
                $scope.emptyResult = actionResult.length == 0 && page == 1;
                page = page + 1;
                $scope.$broadcast('scroll.infiniteScrollComplete');
            });
        }, 1000);
    };
});