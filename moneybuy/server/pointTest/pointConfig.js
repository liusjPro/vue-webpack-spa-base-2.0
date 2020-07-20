module.exports = {
  proEnv: true,
  devInfo: {
    baseURL: '127.0.0.1',
    port: '18081'
  },
  devApiV1: {
    user: '/v1/user/',
    assets: '/v1/user/assets/',
    notice: '/v1/user/news/',
    autosweep: '/v1/user/autosweep/',
    brands: '/v1/brands/',
    brand: '/v1/brand/',
    order: '/v1/user/order/',
    trades: '/v1/user/trades/'
  },
  devApiV2: {
    notice: '/v2/user/news/',
    autosweep: '/v2/user/autosweep/',
  },
  devType: {
    POSSESS_BRAND_FLG: 0, // 初期登録: 0:保有していない (is first) 1:保有している  2:全売却 
    ATTENTION_FLG: 1, // 注意事項　0: popup 1 : popupしない
    CAMPAIGN_APPLIED_FLG: 0, // キャンペーン 0:適用対象外 1:適用対象、当選未確認 2:適用対象、当選確認済
    myRealAmount: 0, // 可利用的余额
   
    home_principal_amount: 1000,  // 保有 追加した
		home_valuation_amount: 2000,  // 利用中 運用中
    course71_principal_amount: 5000,  // 保有 追加した
    course71_valuation_amount: 0,  // 利用中 運用中
    course72_principal_amount: 4000, // 保有 追加した
    course72_valuation_amount: 100, // 利用中 運用中
    receiveOrFinish: true, // 追加交换的受付 还是处理完了
    MAINTENANCE_FLG: 0 // 0　维护しない 1 维护中
  }
}
