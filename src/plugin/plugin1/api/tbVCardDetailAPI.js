import React from 'react';
import Core from '../../../core/core';

export default class tbVCardDetailAPI{
    
    static async GetMyLoyaltyCardDetailByID(data) {
        // Core.log('Saya GetMyLoyaltyDetail By ID APIAPAIPAIAPAI')
        var res = await Core.Helper.SGHelperAPICall.callAPISync('GetMyLoyaltyCardDetailByID', data)
        // Core.log(JSON.stringify(res))
        return Core.Helper.SGHelperErrorHandling.executeRespon(res)

    }

    static async SearchMyLoyaltyEarnPoint(fID) {
        var res = await Core.Helper.SGHelperAPICall.callAPISync('SearchMyLoyaltyEarnPoint', fID)
        return Core.Helper.SGHelperErrorHandling.executeRespon(res)

    }
    static async SearchMyLoyaltyRedeemPoint(fID) {
        var res = await Core.Helper.SGHelperAPICall.callAPISync('SearchMyLoyaltyRedeemPoint', fID)
        return Core.Helper.SGHelperErrorHandling.executeRespon(res)

    }
    
    static async SearchMyLoyaltyExpiredPoints(fID) {
        var res = await Core.Helper.SGHelperAPICall.callAPISync('SearchMyLoyaltyExpiredPoints', fID)
        return Core.Helper.SGHelperErrorHandling.executeRespon(res)

    }

    static async GetEarnPointSetting(fBuildingKey) {
        var res = await Core.Helper.SGHelperAPICall.callAPISync('GetEarnPointSetting', fBuildingKey)
        return Core.Helper.SGHelperErrorHandling.executeRespon(res)

    }

    static async GetNewRegistrationSetting(fBuildingKey) {
        var res = await Core.Helper.SGHelperAPICall.callAPISync('GetNewRegistrationSetting', fBuildingKey)
        return Core.Helper.SGHelperErrorHandling.executeRespon(res)

    }

    static async SubmitUserLoyaltyEarnPoint(data) {
        var res = await Core.Helper.SGHelperAPICall.callAPISync('SubmitUserLoyaltyEarnPoint', data)
        return Core.Helper.SGHelperErrorHandling.executeRespon(res)

    }

    static async SearchLoyaltyReward(arrFilter, arrSort, pagingParam) {
        var token = Core.Helper.SGHelperGlobalVar.getVar("token");

        var filtersort = Core.Helper.SGHelperAPICall.convertFilterSort(arrFilter, arrSort);
        console.log(JSON.stringify({
            filter: filtersort.filter,
            sort: filtersort.sort,
            paging: pagingParam   
        }))
        var res = await Core.Helper.SGHelperAPICall.callAPISync('SearchLoyaltyReward', {
            filter: filtersort.filter,
            sort: filtersort.sort,
            paging: pagingParam    
        })
        Core.log('saya keluar')
        Core.log(JSON.stringify(res))
        return Core.Helper.SGHelperErrorHandling.executeRespon(res);
    }
}