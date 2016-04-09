/* 数据格式演示
 var aqiSourceData = {
 "北京": {
 "2016-01-01": 10,
 "2016-01-02": 10,
 "2016-01-03": 10,
 "2016-01-04": 10
 }
 };
 */

// 以下两个函数用于随机模拟生成测试数据
function getDateStr(dat) {
    var y = dat.getFullYear();
    var m = dat.getMonth() + 1;
    m = m < 10 ? '0' + m : m;
    var d = dat.getDate();
    d = d < 10 ? '0' + d : d;
    return y + '-' + m + '-' + d;
}
function randomBuildData(seed) {
    var returnData = {};
    var dat = new Date("2016-01-01");
    var datStr = '';
    for (var i = 1; i < 92; i++) {
        datStr = getDateStr(dat);
        returnData[datStr] = Math.ceil(Math.random() * seed);
        dat.setDate(dat.getDate() + 1);
    }
    return returnData;
}

var aqiSourceData = {
    "北京": randomBuildData(500),
    "上海": randomBuildData(300),
    "广州": randomBuildData(200),
    "深圳": randomBuildData(100),
    "成都": randomBuildData(300),
    "西安": randomBuildData(500),
    "福州": randomBuildData(100),
    "厦门": randomBuildData(100),
    "沈阳": randomBuildData(500)
};

// 用于渲染图表的数据
var chartData = {};
// 记录当前页面的表单选项
var pageState = {
    nowSelectCity: "北京",
    nowGraTime: "day"
};

/**                                                                                                                                                               
 * 渲染图表
 */
function renderChart() {
    var display = document.getElementById("aqi-display-chart");
    document.getElementById("chart-title").innerHTML =  "<p>"+pageState.nowSelectCity+"空气质量指数统计图</p>";
    var displayContent = "";
    var rendercolor = function (height){
        if(height<=120){
            return "low";
        }else if(height>120 && height<=240){
            return "low-middle";
        }else if(height>240 && height<=360){
            return "middle";
        }else if(height>360 && height<480){
            return "middle-high";
        }else{
            return "high";
        }
    }
    switch (pageState.nowGraTime){
            case "day":
                for (var prop in chartData){
                    displayContent += "<p title='"+prop+"' class='day "+rendercolor(chartData[prop])+"' style='height: "+chartData[prop]+"px'></p>";
                }
                break;
            case "week":
                for (var prop in chartData){
                    displayContent += "<p title='"+prop+"' class='week "+rendercolor(chartData[prop])+"' style='height: "+chartData[prop]+"px'></p>";
                }
                break;
            case "month":
                for (var prop in chartData){
                    displayContent += "<p title='"+prop+"' class='month "+rendercolor(chartData[prop])+"' style='height: "+chartData[prop]+"px'></p>";
                }
                break;
        }
    display.innerHTML = displayContent;

}

/**
 * 日、周、月的radio事件点击时的处理函数
 */
function graTimeChange() {
    // 确定是否选项发生了变化
    var graTimeChecked = "";
    [].forEach.call(document.getElementsByName("gra-time"), function (ele) {
        if (ele.checked) {
            graTimeChecked = ele.value;
        }
    });
    if (graTimeChecked === pageState.nowGraTime) {
        return;
    }
    // 设置对应数据
    pageState.nowGraTime = graTimeChecked;
    // 调用图表渲染函数
    initAqiChartData();

}

/**
 * select发生变化时的处理函数
 */
function citySelectChange() {
    // 确定是否选项发生了变化
    var selectContent = document.getElementById("city-select").value;
    if (pageState.nowSelectCity !== selectContent) {
        // 设置对应数据
        pageState.nowSelectCity = selectContent;
        // 调用图表渲染函数
        initAqiChartData();
    }
}

/**
 * 初始化日、周、月的radio事件，当点击时，调用函数graTimeChange
 */
function initGraTimeForm() {
    document.getElementById("form-gra-time").addEventListener('click', graTimeChange);
}

/**
 * 初始化城市Select下拉选择框中的选项
 */
function initCitySelector() {
    // 读取aqiSourceData中的城市，然后设置id为city-select的下拉列表中的选项
    var select = document.getElementById("city-select");
    var selectContent = "";
    for (var city in aqiSourceData) {
        selectContent += "<option value='"+city+"'>" + city + "</option>";
    }
    select.innerHTML = selectContent;
    // 给select设置事件，当选项发生变化时调用函数citySelectChange
    select.addEventListener('change', citySelectChange);
}

/**
 * 初始化图表需要的数据格式
 */
function initAqiChartData() {
    // 将原始的源数据处理成图表需要的数据格式
    var sourceData = aqiSourceData[pageState.nowSelectCity];
    // 计算平均数
    // var average = function(objdata){
    //     var sum=0,count=0;
    //     for(var prop in objdata){
    //         sum += objdata[prop];
    //         count++;
    //     }
    //     return Math.ceil(sum/count);
    // };
    // 处理好的数据存到 chartData 中
    switch (pageState.nowGraTime) {
        case "day":
            chartData = {};
            chartData = sourceData;
            break;
        case "week":
            //weekAndDay:一个存储一个月的中的一天对应的是本月的第几个周的对象

            chartData = {};
            var wd = new Date(Object.keys(sourceData)[0]).getDay(),weekcount=1;
            var sum = 0, count = 0;
            for (var prop in sourceData) {
                sum += sourceData[prop];
                count++;
                if (wd == 6) {
                    chartData['第'+weekcount+'周'] = Math.ceil(sum / count);
                    weekcount++;
                    count = 1;
                    sum = 0;
                    wd=0;
                } else {
                    wd++;
                }
            }
            chartData['第'+weekcount+'周'] = Math.ceil(sum / count);
            break;
        case "month":
            chartData = {};
            var m = Object.keys(sourceData)[0].charAt(6);
            var sum = 0, count = 0;
            for (var prop in sourceData) {
                if (m === prop.charAt(6)) {
                    sum += sourceData[prop];
                    count++;
                } else {
                    var attr = m + '月';
                    chartData[attr] = Math.ceil(sum / count);
                    m = prop.charAt(6)
                    sum = sourceData[prop];
                    count = 1;
                }
            }
            chartData[m + '月'] = Math.ceil(sum / count);
            break;
    }
    renderChart();
}

/**
 * 初始化函数
 */
function init() {
    initGraTimeForm();
    initCitySelector();
    initAqiChartData();
}

init();
