/**
 * Version 1.2.0
 * 1. Yohanes 26 March 2021
 * - add ErrorHandling
 */
 import { SGHelperAPICall } from '../../core/helper/SGHelperAPICall'
import { SGHelperDB, SGHelperType ,SGHelperErrorHandling} from '../../core/helper'
import { SGHelperGlobalVar } from '../../core/helper';
import { SGBaseScreen } from '../../core/screen/SGBaseScreen';

export class VProfileAPI extends SGBaseScreen {

    static async getUserPlaceCheckInHistory() {
        var res = await SGHelperAPICall.callAPISync('SearchUserCheckInBuildingHistory')
        return SGHelperErrorHandling.executeRespon(res)
    }

    static async getUserStoreCheckInHistory() {
        var res = await SGHelperAPICall.callAPISync('SearchUserCheckInStoreHistory')
        return SGHelperErrorHandling.executeRespon(res)
    }

    static async getUserRestoCheckInHistory() {
        var res = await SGHelperAPICall.callAPISync('SearchUserCheckInRestoHistory')
        return SGHelperErrorHandling.executeRespon(res)
    }

    static async getPlaceContentLikeHistoryData(arrFilter, arrSort,pagingParam) {

        var filtersort = SGHelperAPICall.convertFilterSort(arrFilter, arrSort);
    

        var res = await SGHelperAPICall.callAPISync('SearchUserLikeBuildingHistory',
        {
            filter: filtersort.filter,
            sort: filtersort.sort,
            paging: pagingParam
        })
        return SGHelperErrorHandling.executeRespon(res)
    }

    static async getStoreContentLikeHistoryData(arrFilter, arrSort,pagingParam) {
        var token = SGHelperGlobalVar.getVar("token");
        var filtersort = SGHelperAPICall.convertFilterSort(arrFilter, arrSort);
        var res = await SGHelperAPICall.callAPISync('SearchUserLikeStoreHistory',
        {
            filter: filtersort.filter,
            sort: filtersort.sort,
            paging: pagingParam
        })
        return SGHelperErrorHandling.executeRespon(res)
    }

    static async getRestoContentLikeHistoryData(arrFilter, arrSort,pagingParam) {
        var token = SGHelperGlobalVar.getVar("token");
        var filtersort = SGHelperAPICall.convertFilterSort(arrFilter, arrSort);

        
        var res = await SGHelperAPICall.callAPISync('SearchUserLikeRestoHistory',
        {
            filter: filtersort.filter,
            sort: filtersort.sort,
            paging: pagingParam
        })

        return SGHelperErrorHandling.executeRespon(res)
    }
}