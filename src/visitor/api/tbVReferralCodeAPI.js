/**
 * Version 1.2.0
 * 1. Yohanes 26 March 2021
 * - add ErrorHandling
 */
 import { SGHelperAPICall } from '../../core/helper/SGHelperAPICall'
import { SGHelperDB, SGHelperType ,SGHelperErrorHandling} from '../../core/helper'
import { SGHelperGlobalVar } from '../../core/helper';
import { SGBaseScreen } from '../../core/screen/SGBaseScreen';

export class tbVReferralCodeAPI extends SGBaseScreen {

    static async getUserReferralPoint() {
        var res = await SGHelperAPICall.callAPISync('SearchReferralCodeAvailable')
        return SGHelperErrorHandling.executeRespon(res)
    }

    static async getReferralRewardList(arrFilter, arrSort,pagingParam) {
        var filtersort = SGHelperAPICall.convertFilterSort(arrFilter, arrSort);

        console.log('getRefferalRewardList')
        console.log(SGHelperGlobalVar.getVar('token'))
        console.log(JSON.stringify({
            filter: filtersort.filter,
            sort: filtersort.sort,
            paging: pagingParam
        }))
        var res = await SGHelperAPICall.callAPISync('SearchReferralReward', {
            filter: filtersort.filter,
            sort: filtersort.sort,
            paging: pagingParam
        })
        return SGHelperErrorHandling.executeRespon(res)
    }

    static async tradeReferralPoint(fRewardKey, fType) {
        var jsonInput = { fRewardKey: fRewardKey, fType: fType }

        console.log('tradeReferralPoint')
        console.log(SGHelperGlobalVar.getVar('token'))
        console.log(JSON.stringify(jsonInput))
        var res = await SGHelperAPICall.callAPISync('UpdateReferral', jsonInput)
        console.log(res);
        return SGHelperErrorHandling.executeRespon(res)
    }

    static async getReferralList() {
        var res = await SGHelperAPICall.callAPISync('SearchReferralCodeReferred')
        return SGHelperErrorHandling.executeRespon(res)
    }

    static async getBuildingReferralRewardDetail(fRewardKey) {
        var res = await SGHelperAPICall.callAPISync('RewardBuildingReferral',fRewardKey)
        return SGHelperErrorHandling.executeRespon(res)
    }

    static async getTenantReferralRewardDetail(fRewardKey) {
        var res = await SGHelperAPICall.callAPISync('RewardTenantReferral',fRewardKey)
        return SGHelperErrorHandling.executeRespon(res)
    }
}