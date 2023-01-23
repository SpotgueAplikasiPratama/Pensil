import { SGHelperAPICall } from '../../core/helper/SGHelperAPICall'
import { SGHelperDB, SGHelperType,SGHelperErrorHandling } from '../../core/helper'
import { SGHelperGlobalVar } from '../../core/helper';
import { SGBaseScreen } from '../../core/screen/SGBaseScreen';

export class tbCCommentAPI extends SGBaseScreen {

    static async addUserComment(data) {
        var token = SGHelperGlobalVar.getVar("token");
        console.log(token);
        data.fID = null;
        data.fReplySingle.writer = 'user';
        data.fReplyData.push(data.fReplySingle);
        data.fReplyJSON = data.fReplyData;
        console.log(data);
        var res = await SGHelperAPICall.callAPISync('AddCommentVisitor', data)
        return SGHelperErrorHandling.executeRespon(res)
        
    }

    static async getUserInboxData(pagingParam) {
        arrFilter = [];
        arrSort = [
            { name: 'fLastReplyDate', descending: true, selected: true }
        ]
        var filtersort = SGHelperAPICall.convertFilterSort(arrFilter, arrSort);

        var res = await SGHelperAPICall.callAPISync('SearchUserInboxData', { 
            filter: filtersort.filter, 
            sort: filtersort.sort ,
            paging: pagingParam
        })

        return SGHelperErrorHandling.executeRespon(res)
    }


    static async getInboxGroupDate() {
        var res = await SGHelperAPICall.callAPISync('GetInboxGroupDate')
        return SGHelperErrorHandling.executeRespon(res)
    }

    static async userReadComment(commentKey) {
        var res = await SGHelperAPICall.callAPISync('UpdateUserReadAdminComment', commentKey)
        return SGHelperErrorHandling.executeRespon(res)
    }

    static async getUserCommentDetail(commentKey) {
        var res = await SGHelperAPICall.callAPISync('GetSpecificUserInboxData', commentKey)
        return SGHelperErrorHandling.executeRespon(res)
    }

    static async userAddReply(commentID, newReplyMessage) {
        var jsonInput = { commentID: commentID, newReplyMessage: newReplyMessage };
        var res = await SGHelperAPICall.callAPISync('UpdateUserAddReplyComment', jsonInput)
        return SGHelperErrorHandling.executeRespon(res)
    }

    static async inboxLength(arrFilter, arrSort) {
        var token = SGHelperGlobalVar.getVar("token");
        // console.log(token)  
        var filtersort = SGHelperAPICall.convertFilterSort(arrFilter, arrSort);
        // console.log(JSON.stringify({filter: filtersort.filter,sort: filtersort.sort}))
        var res = await SGHelperAPICall.callAPISync('GetInboxCommentLength', {filter: filtersort.filter, sort: filtersort.sort })
        // var res = await SGHelperAPICall.callAPIAsync('POST', SGHelperGlobalVar.getVar('APIVisitor') + 'GetInboxCommentLength', {
        //     Authorization: 'Bearer ' + token,
        //     'Content-Type': 'application/json'
        // }, JSON.stringify({filter: filtersort.filter, sort: filtersort.sort }));
        // console.log(res);

        return SGHelperErrorHandling.executeRespon(res)
    }
}