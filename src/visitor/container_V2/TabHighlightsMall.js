import React from 'react';
import { SGBaseContainer } from '../../core/container/SGBaseContainer';
import { SGView as View } from '../../core/control/SGView';
import { StyleSheet } from 'react-native';
import { ParkingHighlight } from './ParkingHighlight';
import { HighlightSummary } from './HighlightSummary';
import { PlaceEventSlider } from './PlaceEventSlider';
import HomeMall from '../../plugin/HomeMall';
import { AuctionSlider } from './AuctionSlider';
import { StorePromoSlider } from './StorePromoSlider';
import { RestoPromoSlider } from './RestoPromoSlider';
import { InstagramSpotSlider } from './InstagramSpotSlider';
import { UniqueExperienceSlider } from './UniqueExperienceSlider';
import { ProductStoreRestoMix } from './ProductStoreRestoMix';
import { StoreSlider } from './StoreSlider';
import { RestoSlider } from './RestoSlider';
import { SGLocalize } from '../locales/SGLocalize';
import { SGHelperType, SGHelperWindow,SGHelperGlobalVar } from '../../core/helper';

export class TabHighlightsMall extends SGBaseContainer {
    createStyleSheet = (whp) => {
        var { w, h, p } = whp;
        return StyleSheet.create({
            mainView1: { width: w },
            containerView1: { alignItems: 'flex-start', justifyContent: 'flex-start', width: w, padding: p },
            throwWHP: { width: w, height: h, padding: p }
        });
    }

    constructor(props, context, ...args) {
        super(props, context, ...args);
        this.whp = { w: props.style.width, h: props.style.height, p: props.style.padding }
        this.style = this.createStyleSheet(this.whp);
        this.title = props.title;
        this.image = props.image;
        this.parkingHighlightRef = React.createRef();
        this.placeEventSliderRef = React.createRef();
        this.loyaltySliderRef = React.createRef();
        this.auctionSliderRef = React.createRef();
        this.storeEventSliderRef = React.createRef();
        this.restoEventSliderRef = React.createRef();
        this.mostLikeStoreRef = React.createRef();
        this.mostLikeRestoRef = React.createRef();
        this.highlightSummaryRef = React.createRef();
        this.instagramSpotRef = React.createRef();
        this.uniqueExperienceRef = React.createRef();
        this.currency = SGHelperGlobalVar.getVar('GlobalCurrency');
        this.anonymousMode = SGHelperGlobalVar.getVar('GlobalAnonymous');
        console.log(this.props.loyaltyData)
        console.log('slider loyalty')
    }

    refreshHighlightSummary() {
        try {
            if (SGHelperType.isDefined(this.highlightSummaryRef.current)) {
                this.highlightSummaryRef.current.forceUpdate();
            }
        } catch (e) { }
    }
    refreshInstagramSpot() {
        try {
            if (SGHelperType.isDefined(this.instagramSpotRef.current)) {
                this.instagramSpotRef.current.forceUpdate();
            }
        } catch (e) { }
    }
    refreshUniqueExperience() {
        try {
            if (SGHelperType.isDefined(this.uniqueExperienceRef.current)) {
                this.uniqueExperienceRef.current.forceUpdate();
            }
        } catch (e) { }
    }
    refreshParkingHighlight() {
        try {
            if (SGHelperType.isDefined(this.parkingHighlightRef.current)) {
                this.parkingHighlightRef.current.forceUpdate();
                console.log('refreshParkingHighlight');
            }
        } catch (e) { }
    }

    refreshPlaceEvent() {
        try {
            if (SGHelperType.isDefined(this.placeEventSliderRef.current)) {
                this.placeEventSliderRef.current.forceUpdate();
                console.log('refreshPlaceEvent');
            }
        } catch (e) { }
    }

    refreshLoyalty() {
        try {
            if (SGHelperType.isDefined(this.loyaltySliderRef.current)) {
                this.loyaltySliderRef.current.forceUpdate();
                console.log('refreshLoyalty');
            }
        } catch (e) { }
    }

    refreshAuction() {
        try {
            if (SGHelperType.isDefined(this.auctionSliderRef.current)) {
                this.auctionSliderRef.current.forceUpdate();
                console.log('refreshAuction');
            }
        } catch (e) { }
    }

    refreshStoreEvent() {
        try {
            if (SGHelperType.isDefined(this.storeEventSliderRef.current)) {
                this.storeEventSliderRef.current.forceUpdate();
                console.log('refreshStoreEvent');
            }
        } catch (e) { }
    }

    refreshRestoEvent() {
        try {
            if (SGHelperType.isDefined(this.restoEventSliderRef.current)) {
                this.restoEventSliderRef.current.forceUpdate();
                console.log('refreshRestoEvent');
            }
        } catch (e) { }
    }

    refreshMostLikeStore() {
        try {
            if (SGHelperType.isDefined(this.mostLikeStoreRef.current)) {
                this.mostLikeStoreRef.current.forceUpdate();
                console.log('refreshMostLikeStore');
            }
        } catch (e) { }
    }

    refreshMostLikeResto() {
        try {
            if (SGHelperType.isDefined(this.mostLikeRestoRef.current)) {
                this.mostLikeRestoRef.current.forceUpdate();
                console.log('refreshMostLikeResto');
            }
        } catch (e) { }
    }

    render() {
        var { w, h, p } = this.whp;
        var style = this.style;
        return (
            <View accessible={true} accessibilityLabel={'TabHighlightsMallRootView'} style={style.mainView1}>
                <ParkingHighlight ref={this.parkingHighlightRef} accessible={true} accessibilityLabel={'TabHighlightsMallParkingHighlight'} contentKey={this.props.contentKey} openExternalApp={this.props.openExternalApp} language={this.props.language} imageSetting={this.props.imageSetting} parkingHighlightData={this.props.parkingHighlightData} navigator={this.props.navigator} linkData={this.props.linkData.data} lastUpdated={this.props.lastUpdated} style={style.containerView1}></ParkingHighlight>
                {
                    this.props.mallSummaryData.length !== 0 ?
                        (<HighlightSummary ref={this.highlightSummaryRef} accessible={true} accessibilityLabel={'TabHighlightsMallHighlightSummary'} borderBottom imageSetting={this.props.imageSetting} mallSummaryData={this.props.mallSummaryData} style={style.containerView1}></HighlightSummary>)
                        :
                        (null)
                }

                { 
                    this.props.loyaltyData.data.length !== 0 ?
                        (<HomeMall ref={this.loyaltySliderRef} twoLine marginText borderBottom accessible={true} accessibilityLabel={'TabHighlightsMallLoyaltySlider'} contentData={this.props.contentData} contentKey={this.props.contentKey} language={this.props.language} imageSetting={this.props.imageSetting} seeMoreScreen='SeeMorePlaceLoyalty' seeMoreLabel={SGLocalize.translate("globalText.seeMoreText")} screen='LoyaltyDetail' navigator={this.props.navigator} data={this.props.loyaltyData.data} titleHeading={SGLocalize.translate("mallHomeScreen.LoyaltySliderTitle") + ' ' + this.props.mallName} style={style.throwWHP} buildingName={this.props.mallName}></HomeMall>)
                        :
                        (null)
                }

                {
                    this.props.placeEventData.data.length !== 0 ?
                        (<PlaceEventSlider befSeeMoreScreen={'MallHighlight'} ref={this.placeEventSliderRef} twoLine borderBottom accessible={true} accessibilityLabel={'TabHighlightsMallPlaceEventSlider'} contentData={this.props.contentData} contentKey={this.props.contentKey} language={this.props.language} imageSetting={this.props.imageSetting} seeMoreScreen='SeeMorePlaceEvent' seeMoreLabel={SGLocalize.translate("globalText.seeMoreText")} screen='PlaceEventDetail' navigator={this.props.navigator} data={this.props.placeEventData.data} titleHeading={SGLocalize.translate("mallHomeScreen.PlaceEventSliderTitle") + ' ' + this.props.mallName} style={style.throwWHP}></PlaceEventSlider>)
                        :
                        (null)
                }

                {
                    this.props.hashTagData.data.length !== 0 ?
                        ( <ProductStoreRestoMix navigator={this.props.navigator} imageSetting={this.props.imageSetting} language={this.props.language} currency={this.currency} contentKey={this.props.contentKey} seeMoreLabel={SGLocalize.translate("HomeScreen.SeeMore")} data={this.props.hashTagData.data} style={style.throwWHP} type={2} hashTag={this.props.hashTag}></ProductStoreRestoMix>)
                        :
                        (null)
                }
                
                {   
                    this.props.auctionData.data.length !== 0 ?
                        (<AuctionSlider ref={this.auctionSliderRef} twoLine marginText borderBottom accessible={true} accessibilityLabel={'TabHighlightsMallAuctionSlider'} contentData={this.props.contentData} contentKey={this.props.contentKey} language={this.props.language} imageSetting={this.props.imageSetting} seeMoreScreen='SeeMorePlaceAuction' seeMoreLabel={SGLocalize.translate("globalText.seeMoreText")} screen='AuctionDetail' navigator={this.props.navigator} data={this.props.auctionData.data} titleHeading={SGLocalize.translate("mallHomeScreen.AuctionSliderTitle") + ' ' + this.props.mallName} style={style.throwWHP}></AuctionSlider>)
                        :
                        (null)
                }

                {
                    this.props.storePromoData.data.length !== 0 ?
                        (<StorePromoSlider befSeeMoreScreen={'MallHighlight'} ref={this.storeEventSliderRef} twoLine marginText borderBottom accessible={true} accessibilityLabel={'TabHighlightsMallStorePromoSlider'} contentData={this.props.contentData} contentKey={this.props.contentKey} language={this.props.language} imageSetting={this.props.imageSetting} seeMoreScreen='SeeMorePlaceStorePromo' seeMoreLabel={SGLocalize.translate("globalText.seeMoreText")} screen='StorePromoDetail' navigator={this.props.navigator} data={this.props.storePromoData.data} titleHeading={SGLocalize.translate("mallHomeScreen.StorePromoSliderTitle") + ' ' + this.props.mallName} style={style.throwWHP}></StorePromoSlider>)
                        :
                        (null)
                }
                {
                    this.props.restoPromoData.data.length !== 0 ?
                        (<RestoPromoSlider befSeeMoreScreen={'MallHighlight'} ref={this.restoEventSliderRef} twoLine marginText borderBottom accessible={true} accessibilityLabel={'TabHighlightsMallRestoPromoSlider'} contentData={this.props.contentData} contentKey={this.props.contentKey} language={this.props.language} imageSetting={this.props.imageSetting} seeMoreScreen='SeeMorePlaceRestoPromo' seeMoreLabel={SGLocalize.translate("globalText.seeMoreText")} screen='RestoPromoDetail' navigator={this.props.navigator} data={this.props.restoPromoData.data} titleHeading={SGLocalize.translate("mallHomeScreen.RestoPromoSliderTitle") + ' ' + this.props.mallName} style={style.throwWHP}></RestoPromoSlider>)
                        :
                        (null)
                }
                {
                    this.props.mostLikedStoreData.data.length !== 0 ?
                        (<StoreSlider ref={this.mostLikeStoreRef} titleBar borderBottom accessible={true} accessibilityLabel={'TabHighlightsMallStoreSlider'} contentData={this.props.contentData} contentKey={this.props.contentKey} language={this.props.language} imageSetting={this.props.imageSetting} seeMoreScreen='SeeMoreMostLikedStore' seeMoreLabel={SGLocalize.translate("HomeScreen.SeeMore")} screen='StoreHome' navigator={this.props.navigator} data={this.props.mostLikedStoreData.data} title={SGLocalize.translate("mallHomeScreen.MostLikedStoreSliderTitle")} style={style.throwWHP}></StoreSlider>)
                        :
                        (null)
                }
                {
                    this.props.mostLikedRestoData.data.length !== 0 ?
                        (<RestoSlider ref={this.mostLikeRestoRef} titleBar borderBottom accessible={true} accessibilityLabel={'TabHighlightsMallRestoSlider'} contentData={this.props.contentData} contentKey={this.props.contentKey} language={this.props.language} imageSetting={this.props.imageSetting} seeMoreScreen='SeeMoreMostLikedResto' seeMoreLabel={SGLocalize.translate("HomeScreen.SeeMore")} screen='RestoHome' navigator={this.props.navigator} data={this.props.mostLikedRestoData.data} title={SGLocalize.translate("mallHomeScreen.MostLikedRestoSliderTitle")} style={style.throwWHP}></RestoSlider>)
                        :
                        (null)
                }

                {
                    this.props.salesDiscountData.data.length !== 0 ?
                        ( <ProductStoreRestoMix navigator={this.props.navigator} imageSetting={this.props.imageSetting} language={this.props.language} currency={this.currency} contentKey={this.props.contentKey} seeMoreLabel={SGLocalize.translate("HomeScreen.SeeMore")} data={this.props.salesDiscountData.data} style={style.throwWHP} type={1}></ProductStoreRestoMix>)
                        :
                        (null)
                }
                
        
                {
                    this.props.instagramSpotData.length !== 0 ?
                        (<InstagramSpotSlider ref={this.instagramSpotRef} borderBottom accessible={true} accessibilityLabel={'TabHighlightsMallInstagramSpotSlider'} imageSetting={this.props.imageSetting} seeMoreScreen='' seeMoreLabel={SGLocalize.translate("globalText.seeMoreText")} screen='FacilityDetail' navigator={this.props.navigator} data={this.props.instagramSpotData} titleHeading={SGLocalize.translate("mallHomeScreen.InstagramSpotSliderTitle") + ' ' + this.props.mallName} style={style.throwWHP}></InstagramSpotSlider>)
                        :
                        (null)
                }
                {
                    this.props.uniqueExperienceData.length !== 0 ?
                        (<UniqueExperienceSlider ref={this.uniqueExperienceRef} borderBottom accessible={true} accessibilityLabel={'TabHighlightsMallUniqueExperienceSlider'} imageSetting={this.props.imageSetting} seeMoreScreen='' seeMoreLabel={SGLocalize.translate("globalText.seeMoreText")} screen='FacilityDetail' navigator={this.props.navigator} data={this.props.uniqueExperienceData} titleHeading={SGLocalize.translate("mallHomeScreen.UniqueExperienceSliderTitle") + ' ' + this.props.mallName} style={style.throwWHP}></UniqueExperienceSlider>)
                        :
                        (null)
                }
                <View style={{ height: SGHelperWindow.getStatusBarHeight() + 3 * p, backgroundColor: 'white', width: '100%' }}></View>
            </View>
        );
    }
}
