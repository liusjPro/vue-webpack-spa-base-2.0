<template>

  <div class="sheet-modal sheet-modal-error" style="z-index:99999;">
    <div class="sheet-modal-inner">
      <div class="block icon">
        <img src="/static/images/common/icon_error.svg" alt="">
      </div>
      <div class="block text1"><p v-html="tit"></p></div>
      <div class="block text2"><p v-html="msg"></p></div>
      <div class="block btns">
        <f7-button fill                 data-target=".sheet-modal-error" sheet-close v-if="btn&1"    >OK</f7-button>
        <f7-button class="button-white" data-target=".sheet-modal-error" sheet-close v-if="btn&2">キャンセル</f7-button>
      </div>
    </div>
  </div>

</template>

<script>
  export default {
    data() {
      return {
        tit:'',
        msg:'',
        btn:0,
        btn_cancel:true,
      }
    },
    methods: {
      // btn: int 显示的按钮  1:ok 2:cancel 使用位或运算 1|2=3: ok+cancel
      catchError(err, btn=1){
        if(err._ekey==='timeout'){
          this.tit = 'タイムアウトしました';
          this.msg = '右上の「×」ボタンを押して、<br>再度PayPayホーム画面から<br>ボーナス運用をタップしてください。';
        }
        else if(err._ekey==='maintenance'){
          this.tit = 'メンテナンス中';
          this.msg = err && err._emsg || 'ただいまメンテナンス中のため<br>ご利用いただけません。<br>ご迷惑をおかけして申し訳ございません。';
        }
        else if(err._ekey==='business'){
          this.tit = '入力内容をご確認ください。<br>追加または引き出し(交換)は完了していません。';
          this.msg = err && err._emsg || '入力内容をご確認ください。<br>追加または引き出し(交換)は完了していません。';
        }
        else {
          this.tit = '通信エラーが発生しました。<br>時間をおいて再度お試しください。';
          // this.msg = err && err._emsg || '通信状態が不安定のようです。インターネット接続状態を確認した上で再度お試しください';
          this.msg = err && err._emsg || '';
        }
        this.btn = btn;
      },
    },
  }
</script>
