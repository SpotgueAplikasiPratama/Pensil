import React from 'react';
import Core from '../../../core/core';
import { SGHelperGlobalVar } from '../../../core/helper';

export default class tbVEarnPointAPI{
    
    static async SubmitLoyaltyPointEarnFromReceipt(data) {
        var res = await Core.Helper.SGHelperAPICall.callAPISync('SubmitLoyaltyPointEarnFromReceipt', data)
        return Core.Helper.SGHelperErrorHandling.executeRespon(res)

    }    

    static async GetNewRegistrationSetting(data) {
        var res = await Core.Helper.SGHelperAPICall.callAPISync('GetNewRegistrationSetting', data)
        return Core.Helper.SGHelperErrorHandling.executeRespon(res)
    }

    static async GetEarnPointSetting(fBuildingKey) {
        Core.log('saya masuk nih dong nih dong nih dong')
        var res = await Core.Helper.SGHelperAPICall.callAPISync('GetEarnPointSetting', fBuildingKey)
        Core.log(JSON.stringify(res))
        return Core.Helper.SGHelperErrorHandling.executeRespon(res)
    }

    static async TenantListPicker(lang) {
        // Core.log('masuk ke TenantListPicker')
        var res = await Core.Helper.SGHelperAPICall.callAPISync('TenantListPicker', lang)
        // Core.log(JSON.stringify(res))
        return Core.Helper.SGHelperErrorHandling.executeRespon(res)

    }

    

}