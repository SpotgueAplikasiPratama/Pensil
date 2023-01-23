
/**.
 * Version 1.2.0
 * 1. Yohanes 29 March 2021
 * - add ErrorHandling
 * Version 1.1.0
 * 1 Yohanes , 10 March 2021
 * - fix style
 */
import React from 'react';
import { StyleSheet,AppState } from 'react-native';
import { SGView as View, SGRootView as RootView, SGScrollView as ScrollView, SGTouchableOpacity as TouchableOpacity, SGImage as Image, SGText as Text, SGTextInput as TextInput, SGActivityIndicator as ActivityIndicator } from '../../../core/control';
import { SGBaseScreen } from '../../../core/screen/SGBaseScreen';
import { RibbonHeader } from '../../component_V2/RibbonHeader';
import { SGHelperNavigation, SGHelperGlobalVar, SGHelperErrorHandling } from '../../../core/helper';
import { SGLocalize } from '../../locales/SGLocalize';
import { SGHelperType } from '../../../core/helper';
import image from '../../asset/image';
import { tbCCommentAPI } from '../../api/tbCCommentAPI';
import { CustomMenuBar } from '../../component_V2/CustomMenuBar';

export class InboxDetailScreen extends SGBaseScreen {

    createStyleSheet = (whp) => {
        var { w, h, p } = whp;
        return StyleSheet.create({
            throwWHP: { width: w, height: h, padding: p },
            mainContainer: { width: w, height: h, backgroundColor: '#FFFFFF' },
            tenantContainer: { width: w, borderColor: '#E4E4E4', flexDirection: 'row', justifyContent: 'flex-start', borderBottomWidth: w * 0.0023 },
            leftContainer: { width: w * 0.2, marginLeft: p * 3, justifyContent: 'flex-start', paddingVertical: p * 4 },
            tenantThumbnailImage: { width: w * 0.165, height: w * 0.165, backgroundColor: '#FFFFFF', borderRadius: p * 2 },
            rightContainer: { width: w * 0.7, flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start' },
            textContentName: { color: '#000000', marginVertical: 0 },
            textContentText1: { color: '#A0A0A0', marginTop: 0, marginVertical: p * 0.5 },
            chatContainer: { width: w, backgroundColor: '#FFFFFF', alignItems: 'center' },
            firstMessageView: { width: w, flexDirection: 'row' },
            firstMessageContainer: { width: w, height: '100%', justifyContent: 'flex-start' },
            firstMessageAdmin: { width: w * 0.9, flexDirection: 'row', paddingTop:2*p,paddingBottom:2*p, paddingRight: p * 2,paddingLeft:2*p, borderRadius: p * 3, borderTopLeftRadius: 0, justifyContent: 'space-between', backgroundColor: '#70f0c8' },
            firstMessageCreator: { width: w * 0.9, flexDirection: 'row',  paddingTop:p,paddingBottom:p, paddingRight: p * 2,paddingLeft:2*p, borderRadius: p * 3, borderTopRightRadius: 0, justifyContent: 'space-between', backgroundColor: '#e9e9e9' },
            adminText: { color: 'white', marginLeft: p },
            creatorText: { color: 'black', marginRight: p },
            emoticon: { width: w * 0.15, height: w * 0.15, resizeMode: 'contain', backgroundColor: 'transparent' },
            dateTextAdmin: { color: '#000000', alignSelf: 'flex-start', marginLeft: p * 5, marginVertical: p * 2 },
            dateTextCreator: { color: '#000000', alignSelf: 'flex-end', marginRight: p * 5, marginVertical: p * 2 },
            replyView: { width: w, flexDirection: 'row' },
            replyContainer: { width: w, height: '100%', justifyContent: 'flex-start',},
            replyAdmin: { maxWidth: w * 0.65, marginLeft: p * 5, flexDirection: 'row', alignSelf: 'flex-start', marginTop: 0, marginBottom: 0,  paddingHorizontal: p * 2, borderRadius: p * 3, borderTopLeftRadius: 0, justifyContent: 'space-between', backgroundColor: '#184d47' },
            replyCreator: { maxWidth: w * 0.65, marginRight: p * 5, flexDirection: 'row', alignSelf: 'flex-end', marginTop: 0, marginBottom: 0,paddingHorizontal: p * 2, borderRadius: p * 3, borderTopRightRadius: 0, justifyContent: 'space-between', backgroundColor: '#e9e9e9' },
            addReplyView: { flexDirection: 'row', width: w, height: w * 0.3, borderTopLeftRadius: p * 3, borderTopRightRadius: p * 3, justifyContent: 'space-between', backgroundColor: '#191919', paddingBottom: p * 3 },
            replyInput: { width: w * 0.7, marginLeft: p * 5, },
            sendButton: { marginRight: 6 * p, color: 'white' }
        });
    }

    async componentDidMount() {
        await this.refreshItem();
        this._unsubscribe = this.props.navigation.addListener('focus', async () => {
            await this.refreshItem();
        });
        this.alreadyMount = true;
        AppState.addEventListener('change', this._handleAppStateChange);
        //check apps still active or not
        if (this.state.appState === "active") {
            this.interval = setInterval(async () => {
                await this.refreshItem();
            },  SGHelperType.getSysParamsValueToInt('InboxDetailIntervalVisitor'));
        }

    }

    _handleAppStateChange = (nextAppState) => {
        if (
            this.state.appState.match(/inactive|background/) &&
            nextAppState === 'active'
        ) {
            console.log('App has come to the foreground!');
        }
        this.setState({ appState: nextAppState });
        
    };

    componentWillUnmount() {
        AppState.removeEventListener('change', this._handleAppStateChange);
        clearInterval(this.interval);
        if (this._unsubscribe) { this._unsubscribe(); }

    }
    
    async refreshItem() {
        this.currentUser = SGHelperGlobalVar.getVar('GlobalCurrentUser');
        this.imageSetting = SGHelperGlobalVar.getVar('GlobalImageSetting');
        this.baseRunSingleAPIWithRedoOption('getUserCommentDetail', (async (v) => { return tbCCommentAPI.getUserCommentDetail(v) }).bind(this, this.props.route.params.commentKey), (async (v) => {
            this.commentData =v 
            if (this.commentData.fReadCreator == "N") {
                await tbCCommentAPI.userReadComment(this.commentData.fID);
            }
            this.replyData = this.commentData.fReplyJSON;
            console.log(v)
            this.forceUpdate();
        }).bind(this),  null,  SGHelperGlobalVar.getVar("ResponTimes"));
       

       
    }

     

    constructor(props, context, ...args) {
        super(props, context, ...args);
        this.style = this.createStyleSheet(this.WHP);
        this.props.navigation.setOptions({
            headerShown: false,
        });
        this.commentData = {
            fID:'',fActive:'',fContentImage:{id:[{high:{},med:{},low:{}}],en:[{high:{},med:{},low:{}}],cn:[{high:{},med:{},low:{}}]},fContentKey:'',fContentName:{id:'',en:'',cn:''},fContentText1:{id:'',en:'',cn:''},fContentText2:{id:'',en:'',cn:''},
            fTargetImage:{id:[],en:[],cn:[]},fTargetName:{id:'',en:'',cn:''},
        }
        this.state = { replyMessage: '',appState: AppState.currentState };
        this.alreadyMount = false;
        this.replyData=[]
        console.log(this.imageSetting)
        this.currentUser = SGHelperGlobalVar.getVar('GlobalCurrentUser');
        this.imageSetting = SGHelperGlobalVar.getVar('GlobalImageSetting');
        this.navigationList = { Place: 'MallHome', Store: 'StoreHome', Resto: 'RestoHome', PlaceEvent: 'PlaceEventDetail', StorePromo: 'StorePromoDetail', RestoPromo: 'RestoPromoDetail', StoreProduct: 'StoreProductDetail', RestoMenu: 'RestoMenuDetail', Facility: 'FacilityDetail', WhatToEat: 'WhatToEatResultDetail', WhatToGift: 'WhatToGiftResultDetail', ClothToBuy: 'ClothToBuyResultDetail', RewardPlace: 'RewardDetail', RewardStore: 'RewardDetail', RewardResto: 'RewardDetail', RewardReferralPlace: 'ReferralRewardDetail', RewardReferralStore: 'ReferralRewardDetail', RewardReferralResto: 'ReferralRewardDetail' }
    }

    async _sendPress() {
        // var addReplyRes = await tbCCommentAPI.userAddReply(this.props.route.params.commentKey, this.state.replyMessage);
        // if (addReplyRes.respInfo.status == 200) {
        //     this.state.replyMessage = '';
        //     await this.refreshItem();
        // }
        try 
        {
            await tbCCommentAPI.userAddReply(this.props.route.params.commentKey, this.state.replyMessage);
            this.state.replyMessage = '';
            await this.refreshItem();
        }
        catch (error) {
            SGHelperErrorHandling.Handling(error,this._sendPress.bind(this))
        }
       
    }

    _onContentLinkPress() {
        var rewardType = '';
        if (this.commentData.fContentType === 'RewardPlace' || this.commentData.fContentType === 'RewardReferralPlace') {
            rewardType = 'building'
        }
        if (this.commentData.fContentType === 'RewardStore' || this.commentData.fContentType === 'RewardReferralStore') {
            rewardType = 'store'
        }
        if (this.commentData.fContentType === 'RewardResto' || this.commentData.fContentType === 'RewardReferralResto') {
            rewardType = 'resto'
        }
        SGHelperNavigation.navigatePush(this.props.navigation, this.navigationList[this.commentData.fContentType], { contentKey: this.commentData.fContentKey, storeKey: this.commentData.fTargetKey, restoKey: this.commentData.fTargetKey, fType: rewardType })
    }

    render() {
        var { w, h, p } = this.WHP;
        var style = this.style;
        return (
            <RootView dummyStatusBar accessible={true} accessibilityLabel={'InboxDetailScreenRootView'} style={style.mainContainer}>
                <CustomMenuBar btnBack accessible={true} accessibilityLabel={'HomeScreenHeader'} currentUser={this.currentUser} navigator={this.props.navigation} imageSetting={this.imageSetting} style={style.throwWHP}></CustomMenuBar>
                {this.alreadyMount ?
                    (<View style={{ flex: 1 }}>
                        <RibbonHeader style={style.throwWHP} imageSetting={this.imageSetting} title={SGLocalize.translate("inboxDetailScreen.title")}></RibbonHeader>
                        <TouchableOpacity onPress={this._onContentLinkPress.bind(this)}>
                            <View accessible={true} accessibilityLabel={'InboxDetailScreenContentView'} style={style.tenantContainer}>
                                <View accessible={true} accessibilityLabel={'InboxDetailScreenContentImageView'} style={style.leftContainer}>
                                    <Image accessible={true} accessibilityLabel={'InboxDetailScreenContentImage'} style={style.tenantThumbnailImage} source={{ uri: this.commentData.fContentImage[this._language][0][this.imageSetting].uri }}></Image>
                                </View>
                                <View accessible={true} accessibilityLabel={'InboxDetailScreenContentTextView'} style={style.rightContainer}>
                                    <Text accessible={true} accessibilityLabel={'InboxDetailScreenContentName'} preset={Text.preset.titleH3B} style={style.textContentName}>{this.commentData.fContentName[this._language]}</Text>
                                    <Text accessible={true} accessibilityLabel={'InboxDetailScreenContentCommentText1'} preset={Text.preset.titleH5} style={style.textContentText1}>{this.commentData.fContentText1[this._language]}</Text>
                                    <Text accessible={true} accessibilityLabel={'InboxDetailScreenContentCommentText2'} preset={Text.preset.titleH5} numberOfLines={2} style={style.textContentText1}>{this.commentData.fContentText2[this._language]}</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                        <ScrollView accessible={true} accessibilityLabel={'InboxDetailScreenScrollView'} ref='SV1' onContentSizeChange={() => this.refs.SV1.scrollToEnd()} showsVerticalScrollIndicator={false} contentContainerStyle={style.chatContainer}>
                            {this.replyData.map((x, index) => {
                                return (
                                    index === 0 ?
                                        (<View accessible={true} accessibilityLabel={'InboxDetailScreenFirstReplyView'} style={style.firstMessageView}>
                                            <View accessible={true} accessibilityLabel={'InboxDetailScreenReplyTextView'} style={style.firstMessageContainer}>
                                            <Image accessible={true} accessibilityLabel={'InboxDetailScreenReplyAdminEmoticonImage'} style={style.emoticon} source={{ uri: image[this.commentData.fRespon].inactive.med.url }}></Image>
                                                <View accessible={true} accessibilityLabel={'InboxDetailScreenReplyViewAdmin'} style={x.writer === 'admin' ? style.firstMessageAdmin : style.firstMessageCreator}>
                                                    <Text accessible={true} accessibilityLabel={'InboxDetailScreenReplyAdminText'} preset={Text.preset.titleH2} style={x.writer === 'admin' ? style.adminText : style.creatorText}>{x.replyText}</Text>
                                                </View>
                                                <Text accessible={true} accessibilityLabel={'InboxDetailScreenReplyTopDate'} preset={Text.preset.titleH4_5} style={x.writer === 'admin' ? style.dateTextAdmin : style.dateTextCreator}>{SGHelperType.formatDateTime(x.replyDate, this._language)}</Text>
                                            </View>
                                        </View>)
                                        :
                                        (<View accessible={true} accessibilityLabel={'InboxDetailScreenReplyView'} style={style.replyView}>
                                            <View accessible={true} style={style.replyContainer}>
                                                <View accessible={true} accessibilityLabel={'InboxDetailScreenReplyBubbleAdminView'} style={x.writer === 'admin' ? style.replyAdmin : style.replyCreator}>
                                                    <Text accessible={true} accessibilityLabel={'InboxDetailScreenTextReply'} preset={Text.preset.titleH3} style={x.writer === 'admin' ? style.adminText : style.creatorText}>{x.replyText}</Text>
                                                </View>
                                                <Text accessible={true} accessibilityLabel={'InboxDetailScreenReplyTopDate'} preset={Text.preset.titleH4_5} style={x.writer === 'admin' ? style.dateTextAdmin : style.dateTextCreator}>{SGHelperType.formatDateTime(x.replyDate, this._language)}</Text>
                                            </View>
                                        </View>)
                                )
                            })
                            }
                        </ScrollView>

                    </View>)
                    :
                    (<ActivityIndicator preset={ActivityIndicator.preset.h1} style={{ flex: 1 }}></ActivityIndicator>)}
                <View accessible={true} accessibilityLabel={'InboxDetailScreenAddReplyView'} shadow style={style.addReplyView}>
                    <TextInput accessible={true} accessibilityLabel={'InboxDetailScreenAddReplyInput'} placeholder={SGLocalize.translate("inboxDetailScreen.phAddReply")} style={style.replyInput} onValueChange={(v) => this.setState({ replyMessage: v })} value={this.state.replyMessage} dataType={TextInput.dataType.multiline}></TextInput>
                    <TouchableOpacity disabled={this.state.replyMessage === '' ? true : false} onPress={this._sendPress.bind(this)}>
                        <Text accessible={true} accessibilityLabel={'InboxDetailScreenAddReplySend'} preset={Text.preset.titleH2B} style={style.sendButton}>{SGLocalize.translate("inboxDetailScreen.sendButton")}</Text>
                    </TouchableOpacity>
                </View>
                {/* <BottomNavigationContainer navigator={this.props.navigation} style={style.throwWHP}></BottomNavigationContainer> */}
            </RootView>
        );
    }
}