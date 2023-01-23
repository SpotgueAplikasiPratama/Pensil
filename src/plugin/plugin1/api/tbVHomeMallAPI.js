import React from 'react';
import Core from '../../../core/core';

export default class tbVHomeMallAPI{

    static async SearchBuildingHighlightLoyaltyCardSlider(fBuildingKey) {
        Core.log('me tws')
        Core.log(fBuildingKey)
        var token = Core.Helper.SGHelperGlobalVar.getVar("token");


        var res = await Core.Helper.SGHelperAPICall.callAPISync('SearchBuildingHighlightLoyaltyCardSlider',fBuildingKey) 
       
        Core.log(JSON.stringify(res))
        Core.log("api ajaln?")
        return Core.Helper.SGHelperErrorHandling.executeRespon(res);
        
    }

    static async SearchBuildingHighlightLoyaltyCardList(arrFilter, arrSort, pagingParam) {
        // Core.log("mencoba masuk API")
        var token = Core.Helper.SGHelperGlobalVar.getVar("token");
        console.log(token)
        var filtersort = Core.Helper.SGHelperAPICall.convertFilterSort(arrFilter, arrSort);
        console.log(JSON.stringify({
            filter: filtersort.filter,
            sort: filtersort.sort,
            paging: pagingParam    
        }))
        var res = await Core.Helper.SGHelperAPICall.callAPISync('SearchBuildingHighlightLoyaltyCardList', {
            filter: filtersort.filter,
            sort: filtersort.sort,
            paging: pagingParam    
        })
        // Core.log('saya keluar')
        // Core.log(JSON.stringify(res))
        return Core.Helper.SGHelperErrorHandling.executeRespon(res);
    }

    static async GetBuildingHighlightLoyaltyCardDetail(fID) {
        // Core.log('masuk ke AOU ===asdgaskhdk')
        var res = await Core.Helper.SGHelperAPICall.callAPISync('GetBuildingHighlightLoyaltyCardDetail', fID)
        // Core.log('saya keluar')
        // Core.log(JSON.stringify(res))
        return Core.Helper.SGHelperErrorHandling.executeRespon(res)
    }
    
    static async SearchLoyaltyReward(arrFilter, arrSort, pagingParam) {
        // Core.log("mencoba masuk API")
        var token = Core.Helper.SGHelperGlobalVar.getVar("token");

        var filtersort = Core.Helper.SGHelperAPICall.convertFilterSort(arrFilter, arrSort);

        var res = await Core.Helper.SGHelperAPICall.callAPISync('SearchLoyaltyReward', {
            filter: filtersort.filter,
            sort: filtersort.sort,
            paging: pagingParam    
        })
        Core.log('saya keluar')
        Core.log(JSON.stringify(res))
        return Core.Helper.SGHelperErrorHandling.executeRespon(res);
    }

    static async SearchMyLoyaltyRegistrationHistory(arrFilter, arrSort, pagingParam) {
        var token = Core.Helper.SGHelperGlobalVar.getVar("token");

        var filtersort = Core.Helper.SGHelperAPICall.convertFilterSort(arrFilter, arrSort);

        var res = await Core.Helper.SGHelperAPICall.callAPISync('SearchMyLoyaltyRegistrationHistory', {
            filter: filtersort.filter,
            sort: filtersort.sort,
            paging: pagingParam
        })
        return Core.Helper.SGHelperErrorHandling.executeRespon(res);
    }
}