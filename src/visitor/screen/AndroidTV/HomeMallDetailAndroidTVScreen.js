/*
 * Version 1.4.11
 * Yohanes, 5 Jan 2021
 * 1. new Screen
*/
import React from 'react';
import { StyleSheet } from 'react-native';
import { SGView as View, SGRootView, SGActivityIndicator ,SGViewPager as ViewPager,SGText as Text} from '../../../core/control';
import { SGBaseScreen } from '../../../core/screen/SGBaseScreen';
import { SGLocalize } from '../../locales/SGLocalize';
import { SGHelperGlobalVar,  SGHelperType ,SGHelperNavigation} from '../../../core/helper';
import {VMallHomeAPI} from '../../api/VMallHomeAPI'  
import { TVEventHandler } from 'react-native';
import { MallHeaderAndroidTV } from '../../container_V2/MallHeaderAndroidTV';
import { PlaceEventSliderAndroidTV } from '../../container_V2/PlaceEventSliderAndroidTV';
import {MallFooterAndroidTV} from '../../container_V2/MallFooterAndroidTV'
import { StoreEventSliderAndroidTV } from '../../container_V2/StoreEventSliderAndroidTV';
import { RestoEventSliderAndroidTV } from '../../container_V2/RestoEventSliderAndroidTV';
import { HashTagStoreRestoEventSlider } from '../../container_V2/HashTagStoreRestoEventSlider';
export class HomeMallDetailAndroidTVScreen extends SGBaseScreen {
 
    createStyleSheet = (whp) => {
        var { w, h, p } = whp;
        return StyleSheet.create({
            to: { width:w*0.75,height:h*0.065,backgroundColor:'rgb(38,38,38)',justifyContent:'center',alignItems:'center',marginVertical:2*p,borderRadius:4*p },
            throwWHP:{width:w,height:h,padding:p},
            throwWHP2:{width:w/2,height:h/2,padding:p/2}

        });
    }
    getPagingData(){
        var itemPerPage = SGHelperType.getPaging()
        return {paging:false,offset:this.pagingCounter, totalPerPage:itemPerPage}
    }

    async componentDidMount() {
        await this._onRefreshAllItem();
        setTimeout(() => {
            SGHelperNavigation.navigate(this.props.navigation,"ParkingDetailAndroidTV",{fBuildingKey:this.props.route.params.fBuildingKey,fParkingLayoutKey:this.props.route.params.fParkingLayoutKey})
        }, 60000);
        this.interval= setInterval(async() => {

        // console.log(SGHelperNavigation.getRoutes(this.props.navigation))
            console.log("RefreshMallDetail every "+ SGHelperType.getSysParamsValueToInt('ParkingDetailAndroidTVScreen1')/1000 +" seconds")
            await this._onRefreshAllItem();
       }, SGHelperType.getSysParamsValueToInt('HomeMallDetailAndroidTVScreen1'));
       this._unsubscribe = this.props.navigation.addListener('focus', async () => {

        // console.log(SGHelperNavigation.getRoutes(this.props.navigation))
            setTimeout(() => {
                SGHelperNavigation.navigate(this.props.navigation,"ParkingDetailAndroidTV",{fBuildingKey:this.props.route.params.fBuildingKey,fParkingLayoutKey:this.props.route.params.fParkingLayoutKey})
            }, 60000);
        });
    }
    componentWillUnmount() {
        if (this._unsubscribe) { this._unsubscribe(); }
        clearInterval(this.interval);
       
    }
    checkAPIBatchStatusAllDone(){
        this.alreadyMount=true
        this.timeUpdate = new Date()
        this.forceUpdate()
    }
    async _onRefreshAllItem() {

        this.currentUser = SGHelperGlobalVar.getVar('GlobalCurrentUser');
        this.currentUserData = SGHelperGlobalVar.getVar('GlobalCurrentUserData');
        this.imageSetting = SGHelperGlobalVar.getVar('GlobalImageSetting');
        this.currentUserImage = SGHelperGlobalVar.getVar('GlobalCurrentUserImage');
        this.pagingCounter=0
        this.baseInitAPIParallel( SGHelperGlobalVar.getVar("ResponTimes"), (() => { this.checkAPIBatchStatusAllDone(); }).bind(this),null,false,true);
        this.baseAddAPIParallel('getBuildingContent', (async (v1) => { return VMallHomeAPI.getBuildingContent(v1) }).bind(this, this.props.route.params.fBuildingKey), ((v) => {
            this._data = v;
        }).bind(this), null, null);
        this.baseAddAPIParallel('getBuildingHomeHeader', (async (v1) => { return VMallHomeAPI.getBuildingHomeHeader(v1) }).bind(this, this.props.route.params.fBuildingKey), ((v) => {
            this.mallHeaderData=v
        }).bind(this), null,null);
        this.baseAddAPIParallel('getBuildingEventSlider', (async (v1) => { return VMallHomeAPI.getBuildingEventSlider(v1) }).bind(this,this.props.route.params.fBuildingKey), ((v) => {
            this.placeEventData = v;
           
        }).bind(this), null,null);
        this.baseAddAPIParallel('getBuildingStorePromoSlider', (async (v1) => { return VMallHomeAPI.getBuildingStorePromoSlider(v1) }).bind(this,  this.props.route.params.fBuildingKey), ((v) => {
            this.storePromoData = v;
        
        }).bind(this), null,null);
        this.baseAddAPIParallel('getBuildingRestoPromoSlider', (async (v1) => { return VMallHomeAPI.getBuildingRestoPromoSlider(v1) }).bind(this, this.props.route.params.fBuildingKey), ((v) => {
            this.restoPromoData = v;
        }).bind(this), null, null);
        this.baseAddAPIParallel('getSalesPromo', (async (v1) => { return VMallHomeAPI.SearchBuildingHighlightSaleDiscount(v1) }).bind(this,  this.props.route.params.fBuildingKey), ((v) => {
            this.salesDiscountData = v;
            // console.log('sales')
            // console.log(v)
        }).bind(this), null,null);
        this.paging = this.getPagingData()
        this.baseAddAPIParallel('getHashTagPromo', (async (v1,v2,v3,v4,v5) => { return VMallHomeAPI.SearchBuildingHighlightSaleHashtag(v1,v2,v3,v4,v5) }).bind(this,  this.props.route.params.fBuildingKey,this._language,[],[],this.paging), ((v) => {
            this.hashTagData = v;
            // console.log('hashtag')
            // console.log(v)
        }).bind(this), null,null);

        this.baseRunAPIParallel(); 
    }

    constructor(props, context, ...args) {
        super(props, context, ...args);
        this.style = this.createStyleSheet(this._whpNoHeader);
      
        this.props.navigation.setOptions({
            headerShown: false,
        });
        this.currentUser = SGHelperGlobalVar.getVar('GlobalCurrentUser');
        this.currentUserData = SGHelperGlobalVar.getVar('GlobalCurrentUserData');
        this.currentUserCurrency = SGHelperGlobalVar.getVar('GlobalCurrency');
        this.imageSetting = SGHelperGlobalVar.getVar('GlobalImageSetting');
        this.currentUserImage = SGHelperGlobalVar.getVar('GlobalCurrentUserImage');
        this.alreadyMount = false;
        this.parkingList=[]
        this.arrFilter=[]
        this.arrSort=[
            { name: 'fBuildingName'+ this._language.toUpperCase(), descending: false, selected: true },
        ]
        this.state={refresh:true,buttonList:[]}
        this.flatlistRef= React.createRef();
        this._parkingHighlightData=[]
        this.text="Temukan informasi Event Mal dan beragam  promo di Aplikasi MAG"
        this.currency = SGHelperGlobalVar.getVar('GlobalCurrency');
        // console.log('HOMEMALLDETAIl')
    }


    render() {
        var { w, h, p } = this.WHP;
        var style = this.style;
        var data = this._data
        var language = this._language
        var imageSetting = this.imageSetting
        var fBuildingKey = this.props.route.params.fBuildingKey
       
        return (
            <SGRootView   accessible={true} accessibilityLabel={'RestoMenuDetailScreenRootView'} style={{flex:1}}>
               {
                   this.alreadyMount &&
                   <View>
                        <MallHeaderAndroidTV data={data['fContent'+this._language.toUpperCase()] } imageSetting={this.imageSetting} language={this._language}></MallHeaderAndroidTV>
                        <PlaceEventSliderAndroidTV  borderBottom accessible={true} accessibilityLabel={'TabHighlightsMallPlaceEventSlider'} language={language} imageSetting={imageSetting} data={this.placeEventData} titleHeading={SGLocalize.translate("mallHomeScreen.PlaceEventSliderTitle") } mallName={data['fContent'+ this._language.toUpperCase()].fBuildingName} style={style.throwWHP}></PlaceEventSliderAndroidTV>
                        <View style={{flexDirection:'row',alignItems:'space-around',justifyContent:'space-around',width:w}}>
                            <View style={{transform:[{scale:0.975}]}}> 
                                <StoreEventSliderAndroidTV  titleBar borderBottom accessible={true} accessibilityLabel={'TabHighlightsMallStoreSlider'} language={language} imageSetting={imageSetting} data={this.storePromoData} title={SGLocalize.translate("HomeScreen.WhatsHappeningStoreTitle")} style={style.throwWHP}></StoreEventSliderAndroidTV>                     
                                <HashTagStoreRestoEventSlider imageSetting={imageSetting} language={language} currency={this.currency} contentKey={fBuildingKey} seeMoreLabel={SGLocalize.translate("HomeScreen.SeeMore")} data={this.hashTagData} style={style.throwWHP2} type={2} hashTag={this.mallHeaderData.fHashTagSale}></HashTagStoreRestoEventSlider>
                            </View>
                            <View style={{transform:[{scale:0.975}]}}> 
                                <RestoEventSliderAndroidTV  marginText borderBottom accessible={true} accessibilityLabel={'TabHighlightsMallRestoPromoSlider'} language={language} imageSetting={imageSetting} data={this.restoPromoData} title={SGLocalize.translate("HomeScreen.WhatsHappeningRestoTitle")} style={style.throwWHP}></RestoEventSliderAndroidTV>
                                <HashTagStoreRestoEventSlider imageSetting={imageSetting} language={language} currency={this.currency} contentKey={fBuildingKey} seeMoreLabel={SGLocalize.translate("HomeScreen.SeeMore")} data={this.salesDiscountData} style={style.throwWHP2} type={1} hashTag={this.mallHeaderData.fHashTagSale}></HashTagStoreRestoEventSlider>
                            </View>
                        </View>
                        
                        <MallFooterAndroidTV text={this.text} fBuildingName={this._data['fContent'+this._language.toUpperCase()].fBuildingName} style={{width:w,height:h,padding:p}} language={this._language} lastUpdated={this.timeUpdate}></MallFooterAndroidTV>
                    </View>
               }
               {
                   !this.alreadyMount &&
                   <SGActivityIndicator style={{flex:1}} preset={SGActivityIndicator.preset.h1}></SGActivityIndicator>
               }
            </SGRootView>
        );
    }
}