var app = angular.module("app",[]);
app.config(function($interpolateProvider) {
    $interpolateProvider.startSymbol('{[{');
    $interpolateProvider.endSymbol('}]}');
}).filter('trustAsResourceUrl', ['$sce', function($sce) {
    return function(val) {
        return $sce.trustAsResourceUrl(val);
    };
}]).filter('rangeFormat', function($filter) {
    return function(number) {
        number = number || 0;

        var unit='';
        switch(true){

            case number > 1000*1000*1000:
                unit='G';
                number=number/(1000*1000*1000);
                break;
            case number > 1000*1000:
                unit='M';
                number=number/(1000*1000);
                break;
            case number>1000:
                unit='k';
                number=number/1000;
                break;
            default:
                unit='';
                number=number;
                break;

        }

        return   $filter('number')(number,2)+unit;;
    };
}).controller('dashboardCtrl', function($scope) {
    moment.locale("zh_cn");

    $scope.is_debug = settings.is_debug;
    global.on_load_func();    // 加载隐藏div数据并保存到js的session变量

    $scope.$watch('$viewContentLoaded', function () {
        global.on_loaded_func($scope);    // 显示页面内容
    });

    refreshInterval = 5*60*1000; // N 分钟刷新所有电站数据
    var mapId = "map";

    var videos = [
        "http://192.168.151.163:9435/FmVideo.html?channel=4&ip=192.168.1.28",
        "http://192.168.151.163:9435/FmVideo.html?channel=5&ip=192.168.1.29",
        "http://192.168.151.163:9435/FmVideo.html?channel=0&ip=192.168.1.140",
        "http://192.168.151.163:9435/FmVideo.html?channel=1&ip=192.168.1.141",
        "http://192.168.151.163:9435/FmVideo.html?channel=2&ip=192.168.1.142",
        "http://192.168.151.163:9435/FmVideo.html?channel=3&ip=192.168.1.143",
        "http://192.168.151.163:9435/FmVideo.html?channel=6&ip=192.168.1.7",
        "http://192.168.151.163:9435/FmVideo.html?channel=7&ip=192.168.1.8",
        "http://192.168.151.163:9435/FmVideo.html?channel=8&ip=192.168.1.9",
        "http://192.168.151.163:9435/FmVideo.html?channel=10&ip=192.168.1.11",
        "http://192.168.151.163:9435/FmVideo.html?channel=20&ip=192.168.1.19",
        "http://192.168.151.163:9435/FmVideo.html?channel=11&ip=192.168.1.18",
    ];

    $scope.data = {
        // 空气质量
        "cityId": "1233",  // 嘉兴市
        "AppCode": "1b676b19152f4f41b16a961742c49ac0",  // aliyun墨迹

        headCenter: "智慧楼宇数据管控平台",
        headLeft: "安全·舒适·节能",
        headRight: moment().format("YYYY-MM-DD dddd"),

        safeDays: 123, // 安全运行天数

        buildingSortName: ["海盐", "融通", "明州", "嘉善", "滨海", "嘉兴"],

        videoInd : 0,
        videos: videos.slice(0, 4),

        totalPerson: 100,
        totalArea: 1000,

        totalElec: 0, // 左上
        totalElecAvgArea: 0,
        totalElecAvgPerson: 0,
        totalWater: 0,
        totalWaterAvgArea: 0,
        totalWaterAvgPerson: 0,
        
        totalElecDay: 0, // 中间大字
        totalElecMonth: 0,

        visitorByDay: 12,  // 右上 日访客
        visitorByMonth: 12*30,  // 月访客

        // 人均用电排名
        // elecAvgPerson: [
        //     {
        //         name: '楼1',
        //         percent: "55%",
        //         val: 302
        //     },
        //     {
        //         name: '楼2',
        //         percent: "75%",
        //         val: 302
        //     },
        //     {
        //         name: '楼3',
        //         percent: "65%",
        //         val: 302
        //     },
        //     {
        //         name: '楼4',
        //         percent: "85%",
        //         val: 302
        //     },
        //     {
        //         name: '楼5',
        //         percent: "100%",
        //         val: 510
        //     },
        // ],
        // waterAvgPerson: [
        //     {
        //         name: '楼1',
        //         percent: "55%",
        //         val: 302
        //     },
        //     {
        //         name: '楼2',
        //         percent: "75%",
        //         val: 302
        //     },
        //     {
        //         name: '楼3',
        //         percent: "65%",
        //         val: 302
        //     },
        //     {
        //         name: '楼4',
        //         percent: "85%",
        //         val: 302
        //     },
        //     {
        //         name: '楼5',
        //         percent: "100%",
        //         val: 510
        //     },
        // ],
        // 每平米用电排名
        // elecAvgArea: [
        //     {
        //         name: '楼1',
        //         percent: "55%",
        //         val: 302
        //     },
        //     {
        //         name: '楼2',
        //         percent: "75%",
        //         val: 302
        //     },
        //     {
        //         name: '楼3',
        //         percent: "65%",
        //         val: 302
        //     },
        //     {
        //         name: '楼4',
        //         percent: "85%",
        //         val: 302
        //     },
        //     {
        //         name: '楼5',
        //         percent: "100%",
        //         val: 510
        //     },
        // ],
        // waterAvgArea: [
        //     {
        //         name: '楼1',
        //         percent: "55%",
        //         val: 302
        //     },
        //     {
        //         name: '楼2',
        //         percent: "75%",
        //         val: 302
        //     },
        //     {
        //         name: '楼3',
        //         percent: "65%",
        //         val: 302
        //     },
        //     {
        //         name: '楼4',
        //         percent: "85%",
        //         val: 302
        //     },
        //     {
        //         name: '楼5',
        //         percent: "100%",
        //         val: 510
        //     },
        // ],

        // 中间
        smokeDetector: {
            online: 120,
            closed: 12,
            error: 0,
        },
        light: {
            online: 120,
            closed: 12,
            error: 0,
        },
        camera: {
            online: 10,
            closed: 2,
            error: 0,
        },
        elevator: {
            online: 3,
            closed: 0,
            error: 0,
        },

        // 右下
        warnings: [
            {
                type: "烟感探头",
                name: "YG-001",
                time: "2020-01-01 12:12:12",
                warning: "设备掉线"
            },
            {
                type: "烟感探头",
                name: "YG-001",
                time: "2020-01-01 12:12:12",
                warning: "设备掉线"
            },
            {
                type: "烟感探头",
                name: "YG-001",
                time: "2020-01-01 12:12:12",
                warning: "设备掉线"
            },
            {
                type: "烟感探头",
                name: "YG-001",
                time: "2020-01-01 12:12:12",
                warning: "设备掉线"
            },
            {
                type: "烟感探头",
                name: "YG-001",
                time: "2020-01-01 12:12:12",
                warning: "设备掉线"
            },
            {
                type: "烟感探头",
                name: "YG-001",
                time: "2020-01-01 12:12:12",
                warning: "设备掉线"
            }
        ],
    };
    
    var LineOption = {
        dataZoom: {
            type: 'inside'
        },
        grid: {
            top: 10,
            left: 5,
            right: 5,
            bottom: 5,
        },
        tooltip: {
            trigger: 'axis',
            position: function (pos, params, dom, rect, size) {
                var obj = {top: 60};
                return obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 5;
            },
            formatter:function(params){
                var view = "";    
                var colum=Math.ceil(params.length/14);
                var view = "时间 ："+params[0].axisValueLabel;
                var value='',raws;
                for (var i in params) {
                    if(i%colum){
                        view +='   ';
                    }else{
                        view += '<br/>';
                    }
                    view += params[i].marker;
                    view += params[i].seriesName;
                    value=": "+params[i].value[1];
                    view += value;


                }
                return view;
            }
        },
        xAxis: {
            type: 'time',
            splitLine: {
                show: false
            },
            axisLabel: null,
            axisLine: {
                lineStyle: {
                    color: "rgba(238,155,0,1)"
                }
            },
        },
        yAxis: {
            type: 'value',
            splitLine: {
                show: false
            },
            axisLabel: null,
            axisLine: {
                lineStyle: {
                    color: "rgba(238,155,0,1)"
                }
            },
        },
        series: [
            {
                name:'日功率',
                type:'line',
                smooth:true,
                symbol: 'none',
                sampling: 'average',
                // itemStyle: {
                //     color: 'rgba(238,155,0,1)'
                // },
                itemStyle: null,
                areaStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                        offset: 0,
                        color: 'rgba(238,155,0,1)'
                    }, {
                        offset: 1,
                        color: 'rgba(203,39,0,1)'
                    }])
                },
                data: [],
            }
        ],
    };

    var labelOption = {
        show: true,
        position: 'insideBottom',
        distance: 10,
        align: 'left',
        verticalAlign: 'middle',
        rotate: 90,
        formatter: function(params){ 
            str =  params.data.value
            return str
        },
        fontSize: 14,
        rich: {
            name: {
                textBorderColor: '#fff'
            }
        }
    };
    var BarOption = {
        dataZoom: {
            type: 'inside'
        },
        color: ['#2E92FF'],
        grid: {
            top: 5,
            left: 15,
            right: 15,
            bottom: 10,
        },
        tooltip: {
            trigger: 'axis',
            position: function (pos, params, dom, rect, size) {
                var obj = {top: 60};
                return obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 5;
            }
        },
        xAxis: {
            type: 'time',
            splitLine: {
                show: false
            },
            axisLabel: null,
            axisLine: {
                lineStyle: {
                    color: "rgba(60, 231, 218, 1)"
                }
            },
        },
        yAxis: {
            type: 'value',
            splitLine: {
                show: false
            },
            axisLabel: null,
            axisLine: {
                lineStyle: {
                    color: "rgba(60, 231, 218, 1)"
                }
            },
        },
        series: [
            {
                name:'日发电',
                type:'bar',
                barWidth: "40%",
                smooth:true,
                symbol: 'none',
                sampling: 'average',
                itemStyle: {
                    color: new echarts.graphic.LinearGradient(
                        0, 0, 0, 1,
                        [
                            {offset: 0, color: 'rgba(60, 231, 218, 1)'},
                            {offset: 1, color: 'rgba(60, 231, 218, 1)'}
                        ]
                    )
                },
                label: labelOption,
                data: [],
            },
            {
                name:'日用水',
                type:'bar',
                barWidth: "40%",
                smooth:true,
                symbol: 'none',
                sampling: 'average',
                itemStyle: {
                    color: new echarts.graphic.LinearGradient(
                        0, 0, 0, 1,
                        [
                            {offset: 0, color: 'rgba(60, 231, 218, 0.5)'},
                            {offset: 1, color: 'rgba(60, 231, 218, 0.5)'}
                        ]
                    )
                },
                label: labelOption,
                data: [],
            }
        ],
    };

    // 根据浏览器定位当前位置, 并输出天气情况
    $scope.getLocalWeather = function(){
        var key = "alicityweather_forecast24hours_"+$scope.data.cityId;
        var casheValue = global.getLocalObject(key);
        if(!_getWeather(casheValue)) {
            jQuery.ajax({
                url: "http://aliv18.data.moji.com/whapi/json/alicityweather/forecast24hours",
                method: "post",
                beforeSend: function(xhr) {
                    xhr.setRequestHeader("Authorization", "APPCODE "+$scope.data.AppCode);
                    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=utf-8");
                },
                data: {
                    cityId: $scope.data.cityId,
                },
                success: function(data) {
                    try {
                        data = JSON.parse(data);
                    } catch(e) {
                        // pass
                    }
                    global.setLocalObject(key, data, 12*60*60*1000);
                    $scope.$apply(function() {
                        _getWeather(data);
                    });
                }, 
                error: function(data) {
                    console.log(data);
                }
            });
        }
    };

    function _getWeather(data) {
        if(!data) {
            return data;
        };
        var curData = null;
        var now = moment().format("YYYY-MM-DD H");
        data.data.hourly.map(d => {
            if(now == d.date+" "+d.hour) {
                curData = d;
            }
        });

        if(curData) {
            for(let o in settings.WEATHER) {
                if(settings.WEATHER[o].text == curData.condition) {
                    $scope.realtimeWeather = settings.WEATHER[o];
                }
            }
            $scope.realtimeWeather_weather = curData.condition;
            $scope.realtimeWeather_city = data.data.city.name;
            $scope.realtimeWeather_tp = curData.temp;
            return true;
        }
        return false;
    }

    $scope.getLocalAirPm = function(){
        var key = "alicityweather_aqi_"+$scope.data.cityId;
        var casheValue = global.getLocalObject(key);
        if(!casheValue) {
            jQuery.ajax({
                url: "http://aliv18.data.moji.com/whapi/json/alicityweather/aqi",
                method: "post",
                beforeSend: function(xhr) {
                    xhr.setRequestHeader("Authorization", "APPCODE "+$scope.data.AppCode);
                    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=utf-8");
                },
                data: {
                    cityId: $scope.data.cityId,
                },
                success: function(data) {
                    try {
                        data = JSON.parse(data);
                    } catch(e) {
                        // pass
                    }
                    global.setLocalObject(key, data, 12*60*60*1000);
                    $scope.$apply(function(){
                        $scope.realtimeWeather_airPm = data.data.aqi.pm25;
                    });
                }, 
                error: function(data) {
                    console.log(data);
                }
            });
        } else {
            $scope.realtimeWeather_airPm = casheValue.data.aqi.pm25;
        }
    };

    function refreshDatas (){
        // 天气相关
        $scope.getLocalWeather();
        $scope.getLocalAirPm();

        // 获取用户所有电站 + 获取汇总信息
        $scope.getDatas()
            .then(function(data){
                console.log(data);
                $scope.fmtData(data);
            }).catch(function(data){
                // lay.msg(0)
                // alert("电站暂无数据 refreshDatas:"+data.sub_msg);
                alert("暂无数据，调试中...");
            });
    }
    $scope.getDatas = function () {
        var param = {
            _method: 'post',
            _url: settings.ajax_func.ajaxTotal,
            _param: {
                today: moment().format("YYYY-MM-DD")
            }
        };
        return global.return_promise($scope, param);
    }
    
    $scope.fmtData = function(data) {
        if(data.result.length > 0) {

            var cacheData = global.getLocalObject("cacheData");
            if(!cacheData) {
                cacheData = data;
            }

            $scope.$apply(function(){
                // 汇总数据
                $scope.data.totalArea= 0;   // 
                $scope.data.totalElec= 0;   //
                $scope.data.totalYearElec= 0;   // 
                $scope.data.totalYearWater= 0;   //
                $scope.data.totalElecAvgArea= 0;    //
                $scope.data.totalElecAvgPerson= 0;
                $scope.data.totalWater= 0;  //
                $scope.data.totalWaterAvgArea= 0;   //
                $scope.data.totalWaterAvgPerson= 0;
                $scope.data.totalEnergyDay= 0;  //
                $scope.data.totalEnergyMonth= 0;    //

                var maxElecAvgArea = 0;
                var maxWaterAvgArea = 0;
                var maxElecAvgPerson = 0;
                var maxWaterAvgPerson = 0;
                data.result.map( (b, ind) => {
                    // 尝试取一个数据
                    var totalElec = (b.hasOwnProperty("energyTotalElec") && b["energyTotalElec"].hasOwnProperty("tt")) ? b.energyTotalElec["tt"] : 0;
                    // 如果取到数据，暂存
                    if(totalElec > 0) {
                        cacheData.result[ind] = b;
                    } else {
                        // 取原数据
                        b = cacheData.result[ind];
                    }

                    var totalArea = (b.hasOwnProperty("build") && b["build"].hasOwnProperty("area")) ? b.build["area"] : 0;
                    var totalPerson = (b.hasOwnProperty("build") && b["build"].hasOwnProperty("person")) ? b.build["person"] : 0;
                    var totalElec = (b.hasOwnProperty("energyTotalElec") && b["energyTotalElec"].hasOwnProperty("tt")) ? b.energyTotalElec["tt"] : 0;
                    var totalWater = (b.hasOwnProperty("energyTotalWater") && b["energyTotalWater"].hasOwnProperty("tt")) ? b.energyTotalWater["tt"] : 0;
                    
                    var totalYearElec = (b.hasOwnProperty("energyYearElec") && b["energyYearElec"].hasOwnProperty("tt")) ? b.energyYearElec["tt"] : 0;
                    var totalYearWater = (b.hasOwnProperty("energyYearWater") && b["energyYearWater"].hasOwnProperty("tt")) ? b.energyYearWater["tt"] : 0;
                    
                    var totalEnergyDay = ((b.hasOwnProperty("energyTodayElec") && b["energyTodayElec"].hasOwnProperty("tt")) ? b.energyTodayElec["tt"] : 0) * 0.404
                        + ((b.hasOwnProperty("energyTodayWater") && b["energyTodayWater"].hasOwnProperty("tt")) ? b.energyTodayWater["tt"] : 0) * 0.0857;
                    var totalEnergyMonth = ((b.hasOwnProperty("energyMonthElec") && b["energyMonthElec"].hasOwnProperty("tt")) ? b.energyMonthElec["tt"] : 0) * 0.404
                        + ((b.hasOwnProperty("energyMonthWater") && b["energyMonthWater"].hasOwnProperty("tt")) ? b.energyMonthWater["tt"] : 0) * 0.0857;

                    $scope.data.totalArea +=  totalArea;
                    $scope.data.totalPerson +=  totalPerson;
                    $scope.data.totalElec += totalElec;
                    $scope.data.totalWater += totalWater;

                    $scope.data.totalYearElec += totalYearElec;
                    $scope.data.totalYearWater += totalYearWater;

                    $scope.data.totalEnergyDay += totalEnergyDay;
                    $scope.data.totalEnergyMonth += totalEnergyMonth;

                    maxElecAvgArea = Math.max(maxElecAvgArea, totalArea > 0 ? totalYearElec/totalArea : 0);
                    maxWaterAvgArea = Math.max(maxWaterAvgArea, totalArea > 0 ? totalYearWater/totalArea : 0);
                    maxElecAvgPerson = Math.max(maxElecAvgPerson, totalPerson > 0 ? totalYearElec/totalPerson : 0);
                    maxWaterAvgArea = Math.max(maxWaterAvgPerson, totalPerson > 0 ? totalYearWater/totalPerson : 0);
                });

                $scope.data.totalElecAvgArea = $scope.data.totalArea > 0 ? $scope.data.totalYearElec / $scope.data.totalArea : 0;
                $scope.data.totalWaterAvgArea = $scope.data.totalArea > 0 ? $scope.data.totalYearWater / $scope.data.totalArea : 0;
                $scope.data.totalElecAvgPerson = $scope.data.totalPerson > 0 ? $scope.data.totalYearElec / $scope.data.totalPerson : 0;
                $scope.data.totalWaterAvgPerson = $scope.data.totalPerson > 0 ? $scope.data.totalYearWater / $scope.data.totalPerson : 0;

                // 单个数据
                $scope.data.elecAvgArea = [];
                $scope.data.waterAvgArea = [];
                $scope.data.elecAvgPerson = [];
                $scope.data.waterAvgPerson = [];
                $scope.data.elecMap = {};
                $scope.data.waterMap = {};
                $scope.data.elecList = [];
                $scope.data.waterList = [];
                data.result.map( (b, ind) => {
                    // 尝试取一个数据
                    var totalElec = (b.hasOwnProperty("energyTotalElec") && b["energyTotalElec"].hasOwnProperty("tt")) ? b.energyTotalElec["tt"] : 0;
                    // 如果取到数据，暂存
                    if(totalElec > 0) {
                        cacheData.result[ind] = b;
                    } else {
                        // 取原数据
                        b = cacheData.result[ind];
                    }

                    $scope.data.elecAvgArea.push({
                        name: $scope.data.buildingSortName[ind],
                        percent: (maxElecAvgArea > 0 
                            && b.hasOwnProperty("build") && b["build"].hasOwnProperty("area") 
                            && b.hasOwnProperty("energyYearElec") && b["energyYearElec"].hasOwnProperty("tt")
                            ? (b.energyYearElec.tt / b.build["area"]) / maxElecAvgArea : 0) * 100 + "%",
                        val: maxElecAvgArea > 0 
                            && b.hasOwnProperty("build") && b["build"].hasOwnProperty("area") 
                            && b.hasOwnProperty("energyYearElec") && b["energyYearElec"].hasOwnProperty("tt")
                            ? (b.energyYearElec.tt / b.build["area"]) : 0,
                    });
                    $scope.data.waterAvgArea.push({
                        name: $scope.data.buildingSortName[ind],
                        percent: (maxWaterAvgArea > 0 
                            && b.hasOwnProperty("build") && b["build"].hasOwnProperty("area") 
                            && b.hasOwnProperty("energyYearWater") && b["energyYearWater"].hasOwnProperty("tt")
                            ? (b.energyYearWater.tt / b.build["area"]) / maxWaterAvgArea : 0) * 100 + "%",
                        val: maxElecAvgArea > 0 
                            && b.hasOwnProperty("build") && b["build"].hasOwnProperty("area") 
                            && b.hasOwnProperty("energyYearWater") && b["energyYearWater"].hasOwnProperty("tt")
                            ? (b.energyYearWater.tt / b.build["area"]) : 0,
                    });
                    $scope.data.elecAvgPerson.push({
                        name: $scope.data.buildingSortName[ind],
                        percent: (maxElecAvgPerson > 0 
                            && b.hasOwnProperty("build") && b["build"].hasOwnProperty("person") 
                            && b.hasOwnProperty("energyYearElec") && b["energyYearElec"].hasOwnProperty("tt")
                            ? (b.energyYearElec.tt / b.build["person"]) / maxElecAvgPerson : 0) * 100 + "%",
                        val: maxElecAvgPerson > 0 
                            && b.hasOwnProperty("build") && b["build"].hasOwnProperty("person") 
                            && b.hasOwnProperty("energyYearElec") && b["energyYearElec"].hasOwnProperty("tt")
                            ? (b.energyYearElec.tt / b.build["person"]) : 0,
                    });
                    $scope.data.waterAvgPerson.push({
                        name: $scope.data.buildingSortName[ind],
                        percent: (maxWaterAvgPerson > 0 
                            && b.hasOwnProperty("build") && b["build"].hasOwnProperty("person") 
                            && b.hasOwnProperty("energyYearWater") && b["energyYearWater"].hasOwnProperty("tt")
                            ? (b.energyYearWater.tt / b.build["person"]) / maxWaterAvgPerson : 0) * 100 + "%",
                        val: maxElecAvgPerson > 0 
                            && b.hasOwnProperty("build") && b["build"].hasOwnProperty("person") 
                            && b.hasOwnProperty("energyYearWater") && b["energyYearWater"].hasOwnProperty("tt")
                            ? (b.energyYearWater.tt / b.build["person"]) : 0,
                    });

                    // 当月总发电量
                    if(b.hasOwnProperty("energyListElec") && b.energyListElec.length > 0) {
                        b.energyListElec.map(be => {
                            if($scope.data.elecMap.hasOwnProperty(be.date_time)) {
                                $scope.data.elecMap[be.date_time] += be.tt;
                            } else {
                                $scope.data.elecMap[be.date_time] = be.tt;
                            }
                        });
                    }
                    if(b.hasOwnProperty("energyListWater") && b.energyListWater.length > 0) {
                        b.energyListWater.map(be => {
                            if($scope.data.waterMap.hasOwnProperty(be.date_time)) {
                                $scope.data.waterMap[be.date_time] += be.tt;
                            } else {
                                $scope.data.waterMap[be.date_time] = be.tt;
                            }
                        });
                    }
                });
                console.log($scope.data.elecMap);
                console.log($scope.data.waterMap);
                for(var o in $scope.data.elecMap) {
                    $scope.data.elecList.push({
                        val: $scope.data.elecMap[o],
                        key: o,
                    });
                }
                for(var o in $scope.data.waterMap) {
                    $scope.data.waterList.push({
                        val: $scope.data.waterMap[o],
                        key: o,
                    });
                }

                // 画图
                var opt = copy(BarOption);
                opt.series[0].data = fmtEChartData({
                    datas: $scope.data.elecList,
                    key: "recordTime",
                    unit: "度",
                    val: "daily_energy",
                });
                opt.series[1].data = fmtEChartData({
                    datas: $scope.data.waterList,
                    key: "recordTime",
                    unit: "吨",
                    val: "daily_energy",
                });
                drawEChart($scope.dailyEnergy, opt);

                // 缓存数据
                global.setLocalObject("cacheData", cacheData, 30*60*1000);
            });
        }
    };

    

    // 给图表option添加更多属性
    function addMoreFeature(option) {
        var newFeature = {
            grid: {
                left: '3%',
                right: '3%',
                bottom: '3%',
                top: '3%',
                containLabel: true
            },
            xAxis : {
                type: 'time',
                splitLine: {
                    show: false
                },
                axisLine: {
                    lineStyle: {
                        color: "rgba(255,255,255,0.75)"
                    }
                }
            },
            yAxis : {
                type: 'value',
                splitLine: {
                    lineStyle: {
                        color: "rgba(255,255,255,0.05)"
                    }
                },
                axisLine: {
                    lineStyle: {
                        color: "rgba(255,255,255,0.75)"
                    }
                }
            },
        };
        option = {...option, ...newFeature};
        return option;
    }

    // 刷新实时时间
    function resetIntervalTime() {
        clearInterval($scope.timeInterval);
        $scope.timeInterval = setInterval(function () {
            let n = moment($scope.now).add(1, "second");
            $scope.$apply(function(){
                $scope.now = n.format("YYYY-MM-DD HH:mm:ss");
                $scope.weekDay = n.format('dddd');
                $scope.date = n.format('MoDo');
                $scope.time = n.format("HH:mm:ss");
            });
        }, 1000);
    }

    function copy(obj){
        var newObj = obj;
        if (obj && typeof obj === "object") {
            newObj = Object.prototype.toString.call(obj) === "[object Array]" ? [] : {};
            for (var i in obj) {
                newObj[i] = copy(obj[i]);
            }
        }
        return newObj;
    }

    // 具体画图
    function drawEChart(echart, opt) {
        echart.setOption(opt, true);
        echart.resize();
    }

    // 格式化成图表需要的数据
    function fmtEChartData(data){
        var tmpSeriesData = [];
        data.datas.map(function (p) {
            tmpSeriesData.push([
                new Date(p.key),
                (p.val == "" ? 0 : parseFloat(p.val).toFixed(2))
            ])
        });
        return tmpSeriesData;
    }

    /* 环保计算
    * 标准燃煤节约（kg）    ＝ 电站发电量（kWh）＊0.3250（等效因子 kg/kWh）
    * 二氧化碳减排量（kg）  ＝ 电站发电量（kWh）＊0.9171（等效因子 kg/kWh）
    * 二氧化硫减排量（kg）  ＝ 电站发电量（kWh）＊0.0023（等效因子 kg/kWh）
    * 氮化物减排量（kg）    ＝ 电站发电量（kWh）＊0.0037（等效因子 kg/kWh）
    * 烟尘减排量（kg）     ＝ 电站发电量（kWh）＊0.0004（等效因子 kg/kWh）
    */
    function transEnergyToGreen (energy) {
        return {
            coal: energy*0.3250,
            co2: energy*0.9171,
            so2: energy*0.0023,
            nox: energy*0.0037,
            smoke: energy*0.0004,
            tree: energy*0.9171/18.334,
        }
    }

    function copy(obj){
        var newObj = obj;
        if (obj && typeof obj === "object") {
            newObj = Object.prototype.toString.call(obj) === "[object Array]" ? [] : {};
            for (var i in obj) {
                newObj[i] = copy(obj[i]);
            }
        }
        return newObj;
    }

    // 初始化各种图表
    function initCharts() {
        //$scope.leftPie = echarts.init(document.getElementById(leftPieId));
    };

    // 初始化地图
    function initMap() {
        map = new AMap.Map(mapId,{
            resizeEnable: true,
            rotateEnable:true,
            pitchEnable:true,
            //zoom: mapZoomMin,
            // pitch:45,
            pitch:0,
            rotation:0,
            //viewMode:'3D',//开启3D视图,默认为关闭
            expandZoomRange:true,
            //zooms:[mapZoomMin,mapZoomMaxLimit],
        });
    }

    

    // 获取电站运维信息详情
    function getPlantTicketDetail(tiCode) {
        var param = {
            _method: 'get',
            _url: settings.ajax_func.getPlantTicketDetail + "/"+tiCode,
        };
        return new Promise(function(resolve, reject) {
            global.ajax($scope, param,
                function (data) {
                    if(typeof(data) == "object" &&
                        Object.prototype.toString.call(data).toLowerCase() == "[object object]" && !data.length){
                        resolve(data);
                    } else {
                        reject(data);
                    }
                });
        });
    }

    function resize() {
       var ratioX = $(window).width() / 2112;
       var ratioY = $(window).height() / 832;
       $("body").css({
          transform: "scale(" + ratioX + "," + ratioY + ")",
          transformOrigin: "left top",
          backgroundSize: "100% 100%"
       });
       $("html").css({'overflow':'hidden'})
    }


    // 初始化函数执行
    (function init_data() {

        // 设置全局提供map调用
        window.refreshDatas = refreshDatas;
        window.refreshDatas();

        //resize();

        $scope.dailyEnergy = echarts.init(document.getElementById("dailyEnergy"));

        // 初始化地图
        //initMap();

        // 初始化各种图表
        initCharts();

        //$scope.getLocalWeather();
        resetIntervalTime();

        // 每N分钟定时刷新所有电站数据
        window.refreshPlantsDatasInterval = setInterval(function () {
            refreshDatas();
        }, refreshInterval);

        setInterval(function(){
            $scope.data.videoInd += 1;
            $scope.data.videos = videos.slice(4*($scope.data.videoInd%3), 4*(1+$scope.data.videoInd%3));
        }, 60*1000);

    })();
});