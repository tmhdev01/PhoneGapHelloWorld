angular.module('starter.services', [])

.factory('HomeService', function ($rootScope, $ionicLoading, $http, appUtils) {
    return {
        all: function () {
            var summaryData = {
                Tasks: appUtils.TasksListSummary,
                Events: [
                    { days: 7, title: 'Trong 7 ngày', total: 0, css: 'energized' },
                    { days: 30, title: 'Trong 30 ngày', total: 0, css: 'balanced' }
                ],
                Alerts: [
                    { days: 7, title: 'Trong 7 ngày', total: 0, css: 'energized' },
                    { days: 30, title: 'Trong 30 ngày', total: 0, css: 'balanced' }
                ],
                Groups: []
            };
            appUtils.callGetRemoteMethod('api/v1/GetHomepageReport?tokenKey= ' + $rootScope.accessToken, {},
                function (actionResult) {
                    var taskReport = actionResult.Task;
                    var eventReport = actionResult.Event;
                    var notificationReport = actionResult.Notification;
                    var groups = actionResult.UserGroups;
                    summaryData.Tasks[0].total = taskReport.Proposed;
                    summaryData.Tasks[1].total = taskReport.Created;
                    summaryData.Tasks[2].total = taskReport.InProgress;
                    summaryData.Tasks[3].total = taskReport.Implemented;
                    summaryData.Tasks[4].total = taskReport.OpenOverdue;
                    summaryData.Tasks[5].total = taskReport.OpenAsWarning;
                    summaryData.Tasks[6].total = taskReport.VerifiedIn7Day;
                    summaryData.Tasks[7].total = taskReport.VerifiedIn30Day;
                    summaryData.Events[0].total = eventReport.In7Day;
                    summaryData.Events[1].total = eventReport.In30Day;
                    summaryData.Alerts[0].total = notificationReport.In7Day;
                    summaryData.Alerts[1].total = notificationReport.In30Day;
                    for (var idx in groups) {
                        var userGroup = groups[idx];
                        summaryData.Groups.push({
                            Name: userGroup.Name,
                            Members: userGroup.MemberCount,
                            TasksInProgress: userGroup.Task.InProgress,
                            TasksOverdue: userGroup.Task.OpenOverdue,
                            Id: userGroup.Id
                        });
                    }
                },
                function () {

                });
            return summaryData;
        }
    };
})

.factory('GroupService', function ($rootScope, cacheService, $ionicLoading, $http, appUtils) {

    return {
        all: function () {
            var currentGroups = [];
            appUtils.callGetRemoteMethod('api/v1/getusergroups?tokenKey= ' + $rootScope.accessToken, {},
                function (actionResult) {
                    for (var idx in actionResult) {
                        var item = actionResult[idx],
                            groupItem = {
                                id: item.Id,
                                name: item.Name,
                                Members: item.MemberCount,
                                TasksInProgress: item.Task.InProgress,
                                TasksOverdue: item.Task.OpenOverdue,
                                Tasks: [
                                    { type: 'Proposed', title: 'Đang chờ duyệt', total: item.Task.Proposed, css: 'energized', hasValue: item.Task.Proposed == 0 ? false : true },
                                    { type: 'Created', title: 'Đang chờ xác nhận thực hiện', total: item.Task.Created, css: 'energized', hasValue: item.Task.Created == 0 ? false : true },
                                    { type: 'Accepted', title: 'Đang thực hiện', total: item.Task.InProgress, css: 'energized', hasValue: item.Task.InProgress == 0 ? false : true },
                                    { type: 'Implemented', title: 'Đang chờ xác nhận hoàn thành', total: item.Task.Implemented, css: 'energized', hasValue: item.Task.Implemented == 0 ? false : true },
                                    { type: 'Overdue', title: 'Quá hạn và chưa hoàn thành', total: item.Task.OpenOverdue, css: 'assertive', hasValue: item.Task.OpenOverdue == 0 ? false : true },
                                    { type: 'Verified7', title: 'Hoàn thành trong 7 ngày qua', total: item.Task.VerifiedIn7Day, css: 'balanced', hasValue: item.Task.VerifiedIn7Day == 0 ? false : true },
                                    { type: 'Verified30', title: 'Hoàn thành trong 30 ngày qua', total: item.Task.VerifiedIn30Day, css: 'balanced', hasValue: item.Task.VerifiedIn30Day == 0 ? false : true }
                                ]
                            };
                        currentGroups.push(groupItem);
                    }
                },
                function () {

                });
            return currentGroups;
        },
        get: function (groupId) {
            var currentGroups = [];
            appUtils.callGetRemoteMethod('api/v1/getusergroup?userGroupId=' + groupId + '&tokenKey=' + $rootScope.accessToken,
                { userGroupId: groupId },
                function (actionResult) {
                    for (var idx in actionResult) {
                        var item = actionResult[idx],
                            groupItem = {
                                id: item.Id,
                                name: item.Name,
                                Members: item.MemberCount,
                                TasksInProgress: item.Task.InProgress,
                                TasksOverdue: item.Task.OpenOverdue,
                                Tasks: appUtils.TasksListSummary
                            };
                        groupItem.Tasks[0].total = item.Task.Proposed;
                        groupItem.Tasks[1].total = item.Task.Created;
                        groupItem.Tasks[2].total = item.Task.InProgress;
                        groupItem.Tasks[3].total = item.Task.Implemented;
                        groupItem.Tasks[4].total = item.Task.OpenOverdue;
                        groupItem.Tasks[5].total = item.Task.OpenAsWarning;
                        groupItem.Tasks[6].total = item.Task.VerifiedIn7Day;
                        groupItem.Tasks[7].total = item.Task.VerifiedIn30Day;
                        currentGroups.push(groupItem);
                    }
                },
                function () {

                });
            return currentGroups;
        },
        members: function (groupId) {
            var data = {};
            var members = [];
            appUtils.callGetRemoteMethod('api/v1/getuserreport?tokenKey= ' + $rootScope.accessToken + "&Group=" + groupId, {},
                function (actionResult) {
                    for (var idx in actionResult.Members) {
                        var item = actionResult.Members[idx];
                        members.push({
                            name: item.UserName,
                            avatar: item.AvatarUrl,
                            TasksInProgress: item.InProgress,
                            TasksOverdue: item.OpenOverdue,
                            groupId: item.UserGroupId,
                            id: item.UserId
                        });

                    }
                    data.Members = members;
                    data.Group = actionResult.GroupName;
                },
                function () { });
            return data;
        },
        member: function (groupId, memberId) {
            var members = {};
            appUtils.callGetRemoteMethod('api/v1/getuserreportbymemberid?tokenKey= ' + $rootScope.accessToken + "&Group=" + groupId + "&UserId=" + memberId, {},
                function (actionResult) {
                    members.error = false;
                    members.email = actionResult.Email;
                    members.name = actionResult.UserName;
                    members.Group = actionResult.GroupName;
                    members.phone = actionResult.MobilePhone;
                    members.avatar = actionResult.AvatarUrl;
                    members.id = actionResult.UserId;
                    members.groupId = actionResult.UserGroupId;
                    members.Tasks = appUtils.TasksListSummary;

                    members.Tasks[0].total = actionResult.Proposed;
                    members.Tasks[1].total = actionResult.Created;
                    members.Tasks[2].total = actionResult.InProgress;
                    members.Tasks[3].total = actionResult.Implemented;
                    members.Tasks[4].total = actionResult.OpenOverdue;
                    members.Tasks[5].total = actionResult.OpenAsWarning;
                    members.Tasks[6].total = actionResult.Verified7;
                    members.Tasks[7].total = actionResult.Verified30;
                },
                function () {
                    members.error = true;
                });
            return members;
        }
    };
})

.factory('TaskService', function ($rootScope, cacheService, $ionicLoading, $http, appUtils) {
    return {
        all: function (type, groupId, memberId) {
            var data = {},
                taskActor = -1;
            if (memberId != 0 && memberId != undefined) {
                taskActor = memberId;
            }
            predefinedCriteriaByType = {
                "Proposed": {
                    Title: $rootScope.getLocaleText('Task.SearchBy.Proposed'),
                    Criteria: {
                        Status: 6
                    }
                },
                "Created": {
                    Title: $rootScope.getLocaleText('Task.SearchBy.Created'),
                    Criteria: {
                        Status: 1,
                        AssignedTo: taskActor,
                        StatusFilter: 2
                    }
                },
                "Accepted": {
                    Title: $rootScope.getLocaleText('Task.SearchBy.Accepted'),
                    Criteria: {
                        Status: 2,
                        AssignedTo: taskActor,
                        StatusFilter: 2
                    }
                },
                "Implemented": {
                    Title: $rootScope.getLocaleText('Task.SearchBy.Implemented'),
                    Criteria: {
                        Status: 3,
                        AssignedTo: taskActor,
                        StatusFilter: 2
                    }
                },
                "Overdue": {
                    Title: $rootScope.getLocaleText('Task.SearchBy.Overdue'),
                    Criteria: {
                        StatusFilter: 4,
                        AssignedTo: taskActor == -1 ? 0 : taskActor
                    }
                },
                "Verified7": {
                    Title: $rootScope.getLocaleText('Task.SearchBy.Verified7'),
                    Criteria: {
                        StatusFilter: 3,
                        day: 7
                    }
                },
                "Verified30": {
                    Title: $rootScope.getLocaleText('Task.SearchBy.Verified30'),
                    Criteria: {
                        StatusFilter: 3,
                        day: 30
                    }
                },
                "Goingdue": {
                    Title: $rootScope.getLocaleText('Task.SearchBy.Goingdue'),
                    Criteria: {
                        StatusFilter: 2,
                        GoingDueRequest: true
                    }
                },
                "default": {
                    Title: $rootScope.getLocaleText('Task.SearchBy.Default'),
                    Criteria: {
                        StatusFilter: 2
                    }
                }
            },
        requestParam = predefinedCriteriaByType[type];
            if (typeof (requestParam) === 'undefined')
                requestParam = predefinedCriteriaByType["default"];

            var criteria = requestParam.Criteria;
            if (groupId != 0 && groupId != undefined) {
                criteria["Group"] = groupId;
            }

            // xử lý task
            data.Tasks = [];
            appUtils.callGetRemoteMethod('api/v1/Tasks?tokenKey=' + $rootScope.accessToken + "&" + appUtils.buildQueryString(criteria), {},
                function (actionResult) {

                    data.Title = requestParam.Title;
                    if (groupId != 0 && groupId != undefined) {
                        data.Group = actionResult.GroupName;
                        data.Member = actionResult.MemberName;
                    }

                    for (var idx in actionResult.Tasks) {
                        var item = actionResult.Tasks[idx]

                        data.Tasks.push({
                            name: item.Name,
                            dueDate: item.DueDate,
                            status: item.StatusText,
                            id: item.Id,
                            statusCode: item.TaskStatusCode,
                            Group: item.Groups,
                            days: item.Day
                        }
                        );
                    }
                },
                function () { });
            //
            return data;
        },
        get: function (taskId) {
            var tasks = {};
            appUtils.callGetRemoteMethod('api/v1/Task?tokenKey= ' + $rootScope.accessToken + '&id=' + taskId, {},
            function (actionResult) {
                tasks.name = actionResult.Task.Name;
                tasks.supervisor = actionResult.Task.Supervisor;
                tasks.status = actionResult.Task.StatusToString;
                tasks.priority = actionResult.Task.PriorityToString;
                tasks.category = actionResult.Task.Categories;
                tasks.dueDate = actionResult.Task.DueDate;
                tasks.creator = actionResult.Task.Creator;
                tasks.assignee = actionResult.Task.Assignee;
                tasks.group = actionResult.Task.UserGroups;
                tasks.description = actionResult.Task.Description;
                tasks.createdDate = actionResult.Task.CreatedOn;
                tasks.statusCode = actionResult.TaskStatusCode;
                tasks.days = actionResult.Day
                tasks.error = false;
            },
            function () {
                tasks.error = true;
            });
            return tasks;
        }
    };
})

.factory('EventService', function ($rootScope, $ionicLoading, $http, appUtils) {
    var events = [];
    return {
        all: function (days) {
            var data = {};
            if (days > 0) {
                data.Title = 'Sự kiện (trong ' + days + ' ngày)';
                data.Events = [];
                appUtils.callGetRemoteMethod('api/v1/events?tokenKey= ' + $rootScope.accessToken +
                    '&days=' + days, {},
                    function (actionResult) {
                        for (var idx in actionResult) {
                            var item = actionResult[idx];
                            data.Events.push({
                                id: item.Id,
                                name: item.Name,
                                time: item.EventTime,
                                days: days,
                                chairman: item.Chairman
                            });
                        }
                    },
                    function () {

                    });
            } else {
                data.Title = 'Sự kiện';
                data.Events = [];
                appUtils.callGetRemoteMethod('api/v1/events?tokenKey= ' + $rootScope.accessToken, {},
                    function (actionResult) {
                        for (var idx in actionResult) {
                            var item = actionResult[idx];
                            data.Events.push({
                                id: item.Id,
                                name: item.Name,
                                time: item.EventTime,
                                days: item.Days,
                                chairman: item.Chairman
                            });
                        }
                    },
                    function () {

                    });
            }

            return data;
        },
        get: function (eventId) {
            var event = {};
            appUtils.callGetRemoteMethod('api/v1/event?tokenKey= ' + $rootScope.accessToken + '&id=' + eventId, {},
                function (actionResult) {
                    event.name = actionResult.Name;
                    event.eventOn = actionResult.EventTime;
                    event.days = actionResult.Days;
                    event.attendants = actionResult.Attendants;
                    event.attendantHasValue = actionResult.Attendants !== "";
                    event.Groups = actionResult.Groups;
                    event.groupHasValue = actionResult.Groups !== "";
                    event.description = actionResult.Description;
                    event.chairman = actionResult.Chairman;
                    event.hasChairman = actionResult.Chairman != null;
                    event.category = actionResult.Category;
                    event.error = false;
                },
                function () {
                    event.error = true;
                });

            return event;
        }
    }

})

.factory('AlertService', function ($rootScope, $ionicLoading, $http, appUtils) {
    return {
        getNotification: function (days, page, onLoadCompleted) {
            appUtils.callGetLoadPageMethod('api/v1/GetNotifications?tokenKey= ' + $rootScope.accessToken +
                '&days=' + days + '&page=' + page, {},
                onLoadCompleted,
                function () {
                });
        }
    };

})
.factory(
    "transformRequestAsFormPost",
    function () {

        // I prepare the request data for the form post.
        function transformRequest(data, getHeaders) {

            var headers = getHeaders();

            headers["Content-type"] = "application/x-www-form-urlencoded; charset=utf-8";

            return (serializeData(data));

        }


        // Return the factory value.
        return (transformRequest);


        // ---
        // PRVIATE METHODS.
        // ---


        // I serialize the given Object into a key-value pair string. This
        // method expects an object and will default to the toString() method.
        // --
        // NOTE: This is an altered version of the jQuery.param() method which
        // will serialize a data collection for Form posting.
        // --
        // https://github.com/jquery/jquery/blob/master/src/serialize.js#L45
        function serializeData(data) {

            // If this is not an object, defer to native stringification.
            if (!angular.isObject(data)) {

                return ((data == null) ? "" : data.toString());

            }

            var buffer = [];

            // Serialize each key in the object.
            for (var name in data) {

                if (!data.hasOwnProperty(name)) {

                    continue;

                }

                var value = data[name];

                buffer.push(
                    encodeURIComponent(name) +
                        "=" +
                        encodeURIComponent((value == null) ? "" : value)
                );

            }

            // Serialize the buffer and clean it up for transportation.
            var source = buffer
                    .join("&")
                    .replace(/%20/g, "+")
            ;

            return (source);

        }

    }
)
    .factory("cacheService", function ($cacheFactory) {
        return {
            get: function (key, callback) {
                var $cache = $cacheFactory(key);
                var cachedData = $cache.get(key);
                if (!cachedData) {
                    cachedData = callback();
                    $cache.put(key, cachedData);
                }
                return cachedData;
            }
        }
    })
    .factory("appUtils", function (appConfig, $rootScope, $ionicPopup, $http, $ionicLoading) {
        return {
            callPostRemoteMethod: function (url, requestData, succeedHandler, failedHandler, loadingText) {
                $ionicLoading.show({
                    template: loadingText || appConfig.loadingText
                });
                $http.post(appConfig.apiUrl + url, requestData)
                    .success(function (data, status, headers, config) {
                        succeedHandler(data, status, headers, config);
                        // complete event handler
                        $ionicLoading.hide();
                    })
                    .error(function (data, status, headers, config) {
                        // complete event handler
                        $ionicLoading.hide();
                        if (status == 0) {
                            // Process error with service connection unknown reason
                            $rootScope.accessToken = null;
                            $ionicPopup.alert({
                                title: appConfig.serviceStatusText.title,
                                template: appConfig.serviceStatusText["" + status]
                            });
                            return;
                        } else if (status == 500) {
                            $ionicPopup.alert({
                                title: appConfig.serviceStatusText.title,
                                template: appConfig.serviceStatusText["" + status]
                            });
                            return;
                        } else if (status == 404) {
                            $ionicPopup.alert({
                                title: appConfig.serviceStatusText.title,
                                template: appConfig.serviceStatusText["" + status]
                            });
                        }
                        failedHandler(data, status, headers, config);
                    });
            },
            callGetRemoteMethod: function (url, requestData, succeedHandler, failedHandler, loadingText) {
                $ionicLoading.show({
                    template: loadingText || appConfig.loadingText
                });
                $http.get(appConfig.apiUrl + url, requestData)
                    .success(function (data, status, headers, config) {
                        succeedHandler(data, status, headers, config);
                        // complete event handler
                        $ionicLoading.hide();

                    })
                    .error(function (data, status, headers, config) {
                        // complete event handler
                        $ionicLoading.hide();
                        if (status == 0) {
                            // Process error with service connection unknown reason
                            $rootScope.accessToken = null;
                            $ionicPopup.alert({
                                title: appConfig.serviceStatusText.title,
                                template: appConfig.serviceStatusText["" + status]
                            });
                            return;
                        } else if (status == 500) {
                            $ionicPopup.alert({
                                title: appConfig.serviceStatusText.title,
                                template: appConfig.serviceStatusText["" + status]
                            });
                            return;
                        } else if (status == 404) {
                            $ionicPopup.alert({
                                title: appConfig.serviceStatusText.title,
                                template: appConfig.serviceStatusText["" + status]
                            });
                        }
                        failedHandler(data, status, headers, config);
                    });

            },

            callGetLoadPageMethod: function (url, requestData, succeedHandler, failedHandler) {
                $http.get(appConfig.apiUrl + url, requestData)
                    .success(function (data, status, headers, config) {
                        succeedHandler(data, status, headers, config);
                        // complete event handler
                    })
                    .error(function (data, status, headers, config) {
                        // complete event handler
                        if (status == 0) {
                            // Process error with service connection unknown reason
                            $rootScope.accessToken = null;
                            $ionicPopup.alert({
                                title: appConfig.serviceStatusText.title,
                                template: appConfig.serviceStatusText["" + status]
                            });
                            return;
                        } else if (status == 500) {
                            $ionicPopup.alert({
                                title: appConfig.serviceStatusText.title,
                                template: appConfig.serviceStatusText["" + status]
                            });
                            return;
                        } else if (status == 404) {
                            $ionicPopup.alert({
                                title: appConfig.serviceStatusText.title,
                                template: appConfig.serviceStatusText["" + status]
                            });
                        }
                        failedHandler(data, status, headers, config);
                        // complete event handler
                    });

            },
            buildQueryString: function (requestObject) {
                var parts = [];
                for (var i in requestObject) {
                    if (requestObject.hasOwnProperty(i)) {
                        parts.push(encodeURIComponent(i) + "=" + encodeURIComponent(requestObject[i]));
                    }
                }
                return parts.join("&");
            },
            TasksListSummary: [
                { type: 'Proposed', title: 'Đang chờ duyệt', total: 0, css: 'energized' },
                { type: 'Created', title: 'Đang chờ xác nhận thực hiện', total: 0, css: 'energized' },
                { type: 'Accepted', title: 'Đang thực hiện', total: 0, css: 'energized' },
                { type: 'Implemented', title: 'Đang chờ xác nhận hoàn thành', total: 0, css: 'energized' },
                { type: 'Overdue', title: 'Quá hạn (đang mở)', total: 0, css: 'assertive' },
                { type: 'Goingdue', title: 'Gần đến hạn (đang mở)', total: 0, css: 'energized' },
                { type: 'Verified7', title: 'Hoàn thành trong 7 ngày qua', total: 0, css: 'balanced' },
                { type: 'Verified30', title: 'Hoàn thành trong 30 ngày qua', total: 0, css: 'balanced' }
            ]
        }
    })
    .factory("gcmService", function (appConfig, $ionicPlatform,
                                    $cordovaPush, $cordovaToast, $cordovaDialogs, $ionicPopup, $rootScope) {

        var _gcmRegDone = !appConfig.isInternetRemoteService;
        function Factory($scope) {

            this.$scope = $scope;
        }
        window.gcmOnNotification = function (e) {
            /*$ionicPopup.alert({
                title: 'GCM - Notification Events',
                template:
                    "On Notification Event is being processed.... (Rootscope) - Json: " + JSON.stringify([e])
            });*/
            console.log(e);
            switch (e.event) {
                case 'registered':
                    _gcmRegDone = true;
                    if (e.regid.length > 0) {
                        $rootScope.gcsRegistrationId = e.regid;
                    }
                    this.$scope.caption = $rootScope.getLocaleText('Login.HeaderText');
                    break;

                case 'message':
                    // if this flag is set, this notification happened while we were in the foreground.
                    // you might want to play a sound to get the user's attention, throw up a dialog, etc.
                    if (e.foreground) {
                        $ionicPopup.alert({
                            title: 'GCM - Reg Foreground',
                            template: "Registration is being foreground...."
                        });
                    }
                    else {	// otherwise we were launched because the user touched a notification in the notification tray.
                        if (e.coldstart)
                            $ionicPopup.alert({
                                title: 'GCM - Reg Coldstart',
                                template: "Registration is being ColdStart...."
                            });
                    }

                    //$cordovaDialogs.alert(e.payload.Message, "Push Notification Received");
                    $ionicPopup.alert({
                        title: e.payload.Title,
                        template: e.payload.Message
                    });

                case 'error':
                    $cordovaDialogs.alert(e.msg, "Push notification error event");
                    break;

                default:
                    $cordovaDialogs.alert(e, "Push notification handler - Unprocessed Event");
                    break;
            }
        };

        Factory.prototype.initialize = function (completedHandler) {

            // call to register automatically upon device ready
            $ionicPlatform.ready(function () {
                if ($rootScope.gcsRegistrationId.length > 0 || !appConfig.isInternetRemoteService) return;
                try {
                    // Register GCM - google cloud message
                    $cordovaPush.register({
                        "senderID": appConfig.googleProjectNumber
                        , "ecb": "window.gcmOnNotification"
                    }).then(function (result) {
                        if (result === 'OK') {
                            //TODO below line is being used for testing. Deploy to real device must be remove this PLEASE!
                            completedHandler();
                            //$rootScope.gcsRegistrationId = appConfig.gcmTexts.notRetrieve;
                            /*$ionicPopup.alert({
                                title: 'GCM - Registered successfully',
                                template: "Internal service message - Register success " + result
                            });
                            $cordovaToast.showShortCenter('Registered for push notifications');*/
                            return;
                        }
                        $ionicPopup.alert({
                            title: appConfig.gcmTexts.regErrTitle,
                            template: appConfig.gcmTexts.callbackFailed + result
                        });
                    }, function (err) {
                        $ionicPopup.alert({
                            title: appConfig.gcmTexts.regErrTitle,
                            template: appConfig.gcmTexts.detail + err
                        });
                    });
                } catch (e) {
                    console.error(e);
                    $ionicPopup.alert({
                        title: appConfig.gcmTexts.regExTitle,
                        template: e
                    });
                }
            });
        };
        Factory.prototype.enableLogin = function () {
            return _gcmRegDone;
        }
        return Factory;
    });
