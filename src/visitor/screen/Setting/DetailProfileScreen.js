/**
 * 1. Yohanes 01 April 2021
 * - add ErrorHandling
 *  *  * 2. Leon 12 Apr 2021
 * - add ErrorHandling
 */
import React from 'react';
import { StyleSheet, Alert } from 'react-native';
import { SGBaseScreen } from '../../../core/screen/SGBaseScreen';
import { SGRootView as RootView, SGScrollView as ScrollView, SGView as View, SGDialogBox as DialogBox,SGActivityIndicator as ActivityIndicator } from '../../../core/control';
import { UserProfileForm } from '../../form_V2/UserProfileForm';
import { tbLookupDAO } from '../../db/tbLookupDAO';
import { SGHelperGlobalVar ,SGHelperErrorHandling} from '../../../core/helper';
import { SGLocalize } from '../../locales/SGLocalize';
import { tbUserData, tbUserDAO,tbUserDataProfileScreen } from '../../db/tbUserDAO';
import { SGFormButton as FormButton } from '../../../core/form/SGFormButton';
import { VUserSettingsAPI } from '../../api/VUserSettingsAPI';
import { tbVUserAPI } from '../../api/tbVUserAPI';
import { tbSystemParamsDAO } from '../../db/tbSystemParamsDAO';
import { CustomMenuBar } from '../../component_V2/CustomMenuBar';
import { VFilterOptionsAPI } from '../../api/VFilterOptionsAPI';
import { tbCLocationMatrixAPI } from '../../api/tbCLocationMatrixAPI';
import { BottomNavigationContainer } from '../../component_V2/BottomNavigationContainer';

export class DetailProfileScreen extends SGBaseScreen {

    createStyleSheet = (whp) => {
        var { w, h, p } = whp;
        return StyleSheet.create({
            v1: { width: w, height: h, justifyContent: 'center', backgroundColor: 'white' },
            throwWHP: { width: w, padding: p},
        });
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

    constructor(props, context, ...args) {
        super(props, context, ...args);
        this.style = this.createStyleSheet(this.WHP);
        this.userData = SGHelperGlobalVar.getVar('GlobalCurrentUserData');
        this.imageSetting = SGHelperGlobalVar.getVar('GlobalImageSetting');
        this.userDataModel = new tbUserDataProfileScreen(this.userData);
        this.locationMatrix = [];
        this.props.navigation.setOptions({
            headerShown: false,
        });
        this.newCurrentUserData = '';
    }

    async checkAPIBatchStatusAllDone() {
   
        this.userDataSetting = await tbSystemParamsDAO.getUserDataSetting();
        await tbSystemParamsDAO.updateUserDataSetting(this.userDataSetting, this.newCurrentUserData);
        console.log('screen')
        console.log(this.newCurrentUserData);
        this.userDataModel = new tbUserDataProfileScreen(this.newCurrentUserData);
        // DialogBox.hideDialogBox(this.dbID2, true)
        this.forceUpdate();
    }

    async _refreshData() {
        // this.dbID2 = DialogBox.showLoading("Waiting")

        this.imageSetting = SGHelperGlobalVar.getVar('GlobalImageSetting');

        // this.status ={
        //     getUserData:false,
        //     getLocationMatrix:false
        // }

        this.baseInitAPIParallel(SGHelperGlobalVar.getVar("ResponTimes"), (() => { this.checkAPIBatchStatusAllDone(); }).bind(this));

        this.baseAddAPIParallel('getUserByID', (async (v1) => { return tbVUserAPI.getUserByID(v1); }).bind(this,this.userData.fID), ((v) => {
            this.newCurrentUserData = v;
            SGHelperGlobalVar.addVar('GlobalCurrentUserData', this.newCurrentUserData);
        }).bind(this),  null);

        this.baseAddAPIParallel('getLocationMatrix', (async (v1) => { return tbCLocationMatrixAPI.getLocationMatrix(v1); }).bind(this), ((v) => {
            this.locationMatrix = v;
        }).bind(this),  null);

        this.baseRunAPIParallel();

    }

    async _SaveButton() {
        try {
            var data = (this.userDataModel.getCurrentJSON());
            var res = await VUserSettingsAPI.updateUserData(data);
            if (res === true) {
                SGHelperGlobalVar.setVar('GlobalCurrentUserData',data)
                DialogBox.showSuccess(null, SGLocalize.translate('UserProfileScreen.AlertTitle'), SGLocalize.translate("UserProfileScreen.AlertText"), SGLocalize.translate('globalText.ok'), () => { }, true)
            }
            else {
                DialogBox.showFail(null, SGLocalize.translate('UserProfileScreen.AlertFailTitle'), SGLocalize.translate("UserProfileScreen.AlertFailText"), SGLocalize.translate('globalText.ok'), () => { }, true)
            }
        } catch (error) {
            SGHelperErrorHandling.Handling(error,this._SaveButton.bind(this))
        }


    }

    render() {
        var { w, h, p } = this.WHP;
        var style = this.style;
        return (
            <RootView dummyStatusBar accessible={true} accessibilityLabel={'DetailProfileScreenRootView'} style={style.v1}>
                <CustomMenuBar btnBack accessible={true} accessibilityLabel={'HomeScreenHeader'} currentUser={this.userData} navigator={this.props.navigation} imageSetting={this.imageSetting} style={style.throwWHP}></CustomMenuBar>
                <ScrollView accessible={true} accessibilityLabel={'DetailProfileScreenScrollView'} style={{ flex: 1}}>
                    {this.locationMatrix.length !== 0 ?
                        ((
                        <View style={{flex:1,width:w, marginBottom: 0.25*w}}>
                            <UserProfileForm accessible={true} accessibilityLabel={'DetailProfileScreenUProfForm'} style={style.throwWHP} userData={this.userDataModel} language={this._language} locationMatrix={this.locationMatrix}></UserProfileForm>
                            <FormButton data={this.userDataModel} accessible={true} accessibilityLabel={'DetailProfileScreenFormButton'} onPress={() => { this._SaveButton() }} label={SGLocalize.translate("UserProfileScreen.ButtonText")}></FormButton>
                        </View>
                        ))
                        :
                        (<ActivityIndicator preset={ActivityIndicator.preset.h1} style={{ width:w,height:h }}></ActivityIndicator>)}
                </ScrollView>
                
                <BottomNavigationContainer accessible={true} accessibilityLabel={'HomeScreenBottomNav'} currentUser={this.currentUser} navigator={this.props.navigation} style={style.throwWHP} screen={this.props.route.name} ></BottomNavigationContainer>
                
            </RootView>
        );
    }
}