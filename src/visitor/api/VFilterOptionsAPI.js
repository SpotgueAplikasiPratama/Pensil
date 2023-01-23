/**
 * Version 1.2.0
 * 1. Yohanes 26 March 2021
 * - add ErrorHandling
 */
 import { SGHelperAPICall } from '../../core/helper/SGHelperAPICall'
import { SGHelperDB, SGHelperType,SGHelperErrorHandling } from '../../core/helper'
import { SGHelperGlobalVar } from '../../core/helper';
import { SGBaseScreen } from '../../core/screen/SGBaseScreen';
import { tbLookupDAO } from '../db/tbLookupDAO';
import { SGLocalize } from '../locales/SGLocalize';
import {VisitorHelper} from '../helper/VisitorHelper';

export class VFilterOptionsAPI extends SGBaseScreen {

    static async getLocationFilter(language) {
        var res = await SGHelperAPICall.callAPISync('SearchLocationCategory')
        console.log(res)
        var resultData = SGHelperErrorHandling.executeRespon(res)
        console.log('getLocationFilter')
        console.log(language)
        console.log(resultData);
        var result = this.constructBuildingMatrix(language, resultData);
        return result;

    }

    static constructBuildingMatrix(language, data) {
        console.log('constructBuildingMatrix')
        console.log(data);
        var arr = [];
        for (var i = 0; i < data.length; i++) {
            var json = {
                buildingType: data[i].buildingType, buildingTypeTitle: VisitorHelper.getLocalizeDataFromLookUp('BuildingCategory',data[i].buildingType,language),
                buildingName: data[i].buildingKey, buildingNameTitle: data[i]['buildingName' + language.toUpperCase()],
                city: data[i].city, cityTitle: VisitorHelper.getLocalizeDataFromLookUp('City',data[i].city,language),
                province: data[i].province, provinceTitle: VisitorHelper.getLocalizeDataFromLookUp('Province',data[i].province,language),
                country: data[i].country, countryTitle: VisitorHelper.getLocalizeDataFromLookUp('Country',data[i].country,language)
            }
            arr.push(json);
        }
        return (arr);
    }
}