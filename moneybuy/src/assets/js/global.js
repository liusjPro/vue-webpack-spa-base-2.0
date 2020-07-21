// global util
window.ES = (function(){
    /**
     * global(namespace,选择器 IE>=8)
     * @param selector string 选择器 同浏览器对应版本CSS支持
     * @param box Element|null 指定DOM之下查询  默认document
     * @param es boolean|null 是否返回$实例  默认:false
     * @return Element|this|null null:未找到且multi=false时
     *      特别的: 所有参数为Element|Array|LikeArray|null,个数不限(可无参数),返回$实例
     *          若仅一个参数,且为$实例,则原值返回
     */
    const $ = function (selector, box, es) {
        if (this instanceof $) return this;
        if (typeof selector !== 'string') {
            if (arguments.length === 1 && selector instanceof $) return selector;
            let rtn = new $();
            for (let i = 0, obj; i < arguments.length; i++) {
                if (!(obj = arguments[i])) continue;
                if (obj instanceof Element) rtn[rtn.length++] = obj;
                else for (let k = 0; k < obj.length; k++) rtn[rtn.length++] = obj[k];
            }
            return rtn;
        }
        if (!box || box === document) {
            if (!es) return document.querySelector(selector);
            return $(document.querySelectorAll(selector));
        }
        let fn = es ? 'querySelectorAll' : 'querySelector',
            oid = box.id, pre = '#' + (oid || (box.id = '__es_selector')) + ' ',
            rtn = box[fn](pre + selector.replace(/,/g, ',' + pre));
        if (!oid) box.removeAttribute('id');
        return es ? $(rtn) : rtn;
    };
    // 原型链
    $.prototype = { container: $, length: 0 };
    /**
     * 遍历
     * @param func function 回调函数 this.func(Element, ...args, idx);
     * @param args mixed ... 传递给回调函数的参数
     * @return this
     */
    $.prototype.each = function (func, ...args) {
        for (let i = 0; i < this.length; i++) {
            func.call(this, this[i], ...args, i);
        }
        return this;
    };
    
    /**
     * 对象合并(后不修改前,无递归)
     * @param obj object|null 原始数据 null或非object:新json
     * @param ext object|null ... 扩展的数据,重复key不修改之前的
     * @return object 在obj参数上修改 或 obj为null或非object:新json
     */
    $.extend = function(obj, ...ext){
        if(!obj || typeof obj!=='object') obj = {};
        ext.forEach(ext => {
            if(!ext || typeof ext!=='object') return;
            Object.keys(ext).forEach(k => {
                if(obj[k]===undefined) obj[k] = ext[k];
            });
        });
        return obj;
    };

    /**
     * 对象合并(后替换前,无递归)
     * @param obj object|null 原始数据 null或非object:新json
     * @param ext object|null ... 合并的数据,重复key修改之前的
     * @return object 在obj参数上修改 或 obj为null或非object:新json
     */
    $.mixin = function (obj, ...ext) {
        if (!obj || typeof obj !== 'object') obj = {};
        ext.forEach(ext => {
            if (!ext || typeof ext !== 'object') return;
            Object.keys(ext).forEach(k => obj[k] = ext[k]);
        });
        return obj;
    };

    // local storageに保存されているチャートデータをhighchartの形式に変換
    // @param savedChart sample: {minDate:"2020/03/01",maxDate:"2020/03/03",data:[1000,0,1002]}
    // @return object sample: {"2020/03/01":1000,"2020/03/02":0,"2020/03/03":1002}
    $.getReadableChartData = function (savedChart) {
      if (!savedChart || typeof savedChart !== 'object' || !savedChart["minDate"] || !savedChart["maxDate"] || !savedChart["data"] || !Array.isArray(savedChart["data"])) {
        return {};
      }
      if($.calcDayOffset(savedChart["minDate"], savedChart["maxDate"]) + 1 != savedChart["data"].length)
        return {};
      let out = {};
      let iterateDate = $.date(savedChart['minDate']) * 1;
      savedChart["data"].forEach(item => {
        out[$.date.fmt(iterateDate, '[Y]/[M]/[D]')] = item;
        iterateDate += 86400000;  // plus 1 day
      });
      return out;
    }

    // calculate date diff between date1 and date2
    // @param date1/date2 string like yyyymmdd
    $.calcDayOffset = function(date1, date2) {
      // 1日あたりの秒数
      var MILLISECONDS_IN_A_DAY = 24 * 60 * 60 * 1000;
      var diffMillis = $.date(date2).getTime() - $.date(date1).getTime();
      // 小数点以下は切り上げ
      return Math.ceil(diffMillis / MILLISECONDS_IN_A_DAY)
    }

    // remove old data those date < startD
    // @param chartData like {minDate:"2020/03/01",maxDate:"2020/03/03",data:[1000,0,1001]}
    // @param startD like "2019/03/09"
    // @return mixed[false|charData] return false if no change
    $.removeOldChart = function(chartData, startD) {
      if(startD <= chartData.minDate) return false;
      if(chartData.minDate === "") return false;
      let offset = $.calcDayOffset(chartData.minDate, startD);
      if(chartData.data.length < offset) offset = chartData.data.length;
      chartData.data.splice(0, offset);
      if(chartData.data.length == 0) {
        // all data deleted
        chartData.minDate = "";
        chartData.maxDate = "";
      } else {
        chartData.minDate = startD;
      }
      return chartData;
    }

    // @param chartdata like [{"DATE": "2020/03/01","VALUE": 1000},{"DATE": "2020/03/03","VALUE": 1001}]
    // @param possibleLatestDate: will be padding until possibleLatestDate. like "2020/03/06"
    // @return {minDate:"2020/03/01",maxDate:"2020/03/03",data:[1000,0,1001]}
    $.padDateWithZero = function(chartdata, possibleLatestDate) {
      let converted = {minDate:"",maxDate:"",data:[]};
      let foundPossibleLatestDate = false;
      chartdata.forEach(item => {
        if (!item || typeof item !== 'object' || !item['DATE'] || !("VALUE" in item)) return;
        if(item['DATE'] == possibleLatestDate) {
          foundPossibleLatestDate = true;
          return true;
        }
      });
      if(chartdata.length > 0 && !foundPossibleLatestDate) {
        chartdata.push({"DATE": possibleLatestDate, "VALUE": 0});
      }
      chartdata.forEach(item => {
        if (!item || typeof item !== 'object' || !item['DATE'] || !("VALUE" in item)) {
          return;
        }
        let itemDate = item['DATE'].replace(/-/g, '/');
        if(converted.minDate === "") {
          converted.minDate = converted.maxDate = itemDate;
          converted.data.push(item['VALUE']);
          return;
        } else if(itemDate < converted.minDate) { // insert converted.minDate - item['DATE'] days data in the head
          let tmpArrLen = $.calcDayOffset(itemDate, converted.minDate);
          let tmpArr = new Array(tmpArrLen).fill(0);
          tmpArr[0] = item['VALUE'];
          converted.data.splice(0, 0, ...tmpArr);
          converted.minDate = itemDate;
        } else if(converted.minDate < itemDate && itemDate < converted.maxDate) { // replace the date
          // calcalute offset
          let offset = $.calcDayOffset(converted.minDate, itemDate);
          converted.data[offset - 1] = item['VALUE'];
        } else if(converted.maxDate < itemDate) {  // append to the tail
          let tmpArrLen = $.calcDayOffset(converted.maxDate, itemDate);
          let tmpArr = new Array(tmpArrLen).fill(0);
          tmpArr[tmpArrLen - 1] = item['VALUE'];
          converted.data.splice(converted.data.length, 0, ...tmpArr);
          converted.maxDate = itemDate;
        }
      });
      return converted;
    }
    /**
     * チャートデータのマージ(後ろのパラメータは一番左のパラメータに入れる。再帰しない。ただし２つの日付の間は空けないように０の値を埋める。)
     * @param to object|null  null或いはobjectじゃない場合、jsonに初期化する。{minDate:"2020/03/01",maxDate:"2020/03/03",data:[1000,1001,1002]}の形式
     * @param from object|null  取り込み対象データ。toと同じ形式
     * @return object toはfromのデータを取り込んだ結果。toと同じ形式。
     */
    $.mergeChartData = function (to, from) {
      if (!to || typeof to !== 'object' || !to["minDate"] || !to["maxDate"] || !to["data"] || !Array.isArray(to["data"]) ) {
        return from;
      };
      let outMinDate = to["minDate"]<from["minDate"]?to["minDate"]:from["minDate"];
      let outMaxDate = to["maxDate"]>from["maxDate"]?to["maxDate"]:from["maxDate"];
      let outData = to["data"];
      if(outMinDate < to["minDate"]) {
        outData.splice(0, 0, ...Array($.calcDayOffset(outMinDate, to["minDate"])).fill(0)); // fill the head
      }
      if(to["maxDate"] < outMaxDate) {
        outData.splice(outData.length, 0, new Array($.calcDayOffset(to["maxDate"], outMaxDate)).fill(0));  // fill the tail
      }
      outData.splice($.calcDayOffset(outMinDate, from["minDate"]), from["data"].length, ...from["data"]); // replace by from
      return {minDate: outMinDate, maxDate: outMaxDate, data: outData};
    };

    /** @var json base math */
    $.math = {};
    /**
     * 数学函数: 乘法(解决浮点数精度问题)
     * @param val number 乘值
     * @param args number ... 乘值
     * @return number|NaN
     */
    $.math.mul = function (val, ...args) {
        if (!args.length || (val *= 1) !== val) return NaN;
        for (let i = 0; i < args.length; i++) {
            let v = args[i]; if ((v *= 1) !== v) return NaN; v += ''; val += '';
            let n = (v.split('.')[1] || '') + (val.split('.')[1] || '');
            if (!n.length) val *= v;
            else val = (val.replace('.', '')) * (v.replace('.', '')) / Math.pow(10, n.length);
            if (val !== val) return NaN;
        }
        return val;
    };

    /**
     * 数字格式化(隔三位加',')
     * @param val number 要处理的数字
     * @param decimal boolean 是否处理小数部分  false:只处理整数部分
     * @return string
     */
    $.num = function(val, decimal=false){
        let minus=val<0;  val=(minus?-val:val)+'';
        let spt=val.split('.'), rem=spt[0].length%3||3;
        let rtn = spt[0].substr(0, rem);
        for(let i=rem; i<spt[0].length; i=i+3) rtn += ','+spt[0].substr(i, 3);
        if(spt[1]){
            if(!decimal) rtn += '.'+spt[1];
            else{
                rtn += '.'+spt[1].substr(0, 3);
                for(let i=3; i<spt[1].length; i=i+3) rtn += ','+spt[1].substr(i, 3);
            }
        }
        return minus ? '-'+rtn : rtn;
    };

    /**
     * 小数位数处理
     * @param val number 要处理的数字
     * @param len int 最多保留小数位数
     * @param pad boolean 小数位数不足是否补位
     * @param op int 多出位数处理方式  0(四舍五入),-1(向下取整),1(向上取整)
     * @return string
     */
    $.fix = function(val, len=2, pad=false, op=0){
        let m = Math.pow(10,len), arr;
        val = Math[op===-1?'floor':(op===1?'ceil':'round')]($.math.mul(val,m))/m+'';
        if(pad && len>0){
            arr=val.split('.');  len=len-(arr[1]?arr[1].length:0)+1;
            val = arr[0]+'.'+(arr[1]||'')+(new Array(len).join('0'));
        }
        return val;
    };

    /**
     * 特定格式array(或类数组)转JSON
     *      [{k:v1,...}, ...] -> [v1, ...]
     *      [{k:v1,...}, ...] -> {v1:{k:v1,...}, ...}
     * @param arr array|ArrayLike 要转化的数组
     * @param key string|null 提取键
     *      string: 每项键为{key}的值,作为返回json的键
     *      null: 不提取键,仅提取值做返回array项
     * @param val string|null 提取值
     *      string: 每项键为{val}的值,作为返回json|array的值
     *      null: 原对象每项的值做返回json|array的值,不提取
     * @return json|array
     */
    $.arrayToJson = function (arr, key, val = null) {
        if (key === null && val === null) return arr;
        let i = 0, len = arr.length;
        if (key === null) {
            for (; i < len; i++) arr[i] = arr[i][val];
            return arr;
        }
        let rtn = {};
        if (val === null) for (; i < len; i++) rtn[arr[i][key]] = arr[i];
        else for (; i < len; i++) rtn[arr[i][key]] = arr[i][val];
        return rtn;
    };

    /**
     * 字符串(数字)补位
     * @param val string|number 要处理的字符串或数字
     * @param len int >0 补足后的位数
     * @param pad string 填充的内容(单个字符)
     * @param left boolean 是否在左端补位 false:在右端补位
     * @return string
     */
    $.pad = function (val, len = 2, pad = '0', left = true) {
        let fill = new Array(len - (val + '').length + 1).join(pad);
        return left ? fill + val : val + fill;
    };

    /**
     * 转Date对象
     * @param date Date|string|int|null 时间 对象|字符串|时间戳
     *    字符串格式的数字当时间戳  null:当前时间
     * @return Date
     */
    $.date = function (date = null) {
        if (date === null) return new Date();
        if (date instanceof Date) return date;
        let time = date * 1;
        if (time === time) return new Date(time);
        return new Date(date.replace(/-/g, '/'));
    };
    /**
     * 时间格式化
     * @param date Date|string|int|null 时间 对象|字符串|时间戳
     *    字符串格式的数字当时间戳  null:当前时间
     * @param fmt string 格式化字符串(中午12点为下午)  可用("[{key}]"):
     *      Y:年=2019 M:月=01 m:月=1 D:日=01 d:日=1
     *      w:周=1 H:24时=01 h:24时=1 I:分=01 i:分=1
     *      S:秒=01 s:秒=1 MS:毫秒=001 ms:毫秒=1
     *      A:上下午=A a:上下午=a G:12时=01 g:12时=1
     *      z:时区=由getTimezoneOffset()取得的分钟数(正西区,负东区)
     *      特别的:
     *          m.xx: 由$.date.month.xx定义
     *          w.xx: 由$.date.week.xx定义
     * @return string key不匹配的[],则不改变
     */
    $.date.fmt = function (date, fmt = '[Y]-[M]-[D] [H]:[I]:[S]') {
        date = $.date(date); let h;
        return fmt.replace(/\[(.+?)]/g, function (m, k) {
            switch (k) {
                case 'Y': return date.getFullYear();
                case 'M': return $.pad(date.getMonth() + 1);
                case 'D': return $.pad(date.getDate());
                case 'H': return $.pad(date.getHours());
                case 'I': return $.pad(date.getMinutes());
                case 'S': return $.pad(date.getSeconds());
                case 'MS': return $.pad(date.getMilliseconds(), 3);
                case 'm': return date.getMonth() + 1;
                case 'd': return date.getDate();
                case 'h': return date.getHours();
                case 'i': return date.getMinutes();
                case 's': return date.getSeconds();
                case 'ms': return date.getMilliseconds();
                case 'w': return date.getDay() + 1;
                case 'A': return date.getHours() < 12 ? 'A' : 'P';
                case 'a': return date.getHours() < 12 ? 'a' : 'p';
                case 'G': h = date.getHours(); return $.pad(h < 12 ? h : h - 12);
                case 'g': h = date.getHours(); return h < 12 ? h : h - 12;
                case 'z': return date.getTimezoneOffset();
            }
            let spt = k.split('.');
            if (spt[0] === 'm') {
                let x = $.date.month[spt[1] || ''];
                if (x) return x[date.getMonth()] || m;
            }
            else if (spt[0] === 'w') {
                let x = $.date.week[spt[1] || ''];
                if (x) return x[date.getDay()] || m;
            }
            return m;
        });
    };

    /** @var json base queryString */
    $.que = {};
    /**
     * @var json 默认选项
     * @opt tag string 开始的字符
     * @opt sep string 分割键值对的字符
     * @opt eq string 分割键和值的字符
     * @opt decode function 字符解码函数
     * @opt encode function 字符转码函数
     * */
    $.que.opt = { tag: '?', sep: '&', eq: '=', decode: decodeURIComponent, encode: encodeURIComponent };
    /**
     * queryString解码(非递归)
     * @param str string|object string则解析 object(json)则直接返回
     * @param opt json|null 选项 详情及默认:$.que.opt {tag,sep,eq,decode}
     * @return object
     */
    $.que.decode = function (str, opt) {
        if (str && typeof str === 'object') return str;
        let rtn = {}; if (!str) return rtn;
        opt = $.extend(opt, $.que.opt);
        if (str === opt.tag) return rtn;
        if (str.substr(0, opt.tag.length) === opt.tag) str = str.substr(opt.tag.length);
        str.split(opt.sep).forEach(kv => {
            if (!kv) return;
            if (kv.indexOf(opt.eq) === -1) rtn[opt.decode(kv)] = '';
            else {
                let [k, v] = kv.split(opt.eq);
                rtn[opt.decode(k)] = opt.decode(v);
            }
        });
        return rtn;
    };
    /**
     * queryString转码(非递归)
     * @param obj object|string object则转码 string则返回(处理tag后)
     * @param opt json|null 选项 详情及默认:$.que.opt {tag,sep,eq,encode} 额外:
     *      not boolean 控制返回值开头的tag true:无, false:有(默认,注意:返回空时无tag)
     * @return string
     */
    $.que.encode = function (obj, opt) {
        let rtn = ''; if (!obj) return rtn;
        opt = $.extend(opt, $.que.opt); // {not:false}
        if (typeof obj === 'string') {
            if (obj === opt.tag) return rtn;
            return obj.substr(0, opt.tag.length) === opt.tag ?
                (opt.not ? obj.substr(opt.tag.length) : obj) :
                (opt.not ? obj : opt.tag + obj);
        }
        if (typeof obj === 'object') {
            Object.keys(obj).forEach(k => {
                rtn += opt.sep + opt.encode(k) + opt.eq + opt.encode(obj[k])
            });
            if (rtn) rtn = (opt.not ? '' : opt.tag) + rtn.substr(opt.sep.length);
        }
        return rtn;
    };
    /**
     * query合并(非递归)
     * @param lst array|ArrayLike 合并的query 各项:json|string|null
     *      若第一个值为json,且返回非string, 则将会在第一个值上修改
     * @param opt json|null 选项 详情及默认:$.que.opt {tag,sep,eq,encode,decode} 额外:
     *      str: boolean 返回是否字符串格式 默认false(json)
     *      not: boolean 返回开头tag true:无, false:有(默认,返回空时无tag)
     *      ext: boolean 是否extend(扩展) 默认mixin(替换,false)
     * @return object|string
     */
    $.que.merge = function (lst, opt) {
        let tar = lst[0] || {}, i = 1;
        if (typeof tar !== 'object') { tar = {}; i = 0; }
        opt = $.extend(opt, $.que.opt); // {str:false, not:false, ext:false}
        for (let ext; i < lst.length; i++) {
            if (!(ext = lst[i])) continue;
            if (typeof ext === 'string') ext = $.que.decode(ext, opt);
            else if (typeof ext !== 'object') continue;
            if (!opt.ext) Object.keys(ext).forEach(k => tar[k] = ext[k]);
            else Object.keys(ext).forEach(k => { if (tar[k] === undefined) tar[k] = ext[k]; });
        }
        return opt.str ? $.que.encode(tar, opt) : tar;
    };

    /**
     * url处理: 解析url,生成新的对象
     * @param url string 要解析的url
     * @return json {protocol,hostname,port,pathname,search,hash,host,origin,href,set}
     *      href: {protocol}//{hostname}:{port}{pathname}{search}{hsah}
     *      host: {hostname}:{port}
     *      origin: {protocol}//{hostname}:{port}
     */
    $.url = function (url) { return { set: $.url.set }.set('href', url); };
    /**
     * url处理: 属性修改
     *      $.url().set(): 修改由$.url()生成的对象的属性
     *      $.url.set(): 用于全局(当前页面)的url管理  初始化: $.url.set('href', location.href);
     * @param key string 修改的项 protocol|hostname|port|pathname|search|hash|host|origin|href
     * @param val string|int 设置的值
     * @return this
     */
    $.url.set = function (key, val) {
        this[key] = val;
        if (key === 'href') {
            let a = document.createElement('a');
            a.href = val;
            this.protocol = a.protocol; // http:
            this.hostname = a.hostname; // domain.com
            this.port = a.port; // '' | 8080
            this.pathname = ('/' + a.pathname).replace(/\/\//g, '/'); // /dir/path
            this.search = a.search; // '' | ?k=v
            this.hash = a.hash; // '' | #hash
            this.host = a.host; // domain.com | domain.com:8080
            this.origin = a.origin || a.protocol + '//' + a.host; // http://dmoan.com | http://dmoan.com:8080
        }
        else if (key === 'protocol') {
            if (val.charAt(val.length - 1) !== ':') this.protocol += ':';
            this.origin = this.protocol + '//' + this.host;
        }
        else if (key === 'hostname' || key === 'port') {
            this.host = this.hostname + (this.port ? ':' + this.port : '');
            this.origin = this.protocol + '//' + this.host;
        }
        else if (key === 'pathname') this.pathname = ('/' + this.pathname).replace(/\/\//g, '/');
        else if (key === 'search') { if (val && val.charAt(0) !== '?') this.search = '?' + val; }
        else if (key === 'hash') { if (val && val.charAt(0) !== '?') this.hash = '#' + val; }
        else if (key === 'host') {
            let spt = val.split(':');
            this.hostname = spt[0];
            this.port = spt[1] || '';
            this.origin = this.protocol + '//' + this.host;
        }
        else if (key === 'origin') {
            let a = document.createElement('a');
            a.href = val;
            this.protocol = a.protocol;
            this.hostname = a.hostname;
            this.port = a.port;
            this.host = a.host;
        }
        this.href = this.origin + this.pathname + this.search + this.hash;
        return this;
    };

    /**
     * XMLHttpRequest(ajax)  FormData:IE>=10
     * @param opt json|string 选项或url  选项默认及详情: $.xhr.opt
     * @return Promise resolve:由opt.xhr控制  !opt.xhr且code!==2xx时: reject(Error|json)
     */
    $.xhr = function (opt) {
        return new Promise((resolve, reject) => {
            console.log(opt)
            // prepare
            if (typeof opt === 'string') opt = { url: opt };
            opt = $.extend({ code: 0, res: '' }, opt, $.xhr.opt);
            if(!opt.retry) {
              opt = $.extend(opt, { retry: 0});
            }
            opt.method = opt.method.toUpperCase();
            if (opt.query) {
                let u = $.url(opt.url || location.href), m = [u.search, opt.query];
                opt.url = u.set('search', $.que.merge(m, { str: true })).href;
            }
            // open
            let $xhr = opt.$xhr = new XMLHttpRequest();
            $xhr.open(opt.method, opt.url, opt.async);
            if (opt.async && opt.timeout) $xhr.timeout = opt.timeout * 1000;
            $xhr.withCredentials = opt.cors;
            // headers
            if (
                opt.method === 'POST' && (!opt.headers || !opt.headers['Content-Type'])
                && (!window.FormData || !(opt.data instanceof FormData))
            ) $xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            opt.headers && Object.keys(opt.headers).forEach(k => $xhr.setRequestHeader(k, opt.headers[k]));
            // on ready state change
            $xhr.onreadystatechange = function () {
                if ($xhr.readyState !== 4) return;
                opt.code = $xhr.status;
                opt.res = $xhr.responseText;
                if(((opt.code + '').charAt(0) !== '2' || !opt.res) && opt.retry < 1) { // if status not 2XX or response empty/null, retry request once
                  setTimeout(function() {
                    opt.retry = opt.retry + 1;
                    // resend
                    $xhr.open(opt.method, opt.url, opt.async);
                    if (opt.method === 'GET' || !opt.data) $xhr.send(null);
                    else if (window.FormData && opt.data instanceof FormData) $xhr.send(opt.data);
                    else if (opt.method === 'PUT') $xhr.send(opt.data);
                    else $xhr.send($.que.encode(opt.data, { str: true, not: true }));
                  }, 500);
                  return;
                }

                if (opt.ret === 'json') {
                    try { opt.res = JSON.parse(opt.res); }
                    catch (err) { return reject(err); }
                }
                if (opt.xhr) return resolve(opt);
                if ((opt.code + '').charAt(0) !== '2') reject(opt);
                else resolve(opt.res);
            };
            // send
            if (opt.method === 'GET' || !opt.data) $xhr.send(null);
            else if (window.FormData && opt.data instanceof FormData) $xhr.send(opt.data);
            else if (opt.method === 'PUT') $xhr.send(opt.data);
            else $xhr.send($.que.encode(opt.data, { str: true, not: true }));
        });
    };
    /**
     * 默认选项
     * @param url string URL
     * @param method string 请求方式,不区分大小写
     * @param query json|string url后追加query的JSON|String 同名则替换url的query
     * @param data json|FormData|QueryString|mixed method=GET时丢弃 发送数据
     * @param headers json 请求头信息, POST且data不为FormData时,默认(注意大小写):
     *      'Content-Type: application/x-www-form-urlencoded'
     * @param ret string 返回数据格式(自动解析) json|text
     * @param timeout int 请求超时(秒),同步请求时无效
     * @param async boolean 是否采用异步请求
     * @param cors boolean 是否开启跨域(cookie等),需要目标服务器支持(IE>=10)
     *      详见: https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Access_control_CORS
     * @param xhr boolean 是否返回$xhr(body为:$xhr.res), 默认:false(仅响应的body部分)
     *      $xhr: 初始化后的参数(新对象), 追加:
     *          $xhr: 原生XMLHttpRequest实例
     *          code: 响应的http状态码  初始为:0
     *          res:  json|string 响应的数据(类型根据选项{ret}类型不同)
     */
    $.xhr.opt = {
        url: '', method: 'GET', query: null, data: null, headers: null,
        ret: 'json', timeout: 60, async: true, cors: true, xhr: false,
    };

    /**
     * 显示等待
     * @param msg string|false 显示消息(可为htm或'') false:取消显示
     *      同tar时:  多次显示:更新消息, 多次取消:首次生效
     * @param tar Element|null 挂载位置  null:document.body
     * @param bg boolean 是否显示背景阴影层(同tar时:首次显示有效)
     * @return boolean 操作前是否有显示(当前tar下)
     */
    $.wait = function (msg = '', tar = null, bg = false) {
        if (!tar) tar = document.body; let $has = $('>.g-wait', tar);
        if (msg === false) $has && tar.removeChild($has);
        else if ($has) $('>div', $has).innerHTML = msg || '';
        else {
            let $em = document.createElement('div');
            $em.className = 'g-wait' + (bg ? ' g-wait-bg' : '');
            $em.innerHTML = '<div>' + (msg || '') + '</div>';
            tar.appendChild($em);
        }
        return !!$has;
    };

    return $;
})();

// global app
window.g = (function(){
    const g = {};
    console.log(process.env)
    // config
    g._apiBase = process.env.VUE_APP_API; // 接口路径前缀
    // cache
    g._sysDate = null; // 服务器时间 Date对象 每次接口返回时更新
    // const
    g._classify = {
        0: '--なし--',
        1: 'サービスについて',
        2: '取引について',
        99: 'その他'
    };
    g._course_nm = {
        71: "standard",
        72: "challenge",
    },
    g._summary_type = {
        1: "運用額追加",
        2: "運用額引き出し(交換)",
        3: "入金,",
        4: "出金",
        12: "出金依頼",
        14: "引き出し(交換)できませんでした<br>お問い合わせください",
        31: "予約買",
        32: "追加できませんでした<br>お問い合わせください",
        99: "キャンペーン<br>運用額が追加されました"
    },
    g._autosweep_type = {
        0: '--なし--',
        1: '自動追加',
        32: '自動追加できませんでした<br>お問い合わせください'
    };
    g._orderTimeLimit = 5000;
    g._maxAmountNum = 8;
    g._amountNullErr='運用できるPayPayボーナス残高がありません'
    /**
     * xhr(ajax)
     * @param opt json|string 选项或url  选项默认及详情: $.xhr.opt
     * @return Promise object 数据|异常 追加:
     *      _ekey: 异常key  异常时才存在
     *          'unknown': 未知异常
     *          'business': 业务逻辑错误
     *          'timeout': 登录超时
     *          'system': 系统错误
     *          'maintenance': 维护中
     *      _emsg: 错误消息 若接口返回MESSAGE_ARRAY且非空 为: '<br/>'连接的字符串
     */
    g.xhr = function(opt){
        if(typeof opt==='string') opt = {url:opt};
        opt.url = g._apiBase + opt.url;
        return ES.xhr(opt).then(rtn => {
            if(!rtn) rtn = {_ekey:'unknown'};
            else if((rtn.STATUS*=1)!==0){
                if(rtn.STATUS===1) rtn._ekey = 'business';
                else if(rtn.STATUS===2) rtn._ekey = 'timeout';
                else rtn._ekey = 'system';
            }
            else if(rtn.MAINTENANCE_FLG*1===1) rtn._ekey = 'maintenance';
            if(rtn.MESSAGE_ARRAY && rtn.MESSAGE_ARRAY.length) {
                rtn._emsg = '';
                rtn.MESSAGE_ARRAY.forEach(item => rtn._emsg+='<br/>'+item.MESSAGE);
                rtn._emsg = rtn._emsg.substr(5);
            }
            if(rtn.SYSTEM_DATE) g._sysDate = ES.date(rtn.SYSTEM_DATE);
            rtn['autorefresh'] = opt.autorefresh?opt.autorefresh:false;
            return rtn;
        }).catch(rtn => {
            if(!rtn) rtn = {_ekey:'unknown'};
            else if(!rtn._ekey) rtn._ekey = 'unknown';
            if(rtn.MESSAGE_ARRAY && rtn.MESSAGE_ARRAY.length) {
                rtn._emsg = '';
                rtn.MESSAGE_ARRAY.forEach(item => rtn._emsg+='<br/>'+item.MESSAGE);
                rtn._emsg = rtn._emsg.substr(5);
            }
            rtn['autorefresh'] = opt.autorefresh?opt.autorefresh:false;
            return rtn;
        });
    };

    // loading animation
    g.showLoading = function() {
      document.getElementsByClassName('loading')[0].setAttribute('data-viewstatus', 'true');
    };
    g.hideLoading = function() {
      document.getElementsByClassName('loading')[0].setAttribute('data-viewstatus', 'false');
    };

    // 金额格式化  plus: boolean 正数前是否有'+'
    g.fmtAmount = function (val, plus) {
        if (!val || val === '0') return '0';
        return (plus && val > 0 ? '+' : '') + ES.num(val);
    };

    // 小数转百分数  plus: boolean 正数前是否有'+'
    g.fmtRate = function (val, plus) {
        if (val === '-' || val === 'ー' || (!val && val!==0)) return 'ー';
        if (val===0 || val === '0') return '0%';
        // all rates from API has been converted to type varchar, and no need to re-calculation
        var num = val * 1.0;
        if (num !== num) return 'ー'; // NaN
        return (plus & num > 0 ? '+' : '') + val + '%';
    };

    g.getParam = function(name, url) {
        if (!url) url = window.location.href;
        name = name.replace(/[\[\]]/g, "\\$&");
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    };

  /**
   * google analytics gtag
   * https://developers.google.com/analytics/devguides/collection/gtagjs/events?hl=ja
   * @param action event name
   * @param eventData 发送的事件对象，参数传入顺序 category,label,value
   */
    g.gtag = function(action = '', ...eventData) {
        if (action==='') return ;
        let [ category, label, value ] = eventData;
        if (isNaN(value) || value < 0) value = false;
        let obj = {
            'event_category': category || false,
            'event_label': label || false,
            'value': value
        };
        for (let[k, v] of Object.entries(obj)) {
            if (v === false) delete obj[k];
        }
        gtag('event', action, obj);
    }

    return g;
})();
