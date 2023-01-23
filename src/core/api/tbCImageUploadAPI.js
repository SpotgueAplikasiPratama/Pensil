import { SGHelperAPICall } from '../helper/SGHelperAPICall'
import { SGHelperGlobalVar,SGHelperErrorHandling } from '../helper';
import { SGBaseScreen } from '../screen/SGBaseScreen';

export class tbCImageUploadAPI extends SGBaseScreen {

    static async uploadImage(data) {
        var token = SGHelperGlobalVar.getVar("token");

        var res = await SGHelperAPICall.callAPISync('UploadImage', data)

        // var res = await SGHelperAPICall.callAPIAsync('POST', 'https://spotgue-api-dev.azurewebsites.net/api/v1/common/UploadImage', {
        //     Authorization: 'Bearer ' + token,
        //     'Content-Type': 'application/json'
        // }, JSON.stringify(data));
        return JSON.parse(res.data);

    }
    static async UploadImageFreeRatio(data) {
        var token = SGHelperGlobalVar.getVar("token");
        // var res = await SGHelperAPICall.callAPISync('UploadImage', data)
        var res = await SGHelperAPICall.callAPISync('UploadImageFreeRatio', data)
        return JSON.parse(res.data);

    }


    static async searchImages(arrFilter, arrSort,pagingParam) {
        var token = SGHelperGlobalVar.getVar("token");
        var filtersort = SGHelperAPICall.convertFilterSort(arrFilter, arrSort);

        var res = await SGHelperAPICall.callAPISync('SearchImages', {
            filter: filtersort.filter,
            sort: filtersort.sort,
            paging:pagingParam
        })
        // var res = await SGHelperAPICall.callAPIAsync('POST', 'https://spotgue-api-dev.azurewebsites.net/api/v1/common/SearchImages', {
        //     Authorization: 'Bearer ' + token,
        //     'Content-Type': 'application/json'
        // }, JSON.stringify({
        //     filter: filtersort.filter,
        //     sort: filtersort.sort
        // }));
        
        // var result = JSON.parse(res.data);
        // return result;
        return SGHelperErrorHandling.executeRespon(res);
    }
}