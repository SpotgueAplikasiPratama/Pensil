/*
Version 1.2.0
 * 1. Yohanes 01 April 2021
 * - add ErrorHandling
 *  *  * 2. Leon 12 Apr 2021
 * - add ErrorHandling
Change By Melvin, 2 Maret 2020, Fixing UI Detail
*/
import React from 'react';
import { StyleSheet } from 'react-native';
import { SGBaseScreen } from '../../../core/screen/SGBaseScreen';
import { SGView as View, SGText as Text, SGTouchableOpacity as TouchableOpacity, SGIcon as Icon, SGWebView, SGRootView as RootView, SGActivityIndicator  as ActivityIndicator} from '../../../core/control';
import { SGHelperGlobalVar, SGHelperType, SGHelperNavigation, SGHelperErrorHandling } from '../../../core/helper';
import { SGLocalize } from '../../locales/SGLocalize';
import { tbUserDAO } from '../../db/tbUserDAO';
import { tbCActivityDataSpotgueAPI } from '../../api/tbCActivityDataSpotgueAPI'
import { tbCDirectoryDataSpotgueAPI } from '../../api/tbCDirectoryDataSpotgueAPI';
import { CustomMenuBar } from '../../component_V2/CustomMenuBar';

export class DetailPolicyScreen extends SGBaseScreen {
    createStyleSheet = (whp) => {
        var { w, h, p } = whp;
        var ratio = h/parseFloat(w)

        return StyleSheet.create({
            v1: { width: w, height: w*ratio -((w*0.08)*ratio), backgroundColor: "white", justifyContent: 'flex-start' },
            v2:{width:w-2*p,height:(w*0.08)*ratio,flexDirection:'row',backgroundColor:'transparent',marginVertical:0},
            v2_1: { width: (w - 2 * p) * 0.3, height: w * 0.1, borderWidth: 3, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', borderRadius: w * 0.02, borderColor: "#e9e9e9", marginRight:4*p,backgroundColor:"white"},
            v2_2: { width: (w - 2 * p) * 0.3, height: w * 0.1, borderWidth: 3, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', borderRadius: w * 0.02, borderColor: "blue", marginRight:4*p,backgroundColor:"white" },
        });
    }
    constructor(props, context, ...args) {
        super(props, context, ...args);
        this.style = this.createStyleSheet(this.WHP);
        this.props.navigation.setOptions({
            headerShown: false,
        });
        this.userDataID = SGHelperGlobalVar.getVar('GlobalCurrentUser');
        this.imageSetting = SGHelperGlobalVar.getVar('GlobalImageSetting');
        this.userData = SGHelperGlobalVar.getVar('GlobalCurrentUserData');

        this.action = '';
        this.fID = this.props.route.params.fID
        this.alreadyMount = false;
        this.data = { fContentKey: this.fID, fAction: '' }
        this.directoryDataSpotgue = { fContentURLID: '', fContentURLEN: '', fContentURLCN: '', }
        this._language = this._language.toUpperCase();
    }

    async componentDidMount() {
        await this._refreshData();
        this._unsubscribe = this.props.navigation.addListener('focus', async () => {
            await this._refreshData();
        });
    }

    checkAPIBatchStatusAllDone() {
        this.data = this.data.fID === null ? { fContentKey: this.fID, fAction: '' } : this.data;
        this.alreadyMount = true;
        this.forceUpdate();
    }

    async _refreshData() {
        // try {

            this.baseInitAPIParallel(SGHelperGlobalVar.getVar("ResponTimes"), (() => { this.checkAPIBatchStatusAllDone(); }).bind(this));

            this.baseAddAPIParallel('getDirectoryDataSpotgueByID', (async (v1) => { return tbCDirectoryDataSpotgueAPI.getDirectoryDataSpotgueByID(v1); }).bind(this, this.fID), ((v) => {
                this.directoryDataSpotgue = v;
                console.log(this.directoryDataSpotgue)
            }).bind(this),  null);

            this.baseAddAPIParallel('getActivityDataSpotgueByID', (async (v1) => { return tbCActivityDataSpotgueAPI.getActivityDataSpotgueByID(v1); }).bind(this, this.fID), ((v) => {
                this.data = v;
            }).bind(this),  null);

            this.baseRunAPIParallel();

    }

    componentWillUnmount() {
        if (this._unsubscribe) { this._unsubscribe(); }
    }
    async _onPressLikeDislikeHandler(data){
        try {
            await tbCActivityDataSpotgueAPI.addUpdateActiviyDataSpotgue(data)
            this.forceUpdate()
        } catch (error) {
            SGHelperErrorHandling.Handling(error,this._onPressLikeDislikeHandler.bind(this,data))
        }
    }
    async _onPressLike() {
        var data = this.data
        if (data.fAction === 'like') return
        data.fAction = 'like'
        await this._onPressLikeDislikeHandler(data)
    }
    async _onPressDislike() {

        var data = this.data
        if (data.fAction === 'dislike') return
        data.fAction = 'dislike'
        await this._onPressLikeDislikeHandler(data)
    }
    render() {
        var { w, h, p } = this.WHP;
        var style = this.style;

        var action = this.data.fAction
        
        return (
            <RootView dummyStatusBar accessible={true} accessibilityLabel={'DetailPolicyScreenRootView'} style={style.v1}>
                <CustomMenuBar btnBack accessible={true} accessibilityLabel={'HomeScreenHeader'} currentUser={this.userDataID} navigator={this.props.navigation} imageSetting={this.imageSetting} style={style.throwWHP}></CustomMenuBar>
                {this.alreadyMount ?
                <View>
                    <View style={style.v1}>
                        <SGWebView accessible={true} accessibilityLabel={'DetailPolicyScreenWebView'} style={{ flex: 1, backgroundColor: 'white' }} source={{ uri: this.directoryDataSpotgue["fContentURL" + this._language] }} />
                    </View>
                    <View accessible={true} accessibilityLabel={'DetailPolicyScreenContentView'} style={style.v2}>
                        <TouchableOpacity style={action === 'like' ? style.v2_2 : style.v2_1} onPress={this._onPressLike.bind(this)}>
                            <Icon accessible={true} accessibilityLabel={'DetailPolicyScreenLikeIcon'} name={Icon.Icon.like} preset={Icon.preset.h5}></Icon>
                            <Text accessible={true} accessibilityLabel={'DetailPolicyScreenYesText'} style={style.text1}>{SGLocalize.translate("ChooseScreenProfile.Yes")}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={action === 'dislike' ? style.v2_2 : style.v2_1} onPress={this._onPressDislike.bind(this)}>
                            <Icon accessible={true} accessibilityLabel={'DetailPolicyScreenDislikeIcon'} name={Icon.Icon.dislike} preset={Icon.preset.h5}></Icon>
                            <Text accessible={true} accessibilityLabel={'DetailPolicyScreenNoText'} preset={Text.preset.h5}>{SGLocalize.translate("ChooseScreenProfile.No")}</Text>
                        </TouchableOpacity>
                    </View> 
             </View>
                :
                <ActivityIndicator preset={ActivityIndicator.preset.h1} style={{ flex: 1 }}></ActivityIndicator>
                }
            </RootView>
        );
    }
}