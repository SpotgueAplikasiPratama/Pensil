/**
 * Version 1.2.0
 * 1. Yohanes 26 March 2021
 * - add ErrorHandling
 */
 import { SGHelperAPICall } from '../../core/helper/SGHelperAPICall'
import { SGHelperDB, SGHelperType ,SGHelperErrorHandling} from '../../core/helper'
import { SGHelperGlobalVar } from '../../core/helper';
import { SGBaseScreen } from '../../core/screen/SGBaseScreen';

export class VFacilityDetailAPI extends SGBaseScreen {

    static async getFacilityDetail(contentKey) {
        var res = await SGHelperAPICall.callAPISync('GetDetailItemBuildingFacility', contentKey)
        return SGHelperErrorHandling.executeRespon(res)
    }
}