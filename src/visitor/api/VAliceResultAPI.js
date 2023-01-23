/**
 * Version 1.2.0
 * 1. Yohanes 26 March 2021
 * - add ErrorHandling
 */
 import { SGHelperAPICall } from '../../core/helper/SGHelperAPICall'
import { SGHelperDB, SGHelperType,SGHelperErrorHandling } from '../../core/helper'
import { SGHelperGlobalVar } from '../../core/helper';
import { SGBaseScreen } from '../../core/screen/SGBaseScreen';

export class VAliceResultAPI extends SGBaseScreen {

    static async getBuildingListCard(language, keyword, filterData, sortData) {
        var arrFilter = filterData;
        var arrSort = sortData;
        var filtersort = SGHelperAPICall.convertFilterSort(arrFilter, arrSort);
        var res = await SGHelperAPICall.callAPISync('SearchAliceBuildingListCard', {
            filter: filtersort.filter,
            sort: filtersort.sort
        })
        return SGHelperErrorHandling.executeRespon(res)
    }

    static async getBuildingListCardWithSearch(language, keyword, filterData, sortData) {
        var searchFilter = { name: language.toUpperCase(), operator: 'SEARCH', value: keyword };
        filterData.unshift(searchFilter);
        var arrFilter = filterData;
        var arrSort = sortData;
        var filtersort = SGHelperAPICall.convertFilterSort(arrFilter, arrSort);

        var res = await SGHelperAPICall.callAPISync('SearchAliceBuildingListCardWithKeyword', {
            filter: filtersort.filter,
            sort: filtersort.sort
        })
        return SGHelperErrorHandling.executeRespon(res)
    }

    static async getWhereToGoUnsortedData(filterData,sortData,pagingParam) {
        var arrFilter = filterData;
        var arrSort = sortData;
        var filtersort = SGHelperAPICall.convertFilterSort(arrFilter, arrSort);
        console.log('where to go Unsorted Data')
        console.log(JSON.stringify({
            filter: filtersort.filter,
            sort: filtersort.sort,
            paging:pagingParam
        }))
        var res = await SGHelperAPICall.callAPISync('SearchAliceWhereToGoResult',{
            filter: filtersort.filter,
            sort: filtersort.sort,
            paging:pagingParam
        })
        return SGHelperErrorHandling.executeRespon(res)
    }

    static async getWhatToEatResult(userAnswer,filterData,sortData,pagingParam) {
        var arrFilter = filterData;
        var arrSort = sortData;
        var filtersort = SGHelperAPICall.convertFilterSort(arrFilter, arrSort);
        userAnswer.filterSort = {filter : filtersort.filter,sort : filtersort.sort,paging:pagingParam};
        console.log('what to eat')
        console.log(JSON.stringify(userAnswer))
        var res = await SGHelperAPICall.callAPISync('SearchAliceWhatToEatResult', userAnswer)
        return SGHelperErrorHandling.executeRespon(res)
    }

    static async getWhatToEatResultDetail(contentKey) {
        var res = await SGHelperAPICall.callAPISync('GetAliceWhatToEatResultDetail', contentKey)
        return SGHelperErrorHandling.executeRespon(res)
    }

    static async getWhatToGiftResult(userAnswer,filterData,sortData,pagingParam) {

        var arrFilter = filterData;
        var arrSort = sortData;
        var filtersort = SGHelperAPICall.convertFilterSort(arrFilter, arrSort);

        userAnswer.filterSort = {filter : filtersort.filter,sort : filtersort.sort,paging:pagingParam};
        console.log('what to gift')
        console.log(JSON.stringify(userAnswer))
        var res = await SGHelperAPICall.callAPISync('SearchAliceWhatToGiftResult', userAnswer)
        return SGHelperErrorHandling.executeRespon(res)
    }

    static async getWhatToGiftResultDetail(contentKey) {
        var res = await SGHelperAPICall.callAPISync('GetAliceWhatToGiftResultDetail', contentKey)
        return SGHelperErrorHandling.executeRespon(res)
    }

    static async getClothToBuyResult(userAnswer,filterData,sortData,pagingParam) {
        var arrFilter = filterData;
        var arrSort = sortData;
        var filtersort = SGHelperAPICall.convertFilterSort(arrFilter, arrSort);
        userAnswer.filterSort = {filter : filtersort.filter,sort : filtersort.sort,paging: pagingParam};
        console.log('cloth to buy')
        console.log(JSON.stringify(userAnswer))
        var res = await SGHelperAPICall.callAPISync('SearchAliceClothToBuyResult', userAnswer)
        return SGHelperErrorHandling.executeRespon(res)
    }

    static async getClothToBuyResultDetail(contentKey) {
        var res = await SGHelperAPICall.callAPISync('GetAliceClothToBuyResultDetail', contentKey)
        return SGHelperErrorHandling.executeRespon(res)
    }
}