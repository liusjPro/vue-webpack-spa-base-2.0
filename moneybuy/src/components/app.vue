<template>
<f7-app :params="f7params" >

  <!-- Left panel with cover effect-->
  <f7-panel left cover theme-dark>
    <f7-view>
      <f7-page>
        <f7-navbar title="Left Panel"></f7-navbar>
        <f7-block>Left panel content goes here</f7-block>
      </f7-page>
    </f7-view>
  </f7-panel>


  <!-- Right panel with reveal effect-->
  <f7-panel right reveal theme-dark>
    <f7-view>
      <f7-page>
        <f7-navbar title="Right Panel"></f7-navbar>
        <f7-block>Right panel content goes here</f7-block>
      </f7-page>
    </f7-view>
  </f7-panel>

  <!-- Views/Tabs container -->
  <f7-views tabs class="safe-areas">
    <f7-navbar title="ボーナス運用"></f7-navbar>
    <!-- Tabbar for switching views-tabs -->
    <f7-toolbar tabbar labels top>
      <f7-link tab-link="#view-home" data-path="/" @click="headerCurrent(0), analytics($event)" tab-link-active class="current">
        <p class="tabbar-icon"> <img alt="" src="../assets/images/common/header/icon_graph.svg"></p>
        <p class="tabbar-label">運用状況</p>
      </f7-link>

      <f7-link tab-link="#view-log" data-path="/operation_history/" @click="headerCurrent(1), analytics($event)" tab-link-active>
        <p class="tabbar-icon"><img alt="" src="../assets/images/common/header/icon_list.svg"></p>
        <p class="tabbar-label">運用履歴</p>
      </f7-link>
      <f7-link tab-link="#view-oparation-empty" data-path="/course_select_sheet/" @click="headerCurrent(2), createOperationSheet($event)" tab-link-active >
        <p class="tabbar-icon"><img alt="" src="../assets/images/common/header/icon_assets_plus.svg"></p>
        <p class="tabbar-label">運用する</p>
      </f7-link>
      <f7-link tab-link="#view-etc" data-path="/etc/" @click="headerCurrent(3), analytics($event)" tab-link-active >
        <div class="badge" v-if="noticeAlert > 0"></div>
        <p class="tabbar-icon"><img alt="" src="../assets/images/common/header/icon_threepoint.svg"></p>
        <p class="tabbar-label">その他</p>
      </f7-link>
    </f7-toolbar>

    <!-- Your main view/tab, should have "view-main" class. It also has "tab-active" class -->
    <f7-view id="view-home" main tab tab-active url="/" name="home"></f7-view>

    <!-- log View -->
    <f7-view id="view-log" name="log" tab url="/operation_history/"></f7-view>

    <!-- Oparation View -->
    <f7-view id="view-oparation" name="oparation" tab url="javaScript:void(0)"></f7-view>

    <!-- etc View -->
    <f7-view id="view-etc" name="etc" tab url="/etc/"></f7-view>

  </f7-views>


  <!-- Popup -->
  <f7-popup id="my-popup">
    <f7-view>
      <f7-page>
        <f7-navbar title="Popup">
          <f7-nav-right>
            <f7-link popup-close>Close</f7-link>
          </f7-nav-right>
        </f7-navbar>
        <f7-block>
          <p>Popup content goes here.</p>
        </f7-block>
      </f7-page>
    </f7-view>
  </f7-popup>

  <f7-login-screen id="my-login-screen">
    <f7-view>
      <f7-page login-screen>
        <f7-login-screen-title>Login</f7-login-screen-title>
        <f7-list form>
          <f7-list-input
            type="text"
            name="username"
            placeholder="Your username"
            :value="username"
            @input="username = $event.target.value"
          ></f7-list-input>
          <f7-list-input
            type="password"
            name="password"
            placeholder="Your password"
            :value="password"
            @input="password = $event.target.value"
          ></f7-list-input>
        </f7-list>
        <f7-list>
          <f7-list-button title="Sign In" login-screen-close @click="alertLoginData"></f7-list-button>
          <f7-block-footer>
            Some text about login information.<br>Click "Sign In" to close Login Screen
          </f7-block-footer>
        </f7-list>
      </f7-page>
    </f7-view>
  </f7-login-screen>

  <common_error ref="common_error"></common_error>
  <sheet_modal_course_selection ref="sheet_modal_course_selection"></sheet_modal_course_selection>
  <!-- 注意事項 -->
  <f7-block class="modal attention-modal" data-viewstatus="false"  data-checkstatus="false">
    <div class="modalContent">
      <div class="modal-block modal-block-title">注意事項</div>
      <div class="scrollOuter">
        <perfect-scrollbar>
          <div class="modal-block modal-block-smalltext">
            <span class="little">※本画⾯以降、株式会社One Tap BUYの提供するサービスについてのご案内です。</span>
          </div>
          <div class="modal-block modal-block-text">
            <ul>
              <li>本サービスは、株式会社One Tap BUYが提供するサービスです。本サービスは、当社が有価証券の売買の媒介、取次ぎもしくは代理、募集もしくは私募または募集もしくは私募の取扱い、勧誘、紹介等を行うものではありません。また、当社が金融商品取引業者として、利用者のために投資一任業務を行い、利用者の財産を運用・管理するものでもありません。<br>本サービスをご利⽤するにあたって、証券⼝座の開設をする必要はありません。本サービスは擬似的運⽤を体験していただくためのものです。</li>
              <li>運用できるポイントは「PayPayボーナス」のみと交換できます。</li>
              <li>運用の結果、運用したポイントが減少することがあります。</li>
              <li>利用にあたって年齢制限はございませんが、未成年である場合、法定代理人の同意を得た上で、利用します。</li>
            </ul>
          </div>
        </perfect-scrollbar>
      </div>
      <div class="modal-block modal-block-check" v-on:click="checkAttentionModal()">
        <img class="check_true"  src="../assets/images/common/icon_check_green.svg" alt="">
        <img class="check_false" src="../assets/images/common/icon_check_gray.svg"  alt="">
        <span>注意事項を確認しました</span>
      </div>
      <div class="modal-block modal-block-btn">
        <f7-button fill class="button-in-modal" data-active2="true" v-on:click="closeAttentionModal()">確認しました</f7-button>
        <f7-button fill class="button-in-modal" data-active2="false">確認しました</f7-button>
      </div>
    </div>
  </f7-block>
  <!-- おすすめ -->
  <f7-block class="modal survey-modal" data-viewstatus="false" data-brandid=''>
    <div class="modalContent">
      <div class="modal-block modal-block-title">あなたにおすすめの<br>運用コースは</div>
      <div class="modal-block modal-block-text"></div>
      <div class="modal-block modal-block-btn">
        <f7-button fill href="/course_selection/"  v-on:click="closeSurveyModal()">閉じる</f7-button>
      </div>
    </div>
  </f7-block>
  <!-- キャペーン -->
  <f7-block class="modal campaign-modal" data-viewstatus="false">
    <div class="modalContent">
      <div class="modal-block modal-block-image">
        <img class="check_true"  src="../assets/images/campaign/modal_mv.svg" alt=""></div>
      <div class="modal-block modal-block-text">
        <p>運用履歴から運用中残高を<br>ご確認ください</p>
      </div>
      <div class="modal-block modal-block-btn">
        <f7-button fill tab-link="#view-log" data-path="/operation_history/" @click="closeCampaignModal($event)">運用履歴</f7-button>
        <f7-button fill class="button-white" v-on:click="closeCampaignModal(null)">確認しました</f7-button>
      </div>	
    </div>
  </f7-block>
  <autoaddModal ref="autoadd_modal"></autoaddModal>
  <modal_notice_autoadd></modal_notice_autoadd>
  <div class="loading" data-viewstatus="false">
    <span id="lottie-loading"></span>
  </div>
</f7-app>

</template>

<script>
  import faq from '../assets/js/faq.js';
  import rec_send_Event from '../assets/js/event.js'
  import common_error from '../components/common_error.vue';
  import sheet_modal_course_selection from '../components/course_selection.vue';
  import autoaddModal from '../components/modal_autoadd.vue';
  import modal_notice_autoadd from '../components/modal_notice_autoadd.vue';
  // Import Dom7
  import Dom7 from 'dom7/dist/dom7.js';
  var $$ = Dom7;
  //Import vue2-perfect-scrollbar for scrollbar
  import { PerfectScrollbar } from 'vue2-perfect-scrollbar';

   export default {
    components: {
      common_error,
      sheet_modal_course_selection,
      PerfectScrollbar,
      autoaddModal,
      modal_notice_autoadd
    },
    data() {
      return {
        // Framework7 Parameters
        f7params: {
          name: 'PointBuy', // App name
          theme: 'auto', // Automatic theme detection
          // App root data
          data: function () {
            return {
              isFirst:true,
              noFirst:false,
              phase1:true,
              phase2:false,
              error_view_code:null,
              arrow_status:'same',
              attention:{
                visible:false
              },
              autoadd:{
                enable: 0,
                prepare:'',
                modal:{
                  visible:false
                }
              },
              alert: {
                notice: false
              },
              campaign:{
                visible:false,
              },
              Survey:{
                visible:false,
                current_answer:null,
                answers:{
                  A:'スタンダードコース',
                  B:'チャレンジコース'
                }
              },
              backUrl:'',
              header:{
                data:[
                  {
                    name:'home',
                    badge:true
                  },
                  {
                    name:'log',
                    badge:true
                  },
                  {
                    name:'oparation',
                    badge:true
                  },
                  {
                    name:'etc',
                    badge:true
                  }
                ]
              },
              course:{
                current:0,
                info:[
                  {
                    name_en:'challenge',
                    name:'チャレンジコース',
                    name1:'チャレンジ',
                    name2:'コース',
                    autoadd:false,
                    history: [
                      [Date.UTC(2019,  1, 10),    0],
                      [Date.UTC(2019,  1, 20), 2000],
                      [Date.UTC(2019,  1, 30), 2024],
                      [Date.UTC(2019,  2, 10), 2128],
                      [Date.UTC(2019,  2, 20), 2025],
                      [Date.UTC(2019,  2, 28), 2127],
                      [Date.UTC(2019,  3, 10), 2025],
                      [Date.UTC(2019,  3, 20), 2122],
                      [Date.UTC(2019,  3, 30), 2152],
                      [Date.UTC(2019,  4, 10), 2124],
                      [Date.UTC(2019,  4, 20), 2135],
                      [Date.UTC(2019,  4, 30), 2236],
                      [Date.UTC(2019,  5, 10), 2138],
                      [Date.UTC(2019,  5, 20), 2236],
                      [Date.UTC(2019,  5, 30), 2138],
                      [Date.UTC(2019,  6, 10), 2336],
                      [Date.UTC(2019,  6, 20), 2236],
                      [Date.UTC(2019,  6, 30), 2337],
                      [Date.UTC(2019,  7, 10), 2232],
                      [Date.UTC(2019,  7, 20), 2331],
                      [Date.UTC(2019,  7, 30), 2235],
                      [Date.UTC(2019,  8, 10), 2338],
                      [Date.UTC(2019,  8, 20), 2439],
                      [Date.UTC(2019,  8, 30), 2234],
                      [Date.UTC(2019,  9, 10), 2437],
                      [Date.UTC(2019,  9, 20), 2245],
                      [Date.UTC(2019,  9, 30), 2446],
                      [Date.UTC(2019, 10, 10), 2524],
                      [Date.UTC(2019, 10, 20), 2444],
                      [Date.UTC(2019, 10, 30), 2243],
                      [Date.UTC(2019, 11, 10), 2348],
                      [Date.UTC(2019, 11, 20), 2247],
                      [Date.UTC(2019, 11, 30), 2344],
                      [Date.UTC(2019, 12, 10), 2246],
                      [Date.UTC(2019, 12, 20), 2337],
                      [Date.UTC(2019, 12, 30), 2239],
                      [Date.UTC(2020,  1, 10), 2190],
                      [Date.UTC(2020,  1, 20), 2000],
                      [Date.UTC(2020,  1, 30), 2024],
                      [Date.UTC(2020,  2, 10), 2128],
                      [Date.UTC(2020,  2, 20), 2025],
                      [Date.UTC(2020,  2, 28), 2127],
                      [Date.UTC(2020,  3, 10), 2025],
                      [Date.UTC(2020,  3, 20), 2122],
                      [Date.UTC(2020,  3, 30), 2152],
                      [Date.UTC(2020,  4, 10), 2124],
                      [Date.UTC(2020,  4, 20), 2135],
                      [Date.UTC(2020,  4, 30), 2236],
                      [Date.UTC(2020,  5, 10), 2138],
                      [Date.UTC(2020,  5, 20), 2236],
                      [Date.UTC(2020,  5, 30), 2138],
                      [Date.UTC(2020,  6, 10), 2336],
                      [Date.UTC(2020,  6, 20), 2236],
                      [Date.UTC(2020,  6, 30), 2337],
                      [Date.UTC(2020,  7, 10), 2232],
                      [Date.UTC(2020,  7, 20), 2331],
                      [Date.UTC(2020,  7, 30), 2235],
                      [Date.UTC(2020,  8, 10), 2338],
                      [Date.UTC(2020,  8, 20), 2439],
                      [Date.UTC(2020,  8, 30), 2234],
                      [Date.UTC(2020,  9, 10), 2437],
                      [Date.UTC(2020,  9, 20), 2245],
                      [Date.UTC(2020,  9, 30), 2446],
                      [Date.UTC(2020, 10, 10), 2524],
                      [Date.UTC(2020, 10, 20), 2444],
                      [Date.UTC(2020, 10, 30), 2243],
                      [Date.UTC(2020, 11, 10), 2348],
                      [Date.UTC(2020, 11, 20), 2247],
                      [Date.UTC(2020, 11, 30), 2344],
                      [Date.UTC(2020, 12, 10), 2246],
                      [Date.UTC(2020, 12, 20), 2337],
                      [Date.UTC(2020, 12, 30), 2239]
                    ]
                  },
                  {
                    name_en:'standard',
                    name:'スタンダードコース',
                    name1:'スタンダード',
                    name2:'コース',
                    autoadd:false,
                    history: [
                      [Date.UTC(2019,  1, 10),    0],
                      [Date.UTC(2019,  1, 20), 2000],
                      [Date.UTC(2019,  1, 30), 2024],
                      [Date.UTC(2019,  2, 10), 2128],
                      [Date.UTC(2019,  2, 20), 2025],
                      [Date.UTC(2019,  2, 28), 2127],
                      [Date.UTC(2019,  3, 10), 2025],
                      [Date.UTC(2019,  3, 20), 2122],
                      [Date.UTC(2019,  3, 30), 2152],
                      [Date.UTC(2019,  4, 10), 2124],
                      [Date.UTC(2019,  4, 20), 2135],
                      [Date.UTC(2019,  4, 30), 2236],
                      [Date.UTC(2019,  5, 10), 2138],
                      [Date.UTC(2019,  5, 20), 2236],
                      [Date.UTC(2019,  5, 30), 2138],
                      [Date.UTC(2019,  6, 10), 2336],
                      [Date.UTC(2019,  6, 20), 2236],
                      [Date.UTC(2019,  6, 30), 2337],
                      [Date.UTC(2019,  7, 10), 2232],
                      [Date.UTC(2019,  7, 20), 2331],
                      [Date.UTC(2019,  7, 30), 2235],
                      [Date.UTC(2019,  8, 10), 2338],
                      [Date.UTC(2019,  8, 20), 2439],
                      [Date.UTC(2019,  8, 30), 2234],
                      [Date.UTC(2019,  9, 10), 2437],
                      [Date.UTC(2019,  9, 20), 2245],
                      [Date.UTC(2019,  9, 30), 2446],
                      [Date.UTC(2019, 10, 10), 2524],
                      [Date.UTC(2019, 10, 20), 3444],
                      [Date.UTC(2019, 10, 30), 3243],
                      [Date.UTC(2019, 11, 10), 3348],
                      [Date.UTC(2019, 11, 20), 3247],
                      [Date.UTC(2019, 11, 30), 3344],
                      [Date.UTC(2019, 12, 10), 3246],
                      [Date.UTC(2019, 12, 20), 3337],
                      [Date.UTC(2019, 12, 30), 3439],
                      [Date.UTC(2020,  1, 10), 3331],
                      [Date.UTC(2020,  1, 20), 3232],
                      [Date.UTC(2020,  1, 30), 3000],
                      [Date.UTC(2020,  2, 10), 2128],
                      [Date.UTC(2020,  2, 20), 2025],
                      [Date.UTC(2020,  2, 28), 2127],
                      [Date.UTC(2020,  3, 10), 2025],
                      [Date.UTC(2020,  3, 20), 2122],
                      [Date.UTC(2020,  3, 30), 2152],
                      [Date.UTC(2020,  4, 10), 2124],
                      [Date.UTC(2020,  4, 20), 2135],
                      [Date.UTC(2020,  4, 30), 2236],
                      [Date.UTC(2020,  5, 10), 2138],
                      [Date.UTC(2020,  5, 20), 2236],
                      [Date.UTC(2020,  5, 30), 2138],
                      [Date.UTC(2020,  6, 10), 2336],
                      [Date.UTC(2020,  6, 20), 2236],
                      [Date.UTC(2020,  6, 30), 2337],
                      [Date.UTC(2020,  7, 10), 2232],
                      [Date.UTC(2020,  7, 20), 2331],
                      [Date.UTC(2020,  7, 30), 2235],
                      [Date.UTC(2020,  8, 10), 2338],
                      [Date.UTC(2020,  8, 20), 2439],
                      [Date.UTC(2020,  8, 30), 2234],
                      [Date.UTC(2020,  9, 10), 2437],
                      [Date.UTC(2020,  9, 20), 2245],
                      [Date.UTC(2020,  9, 30), 2446],
                      [Date.UTC(2020, 10, 10), 2524],
                      [Date.UTC(2020, 10, 20), 3444],
                      [Date.UTC(2020, 10, 30), 3243],
                      [Date.UTC(2020, 11, 10), 3348],
                      [Date.UTC(2020, 11, 20), 3247],
                      [Date.UTC(2020, 11, 30), 3344],
                      [Date.UTC(2020, 12, 10), 3246],
                      [Date.UTC(2020, 12, 20), 3337],
                      [Date.UTC(2020, 12, 30), 3439]
                    ]
                  }
                ]
              },
              faq:{
                currentCategoryID:null,
                currentArticleID:null,
                category:faq
              },
              user: {
                firstName: 'Johson',
                lastName: 'Doe',
              },
              // Demo products for Catalog section
              products: [
                {
                  id: '1',
                  title: 'Apple iPhone 8',
                  description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nisi tempora similique reiciendis, error nesciunt vero, blanditiis pariatur dolor, minima sed sapiente rerum.'
                },
                {
                  id: '2',
                  title: 'Apple iPhone 8 Plus',
                  description: 'Velit odit autem modi saepe ratione totam minus, aperiam, labore quia provident temporibus quasi est ut aliquid blanditiis beatae suscipit odio vel! '
                },
                {
                  id: '3',
                  title: 'Apple iPhone X',
                  description: 'Expedita sequi perferendis quod illum pariatur aliquam, alias laboriosam! Vero blanditiis placeat, mollitia necessitatibus reprehenderit. '
                },
              ]
            };
          },

          // App routes
          view: {
            pushState: false,
          },
          sheet: {
            backdrop: true,  // Enables Sheet backdrop (dark semi transparent layer behind)
          }
        },

        // Login screen data
        username: '',
        password: '',
        iniData: this.ini(null,true),
        errData: null,
        noticeAlert: false
      }
    },
    methods: {
      // 全局: 打开页面时初始化
      ini(opt, rtn){
        opt = ES.extend(opt, {
          wait: false, // 是否显示等待(转圈)
          sessBack: null, // sess自动延期的回调
        });
        if(rtn) return opt;
        else this.iniData = opt;
      },
      // 全局: 指定设置
      set(mix, val=null) {
        if(typeof mix==='string') this.iniData[mix] = val;
        else Object.keys(mix).forEach(k=>this.iniData[k]=mix[k]);
      },
      init(){
        // var lottieObj2 = lottie.loadAnimation({
        //   container: document.getElementById('lottie-loading'),
        //   renderer: 'svg',
        //   loop: true,
        //   autoplay: true,
        //   rendererSettings: {
        //     viewBoxSize: '-34 0 164 164', // modify position for /assets/pploading.json
        //   },
        //   path: '../assets/pploading.json'
        // });
        this.$f7.data.attention.checked = false;
        this.headerBadge();
      },
      headerBadge(){
        for(var i = 0;i < this.$f7.data.header.data.length;i++){
          // $$(".toolbar a .badge").eq(i).attr('data-visible', this.$f7.data.header.data[i].badge);
        }
      },
      alertLoginData() {
        this.$f7.dialog.alert('Username: ' + this.username + '<br>Password: ' + this.password);
      },
      closeSurveyModal(){
        //this.$f7.data.Survey.visible= false;
        $$('.survey-modal').attr('data-viewstatus','false');
        var chosed_brandid = $$('.survey-modal').attr('data-brandid');

        $$("html").css({ 'position': 'assets'});
        $$("body").css({ 'overflow': 'auto'});
        $$(".page-content").css({ 'overflow-y': 'auto'});
        $$(".page-content").css({ 'overflow-x': 'auto'});
        // $$(window).off('touchmove');

        $$('.survey-modal').attr('data-viewstatus','false');
        this.$f7.data.checkedId = chosed_brandid;
        this.$f7.views.current.router.navigate('/course_selection/');
      },
      closeAttentionModal(){
        // console.log('will POST /user/status');
        const formData = {
          url: '/user/status',
          method: 'post',
          data: {'ATTENTION_FLG': '1'}
        };
        // this.$root.set('wait', true);
        g.showLoading();
        g.xhr(formData).then(res => {
          // this.$root.set('wait', false);
          g.hideLoading();
          $$('.attention-modal').attr('data-viewstatus','false');

          $$("html").css({ 'position': 'assets'});
          $$("body").css({ 'overflow': 'auto'});
          $$(".page-content").css({ 'overflow-y': 'auto'});
          $$(".page-content").css({ 'overflow-x': 'auto'});
          if(res._ekey) return this.$root.error(res);
          this.$root.set('ATTENTION_FLG', 1);
          rec_send_Event.$emit('oncheckpopup', 1); // キャペーンPopUpChcek
        });
      },
      // キャペーン確認済です
      closeCampaignModal(myEvent){
         const formData = {
          url: '/user/status',
          method: 'post',
          data: {'CAMPAIGN_APPLIED_FLG': 2}
        };
        g.showLoading();
        g.xhr(formData).then(res => {
          g.hideLoading();
          // this.$f7.data.campaign.visible= false;
          $$('.campaign-modal').attr('data-viewstatus','false');
          $$("html").css({ 'position': 'assets'});
          $$("body").css({ 'overflow': 'auto'});
          $$(".page-content").css({ 'overflow-y': 'auto'});
          $$(".page-content").css({ 'overflow-x': 'auto'});
          if(res._ekey) return this.$root.error(res);
          if (myEvent == null) {
            rec_send_Event.$emit('oncheckpopup', 2); // AutpSweep PopUpChcek
          }
        })
        if (myEvent != null) {
          this.analytics(myEvent)
        }
      },
      checkAttentionModal(){
        var status = $$('.attention-modal').attr('data-checkstatus');
        if(status == 'false') {
          status = 'true';
        } else {
          status = 'false';
        }
        $$('.attention-modal').attr('data-checkstatus',status);
      },
      /**
       * 统一异常处理
       * @param err object|null 捕获的异常
       * @param btn int 显示的按钮  1:ok 2:cancel
       *    使用位或运算:  1|2=3: ok+cancel
       * @param $router object|null 若设置(this.$f7router),跳转error页显示  null:弹框
       */ 
      error(err, btn=1, $router=null) {
        // if(!$router){
          // this.$f7.actions.open('.sheet-modal-error');
          // this.$refs.common_error.catchError(err, btn);
        // }
        this.$f7.sheet.close();
        if(err.autorefresh && (!err._ekey || (err._ekey && err._ekey != 'maintenance' && err._ekey != 'timeout'))) {
          // console.log("ignore autorefresh api error");
          this.$f7.toast.show({
            text: "一時的なエラーによりリクエストが完了しませんでした。",
            closeTimeout: 1500
          });
          return;
        }
        const errPages = ['maintenance', 'timeout', 'system', 'unknown'];
        if ($router === null) $router = this.$f7.views.current.router;
        err.btn = btn;
        this.errData = err;
        if (errPages.find(info => info == err._ekey)) {
          setTimeout(()=>{
            $router.navigate('/error/');
          },600); // add delay for fixing https://mybanker.backlog.jp/view/OTBP-201
        } else {
          this.$f7.actions.open('.sheet-modal-error');
          this.$refs.common_error.catchError(err, btn);
        }
      },
      // sess自动延期
      sessRefresh(){
        setTimeout(()=>{
          g.xhr({url:'/user/maintenance',autorefresh:true}).then(res => {
            if (res._ekey) {
              if (res._ekey === 'timeout' ||  
                  res._ekey === 'maintenance' || 
                  res._ekey === 'business' ||
                  res._ekey === 'unknown') {
                return this.$root.error(res, 0);
              }
            }
            if(this.iniData.sessBack) this.iniData.sessBack(res);
            this.sessRefresh();
          });
        }, 600000); // 1000*60*10
      },
      // 運用するシート
      createOperationSheet(e) {
        this.analytics(e);
        var self = this;
        var app = this.$f7;
        if(self.dynamicSheet) self.dynamicSheet = null;
        // request
        // this.$root.set('wait', true);
        g.showLoading();
        let $status = g.xhr('/user/assets/all').then(res => {
          // this.$root.set('wait', false);
          g.hideLoading();
          if(res._ekey) return this.$root.error(res);
          res.PROFIT_LOSS_INFO_BRAND_LIST = ES.arrayToJson(res.PROFIT_LOSS_INFO_BRAND_LIST, 'BRAND_ID');
          // Create dynamic Sheet
          var sheetContent = `
            <div class="sheet-modal sheet-modal-course-selection">
              <div class="sheet-modal-inner">

                <div class="block title">
                  <span>運用コースを選ぶ</span>
                </div>`;
          for (  var i = 0;  i < this.$root.tmpBrands.length;  i++  ) {
            // console.log(this.$root.tmpBrands[i]);
            var theBrand = this.$root.tmpBrands[i];
            // console.log(res.PROFIT_LOSS_INFO_BRAND_LIST[theBrand.BRAND_ID]);
            sheetContent += `
              <a class="jump_brand" href="#" brandid="${theBrand.BRAND_ID}">
              <div class="block course_info ${g._course_nm[theBrand.BRAND_ID] ? g._course_nm[theBrand.BRAND_ID] : ''}">
                <div class="row1">
                  <div class="col icon">
                    <img src="${theBrand.IMAGE_PATH}" alt="">
                  </div>
                  <div class="col data">
                    <div class="row2 name">
                      <p class="course_name">${theBrand.BRAND_NM}</p>
                      <p id="autoSetting${theBrand.BRAND_ID}" class="badge-image badge-autoadd">
                       <img alt="" src="../assets/images/common/badge_autoadd.svg">
                      </p>
                    </div>
                    <div class="row2 amount">
                      <p class="num">${res.PROFIT_LOSS_INFO_BRAND_LIST[theBrand.BRAND_ID] ? g.fmtAmount(res.PROFIT_LOSS_INFO_BRAND_LIST[theBrand.BRAND_ID].PROFIT_LOSS_INFO.VALUATION_AMOUNT) : 0}<span class="unit">円</span></p>
                    </div>
                  </div>
                  <div class="col arrow">
                    <img src="../assets/images/common/arrow_r_blue.svg" alt="">
                  </div>
                </div>
              </div>
              </a>`;
          }
          sheetContent += `<div class="block btn">
            <a class="button button-fill sheet-close" href="#" data-sheet=".sheet-modal-course-selection">閉じる</a>
          </div>

        </div>
      </div>`;
          self.dynamicSheet = app.sheet.create({
            content: sheetContent.trim(),
            // Events
            on: {
              close: function(sheet) {
                this.dynamicSheet = null;
              },
              open: function (sheet) {
                if (self.$f7.data.autoadd.enable != 1) {
                  document.getElementById("autoSetting71").style = "display:none;"
                }
                if (self.$f7.data.autoadd.enable != 2) {
                  document.getElementById("autoSetting72").style = "display:none;"
                }
              },
              opened: function (sheet) {
                // console.log('Sheet opened');
                $$('.jump_brand').on('click', function(event) {
                  // close sheet
                  self.dynamicSheet.close();
                  let brandID = 0, obj = event.target;
                  while(brandID == 0 && obj && obj.attributes !== undefined) {
                     if($$(obj).attr("brandid") !== null) {
                       brandID = $$(obj).attr("brandid");
                       break;
                     } else {
                       obj = obj.parentNode;
                     }
                  }
                  // navigate
                  if(brandID != 0) {
                    let view = $$('.tab-active')[0].id.substr(5);
                    app.views[view].router.navigate('/add_bonus/' + brandID);
                  }
                });
              },
            }
          });
          app.sheet.close('.sheet-modal-course-selection');
          self.dynamicSheet.open();
          // Events also can be assigned on instance later
          self.dynamicSheet.on('close', function (sheet) {
            console.log('Sheet close');
          });
          self.dynamicSheet.on('closed', function (sheet) {
            console.log('Sheet closed');
          });

          // Open dynamic sheet
          $$('.sheet-close').on('click', function () {
            self.dynamicSheet.close();
          });

        }); // end of g.xhr('/user/assets/all')
      }, // end of createOperationSheet
      headerCurrent(value){
        $$(".tab-link").removeClass('current');
        $$(".tab-link").eq(value).addClass('current');
      },
      analytics(e) {
        var path = $$(e.currentTarget).attr('data-path');
        var menuTabs = ['/', '/course_select_sheet/'];
        if (this.$f7.data.autoadd.enable != 0 && menuTabs.indexOf(path) >= 0) {
          path = path + '?as'
        }
        // console.log(`tab = ${path}`);
        gtag('config', trackingId, {'page_path': path});
        // ga('send', {'hitType': 'event', 'path': path});
      }
    },
    mounted() {
      let self = this
      this.sessRefresh();
      this.$f7ready((f7) => {
        this.init();
        var path = '/'
        if (self.$f7.data.autoadd.enable != 0) {
          path = path + '?as'
        }
        gtag('config', trackingId, {'page_path': path});
        // Call F7 APIs here
        rec_send_Event.$on('noticealert', function(alert){
          self.noticeAlert = alert
        });
      });
    },
  };
</script>
<style src="vue2-perfect-scrollbar/dist/vue2-perfect-scrollbar.css"/>
