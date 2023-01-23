import React from 'react';
import { StyleSheet } from 'react-native';
import { SGBaseForm } from "../../core/container/SGBaseForm";
import { SGView as View, SGText as Text, SGTextInput as TextInput, SGImage as Image, SGTouchableOpacity as TouchableOpacity } from '../../core/control';
import image from '../asset/image';
import {SGHelperType} from '../../core/helper';

export class CommentForm extends SGBaseForm {
    createStyleSheet = (whp) => {
        var { w, h, p } = whp;
        return StyleSheet.create({
            mainView1: { padding: p },
            throwWHP: { width: w, height: h, padding: p },
            emotContainer: { flexDirection: 'row-reverse', justifyContent: 'space-evenly', width: (w * 0.6)},
            emoticon: { backgroundColor: 'white', height: w*0.3, width: w * 0.2 },
            text1: { color: '#606060', marginVertical:  p, },
            text2: { color: '#909090' },
            commentBox: {  width: w * 0.55, alignItems: 'flex-start', justifyContent: 'flex-start', borderRadius: 0,  paddingVertical: 2 * p },
            buttonView: { flexDirection: 'row', justifyContent: 'space-around', width: (w - 2 * p) },
        });
    }
    constructor(props, context, ...args) {
        super(props, context, ...args);
        this.whp = { w: props.style.width, h: props.style.height, p: props.style.padding }
        this.style = this.createStyleSheet(this.whp);
        this.initData(this.props.commentData);
        this.state = {
            passwordConfirmation: '',
        };
    }

    render() {
        this.initData(this.props.commentData);
        var { w, h, p } = this.whp;
        var style = this.style;
        var commentData = this.props.commentData;
        var dataCommentFeedback = this.props.dataCommentFeedback;

        return (
            <View accessible={true} accessibilityLabel={'CommentFormRootView'} style={style.mainView1}>

                {/* <Icon1 onPress={this.onCloseHandler.bind(this)} style={style.iconClose} name='window-close'></Icon1> */}
                <Text accessible={true} accessibilityLabel={'CommentFormText1'} preset={Text.preset.titleH3B} style={style.text1}>{this.props.text1}</Text>
                <View accessible={true} accessibilityLabel={'CommentFormViewEmotContainer'} style={style.emotContainer}>
                    {
                        dataCommentFeedback.map((x) => {
                            return (
                                <TouchableOpacity key={x.fValueKey} onPress={() => { this.setData('fRespon', x.fValueKey); this.forceUpdate() }}>
                                    {this.getData('fRespon') === x.fValueKey ? (<Image style={style.emoticon} source={{ uri: image[x.fValueKey].active.med.url }}></Image>) :
                                        (<Image accessible={true} accessibilityLabel={'CommentFormImageEmoticon'} style={style.emoticon} source={{ uri: image[x.fValueKey].inactive.med.url }}></Image>)}
                                </TouchableOpacity>
                            )
                        })
                    }
                </View>
                <Text accessible={true} accessibilityLabel={'CommentFormText2'} preset={Text.preset.titleH4_5B} style={style.text2}>{this.props.text2}</Text>
                <TextInput maxLength={SGHelperType.ArraymaxLength(3)} accessible={true} accessibilityLabel={'CommentFormTextInput'} preset={TextInput.preset.commentBox} dataType={TextInput.dataType.multiline} style={style.commentBox} placeholder={this.props.ph1} onValueChange={(v) => { this.setData('fReplySingle.replyText', v) }} value={this.getData('fReplySingle.replyText')}></TextInput>
            </View>
        );
    }
}
