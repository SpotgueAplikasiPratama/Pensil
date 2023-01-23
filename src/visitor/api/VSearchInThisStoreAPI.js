/**
 * Version 1.2.0
 * 1. Yohanes 26 March 2021
 * - add ErrorHandling
 */
 import { SGHelperAPICall } from '../../core/helper/SGHelperAPICall'
import { SGHelperDB, SGHelperType,SGHelperErrorHandling } from '../../core/helper'
import { SGHelperGlobalVar } from '../../core/helper';
import { SGBaseScreen } from '../../core/screen/SGBaseScreen';

export class VSearchInThisStoreAPI extends SGBaseScreen {

    static async getSearchAllStorePromoInStoreSlider(language, keyword, storeKey, arrSort) {
        var arrFilter = [
            { name: language.toUpperCase(), operator: 'SEARCH', value: keyword },
            { name: 'storeKey', operator: '=', value: storeKey },
            { name: 'fRegistered', operator: '=', value: 'Y' }
        ]
        arrSort=[];
        var filtersort = SGHelperAPICall.convertFilterSort(arrFilter, arrSort);
        var res = await SGHelperAPICall.callAPISync('SearchAllStorePromoSlider', {
            filter: filtersort.filter,
            sort: filtersort.sort
        })
        return SGHelperErrorHandling.executeRespon(res);
    }

    static async getSearchAllStoreProductInStoreSlider(language, keyword, storeKey, arrSort) {
        var arrFilter = [
            { name: language.toUpperCase(), operator: 'SEARCH', value: keyword },
            { name: 'storeKey', operator: '=', value: storeKey }
        ]
        arrSort=[];
        var filtersort = SGHelperAPICall.convertFilterSort(arrFilter, arrSort);
        var res = await SGHelperAPICall.callAPISync('SearchAllStoreProductSlider', {
            filter: filtersort.filter,
            sort: filtersort.sort
        })

        console.log(res);
        return SGHelperErrorHandling.executeRespon(res);
    }

    static async getSearchInStoreStorePromo(language, keyword, filterData, sortData, storeKey,pagingParam) {
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
        var res = await SGHelperAPICall.callAPISync('SearchAllStorePromo', {
            filter: filtersort.filter,
            sort: filtersort.sort,
            paging:pagingParam
        })
        return SGHelperErrorHandling.executeRespon(res);
    }

    static async getSearchInStoreStoreProduct(language, keyword, filterData, sortData, storeKey,pagingParam) {
        var searchFilter = { name: language.toUpperCase(), operator: 'SEARCH', value: keyword };
        filterData.unshift(searchFilter);
        var InStoreFilter = { name: "storeKey", operator: '=', value: storeKey };
        filterData.push(InStoreFilter);
        var arrFilter = filterData;
        var arrSort = sortData;
        // console.log(arrFilter);
        // console.log(arrSort);
        var filtersort = SGHelperAPICall.convertFilterSort(arrFilter, arrSort);
        var token = SGHelperGlobalVar.getVar("token");
        // console.log(JSON.stringify({
        //     filter: filtersort.filter,
        //     sort: filtersort.sort
        // }));
        // console.log(token);

        var res = await SGHelperAPICall.callAPISync('SearchAllStoreProduct', {
            filter: filtersort.filter,
            sort: filtersort.sort,
            paging:pagingParam
        })
        return SGHelperErrorHandling.executeRespon(res);
    }

}