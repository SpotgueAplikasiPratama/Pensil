/**
 * Version 1.3.0
 * 1. Yohanes 03 May 2021
 * -add ErrorHandling
 */
import React from 'react';
import { SGBaseContainer } from '../../core/container/SGBaseContainer';
import { SGView as View, SGText as Text, SGTextInput as TextInput, SGImage as Image, SGTouchableOpacity as TouchableOpacity } from '../../core/control';
import { StyleSheet } from 'react-native';
import { SGHelperNavigation, SGHelperGlobalVar, SGHelperErrorHandling } from '../../core/helper';
import { SGHelperType } from '../../core/helper';
import image from '../asset/image';
import { tbCCommentAPI } from '../api/tbCCommentAPI';

export class InboxCard extends SGBaseContainer {
    createStyleSheet = (whp) => {
        var { w, h, p } = whp;
        return StyleSheet.create({
            mainContainer: { width: w, paddingHorizontal: p * 2, backgroundColor: '#FFFFFF', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-start', marginVertical: p * 0.5,borderBottomWidth: 1, borderBottomColor: 'rgb(169,169,169)', marginBottom: 2 },
            messageDetailContainer: { justifyContent: 'flex-start', alignItems: 'flex-start', alignSelf: 'center' },
            firstRow: { width: w - (w * 0.2), flexDirection: 'row', justifyContent: 'space-between' },
            secondRow: { width: w - (w * 0.2), alignItems: 'flex-start' },
            thridRow: { width: w - (w * 0.2), alignItems: 'flex-start' },
            text: { color: '#000000' },
            topImage: { width: w * 0.15, height: w * 0.15, }
        });
    }

    async _commentPress(commentKey) {
        try {
            this.props.readCommentFake()
            SGHelperNavigation.navigatePush(this.props.navigator, 'InboxDetail', { commentKey: commentKey })
        } catch (error) {
            SGHelperErrorHandling.Handling(error,this._commentPress.bind(this,commentKey))
        }
      
    }

    constructor(props, context, ...args) {
        super(props, context, ...args);
        this.whp = { w: props.style.width, h: props.style.height, p: props.style.padding };
        this.style = this.createStyleSheet(this.whp);
        this.title = props.title;
    }

    render() {
        var { w, h, p } = this.whp;
        this.style = this.createStyleSheet(this.whp);
        var style = this.style;
        var lastReply = this.props.data.fReplyJSON[this.props.data.fReplyJSON.length - 1];
    //    console.log(this.props.data);
        return (
            <TouchableOpacity onPress={this._commentPress.bind(this, this.props.data.fID)}>
                <View accessible={true} accessibilityLabel={'InboxCardRootView'} style={style.mainContainer}>
                    <Image accessible={true} accessibilityLabel={'InboxCardContentImage'} style={style.topImage} source={{ uri: this.props.data.fContentImage[this.props.language][0][this.props.imageSetting].uri }}></Image>
                    <View accessible={true} style={style.messageDetailContainer}>
                        <View accessible={true} style={style.firstRow}>
                            <Text accessible={true} accessibilityLabel={'InboxCardContentTitle'} numberOfLines={1} preset={(this.props.data.fReplyJSON[this.props.data.fReplyJSON.length - 1].writer === 'admin' && this.props.data.fReadCreator === 'N') ? (Text.preset.titleH4B) : (Text.preset.titleH4)} style={style.text}>{(this.props.data.fContentName[this.props.language])}</Text>
                            <Text accessible={true} accessibilityLabel={'InboxCardDateTimeTextU'} preset={(this.props.data.fReplyJSON[this.props.data.fReplyJSON.length - 1].writer === 'admin' && this.props.data.fReadCreator === 'N') ? (Text.preset.titleH5B) : (Text.preset.titleH5)} style={style.text}>{SGHelperType.formatDateTime(lastReply.replyDate, this.props.language)}</Text>
                        </View>
                        <View accessible={true} style={style.secondRow}>
                            <Text accessible={true} accessibilityLabel={'InboxCardContentText1'} numberOfLines={1} preset={(this.props.data.fReplyJSON[this.props.data.fReplyJSON.length - 1].writer === 'admin' && this.props.data.fReadCreator === 'N') ? (Text.preset.titleH4B) : (Text.preset.titleH4)} style={style.text}>{this.props.data.fContentText1[this.props.language]}</Text>
                        </View>
                        <View accessible={true} style={style.thridRow}>
                            <Text accessible={true} accessibilityLabel={'InboxCardReplyTextU'} numberOfLines={1} preset={Text.preset.titleH4_5} style={style.text}>{lastReply.replyText}</Text>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
     
        );
    }
}