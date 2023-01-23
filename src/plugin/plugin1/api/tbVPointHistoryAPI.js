import React from 'react';
import Core from '../../../core/core';

export default class tbVPointHistoryAPI{


    static async SearchMyLoyaltyEarnPoint(arrFilter, arrSort, pagingParam) {
        var token = Core.Helper.SGHelperGlobalVar.getVar("token");

        var filtersort = Core.Helper.SGHelperAPICall.convertFilterSort(arrFilter, arrSort);

        var res = await Core.Helper.SGHelperAPICall.callAPISync('SearchMyLoyaltyEarnPoint', {
            filter: filtersort.filter,
            sort: filtersort.sort,
            paging: pagingParam    
        })
        return Core.Helper.SGHelperErrorHandling.executeRespon(res);
    }
    

    static async SearchMyLoyaltyEarnPointReceiptDetail(data) {
        Core.log('saya masuk ke API SearchMyLoyaltyEarnPointReceiptDetail')
        var res = await Core.Helper.SGHelperAPICall.callAPISync('SearchMyLoyaltyEarnPointReceiptDetail', data)
        Core.log(JSON.stringify(res))
        return Core.Helper.SGHelperErrorHandling.executeRespon(res)

    }

    // static async SearchMyLoyaltyRedeemPoint(data) {
    //     Core.log('saya masuk ke API redeem point')
    //     var res = await Core.Helper.SGHelperAPICall.callAPISync('SearchMyLoyaltyRedeemPoint', data)
    //     // Core.log(JSON.stringify(res))
    //     return Core.Helper.SGHelperErrorHandling.executeRespon(res)
    // }


    static async SearchMyLoyaltyRedeemPoint(arrFilter, arrSort, pagingParam) {
        var token = Core.Helper.SGHelperGlobalVar.getVar("token");

        var filtersort = Core.Helper.SGHelperAPICall.convertFilterSort(arrFilter, arrSort);

        var res = await Core.Helper.SGHelperAPICall.callAPISync('SearchMyLoyaltyRedeemPoint', {
            filter: filtersort.filter,
            sort: filtersort.sort,
            paging: pagingParam    
        })
        return Core.Helper.SGHelperErrorHandling.executeRespon(res);
    }

    // static async SearchMyLoyaltyExpiredPoint(data) {
    //     var res = await Core.Helper.SGHelperAPICall.callAPISync('SearchMyLoyaltyExpiredPoint', data)
    //     // Core.log(JSON.stringify(res))
    //     return Core.Helper.SGHelperErrorHandling.executeRespon(res)

    // }

    static async SearchMyLoyaltyExpiredPoint(arrFilter, arrSort, pagingParam) {
        var token = Core.Helper.SGHelperGlobalVar.getVar("token");

        var filtersort = Core.Helper.SGHelperAPICall.convertFilterSort(arrFilter, arrSort);

        var res = await Core.Helper.SGHelperAPICall.callAPISync('SearchMyLoyaltyExpiredPoint', {
            filter: filtersort.filter,
            sort: filtersort.sort,
            paging: pagingParam    
        })
        return Core.Helper.SGHelperErrorHandling.executeRespon(res);
    }

}