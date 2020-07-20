<template>
  <f7-block class="course_info" :class="'checked_' + brandId">
    <div class="row course_title" >
      <div class="col icon">
        <img :src="brand.IMAGE_PATH" alt />
      </div>
      <div class="col text">
        <p class="name">{{brand.BRAND_NM}}</p>
        <p class="badge-image badge-autoadd" v-if="checkAutosweep()">
          <img alt="" src="../assets/images/common/badge_autoadd.svg">
        </p>
      </div>
    </div>
    <div v-if="courseHasBuy" class="row row1">
      <div class="col">
        <p class="row1_1">
          <span class="text">運用中の残高</span>
          <span class="timestamp">{{this.refreshDate}}</span>
        </p>
        <p class="row1_2">
          <span class="amount">{{total.VALUATION_AMOUNT}}</span>
          <span class="unit">円</span>
        </p>
      </div>
      <p class="col"><img :src="total.icon" alt=""></p>
    </div>
    <div v-else class="col">
      <p class="timestamp">
         <span>{{this.refreshDate}}</span>
      </p>
    </div>
    <div class="test-list">
      <div class="test-item"> abc </div>
      <div class="test-item"> cde </div>
    </div>
    <p class="graph">
      <highcharts id="chart1" :options="chartOptions"></highcharts>
    </p>
    <div class="graph_btns">
      <f7-button v-bind:data-active="this.btns.m1" v-on:click="setChart(1), sendEvent(1)" class="button-ellipse button-array">1カ月</f7-button>
      <f7-button v-bind:data-active="this.btns.m3" v-on:click="setChart(3), sendEvent(3)" class="button-ellipse button-array">3カ月</f7-button>
      <f7-button v-bind:data-active="this.btns.m6" v-on:click="setChart(6), sendEvent(6)" class="button-ellipse button-array">6カ月</f7-button>
      <f7-button v-bind:data-active="this.btns.m12" v-on:click="setChart(12), sendEvent(12)" class="button-ellipse button-array">1年</f7-button>
      <f7-button v-if="!this.courseHasBuy" v-bind:data-active="this.btns.m60" v-on:click="setChart(60), sendEvent(60)" class="button-ellipse button-array">5年</f7-button>
    </div>
    <div class="budget">
      <div class="row row_label">
        <div class="col-50">
          <p v-if="courseHasBuy" class="label">追加した残高総額</p>
          <p v-else class="label">運用できる残高</p>
        </div>
        <div class="col-50">
          <p v-if="courseHasBuy" class="label">今までの運用損益</p>
          <p v-else class="label">運用していた場合の損益</p>
        </div>
      </div>
      <div class="row row_data">
        <div class="col-50">
          <p class="data">
            <span v-if="courseHasBuy" class="amount">{{total.PRINCIPAL_AMOUNT}}</span>
            <span v-else class="amount"> {{g.fmtAmount(this.$root.realAmount)}}</span>
            <span class="unit">円</span>
          </p>
        </div>
        <div class="col-50">
          <div class="data">
            <span class="amount" :class="total.color">{{total.PROFIT_LOSS_AMOUNT}}</span>
            <span class="unit" :class="total.color">円</span>
            <p class="perc">
              <span class="percent" :class="total.color">({{total.PROFIT_LOSS_RATE}})</span>
            </p>
          </div>
        </div>
      </div>
    </div>
    <!-- 「運用できる残高」表示：該当コースの運用残高が0以外 -->
    <div class="available_balance" v-if="courseHasBuy">
      <div class="row">
        <div class="col-l">運用できる残高</div>
        <div class="col-r"><span class="num">{{ g.fmtAmount(this.$root.realAmount) }}</span>
        <span class="unit">円</span></div>
      </div>
    </div>
    <!-- アクティブ:運用できる残高が0以外 -->
    <p class="btn_add">
      <f7-button v-on:click="toBuy()" :disabled="zeroAmount">ボーナスを追加する</f7-button>
    </p>

    <div class="text_error" style="padding-left:10px" v-if="zeroAmount">
      <p>{{g._amountNullErr}}</p>
    </div>

    <p class="bnr_autoadd" v-if="this.$f7.data.autoadd.enable == 0" v-on:click="sendAutoEvent()">
      <a href="/autoadd/">
        <img class="w100per" src="../assets/images/campaign/bnr2.svg" alt="">
      </a>
    </p>
    <p class="btn_withdraw" v-if="this.courseHasBuy">
      <f7-button class="button-white" :href="'/withdraw_bonus/' + brandId + '/'">ボーナスを引き出す(交換)</f7-button>
    </p>
    <p v-if="detalsBtn==='true'" class="btn_detail">
      <f7-button class="button-white" v-on:click="toDetails()">コース詳細を見る</f7-button>
    </p>
  </f7-block>
</template>

<script>
  import Highcharts from 'highcharts';

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
          // format: '{value:%m/%d}',
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
          format: '{value:,.0f}',
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
    name: 'course_info',
    props: ['assets', 'queryDate', 'detalsBtn'],
    data() {
      this.refreshDateFmt = '[Y]年[m]月[d]日 [H]時[I]分';
      this.curChart = 1;
      let data=this.assets, lastData=data.GRAPH_DATA;
      this.brandId = data.BRAND_ID;
      if(lastData && lastData.DATE)
      this.lastData = this.fmtChartRow(lastData.DATE, lastData.VALUE, true);

      let assets = this.$root.tmpAssets[this.brandId];
      this.courseHasBuy = assets && assets.PROFIT_LOSS_INFO.VALUATION_AMOUNT>0;
      if(!this.courseHasBuy) {
        this.curChart = 60 // 12;
        this.actionName = 'eod_chart';
      } else {
        this.actionName = 'valuation_chart';
      }
      return {
        btns: {m1:'false', m3:'false', m6:'false', m12:'false',  m60:'true'},
        checkedId: this.$f7.data.checkedId,
        chartOptions: {
          series: [{
            showInLegend: false,
            curChart: this.curChart,
            name: "",
            color: '#002970',
            lineWidth:3,
            data: []
          }],
        },
        brand: this.$root.tmpBrandsObj[data.BRAND_ID],
        total: this.fmtTotal(data.PROFIT_LOSS_INFO||{}),
        refreshDate: ES.date.fmt(data.SYSTEM_DATE, this.refreshDateFmt),
        zeroAmount: false,
        realAmount: this.$root.realAmount,
      }
    },
    watch: {
      assets: {
        deep: true,
        handler (val) {
          if (!this.$root.realAmount) this.zeroAmount = true;
          else if(this.$root.realAmount == 0) this.zeroAmount = true;
          else this.zeroAmount = false;
          this.setAssets(val,true);
       },
      }
    },
    mounted() {
      this.setChart(this.curChart);
      if (!this.$root.realAmount) this.zeroAmount = true; 
      else if(this.$root.realAmount == 0) this.zeroAmount = true; 
      else this.zeroAmount = false;
      
      const { brandId, checkedId } = this;
      if (brandId * 1 === checkedId * 1) {
        this.$nextTick(() => {
          const $ = this.$$;
          const pageContent = $('.page-content');
          const scrollPoint = pageContent.find('.checked_' + checkedId);
          pageContent.scrollTop(scrollPoint.offset().top - 180, 350);
        });
      }
    },
    methods: {
      setChart(month, noWait) {
        if(!noWait) ES.wait('', document.getElementsByClassName('graph')[0]);
        let btn='m'+month, btns=this.btns;
        if(btns[btn]==='false'){
          Object.keys(btns).forEach(key => btns[key]='false');
          btns[btn] = 'true';
        }

        let date = new Date(g._sysDate*1);
        date.setMonth(g._sysDate.getMonth()-month);
        date = ES.date.fmt(date,'[Y]/[M]/[D]');
        if(this.courseHasBuy) this.curChart = month;
        else if(this.curChart !== month) {
          this.queryDate[this.brandId] = date;
          this.curChart = month;
          return this.refresh();
        }
        this.getData(month, date).then(data => {
          this.chartOptions.series[0].curChart = this.curChart;
          this.chartOptions.series[0].data = data;
          ES.wait(false, document.getElementsByClassName('graph')[0]);
        });
      },
      getData(month, minDate){
        let saveKey = this.courseHasBuy ? ''+this.brandId+':'+this.$root.tmpStatus.CLIENT_ID : ''+this.brandId;
        let graphStartD = minDate;  // parameter to request chart api. Set default value to selected date: minDate
        let needRequest = false;
        let needSaveData = false;   // need to save into local storage
        // same method as home_chart.vue getData(month, minDate)
        month = month * 1; // convert to int
        // get data from localstorage
        let data = localStorage.getItem('courseInfoDat:'+saveKey), $pm;
        let hcHis = localStorage.getItem('courseInfoHis:'+saveKey);
        try{ hcHis = hcHis && JSON.parse(hcHis); } catch(err) { hcHis=null; }
        try{ data = data && JSON.parse(data); } catch(err){ data=null; }
        if(data) {
          // remove graph data earlier than one year
          let date=new Date(g._sysDate*1);
          // date.setMonth(date.getMonth()-12);
          date.setMonth(date.getMonth()-60);
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
          localStorage.setItem('courseInfoHis:'+saveKey, JSON.stringify(hcHis));
          needRequest = true; // neet to request
        }
        // calculate possibleLatestDate at this moment
        //   before 6:00 : day before yesterday (in normal case, since 1:00 date of yesterday can be accessed)
        //   since 6:00  : yesterday
        let hi=ES.date.fmt(g._sysDate,'[H]:[I]');
        let boundaryTime = this.courseHasBuy ? '06:00':'11:00';
        let curPossibleLatestDate = ES.date.fmt(g._sysDate*1-(hi>=boundaryTime?86400000:172800000),'[Y]/[M]/[D]');

        if(hcHis.month && hcHis.month != 0) { // has requested data before
          if((data && data.minDate && graphStartD < data.minDate && month > hcHis.month * 1) || 
            ((data === null || (data && data.minDate === "")) && month > hcHis.month * 1)) {  // if not requested so earlier before
            needRequest = true; // need to request and graphStartD will be the date selected(=>minDate)
          } else if (this.courseHasBuy == false && hcHis.month != null && hcHis.month == 12) {
            needRequest = true; // 既存ユーザ12月場合
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
          // console.log('needSaveData, minDate: ' + data.minDate);
          localStorage.setItem('courseInfoDat:'+saveKey, JSON.stringify(data));
          if(data.minDate == "") {
            hcHis={month:0,possibleLatestDate:null};
            localStorage.setItem('courseInfoHis:'+saveKey, JSON.stringify(hcHis));
          }
        }
        // save data and return formatted data
        return ($pm||Promise.resolve()).then(() => {
          // save to local storage
          // console.log('save to local storage, minDate: ' + data.minDate);
          localStorage.setItem('courseInfoDat:'+saveKey, JSON.stringify(data));
          localStorage.setItem('courseInfoHis:'+saveKey, JSON.stringify(hcHis));
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
      getDataRemote(minDate){
        if(this.courseHasBuy){
          let url = '/user/assets/'+this.brandId+'/chart?graphStartD='+minDate;
          return g.xhr(url).then(res => {
            if(res._ekey) return this.$root.error(res);
            return res.GRAPH_DATA_LIST;
          });
        }
        else{
          let query = JSON.stringify([{brandId:this.brandId, graphStartD:minDate}]);
          let url = '/brand/chart?BRAND_UNIT_INFO_LIST='+query;
          return g.xhr(url).then(res => {
            if(res._ekey) return this.$root.error(res);
            let out = [];
            res.GRAPH_DATA_LIST && res.GRAPH_DATA_LIST.forEach(brand => {
              if(brand.BRAND_ID!=this.brandId) return;
              out = brand.GRAPH_DATA;
            });
            return out;
          });
        }
      },
      setAssets(data, noWait){
        this.total = this.fmtTotal(data.PROFIT_LOSS_INFO||{});
        this.refreshDate = ES.date.fmt(data.SYSTEM_DATE, this.refreshDateFmt);
        let lastData = data.GRAPH_DATA;
        if(lastData && lastData.DATE)
          this.lastData = this.fmtChartRow(lastData.DATE, lastData.VALUE, true);
        this.setChart(this.curChart, noWait);
      },
      refresh(){
        let $wait = document.getElementsByClassName('graph')[0];
        ES.wait('', $wait);
        if(this.courseHasBuy){
            return g.xhr('/user/assets/'+this.brandId+'/special').then(res => {
              this.timer = setTimeout(() => this.autoRefresh(), 5000);
              if(res._ekey) return this.$root.error(res);
              if(!res.PROFIT_LOSS_INFO) return ES.wait(false, $wait);
              res.BRAND_ID = this.brandId;
              this.$root.realAmount = res.REAL_POINT;
              this.setAssets(res);
            });
        }
        else{
          let query = [{id:this.brandId, profitLossStartD:this.queryDate[this.brandId]}];
          let url = '/user/assets/expected?BRAND_UNIT_INFO_LIST='+JSON.stringify(query);
          g.xhr(url).then(res => {
            if(res._ekey) return this.$root.error(res);
            this.$root.realAmount = res.REAL_POINT;
            let has = false;
            res.OPERATION_INFO_LIST && res.OPERATION_INFO_LIST.forEach(brand => {
              if(brand.BRAND_ID!=this.brandId) return;
           
              has=true;  this.setAssets(brand);
            });
            if(!has) ES.wait(false, $wait);
          });
        }
      },
      fmtChartRow(date, val, isLast){
        if(!isLast) return [ES.date(date+' 01:00:00')*1, val]
        return {
          x: ES.date(date+' 01:00:00')*1,
          y: val,
          marker:{
            enabled: true,
            symbol: 'url(../assets/images/common/graph_mark.svg)'
          }
        };
      },
      fmtTotal(total){
        let icon, color;
        if(total.PROFIT_LOSS_AMOUNT>0){ icon='up';  color='green'; }
        else if(total.PROFIT_LOSS_AMOUNT<0){ icon='down';  color='red'; }
        else { icon='same';  color='orange'; }
        return {
          VALUATION_AMOUNT: g.fmtAmount(total.VALUATION_AMOUNT),
          PRINCIPAL_AMOUNT: g.fmtAmount(total.PRINCIPAL_AMOUNT),
          PROFIT_LOSS_AMOUNT: g.fmtAmount(total.PROFIT_LOSS_AMOUNT, true),
          PROFIT_LOSS_RATE: g.fmtRate(total.PROFIT_LOSS_RATE, true),
          icon: '../assets/images/common/icon_arrow_'+icon+'_circle.svg',
          color: color,
        };
      },
      checkAutosweep() {
        if (this.brandId == 72 && this.$f7.data.autoadd.enable == 2 || 
            this.brandId == 71 && this.$f7.data.autoadd.enable == 1) {
          return true
        }
        return false
      },
      toBuy(){
        this.$f7router.navigate('/add_bonus/'+this.brandId);
      },
      toDetails() {
        this.$f7router.navigate('/course_details/'+this.brandId);
      },
      sendEvent(month) {
        if (this.$f7.data.autoadd.enable > 0) {
          g.gtag(this.actionName, this.brand['BRAND_CD'], 'perioid', month);
        } else {
          g.gtag(this.actionName + '_as', this.brand['BRAND_CD'], 'perioid', month);
        }
      },
      sendAutoEvent() {
        if (this.courseHasBuy) {
          g.gtag('auto_add_to', 'autosweep', 'course_valuation_' + this.brandId);
        } else {
          g.gtag('auto_add_to', 'autosweep', 'course_eod_' + this.brandId);
        }
      }
    }
  }
</script>

<style scoped>
  .green{color:#20bf7a !important;}
  .red{color:red !important;}
  .orange{color:#F29D4A !important;}
  .grey{color:grey !important;}

  .btn_add .button.disabled {  
    background: grey;
  }
  .test-list {
    display: flex;
    margin-top:-23px
  }
  .test-item {
    border: 1px solid white;
  }
  .test-item:first-child {
    border-right: none;
    border-radius: 4px 0 0 4px;
    color: white;
  }
  .test-item:last-child {
    border-right: none;
    border-radius: 4px 0 0 4px;
    color: white;
  }
</style>
