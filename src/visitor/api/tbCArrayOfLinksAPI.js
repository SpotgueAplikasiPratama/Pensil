/**
 * Version 1.2.0
 * 1. Yohanes 26 March 2021
 * - add ErrorHandling
 */

import { SGHelperAPICall } from '../../core/helper/SGHelperAPICall'
import { SGHelperDB, SGHelperType,SGHelperErrorHandling } from '../../core/helper'
import { SGHelperGlobalVar } from '../../core/helper';
import { SGBaseScreen } from '../../core/screen/SGBaseScreen';

export class tbCArrayOfLinksAPI extends SGBaseScreen {

    static async pickerArrayOfLinks(language) {
        var token = SGHelperGlobalVar.getVar('token');
        // console.log(token)
        var res = await SGHelperAPICall.callAPISync('SearchPickerArrayOfLinks', language)
        // console.log(res);
        return SGHelperErrorHandling.executeRespon(res)
    }


}