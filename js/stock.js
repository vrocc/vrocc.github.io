var stockNameMap = new Map();

var stockCodeArr = [
    '600519',
    '601318',
    '600036',
    '000651',
    '601166',
    // '000002',
    // '600887',
    // '600016',
    // '002594',
    // '002024',
];

function getQueryString(name, de) {
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
    var r = window.location.search.substr(1).match(reg);
    if (r != null) {
        return unescape(r[2]);
    }
    return de;
}
Date.prototype.addDays = function(number) {
    var adjustDate = new Date(this.getTime() + 24 * 60 * 60 * 1000 * 30 * number)
    return adjustDate;
}

function dateFormat(fmt, date) {
    let ret;
    try {
        date.getFullYear().toString();
    } catch (error) {
        console.log(error);
    }
    const opt = {
        "Y+": date.getFullYear().toString(), // 年
        "m+": (date.getMonth() + 1).toString(), // 月
        "d+": date.getDate().toString(), // 日
        "H+": date.getHours().toString(), // 时
        "M+": date.getMinutes().toString(), // 分
        "S+": date.getSeconds().toString() // 秒
            // 有其他格式化字符需求可以继续添加，必须转化成字符串
    };
    for (let k in opt) {
        ret = new RegExp("(" + k + ")").exec(fmt);
        if (ret) {
            fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
        };
    };
    return fmt;
}

var clone = function(obj) {
    return JSON.parse(JSON.stringify(obj));
};

(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else if (typeof exports === 'object') {
        module.exports = factory();
    } else {
        root.hash = factory();
    }
}(this, function() {
    /**
        A string hashing function based on Daniel J. Bernstein's popular 'times 33' hash algorithm.
        @param {string} text - String to hash
        @return {number} Resulting number.
    */
    function hash(text) {
        'use strict';

        var hash = 5381,
            index = text.length;

        while (index) {
            hash = (hash * 33) ^ text.charCodeAt(--index);
        }

        return hash >>> 0;
    }
    return hash;
}));

function jsonp(options) {
    return new Promise((resolve, reject) => {
        let callbackID = "jsonp_" + hash(options.url), //随机生成callbackID
            container = document.getElementsByTagName('head')[0],
            scriptNode = document.createElement("script"),
            data = options.data || {},
            url = options.url,
            params = [];
        data["callback"] = options.data.callback ? options.data.callback : callbackID; //加上callback参数，服务端接口数据根据callback返回函数
        for (let key in data) { //遍历参数,把参数组成数组[name=zhangsan,age:18]
            params.push(key + "=" + data[key]);
        }
        if (url.indexOf('hq.sinajs.cn') < 0) {
            url += (/\?/.test(url)) ? '&' : '?'; //判断原url是否已经有‘？’，如有给url拼接‘&’，则拼接‘？’
            url += params.join('&');
        }
        //url拼接参数最终变成www.baidu.com/?name=zhangsan&age=18&callback=jsonp_1526006949894_87849
        scriptNode.id = options.data.code; //设置script节点id以便后面删除
        scriptNode.src = url;
        if (!window[callbackID]) {
            window[callbackID] = function(response) {
                //定义全局函数，注意函数名是callbackID是跟上面定义的参数data["callback"]=callbackID是一致的
                // 服务端接口是根据客户端传的callback而返回callbackID({"code":0,"error":"操作成功","data":{}})
                var id = response.symbol;
                if (id) {
                    var name = response.name;

                    if (response.detail) {
                        name = response.detail.nameCN;
                        // id = 'hk' + id;
                    }

                    if (name == undefined) {
                        name = stockNameMap.get(id);
                    }

                    resolve({
                        code: name,
                        data: response
                    });
                } else {
                    var info = response.items[0];

                    var name = info.nameCN;
                    var shares = info.shares;
                    var symbol = info.symbol;

                    resolve({
                        symbol: symbol,
                        name: name,
                        shares: shares
                    });
                }
                //当客服端请求接口时即调用了函数callbackID({"code":0,"error":"操作成功","data":{}})，刚好是这里我们定义
                //的全局函数，于是就拿到了数据response
                let script = document.getElementById(id)
                if (script != null) {
                    container.removeChild(script) //通过script节点id删除script节点
                } else {
                    throw new Error();
                }
            }
        }

        scriptNode.type = "text/javascript";
        try {
            container.appendChild(scriptNode)
        } catch (error) {

        }
    })
}

var variableName = function(code) {
    // hq_str_sh600519
    return "hq_str_" + (code >= 600000 ? 'sh' : 'sz') + code;
}

function loadScript(url, callback) {
    let script = document.createElement('script');
    if (script.readyState) { // IE
        script.onreadystatechange = function() {
            if (script.readyState === 'loaded' || script.readyState === 'complete') {
                script.onreadystatechange = null;
                // console.log(globalThis[variableName(stockCodeArr[0])]);
                callback();
            }
        }
    } else { // 其他浏览器
        script.onload = function() {
            stockCodeArr.forEach(e => {
                var prefix = e >= 600000 ? 'SSE' : 'SZSE';
                var code = prefix + e;
                var name = globalThis[variableName(e)].split(",")[0];
                stockNameMap.set(e, name);
            });
            // console.log(stockNameMap);
            callback && callback();
        }
    }
    script.src = url;
    container = document.getElementsByTagName('head')[0],
        container.appendChild(script);
}

var loadStockNames = function(arr) {
    var stockCodeArr = [];
    for (let i = 0; i < arr.length; i++) {
        const e = arr[i];
        stockCodeArr.push((e >= 600000 ? 'sh' : 'sz') + arr[i]);
    }
    var url = "http://hq.sinajs.cn/?list=" + stockCodeArr.toString();
    loadScript(url);
    return stockNameMap;
}



var getStockKlineList = function(arr, dateUnit) {
    dateUnit = dateUnit ? dateUnit : 'month'
    var r = [];
    arr.forEach(code => {
        var market = '';
        if (code.indexOf('hk') > -1 && code.startsWith('hk')) {
            code = code.substr(2);
            market = 'hkstock';
        } else if (!isNaN(code)) {
            market = 'astock';
        }
        //          https://www.laohu8.com/proxy/stock/stock_info/candle_stick/month/BABA
        var nurl = "https://www.laohu8.com/proxy/stock/" + market + "/stock_info/candle_stick/" + dateUnit + "/" + code + "?manualRefresh=true"
        var url = "http://jsonp.vroc.tech/jsonp?url=" + encodeURIComponent(nurl);
        r.push(jsonp({
            url: url,
            data: {
                code: code
            }
        }));
    });
    return r;
}

var getStockInfo = function(arr) {
    var r = [];
    arr.forEach(code => {
        var market = '';
        if (code.indexOf('hk') > -1 && code.startsWith('hk')) {
            code = code.substr(2);
            market = 'hkstock';
        } else if (!isNaN(code)) {
            market = 'astock';
        }
        // https://www.laohu8.com/proxy/stock/astock/stock_info/detail/600519
        var nurl = "https://www.laohu8.com/proxy/stock/" + market + "/stock_info/detail/" + code;
        var url = "http://jsonp.vroc.tech/jsonp?url=" + encodeURIComponent(nurl);
        r.push(jsonp({
            url: url,
            data: {
                // code: code
            }
        }));
    });
    return r;
}

var getStockNameToStockArrMap = function(raw) {
    var nameToStockArrMap = new Map();
    for (let i = 1; i < raw.length; i++) {
        const e = raw[i];
        var itTime = new Date(e[1] / 10000, e[1] / 100 % 100, e[1] % 100);

        var dateStr = dateFormat('YYYY/mm/dd', itTime);
        var innerArr = nameToStockArrMap.get(e[0]);
        if (innerArr) {
            innerArr.push(
                [dateStr, e[2], e[0], 1]
            );
        } else {
            innerArr = new Array();
            innerArr.push(
                [dateStr, e[2], e[0], 0]
            );
        }
        // codeName, List<Array> []
        var stockName = e[0];
        nameToStockArrMap.set(stockName, innerArr)
    }
    return nameToStockArrMap;
}


function csvToObject(csvString) {
    var csvarry = csvString.split("\r\n");
    var datas = [];
    var headers = csvarry[0].split(",");
    for (var i = 1; i < csvarry.length; i++) {
        var data = {};
        var temp = csvarry[i].split(",");
        for (var j = 0; j < temp.length; j++) {
            data[headers[j]] = temp[j];
        }
        datas.push(data);
    }
    return datas;
}

function FuncCSVInport() {
    $("#csvFileInput").val("");
    $("#csvFileInput").click();
}

function readCSVFile(obj) {
    var reader = new FileReader();
    reader.readAsText(obj.files[0]);
    reader.onload = function() {
        var data = csvToObject(this.result);
        console.log(data); //data为csv转换后的对象
    }
}


$.extend({
    csv: function(url, f) {
        $.get(url, function(record) {
            //按回车拆分
            record = record.split(/\n/);

            var timeLineArr = record[0].split(",")
            timeLineArr = timeLineArr.slice(1, timeLineArr.length);

            var data = new Array();
            for (let i = 1; i < record.length; i++) {
                const line = record[i];
                var items = line.split(",")
                var code = items[0];
                if (items.length <= 1) {
                    continue;
                }
                var values = items.slice(1, items.length).map(Number);
                for (let i = 0; i < values.length; i++) {
                    const value = values[i];
                    values[i] = value.toFixed(2);
                }
                values = values.map(Number);
                data.push({
                    code: code,
                    values: values,
                    times: timeLineArr
                });
            }


            // result:
            // {code: "上海机场", data: {…}}
            // data: {ret: 0, symbol: "600009", period: "month", preClose: 8.91, serverTime: 1613876999001, …}
            f.call(this, data);
            data = null;
        });
    }
});