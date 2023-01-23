/**
 * Version 1.2.0
 * 1. Yohanes 26 March 2021
 * - add ErrorHandling
 */
 import { SGHelperAPICall } from '../../core/helper/SGHelperAPICall'
import { SGHelperDB, SGHelperType,SGHelperErrorHandling } from '../../core/helper'
import { SGHelperGlobalVar } from '../../core/helper';
import { SGBaseScreen } from '../../core/screen/SGBaseScreen';

export class VSearchResultFavoritePlaceEventAPI extends SGBaseScreen {

    static async getAllSearchResultFavoritePlaceEvent(language, keyword, filterData, sortData,pagingParam) {
        var isSearchExist = false;
        for(var i=0;i<filterData.length;i++){
            if(filterData[i].operator==="SEARCH"){
                isSearchExist=true
                break;
            }
            
        }
        // var searchFilter = { name: language.toUpperCase(), operator: 'SEARCH', value: keyword };
        if(!isSearchExist) filterData.unshift({ name: language.toUpperCase(), operator: 'SEARCH', value: keyword });
        var arrFilter = filterData;
        var arrSort = sortData;
        var filtersort = SGHelperAPICall.convertFilterSort(arrFilter, arrSort);
        var token = SGHelperGlobalVar.getVar("token");
        console.log(token);
        console.log(JSON.stringify({
            filter: filtersort.filter,
            sort: filtersort.sort
        }))
        var res = await SGHelperAPICall.callAPISync('SearchUserFavPlaceEventListWithKeyword', {
            filter: filtersort.filter,
            sort: filtersort.sort,
            paging:pagingParam
        })
        return SGHelperErrorHandling.executeRespon(res);
    }
}