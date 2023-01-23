/**
 * Version 1.2.0
 * 1. Yohanes 26 March 2021
 * - add ErrorHandling
 */
 import { SGHelperAPICall } from '../../core/helper/SGHelperAPICall'
import { SGHelperDB, SGHelperType ,SGHelperErrorHandling} from '../../core/helper'
import { SGHelperGlobalVar } from '../../core/helper';
import { SGBaseScreen } from '../../core/screen/SGBaseScreen';

export class VMallProfileAPI extends SGBaseScreen {

    static async getBuildingHomeProfile(contentKey) {
        console.log(contentKey);
        var res = await SGHelperAPICall.callAPISync('GetBuildingHomeProfile', contentKey)
        return SGHelperErrorHandling.executeRespon(res)
    }

    static async getBuildingListContent(language) {
        var res = await SGHelperAPICall.callAPISync('GetBuildingListContent',language)
        return SGHelperErrorHandling.executeRespon(res)
    }

    static async getBrandListContent(language) {
        var res = await SGHelperAPICall.callAPISync('GetBrandListContent',language)
        return SGHelperErrorHandling.executeRespon(res)
    }

}