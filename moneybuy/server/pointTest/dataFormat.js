const pointConfig = require('./pointConfig')

function MyDate() {
    /**
     * 扩展Date的Format函数
     * 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符， 
     * 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字) 
     * @param {[type]} fmt [description]
     */
    Date.prototype.Format = function(fmt) { //author: meizz 
        var o = {
            "M+": this.getMonth() + 1, //月份 
            "d+": this.getDate(), //日 
            "h+": this.getHours(), //小时 
            "m+": this.getMinutes(), //分 
            "s+": this.getSeconds(), //秒 
            "S": this.getMilliseconds() //毫秒 
        };
        if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
            if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
    }

    Date.prototype.addDays = function(d) {
        this.setDate(this.getDate() + d);
    };
    
    Date.prototype.addWeeks = function(w) {
        this.addDays(w * 7);
    };
    
    Date.prototype.addMonths= function(m) {
        var d = this.getDate();
        this.setMonth(this.getMonth() + m);
        if (this.getDate() < d) {
            this.setDate(0);
        }   
    };
    
    Date.prototype.mulMonths= function(m) {
        var d = this.getDate();
        this.setMonth(this.getMonth() - m);
        if (this.getDate() > d) {
           this.setDate(0);
        }
    };

    Date.prototype.addYears = function(y) {
        var m = this.getMonth();
        this.setFullYear(this.getFullYear() + y);
        if (m < this.getMonth()) {
            this.setDate(0);
        }
    };
    
    Date.prototype.mulYears = function(y) {
        var m = this.getMonth();
        this.setFullYear(this.getFullYear() - y);
        if (m > this.getMonth()) {
            this.setDate(0);
        }
    };
}
module.exports.MyDate = MyDate 

var setOprationSetting = function (responseObj) {
    var PRINCIPAL_AMOUNT_home = pointConfig.devType.home_principal_amount
    var VALUATIONL_AMOUNT_home = pointConfig.devType.home_valuation_amount

    var PRINCIPAL_AMOUNT_71 = pointConfig.devType.course71_principal_amount
    var VALUATION_AMOUNT_71 = pointConfig.devType.course71_valuation_amount

    var PRINCIPAL_AMOUNT_72 = pointConfig.devType.course72_principal_amount 
    var VALUATION_AMOUNT_72 = pointConfig.devType.course72_valuation_amount

    if (responseObj.REAL_POINT != null) {
        responseObj.REAL_POINT = pointConfig.devType.myRealAmount
    }

    /// /////////////////////// Home ///////////////////////////////////////////
    if (responseObj.PROFIT_LOSS_INFO_TOTAL != null) {
        responseObj.PROFIT_LOSS_INFO_TOTAL.PRINCIPAL_AMOUNT = PRINCIPAL_AMOUNT_home
        responseObj.PROFIT_LOSS_INFO_TOTAL.VALUATION_AMOUNT = VALUATIONL_AMOUNT_home
    }
    if (responseObj.PROFIT_LOSS_INFO_BRAND_LIST != null) {
        for(var i = 0; i < responseObj.PROFIT_LOSS_INFO_BRAND_LIST.length; i++) {
            if (responseObj.PROFIT_LOSS_INFO_BRAND_LIST[i].PROFIT_LOSS_INFO != null) {
                if (responseObj.PROFIT_LOSS_INFO_BRAND_LIST[i].BRAND_ID == 71)  {
                    responseObj.PROFIT_LOSS_INFO_BRAND_LIST[i].PROFIT_LOSS_INFO.PRINCIPAL_AMOUNT_71 = PRINCIPAL_AMOUNT_71
                    responseObj.PROFIT_LOSS_INFO_BRAND_LIST[i].PROFIT_LOSS_INFO.VALUATION_AMOUNT = VALUATION_AMOUNT_71
                }
                if (responseObj.PROFIT_LOSS_INFO_BRAND_LIST[i].BRAND_ID == 72)  {
                    responseObj.PROFIT_LOSS_INFO_BRAND_LIST[i].PROFIT_LOSS_INFO.PRINCIPAL_AMOUNT_72 = PRINCIPAL_AMOUNT_72
                    responseObj.PROFIT_LOSS_INFO_BRAND_LIST[i].PROFIT_LOSS_INFO.VALUATION_AMOUNT = VALUATION_AMOUNT_72
                }
            }
        }
        console.log( responseObj.PROFIT_LOSS_INFO_BRAND_LIST)
    }
    /// /////////////////////// course 71 72  /////////////////////////////////////////// 
    if (responseObj.OPERATION_INFO_LIST != null) {
        for(var i = 0; i < responseObj.OPERATION_INFO_LIST.length; i++) {
            if (responseObj.OPERATION_INFO_LIST[i].PROFIT_LOSS_INFO != null) {
                if (responseObj.OPERATION_INFO_LIST[i].BRAND_ID == 71)  {
                    responseObj.OPERATION_INFO_LIST[i].PROFIT_LOSS_INFO.PRINCIPAL_AMOUNT = PRINCIPAL_AMOUNT_71
                    responseObj.OPERATION_INFO_LIST[i].PROFIT_LOSS_INFO.VALUATION_AMOUNT = VALUATION_AMOUNT_71
                }
                if (responseObj.OPERATION_INFO_LIST[i].BRAND_ID == 72)  {
                    responseObj.OPERATION_INFO_LIST[i].PROFIT_LOSS_INFO.PRINCIPAL_AMOUNT = PRINCIPAL_AMOUNT_72
                    responseObj.OPERATION_INFO_LIST[i].PROFIT_LOSS_INFO.VALUATION_AMOUNT = VALUATION_AMOUNT_72
                }
            }
        }
    }
    if (responseObj.PROFIT_LOSS_INFO != null) {
        if (responseObj.BRAND_ID == 71)  {
            responseObj.PROFIT_LOSS_INFO.PRINCIPAL_AMOUNT = PRINCIPAL_AMOUNT_71
            responseObj.PROFIT_LOSS_INFO.VALUATION_AMOUNT = VALUATION_AMOUNT_71
        }
        if (responseObj.BRAND_ID == 72)  {
            responseObj.PROFIT_LOSS_INFO.PRINCIPAL_AMOUNT = PRINCIPAL_AMOUNT_72
            responseObj.PROFIT_LOSS_INFO.VALUATION_AMOUNT = VALUATION_AMOUNT_72
        }
    }
    return responseObj
}
module.exports.setOprationSetting = setOprationSetting


var commonSetting = function (responseObj) {
    var MAINTENANCE_FLG = pointConfig.devType.MAINTENANCE_FLG
    responseObj.MAINTENANCE_FLG = MAINTENANCE_FLG
    return responseObj
}
module.exports.commonSetting = commonSetting