var myChart;
var initConfig = function () {
    // 设置合理的坐标
    var mainWidth = $('.container').width() * 1;
    var mainHeight = mainWidth * 0.50;
    $("#main").height(mainHeight + "px").width(mainWidth + "px");

    var hoverLeft = $('#main').offset().left + $('#main').outerWidth() * 0.1 + 16;
    $('#lineHover').css("left", hoverLeft + "px");

    var x = $('body').outerWidth() - $('.container').outerWidth();
    x = x < 0 ? 0 : x
    var left = (x) / 2.0 + $('.container').outerWidth() * (1 - 0.25) + 5;
    $('#mainTip').css("left", left + "px");
    var rawTop = $('#main').offset().top + $('#main').height() * 0.11 - 30;
    $('#mainTip').css("top", rawTop + "px");
    $('#lineHover').css("top", rawTop + "px");
    $('#lineHover').hide();

    var mainLeft = $('#main').offset().left;
    if (mainLeft > 1) {
        mainLeft = mainLeft / 2 - 120;
    }
    $('#inner-absolute').css("left", mainLeft + "px");

    // 基于准备好的dom，初始化echarts实例
    myChart = echarts.init(document.getElementById('main'), 'roma');
    myChart.showLoading({
        text: '数据正在努力加载...',
        fontSize: 80,
        spinnerRadius: 40,
        lineWidth: 10,
    });
    return myChart;
}

var initConfigForPhone = function () {
    // 设置合理的坐标
    var mainWidth = $('.container').width();
    var mainHeight = mainWidth * 0.53;
    // chart 长宽高
    $("#main").height(mainWidth + "px").width(mainHeight + "px");

    var left = $('#main').offset().left + $('#main').outerWidth() * 0.85;
    $('#mainTip').css("left", left + "px");
    var rawTop = $('#main').offset().top + $('#main').height() * 0.12 - 20;
    $('#mainTip').css("top", rawTop + "px");

    $('#dateText').css("margin-top", "275px");

    var mainLeft = $('#main').offset().left;
    if (mainLeft > 1) {
        mainLeft = mainLeft / 2;
    }
    mainLeft = -600;
    // left: -600px;
    $('#inner-absolute').css("left", mainLeft + "px");
    // height: 1650px;
    // width: 928px;
    $('#inner-absolute').css("height", 1650 + "px");
    $('#inner-absolute').css("width", 928 + "px");

    // 基于准备好的dom，初始化echarts实例
    myChart = echarts.init(document.getElementById('main'), 'roma', {
        renderer: 'svg'
    });
    return myChart;
}

function print2View(result) {
    var tb = [
        ["code", "time", "close"]
    ];
    var stockNames = [];
    result.forEach(e => {
        var stockName = e.code;
        if (stockName == undefined) {
            stockName = stockNameMap.get(e.data.symbol);
        }
        stockNames.push(stockName);

        for (let i = 0; i < e.times.length; i++) {
            var date = e.times[i];
            if (!date instanceof Date) {
                date = parseInt(date);
            }
            var close = e.values[i];
            tb.push([stockName, date, close]);
        }

    });

    // 19961231 => Map(1) "SZSE000651" => Array(6) ["SZSE000651", 19961231, 76.98, 31607500, 1872172541, 1.610460251046025]
    var map = new Map();

    for (let i = 1; i < tb.length; i++) {
        const e = tb[i];
        var stockName = e[0];
        var d = e[1];
        var date = d;
        if (typeof d != "string") {
            date = dateFormat("YYYYmmdd", d);
        }
        var innerMap = map.get(date) || new Map();
        innerMap.set(stockName, e);
        map.set(date, innerMap)
    }
    var cur = new Map();
    var res = [
        ["code", "time", "close"]
    ];
    var arrayObj = Array.from(map);
    arrayObj.sort(function (a, b) {
        return a[0] - b[0]
    });
    map = new Map(arrayObj.map(i => [i[0], i[1]]));

    // 0: {1960 => Map(2)}
    //     key: 1960
    //     value: Map(2)
    //     [[Entries]]
    //     0: {"中国" => Array(3)}
    //     1: {"印度" => Array(3)}
    // map = new Map(arrayObj.map(i => [i[0], i[1]]));
    // for (let i = 0; i < arrayObj.length; i++) {
    //     const date2Arr = arrayObj[i];
    //     var date = dateFormat("YYYYmmdd", date2Arr[0]);
    // }


    map.forEach(function (value, key) {
        if (value.size < stockNames.length) {
            stockNames.forEach(c => {
                if (value.get(c) && !cur) {
                    var data = clone(cur.get(c));
                    data[1] = key;
                    var stockName = stockNameMap.get(c);
                    value.set(stockName, data);
                }
            })
        }

        var objs = value.values();
        for (const it of objs) {
            res.push(it);
        }
        cur = value;
    });
    var stockList = [];
    var fisrtName = res[1][0];
    stockList.push(fisrtName);
    for (let i = 0; i < stockNames.length; i++) {
        const name = stockNames[i];
        if (name != fisrtName) {
            stockList.push(name);
        }
    }
    view(res, map, stockList);
}


function view(raw, map, codes) {
    var prev;
    var cl = 0;
    map.forEach(function (value, key) {

        var mapKeys = [...map.keys()];
        var keyIndex = mapKeys.indexOf(key);

        // value :{"格力电器" => Array(3)}
        for (let i = 0; i < value.size; i++) {
            const e = [...value.values()][i];
            var length = value.size;
            if (cl <= length) {
                cl = length;
                prev = key;
            } else {
                console.log(length);
                // {"格力电器" => Array(3)}
                var subMap = map.get(prev);
                subMap.forEach(function (sv, sk) {
                    if (!value.get(sk)) {
                        // key: 20200101
                        50
                        map.get([...map.keys()][50]).get("乐视退");
                        var needFill = false;;
                        for (let j = 0; j < mapKeys.slice(keyIndex).length; j++) {
                            const key = mapKeys.slice(keyIndex)[j];
                            var noneValue = map.get(key).get(sk);
                            if (noneValue) {
                                needFill = true;
                                break;
                            }
                        }

                        var dateInt = parseInt(key);
                        var date = new Date(dateInt / 10000, dateInt / 100 % 100 - 1, dateInt % 10);
                        var svClone = clone(sv);
                        svClone[1] = date;
                        value.set(sv[0], svClone);
                    }
                })
            }
        }



    })

    let keys = map.keys();
    let arr = [...keys];

    // 名称 2 股票列表上报
    var nameArr = codes;
    {
        // http://117.50.19.209/basic/stockQueryLog/query
        var nameStrList = codes.join();
        var settings = {
            // "url": "http://127.0.0.1:9097/basic/stockQueryLog/post",
            "url": "http://117.50.19.209/basic/stockQueryLog/post",
            "method": "POST",
            "timeout": 0,
            "headers": {
                "Content-Type": "application/json"
            },
            "data": JSON.stringify(
                {
                    "names": nameStrList,
                    "url": document.URL
                }
            ),
        };

        $.ajax(settings).done(function (response) {
            console.log(response);
        });
    }


    var title;
    var pageSubTitle = getQueryString("subTitle", "公众号「沉简投资」整理制作");
    if (nameArr.length == 1) {
        title = nameArr[0] + "历史走势图";
    } else {
        title = nameArr[0];
        for (let i = 1; i < nameArr.length; i++) {
            if (i >= 5) {
                // continue;
            }
            const name = nameArr[i];
            title += " vs " + nameArr[i];
        }
    }
    title = getQueryString("title", title);
    $('#pageTitle').html(title);
    $('#pageSubTitle').html(pageSubTitle);

    var yname = getQueryString("yname", "市值/亿美元");

    // 生成相关的div节点
    for (let i = 0; i < nameArr.length; i++) {
        const name = nameArr[i].hashCode();
        var zIndex = 1000 - i;
        $("#mainTip").append('<div id="code_' + name + '" style = "z-index: ' + zIndex + ';"></div>');
    }

    // 这里不好，应该过滤前面的就可以
    var initValue = new Map();
    map.forEach(function (value, key) {
        var length = value.size;
        if (length < nameArr.length) {
            // name, time, close
            var infoArr = [...value.values()][0];
            var sname = infoArr[0];
            for (let i = 0; i < nameArr.length; i++) {
                const name = nameArr[i];
                if (name != sname && !value.has(name)) {
                    // 初始值
                    var initV = initValue.get(name);
                    var v = initV == undefined ? 0 : '-';
                    value.set(name, [name, infoArr[1], v]);
                    initValue.set(name, 1);
                }
            }
        }
    });
    // var filteredItems = map.filter(function (item) {
    //     return value.size == nameArr.length;
    // });


    var seriesList = [];
    var start = false;
    var lineWidth = 5;
    var codes = getQueryString("codes");
    var isStock = codes != undefined;

    for (let i = 0; i < nameArr.length; i++) {
        const key = nameArr[i];
        seriesList.push({
            z: 100 - i,
            type: 'line',
            name: key,
            showSymbol: false,
            hoverAnimation: false,
            smooth: false,
            sampling: 'average',
            endLabel: {
                valueAnimation: true,
                show: true,
                color: 'inherit',
                connectNulls: false,
                // backgroundColor: '#f5f5dcab',

                fontSize: 30,
                // fontWeight: 'bolder',
                formatter: function (params) {
                    try {
                        var v = params.value[1];
                        if (v <= 0 || v == '-') {
                            return "";
                        }
                        var pValue = params.value[4];
                        var text2 = pValue.substr(0, 4);
                        var sdata = seriesList[0].data[0].value[4];
                        if (start || (start = pValue == sdata)) {
                            var add = isStock ? 0 : 1;
                            document.getElementById('dateText').innerHTML = parseInt(text2) + add;
                        }
                        var value = params.data.value[1];
                        var v = params.value[1];
                        if (v <= 0) {
                            return "";
                        }
                        var fixed = 2;
                        if (v > 100) {
                            fixed = 1;
                        }
                        if (v > 1000) {
                            fixed = 0;
                        }
                        v = v.toFixed(fixed);
                        var showValue = isShowValue();
                        if (showValue) {
                            return params.value[2] + ' ' + v;
                        } else {
                            return params.value[2]
                        }
                    } catch (error) {
                        console.log(error);
                    }
                }
            },
            data: new Array(),
            itemStyle: {
                normal: {
                    lineStyle: {
                        width: lineWidth // 0.1的线条是非常细的了
                    },
                },
            }
            // },
            // lineStyle: {
            //     normal: {
            //         width: 8,
            //         // color: '#48D8BF',
            //         shadowColor: 'inherit',
            //         shadowBlur: 3,
            //         shadowOffsetY: 0
            //     }
            // }

            // areaStyle: { //区域填充样式
            //     normal: {
            //         color: {
            //             type: 'linear',
            //             x: 0,
            //             y: 0,
            //             x2: 0,
            //             y2: 1,
            //             colorStops: [{
            //                 offset: 0,
            //                 color: 'rgba(0, 175, 88, 0.05)',
            //             },
            //             {
            //                 offset: 1,
            //                 color: 'rgba(0, 175, 88, 0.00)',
            //             },
            //             ],
            //             globaCoord: false,
            //         },
            //     },
            // },
        });
    }

    // 打印
    console.log(["NT", ...map.keys()].join("\t"));
    for (let i = 0; i < nameArr.length; i++) {
        const name = nameArr[i];
        var infos = [...map.values()];
        var closes = [name];
        for (let j = 0; j < infos.length; j++) {
            const infoMap = infos[j];
            var close = infoMap.get(name)[2];
            closes.push(close);
        }
        console.log(closes.join("\t"));
    }


    // 腾讯科技->Arr
    var count = 5 < map.size ? 5 : map.size;
    var seriesMap = new Map(seriesList.map(i => [i.name, i.data]));
    for (let i = 0; i < count; i++) {
        var valueArr = [...map.values()]
        var oneDayDataMap = valueArr[i];

        oneDayDataMap.forEach(function (value, key) {
            // value:[0: "腾讯控股", 1: 20040601, 2: 0.813]
            var curArr = seriesMap.get(key);
            const dataTime = value[1];
            // curArr.push(
            //     [itTime, value[2], value[0], curArr.length]
            // );

            var now;
            if (typeof dataTime == "string") {
                var dateInt = parseInt(dataTime);
                var date = new Date(dateInt / 10000, dateInt / 100 % 100 - 1, dateInt % 10);
                now = date;
            } else {
                now = new Date(dataTime);
            }
            var dateStr = [now.getFullYear(), now.getMonth() + 1, now.getDate()].join('/');
            var obj = {
                name: now.toString(),
                value: [
                    now,
                    value[2],
                    value[0],
                    curArr.length,
                    dateStr,
                    dataTime
                ]
            };
            curArr.push(obj);
        });
    }


    var cost = getQueryString("cost", 1.1);
    var duration = cost * 60 * 1000.0 / map.size;
    var colors = ['#FD2446', '#248EFD', '#C916F2', '#6669B1'];
    // https://zhuanlan.zhihu.com/p/96698715
    colors = ['#0B89CF', '#A7647A', '#806719', '#B4A9BC', '#FD2446', '#248EFD', '#C916F2', '#6669B1'];
    // colors = ['#BCC74F', '#F38F3A', '#712333', '#3B3A73'];
    option = {
        color: colors,
        title: {
            text: '听投资者说 股票排行榜',
            subtext: '股价走势图',
            subtextStyle: {
                color: '#233',
                fontFamily: 'serif',
                fontSize: 25,
            },
            textStyle: {
                color: '#233',
                fontFamily: 'serif',
                fontSize: 40,
            },
            left: "center",
            // top: "100",
            show: false
        },
        legend: {
            left: "center",
            bottom: 0,
            icon: "roundRect",
            itemWidth: 40,
            itemHeight: 25,
            itemGap: 30,
            textStyle: {
                fontSize: 20,
            }
        },
        xAxis: {
            name: '',
            type: 'time',
            splitLine: {
                show: false
            },
            // boundaryGap: [0, '20%'],
            axisLabel: {
                margin: 10,
                formatter: {
                    // 一年的第一个月显示年度信息和月份信息
                    year: '{yearStyle|{yyyy}}',
                    // quarter:'{monthStyle|{MM}月}',
                    month: '{monthStyle|{MM}月}',
                    day: '{dayStyle|{dd}}',
                },
                rich: {
                    yearStyle: {
                        // 让年度信息更醒目
                        color: '#000',
                        fontSize: 22,
                    },
                    monthStyle: {
                        color: '#000',
                        fontSize: 18,
                    },
                    dayStyle: {
                        color: '#000',
                        fontSize: 10,
                    }
                }
            },
            axisLine: {
                show: true,
                symbolSize: [10, 15],
                lineStyle: {
                    width: 3,

                    color: 'black'
                },
                opacity: 1,
                zlevel: 99
            },
            axisTick: {
                show: true,
                length: 10,
                lineStyle: {
                    color: 'black',
                    width: 3.4,
                    opacity: 0.5,
                },
                zlevel: 98,
                margin: 45,
            },

        },
        yAxis: [{
            scale: false,
            minInterval: 1,
            axisLabel: {
                show: true,
                formatter: '{value}',
                fontSize: 22,
                margin: 18,
                fontSize: 20,
            },
            position: 'left',
            // offset: -7,
            type: 'value',
            name: yname,
            nameTextStyle: {
                color: 'black',
                fontSize: 30,
                align: "center",
                padding: [0, 0, 20, 40],
            },
            splitLine: {
                show: false
            },
            axisLine: {
                show: true,
                symbolSize: [10, 15],
                lineStyle: {
                    width: 3,

                    color: 'black'
                },
                opacity: 1,
                zlevel: 99
            },
            axisTick: {
                show: true,
                length: 15,
                lineStyle: {
                    color: 'black',
                    width: 3.4,
                    opacity: 0.5,
                },
                zlevel: 98,
                margin: 45,
            },

            zlevel: 100,
            axisPointer: {
                show: true,
                type: 'line',
                lineStyle: {
                    color: '#eee'
                }
            },

            max: function (params) {
                // if (params.max < 800) {
                //     return 1000;
                // }
                return Math.round(params.max * 1.3);
            }
        }],
        grid: {
            top: '12%',
            left: '10%',
            right: '25%',
            bottom: '10%',
            containLabel: false,
        },
        series: seriesList,
        animationDuration: 10 * duration,
        animationEasing: 'linear',
        animationDurationUpdate: 1 * duration,
        animationEasingUpdate: 'linear',
        // animationDelayUpdate: function(idx) {
        //     // 越往后的数据延迟越大
        //     return idx * 100;
        // },
    };

    try {
        var shift = getQueryString("shift", 0);
        if (shift == 1) {
            $('#lineHover').show(10 * duration);
        }
        var object = myChart.setOption(option);
        myChart.on('timelinechanged', function (params) {
            console.log(params);
        });

    } catch (error) {
        console.log(error);
    }


    var i = count;
    var moveTime = 1;
    setTimeout(() => {
        var st = setInterval(() => {
            var valueArr = [...map.values()]
            var oneDayDataMap = valueArr[i];
            i++;
            if (!oneDayDataMap) {
                clearInterval(st);
                return;
            }
            oneDayDataMap.forEach(function (value, key) {
                // value:[0: "腾讯控股", 1: 20040601, 2: 0.813]
                var curArr = seriesMap.get(key);
                var itTime = value[1];
                // curArr.push(
                //     [itTime, value[2], value[0], curArr.length]
                // );

                var now;
                if (typeof itTime == "string") {
                    var dateInt = parseInt(itTime);
                    var date = new Date(dateInt / 10000, dateInt / 100 % 100 - 1, dateInt % 10);
                    now = date;
                } else {
                    now = new Date(itTime);
                }
                var dateStr = [now.getFullYear(), now.getMonth() + 1, now.getDate()].join('/');

                var length = curArr.length;

                var obj = {
                    name: now.toString(),
                    value: [
                        now,
                        value[2],
                        value[0],
                        length,
                        dateStr
                    ]
                };
                curArr.push(obj);
                var shift = getQueryString("shift", 0);

                if (curArr.length > 80 && shift == 1) {
                    curArr.shift();
                }
                // curArr
            });

            for (let j = 0; j < seriesList.length; j++) {
                const se = seriesList[j];
                se.endLabel.formatter = function (params) {
                    var v = params.value[1];
                    if (v <= 0 || v == '-') {
                        return "";
                    }
                    var text2 = params.data.value[4].substr(0, 4);
                    if (params.componentIndex == 0) {
                        document.getElementById('dateText').innerHTML = text2;
                    }

                    var color = params.color;
                    var data = se.data;
                    var prevValue = data[data.length - 1].value[1];
                    var pprevValue = data[data.length - 2].value[1];

                    if (prevValue == '-' && v != '-') {
                        prevValue = v;
                    }

                    if (pprevValue == '-' && v != '-') {
                        pprevValue = v;
                    }

                    var rangeY = myChart.getModel().getComponent('yAxis').axis.scale._extent;
                    var totalY = rangeY[1] - rangeY[0];

                    var height = $('#main').height() * 0.82;
                    var top = (height - height * v / totalY) * 0.98;
                    var prevValueHeight = (height - height * prevValue / totalY) * 1;
                    var pprevValueHeight = (height - height * pprevValue / totalY) * 1;
                    var m = (9 * prevValueHeight + pprevValueHeight) / 10;
                    var seriesName = params.seriesName;
                    var id = "#code_" + seriesName.hashCode();
                    var rawId = "code_" + seriesName.hashCode();

                    if ($(id).html() == "") {
                        snabbt(document.getElementById(rawId), {
                            position: [0, m, 0],
                            easing: 'linear',
                            duration: 0
                        });
                        snabbt(document.getElementById(rawId), {
                            position: [0, prevValueHeight, 0],
                            easing: 'linear',
                            duration: duration / 10.0
                        });
                        var showValue = isShowValue();
                        if (showValue) {
                            $(id).html(seriesName + " " + prevValue);
                        } else {
                            $(id).html(seriesName);
                        }
                        $(id).html(seriesName + " " + prevValue);
                        $(id).attr("v", prevValue);
                        $(id).css("color", color);
                    }

                    // var times = 30;
                    // for (let i = 1; i <= times; i++) {
                    //     setTimeout(function () {
                    //         var old = parseFloat($(id).attr("v"));
                    //         var split = (v - old) / times;
                    //         var r = old + split;
                    //         var fixed = 2;
                    //         if (r > 100) {
                    //             fixed = 1;
                    //         }
                    //         if (r > 1000) {
                    //             fixed = 0;
                    //         }
                    //         r = r.toFixed(fixed);
                    //         var showValue = isShowValue();
                    //         if (showValue) {
                    //             $(id).html(seriesName + " " + r);
                    //         } else {
                    //             $(id).html(seriesName);
                    //         }
                    //         $(id).attr("v", r);

                    //     }, 1.2 * duration / times * i)
                    // }



                    var fixed = 2;
                    if (v > 100) {
                        fixed = 1;
                    }
                    if (v > 1000) {
                        fixed = 0;
                    }

                    var old = parseFloat($(id).attr("v"));
                    const options = {
                        startVal: old,
                        decimalPlaces: fixed,
                        duration: duration / 1000.0,
                        useEasing: false,
                        useGrouping: false,
                        prefix: seriesName + ' ',				// 字首(数字的前缀,根据需要可设为 $,¥,￥ 等)
                    };
                    let demo = new CountUp(rawId, v, options);
                    if (!demo.error) {
                        demo.start(function () {
                            $(id).attr("v", v);
                        });
                    } else {
                        console.error(demo.error);
                    }

                    if (moveTime > 0.98) {
                        moveTime = moveTime * 0.9999;
                    }

                    snabbt(document.getElementById(rawId), {
                        position: [0, top, 0],
                        easing: 'linear',
                        duration: 1 * duration * moveTime
                    });

                    return "";
                }
            }

            try {
                myChart.setOption(option);
            } catch (error) {
                console.log(error);
            }


        }, 1 * duration);
    }, 9 * duration);

}