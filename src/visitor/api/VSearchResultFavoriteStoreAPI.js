/**
 * Version 1.2.0
 * 1. Yohanes 26 March 2021
 * - add ErrorHandling
 */
 import { SGHelperAPICall } from '../../core/helper/SGHelperAPICall'
import { SGHelperDB, SGHelperType,SGHelperErrorHandling } from '../../core/helper'
import { SGHelperGlobalVar } from '../../core/helper';
import { SGBaseScreen } from '../../core/screen/SGBaseScreen';

export class VSearchResultFavoriteStoreAPI extends SGBaseScreen {

    static async getAllSearchResultFavoriteStore(language, keyword, filterData, sortData,pagingParam) {
        var searchFilter = { name: language.toUpperCase(), operator: 'SEARCH', value: keyword };
        filterData.unshift(searchFilter);
        var favoriteFilter = { name: 'fUserFavoriteThis', operator: '=', value: 'Y' };
        filterData.push(favoriteFilter);
        var arrFilter = filterData;
        var arrSort = sortData;
        var filtersort = SGHelperAPICall.convertFilterSort(arrFilter, arrSort);
        var token = SGHelperGlobalVar.getVar("token");
        console.log('getAllSearchResultFavoriteStore')
        console.log('token')
        console.log(JSON.stringify({
            filter: filtersort.filter,
            sort: filtersort.sort,
            paging:pagingParam
        }))
       
        var res = await SGHelperAPICall.callAPISync('SearchAllStore', {
            filter: filtersort.filter,
            sort: filtersort.sort,
            paging:pagingParam
        })
        return SGHelperErrorHandling.executeRespon(res);
    }
}