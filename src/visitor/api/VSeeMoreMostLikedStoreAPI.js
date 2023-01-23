/**
 * Version 1.2.0
 * 1. Yohanes 26 March 2021
 * - add ErrorHandling
 */
 import { SGHelperAPICall } from '../../core/helper/SGHelperAPICall'
import { SGHelperDB, SGHelperType ,SGHelperErrorHandling} from '../../core/helper'
import { SGHelperGlobalVar } from '../../core/helper';
import { SGBaseScreen } from '../../core/screen/SGBaseScreen';

export class VSeeMoreMostLikedStoreAPI extends SGBaseScreen {

    static async getMostLikedStoreList(contentKey, arrFilter, arrSort,pagingParam) {
        console.log(arrSort)
        var buildingFilter = { name: 'buildingKey', operator: '=', value: contentKey };
        arrFilter.push(buildingFilter);
        var filtersort = SGHelperAPICall.convertFilterSort(arrFilter, arrSort);

        console.log(JSON.stringify({
            filter: filtersort.filter,
            sort: filtersort.sort,
            paging:pagingParam
        }))
        var res = await SGHelperAPICall.callAPISync('SearchBuildingHighlightSeeMoreMostLikedStore', {
            filter: filtersort.filter,
            sort: filtersort.sort,
            paging:pagingParam
        })
        console.log(res);
        return SGHelperErrorHandling.executeRespon(res);
    }
}