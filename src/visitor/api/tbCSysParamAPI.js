/**
 * Version 1.2.0
 * 1. Yohanes 26 March 2021
 * - add ErrorHandling
 */
 import { SGHelperGlobalVar,SGHelperErrorHandling } from '../../core/helper';
import { SGHelperAPICall } from '../../core/helper/SGHelperAPICall'
import { SGBaseScreen } from '../../core/screen/SGBaseScreen';


export class tbCSysParamAPI extends SGBaseScreen {

    static async searchSysParam(arrFilter, arrSort) {
        var filtersort = SGHelperAPICall.convertFilterSort(arrFilter, arrSort);
        var res = await SGHelperAPICall.callAPISync('SearchSystemParams', {
            filter: filtersort.filter,
            sort: filtersort.sort
        })
        console.log('SearchSysParam')
        // console.log(res)
        return SGHelperErrorHandling.executeRespon(res);
    }

}
 