/**
 * Version 1.2.0
 * 1. Yohanes 26 March 2021
 * - add ErrorHandling
 */
 import { SGHelperAPICall } from '../../core/helper/SGHelperAPICall'
import { SGHelperDB, SGHelperType ,SGHelperErrorHandling} from '../../core/helper'
import { SGHelperGlobalVar } from '../../core/helper';
import { SGBaseScreen } from '../../core/screen/SGBaseScreen';

export class VGroupAPI extends SGBaseScreen {

    static async getGroupTenantOfStore() {
        var arrFilter = [{ name: 'fType', operator: '=', value: 'store'}];
        var arrSort = [];
        var filtersort = SGHelperAPICall.convertFilterSort(arrFilter, arrSort);
        var res = await SGHelperAPICall.callAPISync('SearchGroupOfTenant', {
            filter: filtersort.filter,
            sort: filtersort.sort
        })

        return SGHelperErrorHandling.executeRespon(res)
    }

    static async getGroupTenantOfResto() {
        var arrFilter = [{ name: 'fType', operator: '=', value: 'resto'}];
        var arrSort = [];
        var filtersort = SGHelperAPICall.convertFilterSort(arrFilter, arrSort);
        var token = SGHelperGlobalVar.getVar("token");
        var res = await SGHelperAPICall.callAPISync('SearchGroupOfTenant', {
            filter: filtersort.filter,
            sort: filtersort.sort
        })

        return SGHelperErrorHandling.executeRespon(res)
    }

    static async getSearchInGroupStore(language, keyword, filterData, sortData, groupKey,pagingParam) {
        if (keyword !== '') {
            var searchFilter = { name: language.toUpperCase(), operator: 'SEARCH', value: keyword };
            filterData.unshift(searchFilter);
        }
        var inGroupFilter = { name: "fGroupTenantKey", operator: '=', value: groupKey };
        filterData.push(inGroupFilter);
        var arrFilter = filterData;
        var arrSort = sortData;
        var filtersort = SGHelperAPICall.convertFilterSort(arrFilter, arrSort);

        console.log(SGHelperGlobalVar.getVar('token'))
        console.log(JSON.stringify({
            filter: filtersort.filter,
            sort: filtersort.sort,
            paging:pagingParam
        }))

        var res = await SGHelperAPICall.callAPISync('SearchGroupOfTenantxStore', {
            filter: filtersort.filter,
            sort: filtersort.sort,
            paging:pagingParam
        })
        return SGHelperErrorHandling.executeRespon(res)
    }

    static async getSearchInGroupStoreWithSearch(language, keyword, filterData, sortData, groupKey,pagingParam) {
        if (keyword !== '') {
            var searchFilter = { name: language.toUpperCase(), operator: 'SEARCH', value: keyword };
            filterData.unshift(searchFilter);
        }
        var inGroupFilter = { name: "fGroupTenantKey", operator: '=', value: groupKey };
        filterData.push(inGroupFilter);
        var arrFilter = filterData;
        var arrSort = sortData;
        var filtersort = SGHelperAPICall.convertFilterSort(arrFilter, arrSort);
        var res = await SGHelperAPICall.callAPISync('SearchGroupOfTenantxStoreWithKeyword', {
            filter: filtersort.filter,
            sort: filtersort.sort,
            paging:pagingParam
        })
        return SGHelperErrorHandling.executeRespon(res)
    }


}