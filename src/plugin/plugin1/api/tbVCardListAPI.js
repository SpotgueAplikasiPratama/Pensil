import React from 'react';
import Core from '../../../core/core';

export default class tbVCardListAPI{
    
    static async GetMyLoyaltyCardByID(fID) {
        var res = await Core.Helper.SGHelperAPICall.callAPISync('GetMyLoyaltyCardByID', fID)
        return Core.Helper.SGHelperErrorHandling.executeRespon(res)

    }

    static async GetMyLoyaltyEarnPoint(fID) {
        var res = await Core.Helper.SGHelperAPICall.callAPISync('GetMyLoyaltyEarnPoint', fID)
        return Core.Helper.SGHelperErrorHandling.executeRespon(res)

    }

    static async GetMyLoyaltyRedeemPoint(fID) {
        var res = await Core.Helper.SGHelperAPICall.callAPISync('GetMyLoyaltyRedeemPoint', fID)
        return Core.Helper.SGHelperErrorHandling.executeRespon(res)
    }

    static async GetMyLoyaltyExpiredPoint(fID) {
        var res = await Core.Helper.SGHelperAPICall.callAPISync('GetMyLoyaltyExpiredPoint', fID)
        return Core.Helper.SGHelperErrorHandling.executeRespon(res)
    }

    static async SubmitUserLoyaltyEarnPoint(data) {
        var res = await Core.Helper.SGHelperAPICall.callAPISync('SubmitUserLoyaltyEarnPoint', data)
        return Core.Helper.SGHelperErrorHandling.executeRespon(res)
    }

    static async GetEarnPointSetting(data) {
        var res = await Core.Helper.SGHelperAPICall.callAPISync('GetEarnPointSetting', data)
        return Core.Helper.SGHelperErrorHandling.executeRespon(res)
    }

    
}