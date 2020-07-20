<template>
  <f7-page name="home" no-swipeback-tmp>
    <f7-navbar>
      <f7-nav-left>
     </f7-nav-left>
      <f7-nav-title>ボーナス運用</f7-nav-title>
      <f7-nav-right>
        <f7-link href="/faq_list/"><img src="/static/images/common/header/icon_question.svg"></f7-link>
        <f7-link class="external" :href="this.$f7.data.backUrl">
          <img src="/static/images/common/header/icon_close.svg">
        </f7-link>
      </f7-nav-right>
    </f7-navbar>

    <!-- is first -->
    <template v-if="this.POSSESS_BRAND_FLG===0">
      <f7-block class="text1_1 isfirst">
        <span class="yellow-tip">100万ユーザーが運用中！</span>
      </f7-block>

      <f7-block class="text1_2">
        <span>PayPayボーナスを運用してみよう</span>
      </f7-block>
      <f7-block class="graph">
        <img src="/static/images/home/fig_first_mv.svg" alt="">
      </f7-block>
      <f7-block class="text1_3">
        <p>＊</p>
        <p>2019年の1年間を運用期間として計算した値です。<br>将来の運用成果を示唆あるいは保証するものではありません。</p>
      </f7-block>
      <f7-block class="btn_detail">
        <f7-button class="button-white" href="">もっと詳しく見る</f7-button>
      </f7-block>

      <f7-block class="survey">
        <p class="title">運用コースを診断しよう</p>
        <p class="desc">質問に答えると、<br>あなたにおすすめの運用コースを診断できます。</p>
        <p class="question_title">くじを引くなら？</p>
        <p class="btns">
          <f7-button class="button-white button-array open-modal yes" v-on:click="openSurveyModal('A')">A. 毎回、100円当たるくじ</f7-button>
          <f7-button class="button-white button-array open-modal no"  v-on:click="openSurveyModal('B')">B. 10回に1回、10,000円当たるくじ</f7-button>
        </p>
        <p class="paginate">
          <a class="mark active"></a>
          <a class="mark"></a>
          <a class="mark"></a>
        </p>
      </f7-block>
      <f7-block class="bnr_autoadd bnr_autoadd_first" v-on:click="sendAutoEvent(true)" v-if="autoaddtype == 0">
        <a href="/autoadd/">
          <img class="w100per" src="/static/images/campaign/bnr2.svg" alt="">
        </a>
      </f7-block>

      <f7-block class="btn_start">
        <f7-button href="/course_selection/">ボーナス運用をはじめる</f7-button>
      </f7-block>
      
      <f7-block class="text_error" style="padding-bottom:15px" v-if="zeroAmount">
        <p>{{g._amountNullErr}}</p>
      </f7-block>
    </template>

    <!-- no first -->
    <template v-else-if="this.ready && this.POSSESS_BRAND_FLG===1">
      <f7-block class="text2_2" v-if="false">
        <p>運用状況</p>
      </f7-block>
      <home_chart  :assetsAll="this.assetsAll" ref="home_chart"></home_chart>
      <div id="autoRefreshHome" value="1" data-viewstatus="false"/>
      <template v-if="this.brands">
        <a v-for="(row,key) in this.brands" :key="key" :href="'/course_details/'+row.BRAND_ID">
          <f7-block class="course_info challenge">
            <div class="row">
              <div class="icon">
                <img :src="row.IMAGE_PATH" alt="">
              </div>
              <div class="status">
                <p class="course_name">
                  <span class="name">{{row.BRAND_NM}}</span><br>
                  <span class="badge-image badge-autoadd" v-if="key == 0 && autoaddtype == 2">
                    <img alt="" src="/static/images/common/badge_autoadd.svg">
                  </span>
                  <span class="badge-image badge-autoadd" v-if="key == 1 && autoaddtype == 1">
                    <img alt="" src="/static/images/common/badge_autoadd.svg">
                  </span>
                </p>
                <p class="amount_cnt">
                  <span class="amount">{{assetsAll.PROFIT_LOSS_INFO_BRAND_LIST[row.BRAND_ID].VALUATION_AMOUNT}}</span>
                  <span class="unit">円</span>
                </p>
                <p class="data_cnt">
                  <span class="amount" :class="assetsAll.PROFIT_LOSS_INFO_BRAND_LIST[row.BRAND_ID].color">{{assetsAll.PROFIT_LOSS_INFO_BRAND_LIST[row.BRAND_ID].PROFIT_LOSS_AMOUNT}}</span><span class="unit" :class="assetsAll.PROFIT_LOSS_INFO_BRAND_LIST[row.BRAND_ID].color">円</span>
                  <span class="percent" :class="assetsAll.PROFIT_LOSS_INFO_BRAND_LIST[row.BRAND_ID].color">({{assetsAll.PROFIT_LOSS_INFO_BRAND_LIST[row.BRAND_ID].PROFIT_LOSS_RATE}})</span>
                </p>
              </div>
              <div class="arrow">
                <img src="/static/images/common/arrow_r_blue.svg" alt="">
              </div>
            </div>
          </f7-block>
        </a>
        <f7-block class="autoadd_bnr" v-show="autoaddtype == 0">
          <a href="/autoadd/" v-on:click="sendAutoEvent(false)" > <img class="w100per" src="/static/images/campaign/bnr2.svg" alt=""> </a>
        </f7-block>
      </template>
    </template>
  </f7-page>
</template>
<script>
  import home_chart from '../../components/home_chart.vue';
  import rec_send_Event from '../../assets/js/event.js'
  // Import Dom7
  import Dom7 from 'dom7/dist/dom7.js';
  var $$ = Dom7;

  export default {
    components: { home_chart },
    data() {
      let rewrite = this.initRouter();
      // this.$root.ini({wait:true});
      !rewrite && g.showLoading();
      let brands=null, assets=null, err=null;
      if(!rewrite){
        let $status = g.xhr('/user/status').then(res => {
          if(res._ekey) {
            if(err === null) err = res;
            return;
          }
          gtag('config', trackingId, {'user_id': res.CLIENT_ID});
          res.ATTENTION_FLG = res.ATTENTION_FLG*1;
          this.$root.set('ATTENTION_FLG', res.ATTENTION_FLG);
          // POSSESS_BRAND_FLG: 0=保有していない　1=保有している 2=全売却
          this.POSSESS_BRAND_FLG = res.POSSESS_BRAND_FLG = res.POSSESS_BRAND_FLG*1;
          this.$f7.data.isFirst = this.POSSESS_BRAND_FLG == 0 ? true : false
          // 0:キャンペーン適用対象外 1:キャンペーン適用対象、当選未確認 2:キャンペーン適用対象、当選確認済
          if (res.CAMPAIGN_APPLIED_FLG != null) {
            this.CAMPAIGN_APPLIED_FLG = res.CAMPAIGN_APPLIED_FLG = res.CAMPAIGN_APPLIED_FLG*1;
          }
          this.$root.tmpStatus = res;
          this.setPageisFirst()
        });
        let $brands = g.xhr('/brands/list').then(res => {
          if(res._ekey) {
            if(err === null) err = res;
            return;
          }
          res.SE_BRAND_ARRAY.sort((a,b) => a.SORT>b.SORT?1:-1);
          brands = this.$root.tmpBrands = res.SE_BRAND_ARRAY;
          this.$root.tmpBrandsObj = ES.arrayToJson(brands, 'BRAND_ID');
        });
        let $assets = g.xhr('/user/assets/all').then(res => {
          if(res._ekey) {
            if(err === null) err = res;
            return;
          }
          if(!res.PROFIT_LOSS_INFO_BRAND_LIST) res.PROFIT_LOSS_INFO_BRAND_LIST = [];
          this.$root.tmpAssets = ES.arrayToJson(res.PROFIT_LOSS_INFO_BRAND_LIST, 'BRAND_ID');
          assets = res;
        });
        var reqeustUrl = '/user/news/list?PAGE_DATA_CNT=1\&SEQ_NO=null\&OPEN_DT=null';
        let $noticeReq = g.xhr(reqeustUrl).then(res => {
          if(res._ekey) {
            if(err === null) err = res;
            return;
          }
          var has_unread = 0
          if (res.HAS_UNREAD != null) {
            has_unread = parseInt(res.HAS_UNREAD)
          }
          this.$f7.data.alert.notice = has_unread
          rec_send_Event.$emit('noticealert', has_unread);
        });
        let $autoSweep = g.xhr('/user/autosweep').then(res => {
          if(res._ekey) {
            if(err === null) err = res;
            return;
          }
          res.BRAND_ID = res.BRAND_ID * 1;
          this.$f7.data.autoadd.enable = 0
          if (res.BRAND_ID != null && res.BRAND_ID != 0) {
            this.$f7.data.autoadd.enable = res.BRAND_ID == 71 ? 1 : ( res.BRAND_ID == 72 ? 2 : 0) 
          }
          this.autoaddtype = this.$f7.data.autoadd.enable
          rec_send_Event.$emit('autoaddtype', this.$f7.data.autoadd.enable);
        });
        // 起動時ユーザステータス取得、銘柄マスタ取得、保有状況取得の３つが終わったら下記後続処理をする
        // 　ローディング完了
        // 　保有している場合の初回画面表示
        // 　保有している場合チャートデータ取得＆チャート描画
        Promise.all([$status, $brands, $assets, $noticeReq, $autoSweep]).then(() => {
          g.hideLoading();
          if(err) return !rewrite && this.$root.error(err);
          if(this.POSSESS_BRAND_FLG===2 && !rewrite){
            setTimeout(()=>{
              this.$f7router.navigate('/course_selection/', {
                reloadCurrent:true,
              });
            }, 300);
            return;
          }
          this.setAssets(assets);
          this.ready = true;
          // 初回HOMEの場合/user/assets/allをリロードしない
          if(this.POSSESS_BRAND_FLG) {
            this.autoRefresh(true);
          }
          // 注意事項が見てなかった場合注意事項のPOPUP表示
          if(this.$root.iniData['ATTENTION_FLG'] === 0) {
            this.openAttentionModal();
          } else {
            this.onCheckPopup(1)
          }
        });
      }
      return {
        ready: false, 
        POSSESS_BRAND_FLG: null, 
        CAMPAIGN_APPLIED_FLG: 0,
        autoaddtype: 0,
        startAuto: 0,
        brands: null, 
        assetsAll: null,
        survay:{
          visible:false,
          current_answer:null,
          answers:{
            A:'スタンダードコース',
            B:'チャレンジコース'
          }
        },
        zeroAmount: false,
        realAmount: 0,
      };
    },
    watch: {
      assetsAll: {
        handler(val) {
          let realAmount = val.REAL_POINT * 1;
          if (realAmount == 0) this.zeroAmount = true;
        }
      }
    },
    methods: {
      initRouter(){
        var toParam = g.getParam('to');
        console.log("to: " + toParam);
        if(toParam != null) {
          switch(toParam) {
            case 'services':
              this.$f7router.navigate({
                name: 'services',
                params: { noheader: 1 },
              });
              return true;
            case 'privacypolicy':
               this.$f7router.navigate({
                name: 'privacypolicy',
                params: { noheader: 1 },
              });
              return true;
            case 'terms':
               this.$f7router.navigate({
                name: 'terms',
                params: { noheader: 1 },
              });
              return true;
            case 'faq_list':
              this.$f7router.navigate({
              name: 'faq_list',
              params: { noheader: 1 },
            });
              return true;
            case 'sessiontimeout':
               this.$root.error({'_ekey': 'timeout'}, 0, this.$f7router);
              return true;
            case 'maintenance':
               this.$f7router.navigate({
                name: 'error',
                params: { id: 4 },
              });
              return true;
          }
        }
        return false;
      },
       setPageisFirst(){
        if(this.$f7.data.isFirst == true){
          $$('.page[data-name="home"] .page-content').attr('data-isfirst','true');
        }else{
          $$('.page[data-name="home"] .page-content').attr('data-isfirst','false');
        }
      },
      // アンケートPOPUP開く
      openSurveyModal(value){
        this.survay.visible= true;
        this.survay.current_answer = value;
        $$('.survey-modal').attr('data-viewstatus','true');
        $$('.survey-modal .modal-block-text').empty().append(this.survay.answers[this.survay.current_answer]);
        for (let item of this.brands) {
          if (item.BRAND_NM === this.survay.answers[this.survay.current_answer]) {
            $$('.survey-modal').attr('data-brandid', item.BRAND_ID);
          }
        }
        $$("html").css({ 'position': 'fixed'});
        $$("body").css({ 'overflow': 'hidden'});
        $$(".page-content").css({ 'overflow-y': 'hidden'});
        $$(".page-content").css({ 'overflow-x': 'hidden'});
        $$(window).on('touchmove', (e) => {
          e.preventDefault();
        });
        g.gtag('survey', 'general', value);
      },
      // 注意事項
      openAttentionModal(){
        $$('.attention-modal').attr('data-viewstatus','true');
        $$("html").css({ 'position': 'fixed'});
        $$("body").css({ 'overflow': 'hidden'});
        $$(".page-content").css({ 'overflow-y': 'hidden'});
        $$(".page-content").css({ 'overflow-x': 'hidden'});
        $$(window).on('touchmove', (e) => {
          e.preventDefault();
        });
      },
      // キャペーン
      openCampaignModal(){
        this.$f7.data.campaign.visible= true;
        $$('.campaign-modal').attr('data-viewstatus','true');
        $$("html").css({ 'position': 'fixed'});
        $$("body").css({ 'overflow': 'hidden'});
        $$(".page-content").css({ 'overflow-y': 'hidden'});
        $$(".page-content").css({ 'overflow-x': 'hidden'});
      },
      // アートSweep
      openNoticeAutoaddModal(){
        this.$f7.data.autoadd.modal.visible= true;
        $$('.notice-autoadd-modal').attr('data-viewstatus','true');
        $$("html").css({ 'position': 'fixed'});
        $$("body").css({ 'overflow': 'hidden'});
        $$(".page-content").css({ 'overflow-y': 'hidden'});
        $$(".page-content").css({ 'overflow-x': 'hidden'});
      },
      // checkIndex: 1 campaigning確認画面 2 AutoSweep確認画面
      onCheckPopup(checkIndex) {
        // 運用残高ある
        if (checkIndex == 1) {
          // campaigning確認画面
          if (this.CAMPAIGN_APPLIED_FLG == 1) {
            this.openCampaignModal()
          } else {
            checkIndex = 2
          }
        }
        if (checkIndex == 2) {
          // AutoSweep確認画面
          if (typeof(Storage) != "undefined") {
            let autosweepFlag = localStorage.autosweepFlag
            if (autosweepFlag == null || (autosweepFlag != '1' && autosweepFlag != '2')) {
              this.openNoticeAutoaddModal()
            } else if(autosweepFlag == 1) {
              if( this.autoaddtype == 0) {
                this.openNoticeAutoaddModal()
              }
            }
          }
        }
      },
      setAssets(assets){
        let brands = this.$root.tmpBrands;
        this.brands = brands;
        if(assets === null) {
          this.assetsAll = null;
          return;
        }
        assets.PROFIT_LOSS_INFO_BRAND_LIST = ( assets.PROFIT_LOSS_INFO_BRAND_LIST.length > 0 )?ES.arrayToJson(
          assets.PROFIT_LOSS_INFO_BRAND_LIST,
          'BRAND_ID',
          'PROFIT_LOSS_INFO'
        ):{};
        brands.forEach(row => {
          let data = null;
          if(Object.keys(assets.PROFIT_LOSS_INFO_BRAND_LIST).length > 0 && ("" + row.BRAND_ID in assets.PROFIT_LOSS_INFO_BRAND_LIST)) data = assets.PROFIT_LOSS_INFO_BRAND_LIST[row.BRAND_ID];
          if(data){
            let color = 'grey';
            if(data.PROFIT_LOSS_AMOUNT>0) color = 'green';
            else if(data.PROFIT_LOSS_AMOUNT<0) color = 'red';
            assets.PROFIT_LOSS_INFO_BRAND_LIST[row.BRAND_ID] = {
              VALUATION_AMOUNT: g.fmtAmount(data.VALUATION_AMOUNT),
              PROFIT_LOSS_AMOUNT: g.fmtAmount(data.PROFIT_LOSS_AMOUNT, true),
              PROFIT_LOSS_RATE: g.fmtRate(data.PROFIT_LOSS_RATE, true),
              color,
            };
          }
          else {
              assets.PROFIT_LOSS_INFO_BRAND_LIST[row.BRAND_ID] = {
                VALUATION_AMOUNT: '0',
                PROFIT_LOSS_AMOUNT: '0',
                PROFIT_LOSS_RATE: 'ー',
                color: 'grey',
              };
          }
        });
        this.assetsAll = assets;
      },
      autoRefresh(force){
        let isLeave = false;
        if(!force){
          let $es = document.querySelectorAll('[data-name="home"]');
          isLeave = true;
          $es.length && $es.forEach(em => {
            if(
              em.className.split(' ').indexOf('page-current')>=0 &&
              em.parentNode.className.split(' ').indexOf('tab-active')>=0
            ) isLeave = false;
          });
        }
        
        if(this.$root.homeTimer) clearTimeout(this.$root.homeTimer);
        if(isLeave) return this.$root.homeTimer = setTimeout(() => this.autoRefresh(), 5000);
        let url = '/user/assets/all'
        return g.xhr({"url":url,autorefresh:!force}).then(res => {
            if(this.$root.homeTimer) clearTimeout(this.$root.homeTimer);
            this.$root.homeTimer = setTimeout(() => this.autoRefresh(), 5000);
            if(res._ekey) return this.$root.error(res);
            if(!res.PROFIT_LOSS_INFO_BRAND_LIST) res.PROFIT_LOSS_INFO_BRAND_LIST = [];
            this.$root.tmpAssets = ES.arrayToJson(res.PROFIT_LOSS_INFO_BRAND_LIST, 'BRAND_ID');
            this.setAssets(res);
            if(!this.$refs.home_chart) return;
            this.$refs.home_chart.setAssets(res, true);
            this.$root.realAmount = this.realAmount = res.REAL_POINT * 1;
            if (this.realAmount == 0) this.zeroAmount = true;
        });
      },
      sendAutoEvent(first) {
        if (first) {
          g.gtag('auto_add_to', 'autosweep', 'survey');
        } else {
          g.gtag('auto_add_to', 'autosweep', 'home');
        }
      },
    },
     mounted() {
      let self = this
      this.$f7ready((f7) => {
        // Call F7 APIs here
        rec_send_Event.$on('autoaddtype', function(autoaddtype){
          self.autoaddtype = autoaddtype
        });
        rec_send_Event.$on('oncheckpopup', function(checkIndex){
          self.onCheckPopup(checkIndex)
        });
      });
    },
  }
</script>

<style scoped>
  .green{color:#20bf7a !important;}
  .red{color:red !important;}
  .grey{color:grey !important;}
  .btn_start .button.disabled {  
    background: grey;
  }
</style>
