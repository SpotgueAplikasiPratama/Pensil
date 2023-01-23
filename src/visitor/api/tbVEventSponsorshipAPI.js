
 import { SGHelperAPICall } from '../../core/helper/SGHelperAPICall'
 import { SGHelperDB, SGHelperType,SGHelperErrorHandling } from '../../core/helper'
 import { SGHelperGlobalVar } from '../../core/helper';
 import { SGBaseScreen } from '../../core/screen/SGBaseScreen';
 
 export class tbVEventSponsorshipAPI extends SGBaseScreen {
 
     static async searchEventSponsorshipSlider() {
         var token = SGHelperGlobalVar.getVar('token');
         var res = await SGHelperAPICall.callAPISync('searchEventSponsorshipSlider')
         return SGHelperErrorHandling.executeRespon(res)
     }

     static async searchEventSponsorshipDetail(fEventSponsorshipID) {
        var token = SGHelperGlobalVar.getVar('token');
        var res = await SGHelperAPICall.callAPISync('searchEventSponsorshipDetail',fEventSponsorshipID)
        return SGHelperErrorHandling.executeRespon(res)
    }
    
    static async searchEventSponsorshipList(arrFilter, arrSort,pagingParam) {
        var filtersort = SGHelperAPICall.convertFilterSort(arrFilter, arrSort);
        var res = await SGHelperAPICall.callAPISync('searchEventSponsorshipList',
        {
            filter: filtersort.filter,
            sort: filtersort.sort,
            paging: pagingParam
        })
        return SGHelperErrorHandling.executeRespon(res)
    }

    static async getAllSearchResultSponsorEvent(language, keyword, filterData, sortData,pagingParam) {
        var searchFilter = { name: language.toUpperCase(), operator: 'SEARCH', value: keyword };
        filterData.unshift(searchFilter);
        var arrFilter = filterData;
        var arrSort = sortData;
        var filtersort = SGHelperAPICall.convertFilterSort(arrFilter, arrSort);
        console.log('getAllSearchResultSponsorEvent')
        console.log(JSON.stringify({
            filter: filtersort.filter,
            sort: filtersort.sort
        }));
        var res = await SGHelperAPICall.callAPISync('SearchSponsorEventWithKeyword', {
            filter: filtersort.filter,
            sort: filtersort.sort,
            paging:pagingParam
        })
        console.log(res)
        return SGHelperErrorHandling.executeRespon(res);
    }

 
 }