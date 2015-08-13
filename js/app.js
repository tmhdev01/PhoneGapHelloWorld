// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js

var appVersion = "0.0.0";
angular.module('starter', ['ionic', 'ngCordova', 'starter.controllers', 'starter.services'])

.run(function ($ionicPlatform, $rootScope, $location, appConfig) {
    $ionicPlatform.ready(function () {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova) {
            if (window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            }
            cordova.getAppVersion(function (version) {
                appVersion = version;
            });
        }
        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleDefault();
        }


    });

    $rootScope.location = $location;
    $rootScope.accessToken = null;
    $rootScope.loginName = "";
    $rootScope.gcsRegistrationId = "";
    $rootScope.errorMessageText = "";

    $rootScope.getLocaleText = function (key) {
        return appConfig.localeTexts[appConfig.defaultLangCode][key];
    }

    // register listener to watch route changes
    $rootScope.$on("$stateChangeStart", function (e, toState, toParams, fromState, fromParams) {
        if ($rootScope.accessToken == null || $rootScope.accessToken === '') {
            // no logged user, we should be going to #login
            if (toState.name == "login") {
                // already going to #login, no redirect needed
            } else {
                // not going to #login, we should redirect now
                $location.path("/login");
            }
        }
    });

})
.config(function ($stateProvider, $urlRouterProvider, $locationProvider) {

    // Ionic uses AngularUI Router which uses the concept of states
    // Learn more here: https://github.com/angular-ui/ui-router
    // Set up the various states which the app can be in.
    // Each state's controller can be found in controllers.js
    $stateProvider

    .state('login', {
        url: "/login",
        templateUrl: "templates/login.html",
        controller: 'LoginCtrl'
    })
    .state('logout', {
        url: "/logout",
        controller: 'LogoutCtrl'
    })

    // setup an abstract state for the tabs directive
    .state('tab', {
        url: "/tab",
        abstract: true,
        templateUrl: "templates/tabs.html"
    })


    // Each tab has its own nav history stack:
    .state('tab.home', {
        url: '/home',
        views: {
            'tab-home': {
                templateUrl: 'templates/tab-home.html',
                controller: 'HomeCtrl'
            }
        }
    })
                .state('tab.home.tasks', {
                    url: '/tasks/:type',
                    views: {
                        'tab-home@tab': {
                            templateUrl: 'templates/tab-tasks.html',
                            controller: 'TasksCtrl'
                        }
                    }
                })
                    .state('tab.home.tasks.detail', {
                        url: '/task/:taskId',
                        views: {
                            'tab-home@tab': {
                                templateUrl: 'templates/task-detail.html',
                                controller: 'TaskDetailCtrl'
                            }
                        }
                    })
                .state('tab.home.events', {
                    url: '/events/:days',
                    views: {
                        'tab-home@tab': {
                            templateUrl: 'templates/tab-events.html',
                            controller: 'EventsCtrl'
                        }
                    }
                })
                    .state('tab.home.events.detail', {
                        url: '/event/:eventId',
                        views: {
                            'tab-home@tab': {
                                templateUrl: 'templates/event-detail.html',
                                controller: 'EventDetailCtrl'
                            }
                        }
                    })
                .state('tab.home.alerts', {
                    url: '/alerts/:days',
                    views: {
                        'tab-home@tab': {
                            templateUrl: 'templates/tab-alerts.html',
                            controller: 'AlertsCtrl'
                        }
                    }
                })
                    .state('tab.home.alerts.task-detail', {
                        url: '/task/:taskId',
                        views: {
                            'tab-home@tab': {
                                templateUrl: 'templates/task-detail.html',
                                controller: 'TaskDetailCtrl'
                            }
                        }
                    })
                    .state('tab.home.alerts.event-detail', {
                        url: '/event/:eventId',
                        views: {
                            'tab-home@tab': {
                                templateUrl: 'templates/event-detail.html',
                                controller: 'EventDetailCtrl'
                            }
                        }
                    })
                .state('tab.home.group', {
                    url: '/group/:groupId',
                    views: {
                        'tab-home@tab': {
                            templateUrl: 'templates/tab-groups.html',
                            controller: 'GroupDetailCtrl'
                        }
                    }
                })
                    .state('tab.home.group.members', {
                        url: '/members/:groupId2',
                        views: {
                            'tab-home@tab': {
                                templateUrl: 'templates/group-members.html',
                                controller: 'GroupMembersCtrl'
                            }
                        }
                    })
                        .state('tab.home.group.members.detail', {
                            url: '/member/:memberId',
                            views: {
                                'tab-home@tab': {
                                    templateUrl: 'templates/group-member.html',
                                    controller: 'GroupMemberCtrl'
                                }
                            }
                        })
                            .state('tab.home.group.members.detail.tasks', {
                                url: '/tasks/:type',
                                views: {
                                    'tab-home@tab': {
                                        templateUrl: 'templates/tab-tasks.html',
                                        controller: 'TasksCtrl'
                                    }
                                }
                            })
                                .state('tab.home.group.members.detail.tasks.detail', {
                                    url: '/task/:taskId',
                                    views: {
                                        'tab-home@tab': {
                                            templateUrl: 'templates/task-detail.html',
                                            controller: 'TaskDetailCtrl'
                                        }
                                    }
                                })
                    .state('tab.home.group.tasks', {
                        url: '/tasks/:groupId2/:type',
                        views: {
                            'tab-home@tab': {
                                templateUrl: 'templates/tab-tasks.html',
                                controller: 'TasksCtrl'
                            }
                        }
                    })
                        .state('tab.home.group.tasks.detail', {
                            url: '/task/:taskId',
                            views: {
                                'tab-home@tab': {
                                    templateUrl: 'templates/task-detail.html',
                                    controller: 'TaskDetailCtrl'
                                }
                            }
                        })


            .state('tab.groups', {
                url: '/groups',
                views: {
                    'tab-groups@tab': {
                        templateUrl: 'templates/tab-groups.html',
                        controller: 'GroupsCtrl'
                    }
                }
            })
    .state('tab.groups.members', {
                    url: '/members/:groupId',
        views: {
            'tab-groups@tab': {
                templateUrl: 'templates/group-members.html',
                controller: 'GroupMembersCtrl'
            }
        }
    })
    .state('tab.groups.members.detail', {
                        url: '/member/:memberId',
        views: {
            'tab-groups@tab': {
                templateUrl: 'templates/group-member.html',
                controller: 'GroupMemberCtrl'
            }
        }
    })
    .state('tab.groups.members.detail.tasks', {
        url: '/tasks/:type',
        views: {
            'tab-groups@tab': {
                templateUrl: 'templates/tab-tasks.html',
                controller: 'TasksCtrl'
            }
        }
    })
                            .state('tab.groups.members.detail.tasks.detail', {
                                url: '/task/:taskId',
                                views: {
                                    'tab-groups@tab': {
                                        templateUrl: 'templates/task-detail.html',
                                        controller: 'TaskDetailCtrl'
                                    }
                                }
                            })
    .state('tab.groups.tasks', {
                    url: '/tasks/:groupId/:type',
        views: {
            'tab-groups@tab': {
                templateUrl: 'templates/tab-tasks.html',
                controller: 'TasksCtrl'
            }
        }
    })
                    .state('tab.groups.tasks.detail', {
                        url: '/task/:taskId',
                        views: {
                            'tab-groups@tab': {
                                templateUrl: 'templates/task-detail.html',
                                controller: 'TaskDetailCtrl'
                            }
                        }
                    })


    .state('tab.tasks', {
        url: '/tasks',
        views: {
            'tab-tasks': {
                templateUrl: 'templates/tab-tasks.html',
                controller: 'TasksCtrl'
            }
        }
    })
    .state('tab.tasks.detail', {
        url: '/task/:taskId',
        views: {
            'tab-tasks@tab': {
                templateUrl: 'templates/task-detail.html',
                controller: 'TaskDetailCtrl'
            }
        }
    })


    .state('tab.events', {
        url: '/events/:days',
        views: {
            'tab-events': {
                templateUrl: 'templates/tab-events.html',
                controller: 'EventsCtrl'
            }
        }
    })
     .state('tab.events.detail', {
         url: '/event/:eventId',
         views: {
             'tab-events@tab': {
                 templateUrl: 'templates/event-detail.html',
                 controller: 'EventDetailCtrl'
             }
         }
     })


    .state('tab.alerts', {
        url: '/alerts/:days',
        views: {
            'tab-alerts': {
                templateUrl: 'templates/tab-alerts.html',
                controller: 'AlertsCtrl'
            }
        }
    })
                .state('tab.alerts.task-detail', {
                    url: '/task/:taskId',
                    views: {
                        'tab-alerts@tab': {
                            templateUrl: 'templates/task-detail.html',
                            controller: 'TaskDetailCtrl'
                        }
                    }
                })
                .state('tab.alerts.event-detail', {
                    url: '/event/:eventId',
                    views: {
                        'tab-alerts@tab': {
                            templateUrl: 'templates/event-detail.html',
                            controller: 'EventDetailCtrl'
                        }
                    }
                });

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/tab/home');

})

.provider('appConfig', function () {
    var configs = {
        apiUrl: 'http://api.local.tasks/',
        isInternetRemoteService: false,
        avatarPath: '/img/avatars/',
        greetingMessage: 'Welcome to DynaTask mobile version 1.0',
        loadingText: 'Đang thực thi chức năng....',
        authorizedInProgressMessage: 'Đang xác thực tài khoản...',
        signOutInProgressMessage: 'Đang thoát khỏi hệ thống...',
        defaultLangCode: 'vi-VN',
        googleProjectId: 'core-folio-816',
        googleProjectNumber: '139847032100',
        gcmTexts: {
            regExTitle: 'GCM - Lỗi giao tiếp với hệ thống đăng ký',
            regErrTitle: 'GCM - Lỗi đăng ký thiết bị',
            detail: 'Chi tiết: ',
            callbackFailed: 'Không thể kết nối tới server. Chi tiết: ',
            notRetrieve: 'Chưa truy vấn',
            inProgress: 'Đang kết nối tới dịch vụ GCM.... Bạn có muốn huỷ kết nối và tiếp tục?',
            commonTitle: 'Thông báo'
        },
        okButtonText: 'Đồng ý',
        cancelText: 'Không',
        localeTexts: {
            'vi-VN': {
                'Login.HeaderText': 'Đăng nhập',
                'Login.AccountRequired': 'Bạn vui lòng nhập thông tin.',
                'Login.UserNameRequired': 'Bạn vui lòng nhập tên đăng nhập',
                'Login.PasswordRequired': 'Bạn vui lòng nhập mật khẩu',
                'Login.InvalidAccount': 'Tài khoản không hợp lệ. Tên đăng nhập hoặc Mật khẩu không đúng',
                'Login.ErrorEmail': 'Email không hợp lệ',
                'Login.Initialize': 'Đang khởi động chức năng....',
                'Login.Layout.Name': 'Tên đăng nhập',
                'Login.Layout.Password': 'Mật khẩu',
                'Login.Layout.LoginButton': 'Đăng nhập',
                'Common.NoResultMessage': 'Không có dữ nào được tìm thấy',
                'DatetimeFormat': 'dd/MM/yyyy hh:mm',
                'DateFormat': 'dd/MM/yyyy',
                'Task.SearchBy.Proposed': 'Công việc (đang chờ duyệt)',
                'Task.SearchBy.Created': 'Công việc (đang chờ xác nhận thực hiện)',
                'Task.SearchBy.Accepted': 'Công việc (đang thực hiện)',
                'Task.SearchBy.Implemented': 'Công việc (đang chờ xác nhận hoàn thành)',
                'Task.SearchBy.Overdue': 'Công việc (quá hạn và chưa hoàn thành)',
                'Task.SearchBy.Verified7': 'Công việc (hoàn thành trong 7 ngày qua)',
                'Task.SearchBy.Verified30': 'Công việc (hoàn thành trong 30 ngày qua)',
                'Task.SearchBy.Default': 'Công việc'
            },
            'en-US': {
                'Login.HeaderText': 'Login',
                'Login.AccountRequired': 'Email and Password is Required.',
                'Login.UserNameRequired': 'Email is Required',
                'Login.PasswordRequired': 'Password is Required',
                'Login.InvalidAccount': 'Invalid name or password.',
                'Login.ErrorEmail': 'Email is invalid',
                'Login.Initialize': 'Initializing ....',
                'Login.Layout.Name': 'User name',
                'Login.Layout.Password': 'Password',
                'Login.Layout.LoginButton': 'Login',
                'Common.NoResultMessage': 'No data found',
                'DatetimeFormat': 'MM/dd/yyyy hh:mm',
                'DateFormat': 'MM/dd/yyyy',
                'Task.SearchBy.Proposed': 'Tasks (Waiting approval)',
                'Task.SearchBy.Created': 'Tasks (Waiting acceptant)',
                'Task.SearchBy.Accepted': 'Tasks (In progress)',
                'Task.SearchBy.Implemented': 'Tasks (Waiting verification)',
                'Task.SearchBy.Overdue': 'Tasks (over due)',
                'Task.SearchBy.Verified7': 'Tasks (Done from 7 days recently)',
                'Task.SearchBy.Verified30': 'Tasks (Done from 30 days recently)',
                'Task.SearchBy.Default': 'Tasks'
        }
        },
        serviceStatusText: {
            title: 'Lỗi truy cập dịch vụ',
            0: 'Không thể truy cập đến dịch vụ của ứng dụng. Vui lòng kiểm tra kết nối.',
            500: 'Có lỗi phát sinh từ dịch vụ, nên chức năng không đáp ứng.',
            404: 'Dữ liệu không tồn tại'
        }
    };
    return {
        $get: function () {
            return configs;
        }
    }
})
.directive('next-focus', function () {
    return {
        restrict: 'A',
        require: ['ngModel'],
        link: function ($scope, elem, attrs) {

            elem.bind('keydown', function (e) {
                var code = e.keyCode || e.which;
                if (code === 13) {
                    e.preventDefault();
                    elem.next().focus();
                }
            });
        }
    }
});