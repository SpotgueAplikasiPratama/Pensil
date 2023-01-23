
/**
 * Version 1.2.0
 * 1. Yohanes 01 April 2021
 * - add ErrorHandling
 */
import React from 'react';
import { StyleSheet, Alert } from 'react-native';
import { SGView as View, SGDialogBox as DialogBox, SGRootView as RootView, SGText as Text, SGIcon as Icon, SGScrollView as ScrollView, SGButton as Button, SGTextInput as TextInput, SGDialogBox } from '../../../core/control';
import { BottomNavigationContainer } from '../../component_V2/BottomNavigationContainer';
import { CommentPopup } from '../../container_V2/CommentPopup';
import { SGLocalize } from '../../locales/SGLocalize';
import { SGHelperNavigation, SGHelperGlobalVar, SGHelperType, SGHelperErrorHandling } from '../../../core/helper';
import { SGPopView } from '../../../core/control/SGPopView';
import { SGBaseScreen } from '../../../core/screen/SGBaseScreen';
import { InputOrderDataForm } from '../../form_V2/InputOrderDataForm';
import { tbOrderTableDAO, tbOrderTableData } from '../../db/tbOrderTableDAO';
import { SGFormButton } from '../../../core/form';
import { tbVOrderMenuAPI } from '../../api/tbVOrderMenuAPI';
import { CustomMenuBar } from '../../component_V2/CustomMenuBar';

export class InputDataOrderMenuScreen extends SGBaseScreen {


    createStyleSheet = (whp) => {
        var { w, h, p } = whp;

        return StyleSheet.create({
            mainView1: { width: w, height: h, backgroundColor: 'white' },
            tabBarTextStyle: { color: '#c49848' },
            tabBarStyle: { borderColor: '#c49848', backgroundColor: '#191919', borderBottomWidth: 0.3 },
            throwWHP: { width: w, height: h, padding: p },
            text1: { color: "#181818", marginTop: 2 * p },
            containerView1: { width: w, padding: p, backgroundColor: 'white' },
            containerView2: { width: w, height: h, padding: p },
            button: { marginVertical: 2 * p, backgroundColor: '#DE220F', borderRadius: 8 * p, width: w * 0.4, height: w * 0.115, alignItems: 'center', justifyContent: 'center' },
        });
    }

    constructor(props, context, ...args) {
        super(props, context, ...args);
        this.style = this.createStyleSheet(this.WHP);
       
        this.dataModel = new tbOrderTableData();
        this.restoKey = this.props.route.params.restoKey;
        this.dataTableQR = this.props.route.params.dataTableQR;
        this.dataModel.fTableKey = this.dataTableQR.fTableKey;
        this.dataModel.fTableNumber = this.dataTableQR.fTableNumber;
        this.dataModel.fStoreKey = this.dataTableQR.fStoreKey;
        this.currentUser = SGHelperGlobalVar.getVar('GlobalCurrentUser');
        this.currentUserData = SGHelperGlobalVar.getVar('GlobalCurrentUserData');
        this.imageSetting = SGHelperGlobalVar.getVar('GlobalImageSetting');
        this.currentUserImage = SGHelperGlobalVar.getVar('GlobalCurrentUserImage');
        this.currency = SGHelperGlobalVar.getVar('GlobalCurrency');
        this.props.navigation.setOptions({
            headerShown: false,
        });
    }

    async _onSubmitPress() {
        this.dataModel.fTableKey = this.dataTableQR.fTableKey;
        this.dataModel.fTableNumber = this.dataTableQR.fTableNumber;
        this.dataModel.fStoreKey = this.dataTableQR.fStoreKey;
        this.dbID2 = SGDialogBox.showLoading(SGLocalize.translate("AlertMessage.Processing"))
        try {
            await tbVOrderMenuAPI.addOrderTableVisitor(this.dataModel)
            this.baseRunSingleAPIWithRedoOption('searchTableDataWithKeyVisitor', (async (v1,v2) => { return tbVOrderMenuAPI.searchTableDataWithKeyVisitor(v1,v2) }).bind(this,this.dataModel.fTableKey, this.restoKey), ((v) => {
                this.dataTable =  v
                SGDialogBox.hideDialogBox(this.dbID2, true);
                SGHelperNavigation.navigatePopPush(this.props.navigation, 'OrderList', { fID: this.dataTable[0].fID, restoKey: this.restoKey })
            }).bind(this), (()=>{SGDialogBox.hideDialogBox(this.dbID2, true);}).bind(this),  SGHelperGlobalVar.getVar("ResponTimes"));
            
           
        } catch (error) {
            SGDialogBox.hideDialogBox(this.dbID2, true);
            SGHelperErrorHandling.Handling(error,this._onSubmitPress.bind(this))
        }
       


    }

    render() {
        var { w, h, p } = this.WHP;
        var style = this.style;
        return (

            <RootView dummyStatusBar accessible={true} accessibilityLabel={'InputDataOrderMenuScreenRootView'} style={style.mainView1}>
                <CustomMenuBar btnBack accessible={true} accessibilityLabel={'HomeScreenHeader'} currentUser={this.currentUser} navigator={this.props.navigation} imageSetting={this.imageSetting} style={style.throwWHP}></CustomMenuBar>
                <SGPopView accessible={true} accessibilityLabel={'InputDataOrderMenuScreenPopView'} vPos={'Top'} modal popViewID={this.pvID1}>
                    <CommentPopup accessible={true} accessibilityLabel={'InputDataOrderMenuScreenCommentPopup'} popViewID={this.pvID1} style={style.throwWHP}></CommentPopup>
                </SGPopView>
                <ScrollView accessible={true} accessibilityLabel={'InputDataOrderMenuScreenScrollView'} contentContainerStyle={{ justifyContent: 'flex-start', alignItems: 'center' }}>
                    <Text accessible={true} accessibilityLabel={'InputDataOrderMenuScreenText1'} preset={Text.preset.h5B} style={style.text1}>{SGLocalize.translate('inputDataOrderMenuScreen.text1')}</Text>
                    <Text accessible={true} accessibilityLabel={'InputDataOrderMenuScreenText2'} preset={Text.preset.h6B} style={style.text1}>{SGLocalize.translate('inputDataOrderMenuScreen.text2')}</Text>
                    <InputOrderDataForm accessible={true} accessibilityLabel={'InputDataOrderMenuScreenForm'} style={style.throwWHP} data={this.dataModel} userData={this.currentUserData} language={this._language} ></InputOrderDataForm>
                    <SGFormButton accessible={true} accessibilityLabel={'InputDataOrderMenuScreenFormButton'} shadow preset={SGFormButton.preset.default} data={this.dataModel} label={SGLocalize.translate('inputDataOrderMenuScreen.submitButton')} onPress={this._onSubmitPress.bind(this)} />
                </ScrollView>
                <BottomNavigationContainer accessible={true} accessibilityLabel={'InputDataOrderMenuScreenBottomNav'} blackTheme navigator={this.props.navigation} style={style.containerView2}></BottomNavigationContainer>
            </RootView>
        );
    }
}
