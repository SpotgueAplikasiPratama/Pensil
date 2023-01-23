/**
 * 1. Yohanes 01 April 2021
 * - add ErrorHandling
 *  *  * 2. Leon 12 Apr 2021
 * - add ErrorHandling
 */
import React from 'react';
import { StyleSheet } from 'react-native';
import { SGBaseScreen } from '../../../core/screen/SGBaseScreen';
import { SGView as View, SGText as Text, SGIcon as Icon, SGTouchableOpacity as TouchableOpacity, SGRootView as RootView, SGButton as Button, SGDialogBox as DialogBox } from '../../../core/control';
import { tbLookupDAO } from '../../db/tbLookupDAO';
import { SGLocalize } from '../../locales/SGLocalize';
import { SGHelperErrorHandling, SGHelperGlobalVar, SGHelperType } from '../../../core/helper';
import { tbUserData, tbUserDAO } from '../../db/tbUserDAO';
import { tbVUserAPI } from '../../api/tbVUserAPI';
import { VUserSettingsAPI } from '../../api/VUserSettingsAPI';
import { tbSystemParamsDAO } from '../../db/tbSystemParamsDAO';
import { CustomMenuBar } from '../../component_V2/CustomMenuBar';
import { SGFormButton as FormButton } from '../../../core/form/SGFormButton';

export class ChangeImageSettingScreen extends SGBaseScreen {

    createStyleSheet = (whp) => {
        var { w, h, p } = whp;
        return StyleSheet.create({
            v1: { flex: 1, justifyContent: 'flex-start', backgroundColor: "white",width:w },
            v2: { width: w - 2 * p, height: w * 0.12, justifyContent: 'flex-start', flexDirection: 'row', marginTop: 3 * p, borderBottomWidth: p * 0.2, borderColor: "#E4E4E4" },
            v2_1: { width: (w - 2 * p) * 0.8, height: w * 0.12, padding: p, alignItems: 'flex-start' },
            v2_2: { width: (w - 2 * p) * 0.2, height: w * 0.12, padding: p, alignItems: 'flex-end' },
            text: { alignSelf: 'flex-start', paddingLeft: 2 * p, marginTop: 3 * p, marginBottom: 3 * p },
        });
    }

    constructor(props, context, ...args) {
        super(props, context, ...args);
        this.style = this.createStyleSheet(this.WHP);
        this.props.navigation.setOptions({
            headerShown: false,
        });
     
        this.currentUserData = SGHelperGlobalVar.getVar('GlobalCurrentUserData');
        this.imageSetting = SGHelperGlobalVar.getVar('GlobalImageSetting');
        this.userDataModel = new tbUserData(this.currentUserData);
        this.selectedIndex = this.currentUserData.fImageSetting;
        this.data = tbLookupDAO.getActiveLookUpByGroup('ImageSetting');
        this.sortData = [];
        this._sortData();

    }

    _pushSortingData(key){
        for(var i=0;i<this.data.length;i++){
            if(this.data[i].fLookUpKey ===key){
                this.sortData.push(this.data[i]);
                break;
            }
        }
    }

    _sortData(){
        this._pushSortingData('Low')
        this._pushSortingData('Med')
        this._pushSortingData('High')
    }

    async componentDidMount() {
        await this._refreshData();
        this._unsubscribe = this.props.navigation.addListener('focus', async () => {
            await this._refreshData();
        });
    }

    _componentWillUnmount() {
        if (this._unsubscribe) { this._unsubscribe(); }
    }

    async _refreshData() {
            this.baseRunSingleAPIWithRedoOption('getUserByID', (async (v1) => { return tbVUserAPI.getUserByID(v1) }).bind(this, this.currentUserData.fID), (async (v) => {           
                var newCurrentUserData = v //await tbVUserAPI.getUserByID(this.currentUserData.fID);
                SGHelperGlobalVar.addVar('GlobalCurrentUserData', newCurrentUserData);
                this.currentUserData = SGHelperGlobalVar.getVar('GlobalCurrentUserData');
                this.selectedIndex = this.currentUserData.fImageSetting;
                // melakukan update ke tabel data setting di realm
                this.userDataSetting = await tbSystemParamsDAO.getUserDataSetting();
                await tbSystemParamsDAO.updateUserDataSetting(this.userDataSetting, this.currentUserData)
                this.userDataSetting = await tbSystemParamsDAO.getUserDataSetting();
                SGHelperGlobalVar.addVar('GlobalImageSetting', newCurrentUserData.fImageSetting);
                this.userDataModel = new tbUserData(this.currentUserData);
                this.forceUpdate();
            }).bind(this), null, SGHelperGlobalVar.getVar("ResponTimes"));
    }

    async _SaveButton() {
        try {
            this.userDataModel.fImageSetting = this.selectedIndex;
            var res = await VUserSettingsAPI.updateUserData(this.userDataModel.getCurrentJSON());
            if (res === true) {
                DialogBox.showSuccess(null, SGLocalize.translate('UserProfileScreen.alertChangeProfileImageSettingSuccessTitle'), SGLocalize.translate('UserProfileScreen.alertChangeProfileImageSettingSuccessText'), SGLocalize.translate('globalText.ok'))
                this.forceUpdate()
            }
            else {
                DialogBox.showFail(null, SGLocalize.translate('UserProfileScreen.alertChangeProfileImageSettingFailTitle'), SGLocalize.translate('UserProfileScreen.alertChangeProfileImageSettingFailText'))
            }
        } catch (error) {
            SGHelperErrorHandling.Handling(error,this._SaveButton.bind(this))
        }

    }

    _setSelectedIndex(v) {
        this.selectedIndex = v
    }

    render() {
        var { w, h, p } = this.WHP;
        var style = this.style;
        
        return (
            <RootView dummyStatusBar accessible={true} accessibilityLabel={'ChooseImageSettingProfileScreenRootView'} style={style.v1}>
                <CustomMenuBar btnBack accessible={true} accessibilityLabel={'HomeScreenHeader'} currentUser={this.currentUser} navigator={this.props.navigation} imageSetting={this.imageSetting} style={style.throwWHP}></CustomMenuBar>
                {
                    this.sortData.map((x) => {
                        return (
                            <TouchableOpacity key={SGHelperType.getGUID()} onPress={() => { this._setSelectedIndex(x.fValueKey); this.forceUpdate() }}>
                                <View accessible={true} accessibilityLabel={'ChooseImageSettingProfileScreenContainerView'} style={style.v2}>
                                    <View accessible={true} accessibilityLabel={'ChooseImageSettingProfileScreenTextView'} style={style.v2_1}>
                                        <Text accessible={true} accessibilityLabel={'ChooseImageSettingProfileScreenImageSettingText'} preset={Text.preset.titleH2}>{x.fLanguage[this._language.toLowerCase()]}</Text>
                                    </View>
                                    {this.selectedIndex === x.fValueKey ? (
                                        <View accessible={true} accessibilityLabel={'ChooseImageSettingProfileScreenIconView'} style={style.v2_2}>
                                            <Icon accessible={true} accessibilityLabel={'ChooseImageSettingProfileScreenCheckIcon'} name={Icon.Icon.check} preset={Icon.preset.h5}></Icon>
                                        </View>) : null}
                                </View>
                            </TouchableOpacity>
                        )
                    })
                }
                <FormButton accessible={true} accessibilityLabel={'ChooseImageSettingProfileScreenSaveButton'} onPress={() => { this._SaveButton() }} label={SGLocalize.translate("UserProfileScreen.ButtonText")}></FormButton>
            </RootView>

        );
    }
}