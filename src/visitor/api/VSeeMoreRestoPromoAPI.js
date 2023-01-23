/**
 * Version 1.2.0
 * 1. Yohanes 26 March 2021
 * - add ErrorHandling
 */
 import { SGHelperAPICall } from '../../core/helper/SGHelperAPICall'
import { SGHelperDB, SGHelperType ,SGHelperErrorHandling} from '../../core/helper'
import { SGHelperGlobalVar } from '../../core/helper';
import { SGBaseScreen } from '../../core/screen/SGBaseScreen';

export class VSeeMoreRestoPromoAPI extends SGBaseScreen {

    static async getRestoPromoList(contentKey,arrFilter,arrSort,pagingParam) {
        var restoFilter = { name: 'restoKey', operator: '=', value: contentKey };
        arrFilter.push(restoFilter);
        var filtersort = SGHelperAPICall.convertFilterSort(arrFilter, arrSort);
        console.log(JSON.stringify({
            filter: filtersort.filter,
            sort: filtersort.sort
        }));
        var res = await SGHelperAPICall.callAPISync('SearchRestoHighlightSeeMorePromo', {
            filter: filtersort.filter,
            sort: filtersort.sort,
            paging:pagingParam
        })
        return SGHelperErrorHandling.executeRespon(res);
    }
}