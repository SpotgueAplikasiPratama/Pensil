/**
 * Version 1.2.0
 * 1. Yohanes 26 March 2021
 * - add ErrorHandling
 */
 import { SGHelperAPICall } from '../../core/helper/SGHelperAPICall'
import { SGHelperDB, SGHelperType ,SGHelperErrorHandling} from '../../core/helper'
import { SGHelperGlobalVar } from '../../core/helper';
import { SGBaseScreen } from '../../core/screen/SGBaseScreen';

export class tbVLoyaltyRewardAPI extends SGBaseScreen {

    static async UpdateLoyaltyReward(fRewardKey, fCardKey, fMemberKey, fMemberType, fType) {
        var jsonInput = { fRewardKey: fRewardKey, fCardKey: fCardKey, 
            fMemberKey: fMemberKey, fMemberType: fMemberType, fType: fType }
        console.log('updateLoyaltyReward')
        console.log(SGHelperGlobalVar.getVar('token'))
        console.log(JSON.stringify(jsonInput))
        var res = await SGHelperAPICall.callAPISync('UpdateLoyaltyReward', jsonInput)
        console.log(res);
        return SGHelperErrorHandling.executeRespon(res)
    }

    static async getBuildingLoyaltyRewardDetail(inputDetail) {
        console.log(JSON.stringify(inputDetail))
        console.log(SGHelperGlobalVar.getVar('token'))
        console.log('cek input')
        var res = await SGHelperAPICall.callAPISync('RewardBuildingLoyalty',inputDetail)
        return SGHelperErrorHandling.executeRespon(res)
    }

    static async getTenantLoyaltyRewardDetail(inputDetail) {
        var res = await SGHelperAPICall.callAPISync('RewardTenantLoyalty',inputDetail)
        return SGHelperErrorHandling.executeRespon(res)
    }
}