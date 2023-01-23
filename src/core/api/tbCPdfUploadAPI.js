import { SGHelperAPICall } from '../helper/SGHelperAPICall'
import { SGHelperGlobalVar } from '../helper';
import { SGBaseScreen } from '../screen/SGBaseScreen';

export class tbCPdfUploadAPI extends SGBaseScreen {

    static async uploadPdf(data) {
        var token = SGHelperGlobalVar.getVar("token");
        console.log(JSON.stringify(data));
        var res = await SGHelperAPICall.callAPISync('UploadPdf', data)
        
        console.log(token)
        console.log(res);
        console.log('upload Pdf');
        // var res = await SGHelperAPICall.callAPIAsync('POST', 'https://spotgue-api-dev.azurewebsites.net/api/v1/common/UploadPdf', {
        //     Authorization: 'Bearer ' + token,
        //     'Content-Type': 'application/json'
        // }, JSON.stringify(data));
        
        //console.log(res);
        return JSON.parse(res.data);
    }


}