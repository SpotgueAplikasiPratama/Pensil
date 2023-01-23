/**
 * Version 1.2.0
 * 1. Yohanes 26 March 2021
 * - add ErrorHandling
 */
 import { SGHelperAPICall } from '../../core/helper/SGHelperAPICall'
import { SGHelperDB ,SGHelperErrorHandling,SGHelperType,SGHelperGlobalVar} from '../../core/helper'
import { SGBaseScreen } from '../../core/screen/SGBaseScreen';

export class VRewardAPI extends SGBaseScreen {

    static async SurpriseRewardOpenMall(fID) {
        var circuitBreaker = SGHelperType.getCircuitBreakerStatus('CircuitBreakerSurpriseReward')
        if(circuitBreaker.fActive==="Y"){
          
            var res = await SGHelperAPICall.callAPISync('SurpriseRewardsOpenMall', fID)
            return SGHelperErrorHandling.executeRespon(res);
        }else{
            console.log("CircuitBreaker SurpriseRewardOpenMall")
            return { fID: null, fRewardID: { fTargetName: '', fShortDescription: '', fImageJSON: [] }, fRewardEN: { fTargetName: '', fShortDescription: '', fImageJSON: [] }, fRewardCN: { fTargetName: '', fShortDescription: '', fImageJSON: [] } }
        }
       
    }
    static async SurpriseRewardCheckInMall(fID) {
        var circuitBreaker = SGHelperType.getCircuitBreakerStatus('CircuitBreakerSurpriseReward')
        if(circuitBreaker.fActive==="Y"){
            var res = await SGHelperAPICall.callAPISync('SurpriseRewardsCheckInMall', fID)
            return SGHelperErrorHandling.executeRespon(res);
        }else{
            console.log("CircuitBreaker SurpriseRewardCheckInMall")
            return { fID: null, fRewardID: { fTargetName: '', fShortDescription: '', fImageJSON: [] }, fRewardEN: { fTargetName: '', fShortDescription: '', fImageJSON: [] }, fRewardCN: { fTargetName: '', fShortDescription: '', fImageJSON: [] } }
        }

    }
    static async SurpriseRewardOpenStore(fID) {
        var circuitBreaker = SGHelperType.getCircuitBreakerStatus('CircuitBreakerSurpriseReward')
        if(circuitBreaker.fActive==="Y"){
            var res = await SGHelperAPICall.callAPISync('SurpriseRewardsOpenStore', fID)
            return SGHelperErrorHandling.executeRespon(res);
        }else{

            console.log("CircuitBreaker SurpriseRewardOpenStore")
            return { fID: null, fRewardID: { fTargetName: '', fShortDescription: '', fImageJSON: [] }, fRewardEN: { fTargetName: '', fShortDescription: '', fImageJSON: [] }, fRewardCN: { fTargetName: '', fShortDescription: '', fImageJSON: [] } }
        }

    }
    static async SurpriseRewardCheckInStore(fID) {
        var circuitBreaker = SGHelperType.getCircuitBreakerStatus('CircuitBreakerSurpriseReward')
        if(circuitBreaker.fActive==="Y"){
            var res = await SGHelperAPICall.callAPISync('SurpriseRewardsCheckInStore', fID)
            return SGHelperErrorHandling.executeRespon(res);;
        }else{

            console.log("CircuitBreaker SurpriseRewardCheckInStore")
            return { fID: null, fRewardID: { fTargetName: '', fShortDescription: '', fImageJSON: [] }, fRewardEN: { fTargetName: '', fShortDescription: '', fImageJSON: [] }, fRewardCN: { fTargetName: '', fShortDescription: '', fImageJSON: [] } }
        }

    }
    static async SurpriseRewardLikeMall(fID) {
        var circuitBreaker = SGHelperType.getCircuitBreakerStatus('CircuitBreakerSurpriseReward')
        if(circuitBreaker.fActive==="Y"){
            var res = await SGHelperAPICall.callAPISync('SurpriseRewardsLikeMall', fID)
            return SGHelperErrorHandling.executeRespon(res);
        }else{

            console.log("CircuitBreaker SurpriseRewardLikeMall")
            return { fID: null, fRewardID: { fTargetName: '', fShortDescription: '', fImageJSON: [] }, fRewardEN: { fTargetName: '', fShortDescription: '', fImageJSON: [] }, fRewardCN: { fTargetName: '', fShortDescription: '', fImageJSON: [] } }
        }

    }
    static async SurpriseRewardLikeStore(fID) {
        var circuitBreaker = SGHelperType.getCircuitBreakerStatus('CircuitBreakerSurpriseReward')
        if(circuitBreaker.fActive==="Y"){
            var res = await SGHelperAPICall.callAPISync('SurpriseRewardsLikeStore', fID)
            return SGHelperErrorHandling.executeRespon(res);
        }else{

            console.log("CircuitBreaker SurpriseRewardLikeStore")
            return { fID: null, fRewardID: { fTargetName: '', fShortDescription: '', fImageJSON: [] }, fRewardEN: { fTargetName: '', fShortDescription: '', fImageJSON: [] }, fRewardCN: { fTargetName: '', fShortDescription: '', fImageJSON: [] } }
        }

    }
    static async searchRedeemReward(arrFilter, arrSort,pagingParam) {
        var token = SGHelperGlobalVar.getVar("token");
        var filtersort = SGHelperAPICall.convertFilterSort(arrFilter, arrSort);

        // console.log(token);
        console.log(JSON.stringify({
            filter: filtersort.filter,
            sort: filtersort.sort,
            paging : pagingParam
        }))
        console.log('my reward active')
        var res = await SGHelperAPICall.callAPISync('SearchRedeemRewardVisitor', {
            filter: filtersort.filter,
            sort: filtersort.sort,
            paging : pagingParam
        })
        return SGHelperErrorHandling.executeRespon(res);
    }
    static async searchRedeemRewardHistory(arrFilter, arrSort,pagingParam) {
        var token = SGHelperGlobalVar.getVar("token");
        var filtersort = SGHelperAPICall.convertFilterSort(arrFilter, arrSort);
        console.log(JSON.stringify({
            filter: filtersort.filter,
            sort: filtersort.sort,
            paging:pagingParam
        }))
        var res = await SGHelperAPICall.callAPISync('SearchRedeemRewardHistoryVisitor', {
            filter: filtersort.filter,
            sort: filtersort.sort,
            paging:pagingParam
        })
        console.log('2')
        console.log(res);
        return SGHelperErrorHandling.executeRespon(res);
    }
    static async getRedeemRewardBuildingByID(fID) {
        var res = await SGHelperAPICall.callAPISync('GetRedeemRewardBuildingByIDVisitor', fID)
        try {
            return SGHelperErrorHandling.executeRespon(res);
        } catch (error) {
            return null
        }
    }
    //getRedeemRewardByIDForVisitor
    //getRedeemRewardByIDForVisitor

    
    static async getRedeemRewardTenantByID(fID) {
        var token = SGHelperGlobalVar.getVar("token");
        // console.log(token)
        // console.log(JSON.stringify(fID))
        var res = await SGHelperAPICall.callAPISync('GetRedeemRewardTenantByIDVisitor', fID)
     
        try {
            return SGHelperErrorHandling.executeRespon(res);
        } catch (error) {
            return null
        }
    }

    static async redeemTenantReward(data) {
        var res = await SGHelperAPICall.callAPISync('RedeemTenantReward', data)
        return SGHelperErrorHandling.executeRespon(res);
    }
//aw
    static async redeemBuildingReward(data) {

        var res = await SGHelperAPICall.callAPISync('RedeemBuildingReward', data)
        return SGHelperErrorHandling.executeRespon(res);
    }

    static async redeemTenantRewardByCode(data) {
        var res = await SGHelperAPICall.callAPISync('RedeemTenantRewardByCode', data)
        return SGHelperErrorHandling.executeRespon(res);
    }
//aw
    static async redeemBuildingRewardByCode(data) {
        var res = await SGHelperAPICall.callAPISync('RedeemBuildingRewardByCode', data)
        return SGHelperErrorHandling.executeRespon(res);
    }

    static async SurpriseRewardsOpenTenantQRQuiz(target,item) {
        var token = SGHelperGlobalVar.getVar("token");
        var data ={fTargetKey:target,fItemKey:item}
        var res = await SGHelperAPICall.callAPISync('SurpriseRewardsOpenTenantQRQuiz', data)
        try {
            return SGHelperErrorHandling.executeRespon(res);
        } catch (error) {
            return null
        }
    }

    static async SurpriseRewardsOpenBuildingQRQuiz(target,item) {
        var token = SGHelperGlobalVar.getVar("token");
        var data ={fTargetKey:target,fItemKey:item}
        console.log(token);
        console.log(data);
        console.log(JSON.stringify(data))
        var res = await SGHelperAPICall.callAPISync('SurpriseRewardsOpenBuildingQRQuiz', data)
        try {
            return SGHelperErrorHandling.executeRespon(res);
        } catch (error) {
            return null
        }
    }

    static async SurpriseRewardsOpenQRProduct(target,item) {
        var token = SGHelperGlobalVar.getVar("token");
        var data ={fTargetKey:target,fItemKey:item}
        var res = await SGHelperAPICall.callAPISync('SurpriseRewardsOpenQRProduct', data)
        try {
            return SGHelperErrorHandling.executeRespon(res);
        } catch (error) {
            return null
        }
    }

}