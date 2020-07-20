
// Import Vue
import Vue from 'vue';

import HighchartsVue from 'highcharts-vue';
Vue.use(HighchartsVue);

// Import Framework7
import Framework7 from 'framework7/framework7-lite.esm.bundle.js';

// Import Framework7-Vue Plugin
import Framework7Vue from 'framework7-vue/framework7-vue.esm.bundle.js';

// Import Dom7
import Dom7 from 'dom7/dist/dom7.js';

// Import Framework7 Styles
import 'framework7/css/framework7.bundle.css';

// Import Icons and App Custom Styles
import '../css/icons.css';
import '../css/app.scss';

// Import App Custom Global Javascript
import './global.js';
Vue.prototype.$ = ES;
Vue.prototype.g = g;

// Init Framework7-Vue Plugin
Framework7.use(Framework7Vue);

// // dom7
var $$ = Dom7;

// // animate lottie sample
// $$('html').on('click', '#lottie-sample-ready',function () {
// 	lottieObj = lottie.loadAnimation({
// 		container: document.getElementById('lottie-sample'), 
// 		renderer: 'svg', 
// 		loop: true, 
// 		//loop: false, 
// 		autoplay: true, // 自動再生させないように
// 		//autoplay: false, // 自動再生させないように
// 		path: '../../assets/1708-success.json' 
// 	});
// });

// $$('html').on('click', '#lottie-sample-start',function () {
// 	console.log('lottieObj:',lottieObj);
// 	lottieObj.play();
// });

// //Ctrl
// $$('html').on('click','.open-modal', function () {
// 	//$$( $$(this).attr('data-target') ).css('display','flex');
// 	$$( $$(this).attr('data-target') ).attr('data-visible','true');
// 	//$$('html,body,#framework7-root').css({'pointer-events':'none'});
// 	//$$( $$(this).attr('data-target') ).css({'pointer-events':'auto'});
// 	//$$('html,body,#framework7-root').css({'overflow': 'hidden'});
// 	//openModalScrollControl();

// });

// $$('html').on('click','.close-modal', function () {
// 	//$$( $$(this).attr('data-target') ).css('display','none');
// 	$$( $$(this).attr('data-target') ).attr('data-visible','false');
// 	//$$('html,body,#framework7-root').css({'pointer-events':'auto'});
// 	//$$( $$(this).attr('data-target') ).css({'pointer-events':'auto'});
// 	//$$('html,body,#framework7-root').css({'overflow': 'auto'});
// 	//closeModalScrollControl();
// });

// // import PayPayJsBridge from '../../assets/paypay-jsbridge.js';
// $$('html').on('click','.external',function(){
// 	var attr = $$(this).attr('href');
// 	if (typeof attr !== typeof undefined && attr !== false) {
// 		if(attr == backUrl) {
// 			// window.PayPayJsBridge.closeWebview();
// 		}
// 	}
// });

// function openModalScrollControl() {
//   $$("html").css({ 'position': 'fixed'});
//   $$("body").css({ 'overflow': 'hidden'});
//   $$(".page-content").css({ 'overflow-y': 'hidden'});
//   $$(".page-content").css({ 'overflow-x': 'hidden'});
//   $$(window).on('touchmove', (e) => {
//     e.preventDefault();
//   });
// }
// function closeModalScrollControl() {
//   $$("html").css({ 'position': 'assets'});
//   $$("body").css({ 'overflow': 'auto'});
//   $$(".page-content").css({ 'overflow-y': 'auto'});
//   $$(".page-content").css({ 'overflow-x': 'auto'});
//   $$(window).off('touchmove');
// }

/*
$$('html').on('click','.scrollto', function () {
	var speed    = 500;
	var position = $$(this).offset().top;
	$$('html,body,.page-content,.page').animate({scrollTop:position}, speed, "swing");
});
*/
