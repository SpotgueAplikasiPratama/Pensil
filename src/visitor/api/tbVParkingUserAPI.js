/**
 * Version 1.4.3
 * 1. Yohanes 13 Agustus 2021
 * - change param in GetParkingLayoutAndData func
 * Version 1.2.0
 * 1. Yohanes 26 March 2021
 * - add ErrorHandling
 */
 import { SGHelperAPICall } from '../../core/helper/SGHelperAPICall'
import { SGHelperDB, SGHelperType ,SGHelperErrorHandling} from '../../core/helper'
import { SGHelperGlobalVar } from '../../core/helper';
import { SGBaseScreen } from '../../core/screen/SGBaseScreen';

export class tbVParkingUserAPI extends SGBaseScreen {


    static async AddParkingSpot(data) {
        console.log(JSON.stringify(data))
        console.log(SGHelperGlobalVar.getVar("token"))
        var res = await SGHelperAPICall.callAPISync('AddParkingSpot', data)
        return SGHelperErrorHandling.executeRespon(res)
    }

    static async GetParkingSpot() {
        var res = await SGHelperAPICall.callAPISync('GetParkingSpot')
        return SGHelperErrorHandling.executeRespon(res)
    }

    static async GetParkingLayoutAndData(fID,fBuildingKey) {
        var param ={
            fID:fID,
            fBuildingKey:fBuildingKey
        }
        var res = await SGHelperAPICall.callAPISync('GetParkingLayoutAndDataByID', param)
        return SGHelperErrorHandling.executeRespon(res);
    }

    static async SearchParkingUserHistory(arrFilter, arrSort,pagingParam) {
        filter = { name: 'fActive', operator: '=', value: 'Y' }
        arrFilter.push(filter)
        var filtersort = SGHelperAPICall.convertFilterSort(arrFilter, arrSort);
        var res = await SGHelperAPICall.callAPISync('SearchParkingUserHistory', {
            filter: filtersort.filter,
            sort: filtersort.sort,
            paging:pagingParam
        })
        return SGHelperErrorHandling.executeRespon(res)
    }

    static async UpdateParkingSpot(data) {
        console.log(JSON.stringify(data))
        console.log(SGHelperGlobalVar.getVar("token"))
        var res = await SGHelperAPICall.callAPISync('UpdateParkingSpot', data)
        return SGHelperErrorHandling.executeRespon(res);
    }
    static async CheckOutParking(data) {
        var res = await SGHelperAPICall.callAPISync('CheckOutParking', data)
        return SGHelperErrorHandling.executeRespon(res);
    }

    static async ClearParkingHistory() {
        var res = await SGHelperAPICall.callAPISync('DeleteParkingSearchHistory')
        return SGHelperErrorHandling.executeRespon(res);
    }
    static async GetListOfPillar(fParkingLayoutKey) {
        var res = await SGHelperAPICall.callAPISync('GetListOfPillar',fParkingLayoutKey)
        return SGHelperErrorHandling.executeRespon(res);
    }
    static async SearchParkingBuildingList(arrFilter, arrSort){
        var filtersort = SGHelperAPICall.convertFilterSort(arrFilter, arrSort);
        var res = await SGHelperAPICall.callAPISync('SearchParkingBuildingList', {
            filter: filtersort.filter,
            sort: filtersort.sort
        })
        return SGHelperErrorHandling.executeRespon(res)
    }
}