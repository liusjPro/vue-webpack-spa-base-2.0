<template>

  <f7-block class="modal autoadd-modal" data-viewstatus="false">
    <div class="modalContent add">
      <div class="modal-block modal-block-image">
        <img class="icon" src="" alt="">
      </div>
      <div class="modal-block modal-block-text1">
        <p><span class="name"></span>の<br>自動追加を設定します</p>
      </div>
      <div class="modal-block modal-block-text2">
        <span>お手持ちのPayPayボーナスの全額が<br>１日１回、自動で追加（運用）されます</span>
      </div>

      <div class="modal-block modal-block-btn1">
        <f7-button fill class="auto-apply"  v-on:click="closeAutoaddModal(1, true)">自動追加する</f7-button>
      </div>

      <div class="modal-block modal-block-btn2">
        <f7-button fill class="button-white cancel" v-on:click="closeAutoaddModal(1, false)">キャンセル</f7-button>
      </div>
    </div>

    <div class="modalContent release">
      <div class="modal-block modal-block-image">
        <img class="icon" src="" alt="">
      </div>
      <div class="modal-block modal-block-text1">
        <p><span class="name"></span>の<br>自動追加設定を解除します</p>
      </div>
      <div class="modal-block modal-block-btn1">
        <f7-button fill class="auto-apply"  v-on:click="closeAutoaddModal(0, true)">解除する</f7-button>
      </div>

      <div class="modal-block modal-block-btn2">
        <f7-button fill class="button-white cancel" v-on:click="closeAutoaddModal(0, false)">キャンセル</f7-button>
      </div>
    </div>


  </f7-block>



</template>

<script>
  import addEvent from './../assets/js/event.js'
  // Import Dom7
  import Dom7 from 'dom7/dist/dom7.js';
  var $$ = Dom7;

  export default {
    data() {
      return {
      }
    },
    methods: {
      closeAutoaddModal(type, submit){
         // AutoSweep設定する
        if (submit) {
          var brandId = 0
          // add
          if (type == 1) {
            if (this.$f7.data.autoadd.prepare == 1) {
              brandId = 71
            } else if (this.$f7.data.autoadd.prepare == 2) {
              brandId = 72
            }
          }
          const formData = {
            url: '/user/autosweep',
            method: 'post',
            data: {'BRAND_ID': brandId}
          };
          g.showLoading();
          g.xhr(formData).then(res => {
            g.hideLoading();
            this.$f7.data.autoadd.modal.visible = false;
            $$('.autoadd-modal').attr('data-viewstatus','false');
            $$("html").css({ 'position': 'assets'});
            $$("body").css({ 'overflow': 'auto'});
            $$(".page-content").css({ 'overflow-y': 'auto'});
            $$(".page-content").css({ 'overflow-x': 'auto'});
            if(res._ekey) return this.$root.error(res);
            this.sendAutoEvent(this.$f7.data.autoadd.enable, this.$f7.data.autoadd.prepare)
            this.$f7.data.autoadd.enable = this.$f7.data.autoadd.prepare;
            addEvent.$emit('autoaddtype', this.$f7.data.autoadd.enable);
          })
        // AutoSweepキャセルする
        } else {
          this.$f7.data.autoadd.prepare = this.$f7.data.autoadd.enable 
          addEvent.$emit('autoaddtype', this.$f7.data.autoadd.enable);
          this.$f7.data.autoadd.modal.visible= false;
          $$('.autoadd-modal').attr('data-viewstatus','false');
          $$("html").css({ 'position': 'assets'});
          $$("body").css({ 'overflow': 'auto'});
          $$(".page-content").css({ 'overflow-y': 'auto'});
          $$(".page-content").css({ 'overflow-x': 'auto'});
          this.sendAutoEvent(this.$f7.data.autoadd.enable, this.$f7.data.autoadd.prepare)
        }
      },
      sendAutoEvent(enable, prepare) {
        var fromBrandId = enable == 1 ? 71 : ( enable == 2 ? 72 : 0)
        var toBrandId = prepare == 1 ? 71 : ( prepare == 2 ? 72 : 0)
        g.gtag('auto_add_submit', 'autosweep', fromBrandId + '_' + toBrandId);
      }
    },
    mounted() {
      this.$f7ready((f7) => {
        // Call F7 APIs here
      });
    }
  }


</script>
