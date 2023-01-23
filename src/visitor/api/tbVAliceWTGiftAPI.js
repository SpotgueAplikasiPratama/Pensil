/**
 * Version 1.2.0
 * 1. Yohanes 26 March 2021
 * - add ErrorHandling
 */
 import { SGHelperAPICall } from '../../core/helper/SGHelperAPICall'
import { SGHelperDB, SGHelperType,SGHelperErrorHandling } from '../../core/helper'
import { SGHelperGlobalVar } from '../../core/helper';
import { SGBaseScreen } from '../../core/screen/SGBaseScreen';

export class tbVAliceWTGiftAPI extends SGBaseScreen {

    static async searchWTGiftWithArrFilter(arrFilter, arrSort) {
        var token = SGHelperGlobalVar.getVar("token");
        var filtersort = SGHelperAPICall.convertFilterSort(arrFilter, arrSort);

        var res = await SGHelperAPICall.callAPISync('SearchWTGift', {
            filter: filtersort.filter,
            sort: filtersort.sort
        })
        return SGHelperErrorHandling.executeRespon(res)
    }
}