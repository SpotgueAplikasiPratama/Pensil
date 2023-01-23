/**
 * Version 1.2.0
 * 1. Yohanes 26 March 2021
 * - add ErrorHandling
 */
 import { SGHelperAPICall } from '../../core/helper/SGHelperAPICall'
import { SGHelperDB, SGHelperType,SGHelperErrorHandling } from '../../core/helper'
import { SGHelperGlobalVar } from '../../core/helper';
import { SGBaseScreen } from '../../core/screen/SGBaseScreen';

export class tbCLookUpAPI extends SGBaseScreen {

    static async getAllLookUpData() {
        var jsonInput = { filter: [], sort: [] };
        var res = await SGHelperAPICall.callAPISync('SearchLookUp', jsonInput)

        return SGHelperErrorHandling.executeRespon(res)
    }

}