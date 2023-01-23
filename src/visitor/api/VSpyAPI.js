import { SGHelperAPICall } from '../../core/helper/SGHelperAPICall'
import { SGHelperDB, SGHelperType,SGHelperErrorHandling } from '../../core/helper'
import { SGHelperGlobalVar } from '../../core/helper';
import { SGBaseScreen } from '../../core/screen/SGBaseScreen';

export class VSpyAPI extends SGBaseScreen {

    static async SpyAPI(placeKey) {

        var token = SGHelperGlobalVar.getVar('token');
        var res = await SGHelperAPICall.callAPISync('GetLastModifiedBuildingHome',placeKey)
        return SGHelperErrorHandling.executeRespon(res);
    }

    static async SpyMainHome() {
        var token = SGHelperGlobalVar.getVar('token');
        var res = await SGHelperAPICall.callAPISync('GetLastModifiedMainHome')
        // console.log(res);
        return SGHelperErrorHandling.executeRespon(res);
    }

}