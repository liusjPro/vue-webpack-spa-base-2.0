<template>

  <div class="sheet-modal sheet-modal-course-selection">
    <div class="sheet-modal-inner">

      <div class="block title">
        <span>運用コースを選ぶ</span>
      </div>

      <div class="block course_info challenge" v-on:click="changeCourse(0)" sheet-close=".sheet-modal-course-selection">
        <div class="row1">
          <div class="col icon">
            <img src="../assets/images/course/challenge/icon.svg" alt="">
          </div>
          <div class="col data">
            <div class="row2 name">
              <p class="course_name" >チャレンジコース</p>
              <p class="badge-image badge-autoadd">
                <img alt="" src="../assets/images/common/badge_autoadd.svg">
              </p>
            </div>
            <div class="row2 amount">
              <p class="num">9,999,999,999<span class="unit">円</span></p>
            </div>
          </div>
          <div class="col arrow">
            <img src="../assets/images/common/arrow_r_blue.svg" alt="">
          </div>
        </div>
      </div>

      <div class="block course_info standard" v-on:click="changeCourse(1)" sheet-close=".sheet-modal-course-selection">
        <div class="row1">
          <div class="col icon">
            <img src="../assets/images/course/standard/icon.svg" alt="">
          </div>
          <div class="col data">
            <div class="row2 name">
              <p class="course_name">スタンダードコース</p>
               <p class="badge-image badge-autoadd">
                 <img alt="" src="../assets/images/common/badge_autoadd.svg">
               </p>
            </div>
            <div class="row2 amount">
              <p class="num">800,100<span class="unit">円</span></p>
            </div>
          </div>
          <div class="col arrow">
            <img src="../assets/images/common/arrow_r_blue.svg" alt="">
          </div>
        </div>
      </div>

      <div class="block btn">
        <f7-button fill sheet-close=".sheet-modal-course-selection">閉じる</f7-button>
      </div>
      
    </div>
  </div>

</template>

<script>
  export default {
    data() {
      return {
      }
    },
    methods: {
      changeCourse(value) {
        this.$f7.data.course.current = value ;
        this.$f7router.navigate('/course_details/');
        this.$f7.sheet.close('.sheet-modal-course-selection');
        
      }
    },
    mounted() {
      this.$f7ready((f7) => {

        // Call F7 APIs here
      });
    }
  }
</script>
