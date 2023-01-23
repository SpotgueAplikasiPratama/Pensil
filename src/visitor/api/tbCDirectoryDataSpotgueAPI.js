/**
 * Version 1.2.0
 * 1. Yohanes 26 March 2021
 * - add ErrorHandling
 */
 import { SGHelperAPICall } from '../../core/helper/SGHelperAPICall'
import { SGHelperDB, SGHelperType,SGHelperErrorHandling } from '../../core/helper'
import { SGHelperGlobalVar } from '../../core/helper';
import { SGBaseScreen } from '../../core/screen/SGBaseScreen';

export class tbCDirectoryDataSpotgueAPI extends SGBaseScreen {


    static async searchDirectoryDataSpotgueCard(arrFilter, arrSort) {
        var filtersort = SGHelperAPICall.convertFilterSort(arrFilter, arrSort);
        var res = await SGHelperAPICall.callAPISync('SearchDirectoryDataSpotgue', { filter: filtersort.filter, sort: filtersort.sort })
        return SGHelperErrorHandling.executeRespon(res);
    }
    static async getDirectoryDataSpotgueByID(fID) {
        console.log(SGHelperGlobalVar.getVar('token'))
        console.log(JSON.stringify(fID))
        var res = await SGHelperAPICall.callAPISync('GetDirectoryDataSpotgueByID', fID)
        console.log(res);
        return SGHelperErrorHandling.executeRespon(res);
    }

}