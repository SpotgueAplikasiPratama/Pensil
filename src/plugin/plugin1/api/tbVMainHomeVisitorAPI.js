import React from 'react';
import Core from '../../../core/core';

export default class tbVMainHomeVisitorAPI{

    static async SearchMyLoyaltyCardSlider() {
        var token = Core.Helper.SGHelperGlobalVar.getVar("token");
        var res = await Core.Helper.SGHelperAPICall.callAPISync('SearchMyLoyaltyCardSlider', {})
        Core.log(JSON.stringify(res))
        return Core.Helper.SGHelperErrorHandling.executeRespon(res);
    }

    static async SearchMyLoyaltyCardList(arrFilter, arrSort, pagingParam) {
        var token = Core.Helper.SGHelperGlobalVar.getVar("token");
        var filtersort = Core.Helper.SGHelperAPICall.convertFilterSort(arrFilter, arrSort);
        var res = await Core.Helper.SGHelperAPICall.callAPISync('SearchMyLoyaltyCardList', {
            filter: filtersort.filter,
            sort: filtersort.sort,
            paging: pagingParam    })
        return Core.Helper.SGHelperErrorHandling.executeRespon(res);
    }

    static async SearchBuildingLoyaltyRewardList(arrFilter, arrSort, pagingParam) {
        var token = Core.Helper.SGHelperGlobalVar.getVar("token");

        var filtersort = Core.Helper.SGHelperAPICall.convertFilterSort(arrFilter, arrSort);

        var res = await Core.Helper.SGHelperAPICall.callAPISync('SearchBuildingLoyaltyRewardList', {
            filter: filtersort.filter,
            sort: filtersort.sort,
            paging: pagingParam
        })
        return Core.Helper.SGHelperErrorHandling.executeRespon(res);
    }

    static async getLocationFilter(data){
        var token = Core.Helper.SGHelperGlobalVar.getVar("token");

        var res = await Core.Helper.SGHelperAPICall.callAPISync('SearchLocationCategory', data)

return Core.Helper.SGHelperErrorHandling.executeRespon(res);

    }


    static async SearchMyLoyaltyRegistrationHistory(arrFilter, arrSort, pagingParam) {
        var token = Core.Helper.SGHelperGlobalVar.getVar("token");

        var filtersort = Core.Helper.SGHelperAPICall.convertFilterSort(arrFilter, arrSort);
        console.log(token)
        console.log(JSON.stringify({
            filter: filtersort.filter,
            sort: filtersort.sort,
            paging: pagingParam
        }))
        var res = await Core.Helper.SGHelperAPICall.callAPISync('SearchMyLoyaltyRegistrationHistory', {
            filter: filtersort.filter,
            sort: filtersort.sort,
            paging: pagingParam
        })
        return Core.Helper.SGHelperErrorHandling.executeRespon(res);
    }





}