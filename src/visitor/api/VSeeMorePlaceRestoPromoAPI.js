/**
 * Version 1.2.0
 * 1. Yohanes 26 March 2021
 * - add ErrorHandling
 */
 import { SGHelperAPICall } from '../../core/helper/SGHelperAPICall'
import { SGHelperDB, SGHelperType ,SGHelperErrorHandling} from '../../core/helper'
import { SGHelperGlobalVar } from '../../core/helper';
import { SGBaseScreen } from '../../core/screen/SGBaseScreen';

export class VSeeMorePlaceRestoPromoAPI extends SGBaseScreen {

    static async getPlaceRestoPromoList(contentKey, arrFilter, arrSort,pagingParam) {
        var buildingFilter = { name: 'buildingKey', operator: '=', value: contentKey };
        arrFilter.push(buildingFilter);
        var filtersort = SGHelperAPICall.convertFilterSort(arrFilter, arrSort);
        console.log(JSON.stringify({
            filter: filtersort.filter,
            sort: filtersort.sort
        }));
        var token = SGHelperGlobalVar.getVar("token");
        console.log(token);
        var res = await SGHelperAPICall.callAPISync('SearchBuildingHighlightSeeMoreRestoPromo', {
            filter: filtersort.filter,
            sort: filtersort.sort,
            paging:pagingParam
        })
        return SGHelperErrorHandling.executeRespon(res);
    }
}