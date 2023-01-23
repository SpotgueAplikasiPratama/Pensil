/**
 * Version 1.2.0
 * 1. Yohanes 26 March 2021
 * - add ErrorHandling
 */
 import { SGHelperAPICall } from '../../core/helper/SGHelperAPICall'
import { SGHelperDB, SGHelperErrorHandling, SGHelperType } from '../../core/helper'
import { SGHelperGlobalVar } from '../../core/helper';
import { SGBaseScreen } from '../../core/screen/SGBaseScreen';

export class VRestoMenuDetailAPI extends SGBaseScreen {

    static async getRestoProductDetail(contentKey, restoKey) {
        var jsonInput = { itemID: contentKey, storeID: restoKey }
        // console.log(SGHelperGlobalVar.getVar('token'))
        // console.log(JSON.stringify(jsonInput))
        var res = await SGHelperAPICall.callAPISync('GetDetailItemRestoProduct', jsonInput)
        // console.log(res)
        try {
            var result = SGHelperErrorHandling.executeRespon(res)
            return result
        } catch (error) {
            return null
        }
    }
}