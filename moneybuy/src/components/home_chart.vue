<template>
      <f7-block class="oparation_info" style="position:relative;">
        <f7-block class="text2_1 nofirst">
        　　<span class="yellow-tip">100万ユーザーが運用中！</span>
      　</f7-block>
        <div class="row row1">
          <div class="col">
            <p class="row1_1">
              <span class="text">運用中の残高</span>
              <span class="timestamp">{{this.refreshDate}}</span>
            </p>
            <p class="row1_2">
              <span class="amount">{{this.total.VALUATION_AMOUNT}}</span>
              <span class="unit">円</span>
            </p>
          </div>
          <p class="col"><img :src="total.icon" alt=""></p>
        </div>

        <div class="graph">
          <highcharts id="chart1" :options="chartOptions"></highcharts>
        </div>
        <div class="graph_btns">
          <f7-button class="button-ellipse button-array" v-bind:data-active="this.btns.m1"  v-on:click="setChart(1), sendEvent(1)">1カ月</f7-button>
          <f7-button class="button-ellipse button-array" v-bind:data-active="this.btns.m3"  v-on:click="setChart(3), sendEvent(3)">3カ月</f7-button>
          <f7-button class="button-ellipse button-array" v-bind:data-active="this.btns.m6"  v-on:click="setChart(6), sendEvent(6)">6カ月</f7-button>
          <f7-button class="button-ellipse button-array" v-bind:data-active="this.btns.m12" v-on:click="setChart(12), sendEvent(12)">1年</f7-button>
        </div>

        <div class="row budget">
          <div class="col col-50">
            <p class="label">追加した残高総額<p>
            <p class="data"><span class="amount">{{this.total.PRINCIPAL_AMOUNT}}</span><span class="unit">円</span></p>
          </div>
          <div class="col col-50">
            <p class="label">今までの運用損益</p>
            <div class="data">
              <span class="amount" :class="this.total.color">{{this.total.PROFIT_LOSS_AMOUNT}}</span><span class="unit" :class="this.total.color">円</span>
              <p class="perc"><span class="percent" :class="this.total.color">({{this.total.PROFIT_LOSS_RATE}})</span></p>
            </div>
          </div>
        </div>
        <div class="available_balance" v-if="this.total.VALUATION_AMOUNT_VALUE>0">
          <div class="row">
            <div class="col-l">運用できる残高</div>
            <div class="col-r"><span class="num">{{ g.fmtAmount(this.$root.realAmount) }}</span>
            <span class="unit">円</span></div>
          </div>
        </div>
      </f7-block>
</template>

<script>
  import Highcharts from 'highcharts';
  // Import Dom7
  import Dom7 from 'dom7/dist/dom7.js';
  var $$ = Dom7;

  Highcharts.dateFormats.s = function (timestamp) {
    var date = new Date(timestamp);
    return date.getMonth() + 1;
  };

  Highcharts.dateFormats.k = function (timestamp) {
    var date = new Date(timestamp);
    return date.getDate();
  };

  Highcharts.setOptions({
    lang:{
      thousandsSep:','
    },
    plotOptions: {
        series: {
            marker: {
                enabled: false,
            },
        },
    },
    credits:{
      enabled: false
    },
    chart: {
        spacingRight:20,
        height:'50%',
        type: 'line',
        legend:{
          enabled:false
        },
    },
    title: {
        text: ''
    },
    xAxis: {
        type: 'datetime',
        dateTimeLabelFormats: {
            minute: '%H:%M',
            hour: '%m/%d %H:%M',
            day: '%Y/%m/%d',
            week: '%Y/%m/%d',
            month: '%Y/%m',
            year: '(%Y)'
        },
        labels:{
          format: '{value:%m/%e}',
          formatter:function(){
            var label = this.axis.defaultLabelFormatter.call(this);
            var labelSplit  = label.split('/');
            var result = Number(labelSplit[0]) + '/' + Number(labelSplit[1]);
            return result;
          },
          style:{
            color:'#909090',
            fontSize: "12px"
          }
        },
        title: {
            text: ''
        },
        tickLength: 0,
        lineColor:'#909090'
    },
    yAxis: {
        title: {
            text: ''
        },
        min: 0,
        softMax: 3,
        tickAmount: 4,
        width:'100%',
        labels:{
          format: '{value}',
          style:{
            color:'#002970',
            fontSize: "10px"
          }
        }
    },
    tooltip: {
      xDateFormat: '%Y年%s月%k日',
    },
  });

  export default {
    props:['assetsAll'],
    data() {
      this.refreshDateFmt = '[Y]年[m]月[d]日 [H]時[I]分';
      this.curChart = 1;
      let data=this.assetsAll, lastData=data.GRAPH_DATA;
      if(lastData && lastData.DATE)
        this.lastData = this.fmtChartRow(lastData.DATE, lastData.VALUE, true);
      
      return {
        btns:{m1:'true',m3:'false',m6:'false',m12:'false'},
        chartOptions: {
          series: [{
            showInLegend: false,
            name: "",
            color: '#002970',
            lineWidth:3,
            data: []
          }]
        },
        total: this.fmtTotal(data.PROFIT_LOSS_INFO_TOTAL||{}),
        refreshDate: ES.date.fmt(data.SYSTEM_DATE, this.refreshDateFmt),
      };
    },
    methods: {
      setChart(month, noWait){
        if(!noWait) ES.wait('', document.getElementsByClassName('graph')[0]);
        let btn='m'+month, btns=this.btns;
        if(btns[btn]==='false'){
          Object.keys(btns).forEach(key => btns[key]='false');
          btns[btn] = 'true';
        }

        let date = new Date(g._sysDate*1);
        date.setMonth(g._sysDate.getMonth()-month);
        this.curChart = month;
        this.getData(month, ES.date.fmt(date,'[Y]/[M]/[D]')).then(data => {
          this.chartOptions.series[0].data = data;
          ES.wait(false, document.getElementsByClassName('graph')[0]);
        });
      },
      getData(month, minDate){
        // console.log("month: " + month + ", minDate: " + minDate);
        let graphStartD = minDate;  // parameter to request chart api. Set default value to selected date: minDate
        let needRequest = false;
        let needSaveData = false;   // need to save into local storage
        // homeChartDat:にAPIで取得したCHARTデータを保存する。ただしデータがない日付は０の値を埋める。
        // {minDate:"2020/03/01",maxDate:"2020/03/03",data:[1000,1001,1002]}の形式
        // homeChartHis:に、{"month":[0/1/3/6/12],"possibleLatestDate":[null/yyyymmdd]}のように保存する。
        // {"month":0,"possibleLatestDate":null}は初期状態
        // 一回リクエストしたら、monthにリクエストしたときのNカ月を保存
        // possibleLatestDateにはその時点論理上サーバーから返される最大日付を保存する
        // 　（0時〜5時59分59秒：二日前の日付、6時〜23時59分59秒：一日前の日付）
        // 　サーバーからすでにpossibleLatestDateと一致した日付のデータが返された場合、possibleLatestDateがその翌日で保存する。
        // グラフデータを取得できなかった場合：
        // 　mindateにnullを保存
        // グラフデータを取得した場合
        // 　mindateに取得したデータに最小日付を保存
        month = month * 1; // convert to int
        // get data from localstorage
        let data=localStorage.getItem('homeChartDat:'+this.$root.tmpStatus.CLIENT_ID), $pm;
        let hcHis = localStorage.getItem('homeChartHis:'+this.$root.tmpStatus.CLIENT_ID);
        try{ hcHis = hcHis && JSON.parse(hcHis); } catch(err) { hcHis=null; }
        try{ data = data && JSON.parse(data); } catch(err){ data=null; }
        if(data) {
          // remove graph data earlier than one year
          let date=new Date(g._sysDate*1);
           date.setMonth(date.getMonth()-12);
          //date.setMonth(date.getMonth()-60);
          let oneYearAgoDate = ES.date.fmt(date, '[Y]/[M]/[D]');
          let rmRtn = ES.removeOldChart(data, oneYearAgoDate);
          if(rmRtn !== false) {
            needSaveData = true;  // should be saved later
          }
          // will be merged with data from chart api
        }

        if(hcHis === null || hcHis.month == 0) {
          // init hcHis
          hcHis={month:0,possibleLatestDate:null};
          localStorage.setItem('homeChartHis:'+this.$root.tmpStatus.CLIENT_ID, JSON.stringify(hcHis));
          needRequest = true; // neet to request
        }

        // calculate possibleLatestDate at this moment
        //   before 6:00 : day before yesterday (in normal case, since 1:00 date of yesterday can be accessed)
        //   since 6:00  : yesterday
        let hi=ES.date.fmt(g._sysDate,'[H]:[I]');
        let curPossibleLatestDate = ES.date.fmt(g._sysDate*1-(hi>='06:00'?86400000:172800000),'[Y]/[M]/[D]');

        if(hcHis.month && hcHis.month != 0) { // has requested data before
          if((data && data.minDate && graphStartD < data.minDate && month > hcHis.month * 1) || ((data === null || (data && data.minDate === "")) && month > hcHis.month * 1)) {  // if not requested so earlier before
            needRequest = true; // need to request and graphStartD will be the date selected(=>minDate)
          }
          if(!needRequest) { // no need to request for past date
            // then continue to check if necessary to get date since the possibleLatestDate requested before
            if(!hcHis.possibleLatestDate) { // impossible condition
              needRequest = true; // need to request and graphStartD will be the date selected(=>minDate)
            } else if(curPossibleLatestDate > hcHis.possibleLatestDate) { // hcHis.possibleLatestDate is the lastest date has been received or the lastest date if possible
              needRequest = true;
              graphStartD = ES.date.fmt(ES.date(hcHis.possibleLatestDate+' 01:00:00')*1-5*86400000, '[Y]/[M]/[D]');  // request with startD as hcHis.possibleLatestDate day - 5 days. 5 days's data will be repeated but it will be useful for data recovery occasionally.
            }
          }
        }
        if(needRequest) {
          hcHis.month = month;
          hcHis.possibleLatestDate = curPossibleLatestDate;
          $pm = this.getDataRemote(graphStartD).then(res => {
            let paddedRes = ES.padDateWithZero(res, curPossibleLatestDate);
            data = (data!==null && data.minDate && data.minDate > "1970/01/01")?ES.mergeChartData(data, paddedRes):paddedRes;
          });
        } else if(needSaveData){  // no request but need save
          localStorage.setItem('homeChartDat:'+this.$root.tmpStatus.CLIENT_ID, JSON.stringify(data));
          if(data.minDate == "") {
            hcHis={month:0,possibleLatestDate:null};
            localStorage.setItem('homeChartHis:'+this.$root.tmpStatus.CLIENT_ID, JSON.stringify(hcHis));
          }
        }
        // save data and return formatted data
        return ($pm||Promise.resolve()).then(() => {
          // save to local storage
          localStorage.setItem('homeChartDat:'+this.$root.tmpStatus.CLIENT_ID, JSON.stringify(data));
          localStorage.setItem('homeChartHis:'+this.$root.tmpStatus.CLIENT_ID, JSON.stringify(hcHis));
          // prepare data for highcharts
          let rtn=[], zone=g._sysDate.getTimezoneOffset()*60000;
          let readableChartData = ES.getReadableChartData(data);
          Object.keys(readableChartData).forEach(key => {
            if(key < minDate) return;
            // minus zone for Highcharts.dateFormat
            rtn.push([ES.date(key+' 01:00:00')*1 - zone, readableChartData[key]]);
          });
          rtn.sort((a,b) => a[0]>b[0]);
          // last data from realtime price
          if(this.lastData) {
            // minus zone for Highcharts.dateFormat
            let lastData = ES.extend({}, this.lastData);
            lastData.x = lastData.x - zone;
            rtn.push(lastData);
          }
          else {
            let idx=rtn.length-1, lastData=rtn[idx];
            rtn[idx] = this.fmtChartRow(lastData[0], lastData[1], true);
          }
          return rtn;
        });

      },
      getDataRemote(graphStartD){
        let url='/user/assets/chart?graphStartD='+graphStartD;
        return g.xhr(url).then(res => {
          if(res._ekey) return this.$root.error(res);
          return res.GRAPH_DATA_LIST;
        });
      },
      setAssets(data, noWait){
        this.total = this.fmtTotal(data.PROFIT_LOSS_INFO_TOTAL||{});
        this.refreshDate = ES.date.fmt(data.SYSTEM_DATE, this.refreshDateFmt);

        // fixed https://mybanker.backlog.jp/view/OTBP-180 ホーム画面の表示時刻がダブっている
        if($$('.timestamp') && $$('.timestamp').html().length > this.refreshDate.length) {
          $$('.timestamp').html(this.refreshDate);
        }

        let lastData = data.GRAPH_DATA;
        if(lastData && lastData.DATE)
          this.lastData = this.fmtChartRow(lastData.DATE, lastData.VALUE, true);
        this.setChart(this.curChart, noWait);
      },
      refresh(){
        ES.wait('', document.getElementsByClassName('graph')[0]);
        g.xhr('/user/assets/all').then(res => {
          if(res._ekey) return this.$root.error(res);
          this.setAssets(res);
        });
      },
      fmtChartRow(date, val, isLast){
        if(!isLast) return [ES.date(date+' 01:00:00')*1, val]
        return {
          x: ES.date(date+' 01:00:00')*1,
          y: val,
          marker:{
            enabled: true,
            symbol: 'url(/static/images/common/graph_mark.svg)'
          }
        };
      },
      fmtTotal(total){
        let icon, color;
        if(total.PROFIT_LOSS_AMOUNT>0){ icon='up';  color='green'; }
        else if(total.PROFIT_LOSS_AMOUNT<0){ icon='down';  color='red'; }
        else { icon='same';  color='orange'; }
        return {
          VALUATION_AMOUNT_VALUE: total.VALUATION_AMOUNT,
          VALUATION_AMOUNT: g.fmtAmount(total.VALUATION_AMOUNT),
          PRINCIPAL_AMOUNT: g.fmtAmount(total.PRINCIPAL_AMOUNT),
          PROFIT_LOSS_AMOUNT: g.fmtAmount(total.PROFIT_LOSS_AMOUNT, true),
          PROFIT_LOSS_RATE: g.fmtRate(total.PROFIT_LOSS_RATE, true),
          icon: '/static/images/common/icon_arrow_'+icon+'_circle.svg',
          color: color,
        };
      },
      sendEvent(month) {
        if (this.$f7.data.autoadd.enable > 0) {
          g.gtag('home_chart', 'allbrands', 'perioid', month);
        } else {
           g.gtag('home_chart_as', 'allbrands', 'perioid', month);
        }
       
      }
    },
    mounted(){
      this.setChart(this.curChart);
    }
  }
</script>

<style scoped>
  .green{color:#20bf7a !important;}
  .red{color:red !important;}
  .orange{color:#F29D4A !important;}
  .grey{color:grey !important;}
</style>
