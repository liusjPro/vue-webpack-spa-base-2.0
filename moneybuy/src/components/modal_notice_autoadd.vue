<template>

  <f7-block class="modal notice-autoadd-modal" data-viewstatus="false">
    <div class="modalContent">
      <div class="modal-block modal-block-title">
        <p>「自動追加」登場！</p>
      </div>
      <div class="modal-block modal-block-image">
        <img class="icon" src="/static/images/autoaddmodal/mv.svg" alt="">
      </div>
      <div class="modal-block modal-block-text">
        <span>自動追加を設定すると、付与されるPayPayボーナスを自動的に運用にまわすことができます。</span>
      </div>

      <div class="modal-block modal-block-btn1">
        <f7-button fill class="apply" href="/autoadd/" v-on:click="closeNoticeAutoaddModal(true)">自動追加を設定する</f7-button>
      </div>

      <div class="modal-block modal-block-btn2">
        <f7-button fill class="button-white cancel" v-on:click="closeNoticeAutoaddModal(false)">閉じる</f7-button>
      </div>
    </div>
  </f7-block>

</template>

<script>
  // Import Dom7
  import Dom7 from 'dom7/dist/dom7.js';
  var $$ = Dom7;

  export default {
    data() {
      return {
      }
    },
    methods: {
      closeNoticeAutoaddModal(value){
        if(typeof(Storage) != "undefined") {
          if (localStorage.autosweepFlag == null || localStorage.autosweepFlag == '1') {
            localStorage.autosweepFlag = '2';
          }
        }
        this.$f7.data.autoadd.modal.visible = false;
        $$('.notice-autoadd-modal').attr('data-viewstatus','false');
        $$("html").css({ 'position': 'static'});
        $$("body").css({ 'overflow': 'auto'});
        $$(".page-content").css({ 'overflow-y': 'auto'});
        $$(".page-content").css({ 'overflow-x': 'auto'});
        if (value) {
          g.gtag('auto_add_to', 'autosweep', 'popup');
        } else {
          g.gtag('auto_add_popup', 'autosweep', 'close');
        }
      }
    },
    mounted() {
      this.$f7ready((f7) => {
        // Call F7 APIs here
      });
    }
  }


</script>
