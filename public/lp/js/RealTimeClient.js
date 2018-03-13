(function () {
    angular.module('rj.realTimeClient', [])
      .value('$', $)
      .service('RealTime', ['$', '$rootScope', 'REAL_TIME_OPTIONS', '$timeout',
        function ($, $rootScope, options, $timeout) {
            /// <summary>RealTimeClient</summary>
            /// <param name="options">{ url: '', basePath: '', subApp: '', version: '', realTimeHubName: '', projectIdentifier: '' }</param>
            var self = this,
                isForceStopped = false,
                settings = {
                    url: '',
                    basePath: 'api',
                    subApp: '',
                    version: 'v1',
                    realTimeHubName: 'v1/realTimeFeed',
                    projectIdentifier: null
                };

            if (options) {
                settings = $.extend(true, {}, settings, options);
            }

            var connection,
                connectionStates = { 0: "connecting", 1: "connected", 2: "reconnecting", 4: "disconnected" },
                realTimeHubProxy = undefined,
                stateChanged = null,
                isSubscribePassed = false,
                hasLiveConnection = false,
                notifications = [],

                checkValidity = function (notifications) {
                    if (settings.projectIdentifier == undefined || settings.projectIdentifier == null || settings.projectIdentifier.length == 0) {
                        return "Please pass 'projectIdentifier' when creating the instance.";
                    }
                    else if (notifications == undefined || notifications == null || notifications.length == 0 || !$.isArray(notifications)) {
                        return "Please pass 'notifications' when creating the instance.";
                    }
                    return true;
                }

            /// <summary>start broadcasting</summary>
            /// <param name="options">notifications: [{method: '', callback: }]}</param>
            start = function (startupOptions) {
                var validity = checkValidity(startupOptions.notifications);
                if (validity === true) {
                    if (startupOptions) {
                        notifications = startupOptions.notifications;
                        stateChanged = startupOptions.stateChanged;
                    }
                    checkConnection();
                }
                else {
                    //console.log(validity);
                    throw validity;
                }
            },

            checkConnection = function () {
                try {
                    if (!connection) {
                        connection = $.hubConnection(settings.url);//, { useDefaultPath: false }
                        //connection.logging = true;
                    }
                    connection.error(function (error) {
                        console.log('SignalR error: ' + error)
                    });
                    if (connection.state === $.signalR.connectionState.disconnected) {
                        console.log("Checking signalR connection...");
                        restartConnection();
                    }
                    else {
                        console.log("Connection state: " + connectionStates[connection.state] + '. Checking loop stopped.');
                    }
                }
                catch (err) {
                    console.log('checkSignalRConnection ' + err.number + ': ' + err.message);
                }
            },

            subscribeFor = function (hubProxy, notification) {
                if (hubProxy && notification && notification.method && notification.callback) {
                    hubProxy.on(notification.method, function (data) {
                        if (notification.callback != null && notification.callback != undefined && angular.isString(notification.callback)) {
                            $rootScope.$broadcast(notification.callback, data);
                        }
                    });
                }
            },

            restartConnection = function () {
                try {
                    if (realTimeHubProxy === undefined) {
                        realTimeHubProxy = connection.createHubProxy(settings.realTimeHubName);
                        realTimeHubProxy.on('newVersionReleased', function (data) {
                            location.reload();
                        });
                        $.each(notifications, function (index, notification) {
                            subscribeFor(realTimeHubProxy, notification);
                        });
                    }
                    var ie = false;
                    var transports = ['webSockets', 'serverSentEvents', 'foreverFrame', 'longPolling'];
                    if (navigator.appName == "Microsoft Internet Explorer") {
                        //Set IE as true
                        ie = true;
                        //Create a user agent var
                        var ua = navigator.userAgent;
                        //Write a new regEx to find the version number
                        var re = new RegExp("MSIE ([0-9]{1,}[.0-9]{0,})");
                        //If the regEx through the userAgent is not null
                        if (re.exec(ua) != null) {
                            //Set the IE version
                            ieVersion = parseInt(RegExp.$1);
                        }
                        if (ieVersion <= 9) {
                            transports = ['webSockets', 'serverSentEvents', 'longPolling'];
                        }
                    }
                    //console.log(transports);
                    connection.stop();
                    connection.start({ transport: transports })//
                        .done(function () {
                            hasLiveConnection = true;
                            console.log('Now connected, connection ID=' + connection.id + ' transport=' + connection.transport.name);
                            isSubscribePassed = false;
                            isForceStopped = false;
                            connection.disconnected(function () {
                                if (!isForceStopped) {
                                    setTimeout(checkConnection, 10000);
                                }
                            });
                            connection.stateChanged(function (state) {
                                if (stateChanged) {
                                    stateChanged(state);
                                }
                                if (state.oldState == $.signalR.connectionState.reconnecting && state.newState == $.signalR.connectionState.connected) {
                                    subscribe(10000);
                                }
                                console.log('State changing: ' + connectionStates[state.oldState] + ' => ' + connectionStates[state.newState]);
                            });
                            subscribe(0);
                        })
                        .fail(function () {
                            console.log('Could not connect');
                            if (!hasLiveConnection) {
                                setTimeout(checkConnection, 10000);
                            }
                        });
                }
                catch (err) {
                    console.log('restartConnection ' + err.number + ': ' + err.message);
                }
            },

            subscribe = function (delay) {
                if (!isSubscribePassed) {
                    isSubscribePassed = true;
                    delay = delay || 0;
                    var methods = [];
                    methods = $.map(notifications, function (notification, index) {
                        return notification.method;
                    });
                    setTimeout(function () {
                        realTimeHubProxy.invoke('subscribe', {
                            projectIdentifier: settings.projectIdentifier,
                            methods: methods
                        }).done(function (data) {
                            isSubscribePassed = false;
                            console.log(data);
                        })
                        .fail(function (error) {
                            isSubscribePassed = false;
                            subscribe(5000);
                            console.log('Error (subscribe): ' + error);
                        });
                    }, delay);
                }
                else {
                    console.log("subscribe", "Stopped potential second subscribtion")
                }
            },

            disconnect = function () {
                if (connection) {
                    isForceStopped = true;
                    connection.disconnected(function () {

                    });
                    connection.stateChanged(function (state) {

                    });
                    connection.stop();
                    isSubscribePassed = false;
                    hasLiveConnection = false;
                    stateChanged = null;
                    notifications = [];
                    delete connection;
                }
            },

            stop = function () {
                disconnect();
            };

            function isFunction(func) {
                return func != null && func != undefined && $.isFunction(func);
            }

            window.onbeforeunload = function (e) {
                disconnect();
            };

            return {
                stop: stop,
                start: start
            };
        }
      ])
}());
