/**
 * Version 1.3.0
 * 1. Yohanes 03 May 2021
 * -add ErrorHandling
 * Version 1.2.0
 * 1. Yohanes 26 March 2021
 * - add ErrorHandling
 */
 import React from 'react';
import { SGBaseContainer } from "../../core/container/SGBaseContainer";
import { SGView as View, SGButton as Button, SGText as Text, SGImage as Image, SGTextInput as TextInput, SGTouchableOpacity as TouchableOpacity, SGPopView,SGDialogBox } from '../../core/control';
import { StyleSheet } from 'react-native';
import image from '../asset/image';
import { SGLocalize } from '../locales/SGLocalize';
import { SGHelperErrorHandling, SGHelperGlobalVar, SGHelperStyle, SGHelperType } from '../../core/helper';
import { tbLookupDAO } from '../db/tbLookupDAO';
import { tbCommentData } from '../db/tbCommentDAO';
import { CommentForm } from '../form_V2/CommentForm';
import { tbCCommentAPI } from '../api/tbCCommentAPI';

export class CommentPopup extends SGBaseContainer {

    getData() {
        return ([
            { key: 1, name: "frowning" },
            { key: 2, name: "confused", },
            { key: 3, name: "slightly-smile", },
        ]);
    }

    createStyleSheet = (whp) => {
        var { w, h, p } = whp;
        return StyleSheet.create({
            mainView1: { marginVertical: p, width: (w * 0.675), justifyContent: 'center', borderRadius: 3 * p, borderColor: 'rgb(100,100,100)', elevation: 1, shadowOpacity: 0.085, padding: p, marginBottom: 4 * p, backgroundColor: 'white' },
            throwWHP: { width: w, height: h, padding: p },
            iconClose: { width: w * 0.05, height: w * 0.05, alignSelf: 'flex-end', backgroundColor: 'white' },
            buttonCancel: { color: 'white',backgroundColor:"#7a7a7a" },
            buttonSend: { color: 'white',backgroundColor:"#63aee0" },
            buttonView: { flexDirection: 'row', justifyContent: 'space-between', width: (w * 0.575) },
        });
    }

    constructor(props, context, ...args) {
        super(props, context, ...args);
        this.whp = { w: props.style.width, h: props.style.height, p: props.style.padding }
        this.style = this.createStyleSheet(this.whp);
        this.title = props.title;
        this.commentData = new tbCommentData();
        this.currentUser = SGHelperGlobalVar.getVar('GlobalCurrentUser');
        this.imageSetting = SGHelperGlobalVar.getVar('GlobalImageSetting');
        this.state={added:false}
    }
    async _addUserComment(dataInput){
        try {
            if(!this.state.added){
                var result = await tbCCommentAPI.addUserComment(dataInput);
        

                if(result.fTargetType == 'Store'){
                    SGDialogBox.showSuccess(null, SGLocalize.translate("AlertMessage.Success"), SGLocalize.translate("CommentPopUp.SuccessCommentStore"), SGLocalize.translate("AlertMessage.OK"), () => {}, true)
                }else if(result.fTargetType =='Resto'){
                    SGDialogBox.showSuccess(null, SGLocalize.translate("AlertMessage.Success"), SGLocalize.translate("CommentPopUp.SuccessCommentResto"), SGLocalize.translate("AlertMessage.OK"), () => {}, true)
                }else if(result.fTargetType == 'Place'){
                    SGDialogBox.showSuccess(null, SGLocalize.translate("AlertMessage.Success"), SGLocalize.translate("CommentPopUp.SuccessCommentPlace"), SGLocalize.translate("AlertMessage.OK"), () => {}, true)
                }
                this.onCloseHandler();
            }

        } catch (error) {
            this.setState({added:true})
            SGHelperErrorHandling.Handling(error,this._addUserComment.bind(this,dataInput))
        }

    }
    async onSendPress() {
   
        var dataInput = this.commentData.getCurrentJSON();
        var commentPackage = this.props.commentPackage;
        // console.log(commentPackage)
        if(dataInput.fRespon!==''){
            dataInput.fCreatedBy = this.currentUser;
            dataInput.fLastModifiedBy = this.currentUser;
            dataInput.fContentName = commentPackage.fContentName;
            dataInput.fContentType = commentPackage.fContentType;
            dataInput.fContentKey = commentPackage.fContentKey;
            dataInput.fContentText1 = commentPackage.fContentText1;
            dataInput.fContentText2 = commentPackage.fContentText2;
            dataInput.fTargetType = commentPackage.fTargetType;
            dataInput.fTargetKey = commentPackage.fTargetKey;
            dataInput.fTargetName = commentPackage.fTargetName;
            dataInput.fContentImage = commentPackage.fContentImage;
            dataInput.fUserImage = commentPackage.fUserImage;
            dataInput.fTargetImage = commentPackage.fTargetImage;
            dataInput.fReplySingle.writer = 'user';
            await this._addUserComment(dataInput)
           
        }else{
            SGDialogBox.showFail(null, SGLocalize.translate("AlertMessage.Fail"), SGLocalize.translate("CommentPopUp.IconEmpty"), SGLocalize.translate("AlertMessage.OK"), () => {}, true)
        }

      
    }

    onCloseHandler() {
        SGHelperGlobalVar.setVar('PauseViewPager',false);
        SGPopView.hidePopView(this.props.popViewID);
    }

    render() {
        var { w, h, p } = this.whp;
        var style = this.style;
        var dataCommentFeedback = tbLookupDAO.getSpecificLookupByGroup('CommentFeedback');
        console.log(dataCommentFeedback);
        return (
            <View accessible={true} accessibilityLabel={'CommentPopupRootView'} style={style.mainView1}>
                <TouchableOpacity style={style.iconClose} onPress={this.onCloseHandler.bind(this)}>
                    <Image accessible={true} accessibilityLabel={'CommentPopupImageIconClose'} style={style.iconClose} source={{ uri: image.closeButton[this.imageSetting].url }}></Image>
                </TouchableOpacity>
                <CommentForm accessible={true} accessibilityLabel={'CommentPopupCommentForm'} commentData={this.commentData} dataCommentFeedback={dataCommentFeedback} text1={SGLocalize.translate("commentPopup.text1")} text2={SGLocalize.translate("commentPopup.text1")} ph1={SGLocalize.translate("commentPopup.placeholder1")} style={style.throwWHP}></CommentForm>
                <View accessible={true} accessibilityLabel={'CommentPopupViewButton'} style={style.buttonView}>
                    <Button accessible={true} accessibilityLabel={'CommentPopupCancelButton'} preset={Button.preset.grey} textPreset={Text.preset.titleH3B}  style={style.buttonCancel} label={SGLocalize.translate("commentPopup.buttonCancel")} onPress={this.onCloseHandler.bind(this)} title={SGLocalize.translate('commentPopup.buttonCancel')}></Button>
                    <Button accessible={true} accessibilityLabel={'CommentPopupSendButton'} preset={Button.preset.green} textPreset={Text.preset.titleH3B} style={style.buttonSend} label={SGLocalize.translate("commentPopup.buttonSend")} onPress={this.onSendPress.bind(this)} title={SGLocalize.translate('commentPopup.buttonSend')}></Button>
                </View>
            </View>
        );
    }
}