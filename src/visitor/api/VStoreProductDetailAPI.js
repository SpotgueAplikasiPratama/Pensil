/**
 * Version 1.2.0
 * 1. Yohanes 26 March 2021
 * - add ErrorHandling
 */
 import { SGHelperAPICall } from '../../core/helper/SGHelperAPICall'
import { SGHelperDB, SGHelperType ,SGHelperErrorHandling} from '../../core/helper'
import { SGHelperGlobalVar } from '../../core/helper';
import { SGBaseScreen } from '../../core/screen/SGBaseScreen';

export class VStoreProductDetailAPI extends SGBaseScreen {

    static async getStoreProductDetail(contentKey, storeKey) {
        var jsonInput = { itemID: contentKey, storeID: storeKey }
        console.log(JSON.stringify(jsonInput));
        console.log(SGHelperGlobalVar.getVar('token'))
        console.log(jsonInput);
        var res = await SGHelperAPICall.callAPISync('GetDetailItemStoreProduct', jsonInput)
        console.log(res);
        try {
            return SGHelperErrorHandling.executeRespon(res);
        } catch (error) {
            return null
        }

    }
}