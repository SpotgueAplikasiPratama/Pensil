/**
 * Version 1.2.0
 * 1. Yohanes 26 March 2021
 * - add ErrorHandling
 */
 import { SGHelperAPICall } from '../../core/helper/SGHelperAPICall'
import { SGHelperDB, SGHelperType ,SGHelperErrorHandling} from '../../core/helper'
import { SGHelperGlobalVar } from '../../core/helper';
import { SGBaseScreen } from '../../core/screen/SGBaseScreen';

export class VPlaceEventDetailAPI extends SGBaseScreen {

    static async getPlaceEventDetail(contentKey) {
        var res = await SGHelperAPICall.callAPISync('GetDetailItemBuildingEvent', contentKey)
        try {
            var result = SGHelperErrorHandling.executeRespon(res)
            return result
        } catch (error) {
            return null
        }
        // SGHelperErrorHandling.executeRespon(res)
        // console.log(res.respInfo.status)
        // if (res.respInfo.status != 404) {
        //     var result = JSON.parse(res.data);
        // }
        // else {
        //     var result = null;
        // }
        // return result;
    }
}