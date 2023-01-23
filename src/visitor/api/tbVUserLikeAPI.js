/**
 * Version 1.2.0
 * 1. Yohanes 26 March 2021
 * - add ErrorHandling
 */
 import { SGHelperAPICall } from '../../core/helper/SGHelperAPICall'
import { SGHelperDB, SGHelperType,SGHelperErrorHandling } from '../../core/helper'
import { SGHelperGlobalVar } from '../../core/helper';
import { SGBaseScreen } from '../../core/screen/SGBaseScreen';

export class tbVUserLikeAPI extends SGBaseScreen {

    static async addUserLike(data) {
        var res = await SGHelperAPICall.callAPISync('ChangeUserLikeOn', data)
        console.log(res);
        return SGHelperErrorHandling.executeRespon(res)
    }
    
    static async addUserUnlike(data) {
        var token = SGHelperGlobalVar.getVar("token");
        data.fID = null;
        console.log(token);
        console.log(JSON.stringify(data));
        var res = await SGHelperAPICall.callAPISync('ChangeUserLikeOff', data)
        return SGHelperErrorHandling.executeRespon(res)
    }
}