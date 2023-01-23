/**
 * Version 1.2.0
 * 1. Yohanes 26 March 2021
 * - add ErrorHandling
 */
 import { SGHelperAPICall } from '../../core/helper/SGHelperAPICall'
import { SGHelperDB, SGHelperType ,SGHelperErrorHandling} from '../../core/helper'
import { SGHelperGlobalVar } from '../../core/helper';
import { SGBaseScreen } from '../../core/screen/SGBaseScreen';

export class VSearchResultAuctionAPI extends SGBaseScreen {

    static async getAllSearchResultAuction(language, keyword, filterData, sortData,pagingParam) {
        var searchFilter = { name: language.toUpperCase(), operator: 'SEARCH', value: keyword };
        filterData.unshift(searchFilter);
        var arrFilter = filterData;
        var arrSort = sortData;
        var filtersort = SGHelperAPICall.convertFilterSort(arrFilter, arrSort);
        var token = SGHelperGlobalVar.getVar("token");
        console.log(JSON.stringify({
            filter: filtersort.filter,
            sort: filtersort.sort,
            paging:pagingParam
        }))
        var res = await SGHelperAPICall.callAPISync('SearchAllAuction', {
            filter: filtersort.filter,
            sort: filtersort.sort,
            paging:pagingParam
        })
        return SGHelperErrorHandling.executeRespon(res);
    }

    static async SearchStoreAuctionListWithKeyword(language, keyword, filterData, sortData, storeKey,pagingParam) {
        var searchFilter = { name: language.toUpperCase(), operator: 'SEARCH', value: keyword };
        filterData.unshift(searchFilter);
       
        var InStoreFilter = { name: "storeKey", operator: '=', value: storeKey };
        filterData.push(InStoreFilter);
        var arrFilter = filterData;
        var arrSort = sortData;
        var filtersort = SGHelperAPICall.convertFilterSort(arrFilter, arrSort);
        var token = SGHelperGlobalVar.getVar("token");
        console.log(storeKey);
        console.log(JSON.stringify({
            filter: filtersort.filter,
            sort: filtersort.sort
        }))
        var res = await SGHelperAPICall.callAPISync('SearchStoreAuctionListWithKeyword', {
            filter: filtersort.filter,
            sort: filtersort.sort,
            paging:pagingParam
        })
        return SGHelperErrorHandling.executeRespon(res);
    }

    static async SearchRestoAuctionListWithKeyword(language, keyword, filterData, sortData, restoKey,pagingParam) {
        var searchFilter = { name: language.toUpperCase(), operator: 'SEARCH', value: keyword };
        filterData.unshift(searchFilter);
        var InRestoFilter = { name: "storeKey", operator: '=', value: restoKey };
        filterData.push(InRestoFilter);
        var arrFilter = filterData;
        var arrSort = sortData;
        var filtersort = SGHelperAPICall.convertFilterSort(arrFilter, arrSort);
        var token = SGHelperGlobalVar.getVar("token");
        var res = await SGHelperAPICall.callAPISync('SearchRestoAuctionListWithKeyword', {
            filter: filtersort.filter,
            sort: filtersort.sort,
            paging:pagingParam
        })
        return SGHelperErrorHandling.executeRespon(res);
    }
}