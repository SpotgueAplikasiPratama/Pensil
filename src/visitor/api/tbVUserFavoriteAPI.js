/**
 * Version 1.2.0
 * 1. Yohanes 26 March 2021
 * - add ErrorHandling
 */
 import { SGHelperAPICall } from '../../core/helper/SGHelperAPICall'
import { SGHelperDB, SGHelperType ,SGHelperErrorHandling} from '../../core/helper'
import { SGHelperGlobalVar } from '../../core/helper';
import { SGBaseScreen } from '../../core/screen/SGBaseScreen';

export class tbVUserFavoriteAPI extends SGBaseScreen {

    static async addUserFavorite(data) {
        var res = await SGHelperAPICall.callAPISync('ChangeUserFavoriteOn', data)
        return SGHelperErrorHandling.executeRespon(res)
    }

    static async addUserUnfavorite(data) {
        var token = SGHelperGlobalVar.getVar("token");
        data.fID = null;
        // console.log(token);
        // console.log(JSON.stringify(data));
        var res = await SGHelperAPICall.callAPISync('ChangeUserFavoriteOff', data)
        return SGHelperErrorHandling.executeRespon(res)
    }

    static async searchUserFavoriteWithArrFilter(arrFilter, arrSort) {
        var filtersort = SGHelperAPICall.convertFilterSort(arrFilter, arrSort);
        var res = await SGHelperAPICall.callAPISync('Search', {
            filter: filtersort.filter,
            sort: filtersort.sort
        })
        return SGHelperErrorHandling.executeRespon(res)
    }

    static async changeUserFavoriteActive(arrFilter, arrSort) {
        var filtersort = SGHelperAPICall.convertFilterSort(arrFilter, arrSort);
        var res = await SGHelperAPICall.callAPISync('changeUserFavoriteActive', {
            filter: filtersort.filter,
            sort: filtersort.sort
        })
        return SGHelperErrorHandling.executeRespon(res)
    }

    static async changeUserFavoriteInactive(arrFilter, arrSort) {
        var filtersort = SGHelperAPICall.convertFilterSort(arrFilter, arrSort);
        var res = await SGHelperAPICall.callAPISync('changeUserFavoriteInactive', {
            filter: filtersort.filter,
            sort: filtersort.sort
        })
        return SGHelperErrorHandling.executeRespon(res)
    }

    static async getUserFavPlaceEventSlider() { 
        var res = await SGHelperAPICall.callAPISync('SearchUserFavPlaceEventSlider')
        return SGHelperErrorHandling.executeRespon(res)
    }

    static async getUserFavPlaceSlider() {
        var res = await SGHelperAPICall.callAPISync('SearchUserFavPlaceSlider')
        console.log('get user fav place slider')
        console.log(res);
        return SGHelperErrorHandling.executeRespon(res)
    }

    static async getUserFavStorePromoSlider() {
        var res = await SGHelperAPICall.callAPISync('SearchUserFavStorePromoSlider')
        return SGHelperErrorHandling.executeRespon(res)
    }

    static async getUserFavStoreSlider() {
        var res = await SGHelperAPICall.callAPISync('SearchUserFavStoreSlider')
        return SGHelperErrorHandling.executeRespon(res)
    }

    static async getUserFavRestoPromoSlider() {
        var res = await SGHelperAPICall.callAPISync('SearchUserFavRestoPromoSlider')
        return SGHelperErrorHandling.executeRespon(res)
    }

    static async getUserFavRestoSlider() {
        var res = await SGHelperAPICall.callAPISync('SearchUserFavRestoSlider')
        return SGHelperErrorHandling.executeRespon(res)
    }

    static async getUserUnfavPlaceList(language, keyword, filterData, sortData,pagingParam) {
        var arrFilter = filterData;
        var arrSort = sortData;
        var filtersort = SGHelperAPICall.convertFilterSort(arrFilter, arrSort);
        var token = SGHelperGlobalVar.getVar("token");

        var res = await SGHelperAPICall.callAPISync('SearchUserUnfavPlaceList',
        {
            filter: filtersort.filter,
            sort: filtersort.sort,
            paging: pagingParam
        })
        return SGHelperErrorHandling.executeRespon(res)
    }

    static async getUserUnfavPlaceListWithSearch(language, keyword, filterData, sortData,pagingParam) {
        var searchFilter = { name: language.toUpperCase(), operator: 'SEARCH', value: keyword };
        filterData.unshift(searchFilter);
        var arrFilter = filterData;
        var arrSort = sortData;
        var filtersort = SGHelperAPICall.convertFilterSort(arrFilter, arrSort);
        var res = await SGHelperAPICall.callAPISync('SearchUserUnfavPlaceListWithKeyword',
        {
            filter: filtersort.filter,
            sort: filtersort.sort,
            paging: pagingParam
        })
        return SGHelperErrorHandling.executeRespon(res)
    }

    static async getUserUnfavStoreList(language, keyword, filterData, sortData,pagingParam) {
        if (keyword !== '') {
            var searchFilter = { name: language.toUpperCase(), operator: 'SEARCH', value: keyword };
            filterData.unshift(searchFilter);
        }
        var arrFilter = filterData;
        var arrSort = sortData;
        var filtersort = SGHelperAPICall.convertFilterSort(arrFilter, arrSort);
        var res = await SGHelperAPICall.callAPISync('SearchUserUnfavStoreList',
        {
            filter: filtersort.filter,
            sort: filtersort.sort,
            paging: pagingParam
        })
        return SGHelperErrorHandling.executeRespon(res)
    }

    static async getUserUnfavStoreListWithSearch(language, keyword, filterData, sortData,pagingParam) {
        var searchFilter = { name: language.toUpperCase(), operator: 'SEARCH', value: keyword };
        filterData.unshift(searchFilter);
        var arrFilter = filterData;
        var arrSort = sortData;
        var filtersort = SGHelperAPICall.convertFilterSort(arrFilter, arrSort);
 
        var res = await SGHelperAPICall.callAPISync('SearchUserUnfavStoreListWithKeyword',
        {
            filter: filtersort.filter,
            sort: filtersort.sort,
            paging: pagingParam
        })
        return SGHelperErrorHandling.executeRespon(res)
    }


    static async getUserUnfavRestoList(language, keyword, filterData, sortData,pagingParam) {
        if (keyword !== '') {
            var searchFilter = { name: language.toUpperCase(), operator: 'SEARCH', value: keyword };
            filterData.unshift(searchFilter);
        }
        var arrFilter = filterData;
        var arrSort = sortData;
        var filtersort = SGHelperAPICall.convertFilterSort(arrFilter, arrSort);
        var res = await SGHelperAPICall.callAPISync('SearchUserUnfavRestoList',
        {
            filter: filtersort.filter,
            sort: filtersort.sort,
            paging: pagingParam
        })
        return SGHelperErrorHandling.executeRespon(res)
    }

    static async getUserUnfavRestoListWithSearch(language, keyword, filterData, sortData,pagingParam) {
        var searchFilter = { name: language.toUpperCase(), operator: 'SEARCH', value: keyword };
        filterData.unshift(searchFilter);
        var arrFilter = filterData;
        var arrSort = sortData;
        var filtersort = SGHelperAPICall.convertFilterSort(arrFilter, arrSort);
        var res = await SGHelperAPICall.callAPISync('SearchUserUnfavRestoListWithKeyword',
        {
            filter: filtersort.filter,
            sort: filtersort.sort,
            paging: pagingParam
        })
        return SGHelperErrorHandling.executeRespon(res)
    }

    static async getUserFavPlaceEventList(arrFilter, arrSort,pagingParam) {
        var filtersort = SGHelperAPICall.convertFilterSort(arrFilter, arrSort);
        var res = await SGHelperAPICall.callAPISync('SearchUserFavPlaceEventList',
        {
            filter: filtersort.filter,
            sort: filtersort.sort,
            paging:pagingParam
        })
        return SGHelperErrorHandling.executeRespon(res)
    }

    static async getUserFavPlaceList(arrFilter, arrSort,pagingParam) {
        var filtersort = SGHelperAPICall.convertFilterSort(arrFilter, arrSort);
        var res = await SGHelperAPICall.callAPISync('SearchUserFavPlaceList',
        {
            filter: filtersort.filter,
            sort: filtersort.sort,
            paging: pagingParam
        })
        return SGHelperErrorHandling.executeRespon(res)
    }

    static async getUserFavStorePromoList(arrFilter, arrSort,pagingParam) {
        var filtersort = SGHelperAPICall.convertFilterSort(arrFilter, arrSort);
        var res = await SGHelperAPICall.callAPISync('SearchUserFavStorePromoList',
        {
            filter: filtersort.filter,
            sort: filtersort.sort,
            paging:pagingParam
        })
        return SGHelperErrorHandling.executeRespon(res)
    }

    static async getUserFavStoreList(arrFilter, arrSort,pagingParam) {
        var filtersort = SGHelperAPICall.convertFilterSort(arrFilter, arrSort);
        var res = await SGHelperAPICall.callAPISync('SearchUserFavStoreList',
        {
            filter: filtersort.filter,
            sort: filtersort.sort,
            paging: pagingParam
        })
        return SGHelperErrorHandling.executeRespon(res)
    }

    static async getUserFavRestoPromoList(arrFilter, arrSort,pagingParam) {
        var filtersort = SGHelperAPICall.convertFilterSort(arrFilter, arrSort);
        var res = await SGHelperAPICall.callAPISync('SearchUserFavRestoPromoList',
        {
            filter: filtersort.filter,
            sort: filtersort.sort,
            paging:pagingParam
        })
        return SGHelperErrorHandling.executeRespon(res)
    }

    static async getUserFavRestoList(arrFilter, arrSort,pagingParam) {
        var filtersort = SGHelperAPICall.convertFilterSort(arrFilter, arrSort);
        var res = await SGHelperAPICall.callAPISync('SearchUserFavRestoList',
        {
            filter: filtersort.filter,
            sort: filtersort.sort,
            paging: pagingParam
        })
        return SGHelperErrorHandling.executeRespon(res)
    }
}