/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
//improve transition speed
import { createStackNavigator, CardStyleInterpolators, } from "@react-navigation/stack";
import { SGHelperNavigation, SGHelperGlobalVar, SGHelperStringValidator, SGHelperRangeValidator, } from '../core/helper';
import React from "react";
import { AppRegistry, Platform } from "react-native";
import { FirstMeasureScreen } from "./screen/FirstMeasureScreen";
import { SplashScreen } from "./screen/LetsGetStarted/SplashScreen";
// ..

import { PluginScreen } from '../host/screen/PluginScreen';
import { SGLocalize } from './locales/SGLocalize';
import { name as appName } from "../../app.json";
import { SGBaseModel } from "../core/model/SGBaseModel";
import { HomeScreen } from "./screen/MainHome/HomeScreen";
import { DetailProfileScreen } from "./screen/Setting/DetailProfileScreen";
import { SignInScreen } from "./screen/SignIn/SignInScreen";
import { SplashScreenAndroidTV } from "./screen/AndroidTV/SplashScreenAndroidTV";
import { SignUpScreen } from "./screen/SignUp/SignUpScreen";
import { SignUpFormScreen } from "./screen/SignUp/SignUpFormScreen";
import { FirstVerifyOTPScreen } from "./screen/Setting/FirstVerifyOTPScreen";
import { ChooseVerifyOTPScreen } from "./screen/Setting/ChooseVerifyOTPScreen";
import { VerifyOldPasswordScreen } from "./screen/Setting/VerifyOldPasswordScreen";
import { VerifyOTPScreen } from "./screen/Setting/VerifyOTPScreen";
import { VerifyOTPSignUpScreen } from "./screen/SignUp/VerifyOTPSignUpScreen";
import { VerifyOTPForgotPasswordScreen } from "./screen/ForgotPassword/VerifyOTPForgotPasswordScreen";
import { ForgotPasswordSecurity1Screen } from "./screen/ForgotPassword/ForgotPasswordSecurity1Screen";
import { ForgotPasswordSecurity2Screen } from "./screen/ForgotPassword/ForgotPasswordSecurity2Screen";
import { ForgotPasswordChangePasswordScreen } from "./screen/ForgotPassword/ForgotPasswordChangePasswordScreen";
import { ChangePasswordProfileScreen } from "./screen/Setting/ChangePasswordProfileScreen";
import { ChangeEmailScreen } from "./screen/Setting/ChangeEmailScreen";
import { AddEmailScreen } from "./screen/Setting/AddEmailScreen";
import { ChangePhoneNumberScreen } from "./screen/Setting/ChangePhoneNumberScreen";
import { AddPhoneNumberScreen } from "./screen/Setting/AddPhoneNumberScreen";
import { ChangeSecurityQuestionScreen } from "./screen/Setting/ChangeSecurityQuestionScreen";
import { ChangeImageSettingScreen } from "./screen/Setting/ChangeImageSettingScreen";
import { ChangeCurrencyScreen } from "./screen/Setting/ChangeCurrencyScreen";
import { ChooseLanguageScreen } from "./screen/LetsGetStarted/ChooseLanguageScreen";
import { ChooseLanguageProfileScreen } from "./screen/Setting/ChooseLanguageProfileScreen";
import { TipsAndTrickScreen } from "./screen/Setting/TipsAndTrickScreen";
import { DetailTipsAndTrickScreen } from "./screen/Setting/DetailTipsAndTrickScreen";
import { HelpScreen } from "./screen/Setting/HelpScreen";
import { DetailHelpScreen } from "./screen/Setting/DetailHelpScreen";
import { PolicyScreen } from "./screen/Setting/PolicyScreen";
import { DetailPolicyScreen } from "./screen/Setting/DetailPolicyScreen";
import { LetsGetStartedScreen } from "./screen/LetsGetStarted/LetsGetStartedScreen";
import { SeeAllFavoritesPlaceScreen } from "./screen/MainHome/SeeAllFavoritesPlaceScreen";
import { SeeAllFavoritesPlaceEventScreen } from "./screen/MainHome/SeeAllFavoritesPlaceEventScreen";
import { SeeAllFavoritesStoreScreen } from "./screen/MainHome/SeeAllFavoritesStoreScreen";
import { SeeAllFavoritesStorePromoScreen } from "./screen/MainHome/SeeAllFavoritesStorePromoScreen";
import { SeeAllFavoritesRestoScreen } from "./screen/MainHome/SeeAllFavoritesRestoScreen";
import { SeeAllFavoritesRestoPromoScreen } from "./screen/MainHome/SeeAllFavoritesRestoPromoScreen";
import { SeeAllTrendingPlaceScreen } from "./screen/MainHome/SeeAllTrendingPlaceScreen";
import { SeeAllTrendingPlaceEventScreen } from "./screen/MainHome/SeeAllTrendingPlaceEventScreen";
import { SeeAllTrendingAuctionScreen } from "./screen/MainHome/SeeAllTrendingAuctionScreen";
import { SeeAllTrendingStoreScreen } from "./screen/MainHome/SeeAllTrendingStoreScreen";
import { SeeAllTrendingStorePromoScreen } from "./screen/MainHome/SeeAllTrendingStorePromoScreen";
import { SeeAllTrendingRestoScreen } from "./screen/MainHome/SeeAllTrendingRestoScreen";
import { SeeAllTrendingRestoPromoScreen } from "./screen/MainHome/SeeAllTrendingRestoPromoScreen";
import { SeeMoreMostLikedStoreScreen } from "./screen/Place/SeeMoreMostLikedStoreScreen";
import { SeeMoreMostLikedRestoScreen } from "./screen/Place/SeeMoreMostLikedRestoScreen";
import { SeeMorePlaceAuctionScreen } from "./screen/Place/SeeMorePlaceAuctionScreen";
import { SeeMorePlaceRestoPromoScreen } from "./screen/Place/SeeMorePlaceRestoPromoScreen";
import { SeeMorePlaceStorePromoScreen } from "./screen/Place/SeeMorePlaceStorePromoScreen";
import { SeeMoreStorePromoScreen } from "./screen/Store/SeeMoreStorePromoScreen";
import { SeeMoreRestoPromoScreen } from "./screen/Resto/SeeMoreRestoPromoScreen";
import { SeeMorePlaceEventScreen } from "./screen/Place/SeeMorePlaceEventScreen";
import { MallHomeScreen } from "./screen/Place/MallHomeScreen";
import { AddFavoritesScreen } from "./screen/MainHome/AddFavoritesScreen";
import { MyRewardsScreen } from "./screen/MyRewardsScreen/MyRewardsScreen";
import { RewardDetailScreen } from './screen/MyRewardsScreen/RewardDetailScreen';
import { StoreHomeScreen } from './screen/Store/StoreHomeScreen';
import { RestoHomeScreen } from './screen/Resto/RestoHomeScreen';
import { RestoMenuListScreen } from './screen/Resto/RestoMenuListScreen';
import { PlaceEventDetailScreen } from './screen/Place/PlaceEventDetailScreen';
import { AuctionDetailScreen } from "./screen/MainHome/AuctionDetailScreen";
import { StorePromoDetailScreen } from './screen/Store/StorePromoDetailScreen';
import { StoreProductListScreen } from './screen/Store/StoreProductListScreen';
import { StoreProductDetailScreen } from './screen/Store/StoreProductDetailScreen';
import { RestoMenuDetailScreen } from './screen/Resto/RestoMenuDetailScreen';
import { FacilityDetailScreen } from './screen/Place/FacilityDetailScreen';
import { MallProfileScreen } from './screen/Place/MallProfileScreen';
import { StoreRestoProductListScreen } from './screen/Place/StoreRestoProductListScreen';
import { StoreRestoHashTagProductListScreen } from './screen/Place/StoreRestoHashTagProductListScreen';
import { StoreProfileScreen } from './screen/Store/StoreProfileScreen';
import { RestoProfileScreen } from './screen/Resto/RestoProfileScreen';
import { RestoPromoDetailScreen } from './screen/Resto/RestoPromoDetailScreen';
import { OrderListScreen } from './screen/OrderMenu/OrderListScreen';
import { OrderMenuListScreen } from './screen/OrderMenu/OrderMenuListScreen';
import { AddChoosenOrderScreen } from './screen/OrderMenu/AddChoosenOrderMenu';
import { RequestBillScreen } from './screen/OrderMenu/RequestBillScreen';
import { RestoOrderMenuDetailScreen } from './screen/MyRestoBooking/RestoOrderMenuDetailScreen';
import { RestoWaitingListScreen } from './screen/WaitingList/RestoWaitingListScreen';
import { StoreWaitingListScreen } from './screen/WaitingList/StoreWaitingListScreen';
import { RestoReservationScreen } from './screen/Reservation/RestoReservationScreen';
import { StoreReservationScreen } from './screen/Reservation/StoreReservationScreen';
import { AddWaitingListScreen } from './screen/WaitingList/AddWaitingListScreen';
import { AddWaitingListStoreScreen } from './screen/WaitingList/AddWaitingListStoreScreen';
import { ViewWaitingListScreen } from './screen/WaitingList/ViewWaitingListScreen';
import { ViewWaitingListStoreScreen } from './screen/WaitingList/ViewWaitingListStoreScreen';
import { RestoReservationDetailScreen } from './screen/MyRestoBooking/RestoReservationDetailScreen';
import { StoreReservationDetailScreen } from './screen/MyRestoBooking/StoreReservationDetailScreen';
import { RestoWaitingListDetailScreen } from './screen/MyRestoBooking/RestoWaitingListDetailScreen';
import { StoreWaitingListDetailScreen } from './screen/MyRestoBooking/StoreWaitingListDetailScreen';
import { MyRestoBookingScreen } from "./screen/MyRestoBooking/MyRestoBookingScreen";
import { MyParkingSpotWithLayoutScreen } from "./screen/MyParking/MyParkingSpotWithLayoutScreen";
import { ProfileScreen } from "./screen/UserProfile/ProfileScreen";
import { ChooseSettingScreen } from "./screen/Setting/ChooseSettingScreen";
import { AskAliceScreen } from "./screen/AskAlice/AskAliceScreen";
import { AddLocationAskAliceScreen } from "./screen/AskAlice/AddLocationAskAliceScreen";
import { WhereToGoResultScreen } from "./screen/AskAlice/WhereToGoResultScreen";
import { InboxListScreen } from './screen/Inbox/InboxListScreen';
import { InboxDetailScreen } from './screen/Inbox/InboxDetailScreen';
import { WhatToEatResultScreen } from "./screen/AskAlice/WhatToEatResultScreen";
import { WhatToEatResultDetailScreen } from "./screen/AskAlice/WhatToEatResultDetailScreen";
import { ClothToBuyResultScreen } from "./screen/AskAlice/ClothToBuyResultScreen";
import { ClothToBuyResultDetailScreen } from "./screen/AskAlice/ClothToBuyResultDetailScreen";
import { WhatToGiftResultScreen } from "./screen/AskAlice/WhatToGiftResultScreen";
import { WhatToGiftResultDetailScreen } from "./screen/AskAlice/WhatToGiftResultDetailScreen";
import { FilterScreen } from './screen/Filter/FilterScreen';
import { ParkingLayoutFullScreen } from './screen/MyParking/ParkingLayoutFullScreen'
import { DemoVerificationScreen } from './screen/DemoVerificationScreen';
import { SearchStartScreen } from './screen/Search/SearchStartScreen';
import { SearchAllScreen } from './screen/Search/SearchAllScreen';
import { SearchResultPlaceScreen } from './screen/Search/SearchResultPlaceScreen';
import { SearchResultStoreScreen } from './screen/Search/SearchResultStoreScreen';
import { SearchResultRestoScreen } from './screen/Search/SearchResultRestoScreen';
import { SearchResultAuctionScreen } from "./screen/Search/SearchResultAuctionScreen";
import { SearchResultPlaceEventScreen } from './screen/Search/SearchResultPlaceEventScreen';
import { SearchResultStorePromoScreen } from './screen/Search/SearchResultStorePromoScreen';
import { SearchResultRestoPromoScreen } from './screen/Search/SearchResultRestoPromoScreen';
import { SearchResultStoreProductScreen } from './screen/Search/SearchResultStoreProductScreen';
import { SearchResultRestoMenuScreen } from './screen/Search/SearchResultRestoMenuScreen';
import { SearchResultFavoritePlaceScreen } from './screen/Search/SearchResultFavoritePlaceScreen';
import { SearchResultFavoriteStoreScreen } from './screen/Search/SearchResultFavoriteStoreScreen';
import { SearchResultFavoriteRestoScreen } from './screen/Search/SearchResultFavoriteRestoScreen';
import { SearchResultFavoritePlaceEventScreen } from './screen/Search/SearchResultFavoritePlaceEventScreen';
import { SearchResultFavoriteStorePromoScreen } from './screen/Search/SearchResultFavoriteStorePromoScreen';
import { SearchResultFavoriteRestoPromoScreen } from './screen/Search/SearchResultFavoriteRestoPromoScreen';
import { SearchInThisPlaceScreen } from './screen/Search/SearchInThisPlaceScreen';
import { SearchResultInThisPlacePlaceEventScreen } from './screen/Search/SearchResultInThisPlacePlaceEventScreen';
import { SearchResultInThisPlaceAuctionScreen } from "./screen/Search/SearchResultInThisPlaceAuctionScreen";
import { SearchResultInThisPlaceStorePromoScreen } from './screen/Search/SearchResultInThisPlaceStorePromoScreen';
import { SearchResultInThisPlaceRestoPromoScreen } from './screen/Search/SearchResultInThisPlaceRestoPromoScreen';
import { SearchResultInThisPlaceStoreScreen } from './screen/Search/SearchResultInThisPlaceStoreScreen';
import { SearchResultInThisPlaceRestoScreen } from './screen/Search/SearchResultInThisPlaceRestoScreen';
import { SearchResultInThisPlaceStoreProductScreen } from './screen/Search/SearchResultInThisPlaceStoreProductScreen';
import { SearchResultInThisPlaceRestoMenuScreen } from './screen/Search/SearchResultInThisPlaceRestoMenuScreen';
import { SearchInThisStoreScreen } from './screen/Search/SearchInThisStoreScreen';
import { SearchResultInThisStoreStorePromoScreen } from './screen/Search/SearchResultInThisStoreStorePromoScreen';
import { SearchResultInThisStoreStoreProductScreen } from './screen/Search/SearchResultInThisStoreStoreProductScreen';
import { SearchResultInThisRestoRestoPromoScreen } from './screen/Search/SearchResultInThisRestoRestoPromoScreen';
import { SearchResultInThisRestoRestoMenuScreen } from './screen/Search/SearchResultInThisRestoRestoMenuScreen';
import { SearchInThisRestoScreen } from './screen/Search/SearchInThisRestoScreen';
import { SearchResultGroupRestoScreen } from './screen/Search/SearchResultGroupRestoScreen';
import { SearchResultGroupStoreScreen } from './screen/Search/SearchResultGroupStoreScreen';
import { NotificationScreen } from './screen/Notification/NotificationScreen';
import { NotificationDetailScreen } from './screen/Notification/NotificationDetailScreen'
import { SortScreen } from './screen/Sort/SortScreen';
import { InputDataOrderMenuScreen } from './screen/OrderMenu/InputDataOrderMenuScreen';
import { PDFViewerScreen } from './screen/UtilityScreen/PDFViewerScreen';
// import { MyReferralScreen } from './screen/UserProfile/MyReferralScreen';
import {MyReferralInMyRewardScreen} from './screen/MyRewardsScreen/MyReferralInMyRewardScreen';
import { ReferralHistoryScreen } from './screen/UserProfile/ReferralHistoryScreen';
import { ReferralRewardDetailScreen } from './screen/UserProfile/ReferralRewardDetailScreen';
import {SponsorshipDetailScreen} from './screen/MainHome/SponsorshipDetailScreen';
import {SeeAllSponsorshipPromoScreen} from './screen/MainHome/SeeAllSponsorshipPromoScreen';
import { SearchResultSponsorPromoScreen } from "./screen/Search/SearchResultSponsorPromoScreen";
import {MyHealthScreen} from './screen/MainHome/MyHealthScreen';
import {SelectMallScreen} from './screen/AndroidTV/SelectMallScreen';
import { MMKVScreen } from "./screen/MMKVScreen";
import { SelectParkingScreen } from "./screen/AndroidTV/SelectParkingScreen";
import { ParkingDetailAndroidTVScreen } from "./screen/AndroidTV/ParkingDetailAndroidTVScreen";
import { HomeMallDetailAndroidTVScreen } from "./screen/AndroidTV/HomeMallDetailAndroidTVScreen";
import { SeeMoreRestoAuctionScreen } from "./screen/Resto/SeeMoreRestoAuctionScreen";
import { SeeMoreStoreAuctionScreen } from "./screen/Store/SeeMoreStoreAuctionScreen";
import {SearchResultInThisStoreAuctionScreen} from './screen/Search/SearchResultInThisStoreAuctionScreen';
import {SearchResultInThisRestoAuctionScreen} from './screen/Search/SearchResultInThisRestoAuctionScreen';
import TestSimpleAPIScreen from "../plugin/plugin1/screen/TestSimpleAPIScreen";
import {QuizScreen} from '../visitor/screen/MainHome/QuizScreen';
import {QuizBuildingScreen} from '../visitor/screen/MainHome/QuizBuildingScreen';
import SpotgueAppMyCardList from '../plugin/SpotgueAppMyCardList';
import CardDetail from '../plugin/CardDetail'
import { LoyaltyRewardDetailScreen } from "./screen/UserProfile/LoyaltyRewardDetailScreen";
import PointHistory from "../plugin/PointHistory";
import EarnPoint from "../plugin/EarnPoint";
import HomeMallDetail from "../plugin/HomeMallDetail";
import RegisterScreen from "../plugin/RegisterScreen";
import ListHomeMall from "../plugin/ListHomeMall";

import * as Sentry from "@sentry/react-native";
import {mode} from '../../app.json';

//improve transition speed
const tConfig = {
  animation: 'timing',
  config: { duration: 250, }
}
const tSpec = {
  open: tConfig,
  close: tConfig,
}
// ...

const Stack = createStackNavigator();

 function App() {
  // if(mode !== 'dev' ){
  //   Sentry.init({
  //     // dsn: "https://b8c1f097fada49a9bdeb52e7cbeb7262@o881384.ingest.sentry.io/5835768",
  //     dsn: "https://39e65dd0de9e43bbb97666a70e9f8370@o881384.ingest.sentry.io/4504551326482432",
  //   });
  // }
  //throw new Error("MAGV Sentry error!");
  
  SGHelperGlobalVar.addVar("UseRandomColor", false);
  // SGHelperGlobalVar.addVar("APIVisitor", 'https://spotgue-visitor-api-dev.azurewebsites.net/api/v1/visitor/');
  SGHelperGlobalVar.addVar("APIVisitor", 'https://mag-visitor-api-dev.azurewebsites.net/api/v1/visitor/');
  // SGHelperGlobalVar.addVar("APIVisitorAnonymous", 'https://spotgue-visitor-api-dev.azurewebsites.net/api/v1/visitor/anonymous/');
  SGHelperGlobalVar.addVar("APIVisitorAnonymous", 'https://mag-visitor-api-dev.azurewebsites.net/api/v1/visitor/anonymous/');
  // SGHelperGlobalVar.addVar("APICommon", 'https://spotgue-visitor-api-dev.azurewebsites.net/api/v1/common/');
  SGHelperGlobalVar.addVar("APICommon", 'https://mag-visitor-api-dev.azurewebsites.net/api/v1/common/');
  // SGHelperGlobalVar.addVar("APIBuilding", 'https://spotgue-visitor-api-dev.azurewebsites.net/api/v1/building/');

  //Urischeme1 for push notification
  SGHelperGlobalVar.addVar('UriScheme1', 'magvisitor://');
  //Urischeme2 for shared message Android
  SGHelperGlobalVar.addVar('UriScheme2', 'https://mag.spotgue.com/');
  //Urischeme3 for shared message iOS
  SGHelperGlobalVar.addVar('UriScheme3', 'magvisitor://web/');
  //Urischeme4 for ??
  SGHelperGlobalVar.addVar('UriScheme4', 'https://spotgue.azurewebsites.net/');
  SGHelperGlobalVar.addVar("SplashScreen","Splash")
  SGHelperGlobalVar.addVar("PauseViewPager",false);
  SGHelperGlobalVar.addVar("UserLikeCache",[]);
  SGHelperGlobalVar.addVar("UserFavoriteCache",[]);
  SGHelperGlobalVar.addVar("UserNotificationCache",[]);
  SGHelperGlobalVar.addVar("APIMapStatus","Primary");
  SGHelperGlobalVar.addVar("RTOCount",0);
  SGHelperGlobalVar.addVar("PluginFileCache", {});
  SGHelperGlobalVar.addVar("InitialDeepLinkURLHandled", false);

  // SGHelperGlobalVar.addVar("Yoh",true);
  //improve transition speed
  var optimize = (v) => { return v };
  if (Platform.OS === 'android') {
    optimize = SGHelperNavigation.optimizeHeavyScreen;
  }
  //... add screenOptions and wrap each screen with optimize()
  return (
    <NavigationContainer independent={true}>
      <Stack.Navigator initialRouteName="FirstMeasureScreen" screenOptions={Platform.OS === 'android' ? { transitionSpec: tSpec, cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS } : {}} >
        {
          mode === 'dev' &&
          <Stack.Screen name="PluginScreen" component={PluginScreen} />
        }
        <Stack.Screen name="FirstMeasureScreen" component={FirstMeasureScreen} />
        <Stack.Screen name="Splash" component={SplashScreen} options={{ animationEnabled: false, }} />

        <Stack.Screen name="TestSimpleAPIScreen" component={TestSimpleAPIScreen} />
        <Stack.Screen name="MMKV" component={MMKVScreen} />
        <Stack.Screen name="SplashAndroidTV" component={SplashScreenAndroidTV} options={{ animationEnabled: false, }} />
        <Stack.Screen name="ChooseLanguage" component={optimize(ChooseLanguageScreen)} />
        <Stack.Screen name="ChooseLanguageProfileScreen" component={optimize(ChooseLanguageProfileScreen)} />
        <Stack.Screen name="LetsGetStarted" component={optimize(LetsGetStartedScreen)} />
        <Stack.Screen name="SignIn" component={optimize(SignInScreen)} />
        <Stack.Screen name="SignUp" component={optimize(SignUpScreen)} />
        <Stack.Screen name="ChooseVerifyOTP" component={optimize(ChooseVerifyOTPScreen)} />
        <Stack.Screen name="VerifyOTP" component={optimize(VerifyOTPScreen)} />
        <Stack.Screen name="FirstVerifyOTP" component={optimize(FirstVerifyOTPScreen)} />
        <Stack.Screen name="VerifyOldPassword" component={optimize(VerifyOldPasswordScreen)} />
        <Stack.Screen name="VerifyOTPSignUp" component={optimize(VerifyOTPSignUpScreen)} />
        <Stack.Screen name="SignUpForm" component={optimize(SignUpFormScreen)} />
        <Stack.Screen name="VerifyOTPForgotPassword" component={optimize(VerifyOTPForgotPasswordScreen)} />
        <Stack.Screen name="ForgotPasswordSecurity1" component={optimize(ForgotPasswordSecurity1Screen)} />
        <Stack.Screen name="ForgotPasswordSecurity2" component={optimize(ForgotPasswordSecurity2Screen)} />
        <Stack.Screen name="ChangePasswordProfileScreen" component={optimize(ChangePasswordProfileScreen)} />
        <Stack.Screen name="ChangeEmailScreen" component={optimize(ChangeEmailScreen)} />
        <Stack.Screen name="AddEmailScreen" component={optimize(AddEmailScreen)} />
        <Stack.Screen name="ChangePhoneNumberScreen" component={optimize(ChangePhoneNumberScreen)} />
        <Stack.Screen name="AddPhoneNumberScreen" component={optimize(AddPhoneNumberScreen)} />
        <Stack.Screen name="ChangeSecurityQuestionScreen" component={optimize(ChangeSecurityQuestionScreen)} />
        <Stack.Screen name="ChangeImageSettingScreen" component={optimize(ChangeImageSettingScreen)} />
        <Stack.Screen name="ChangeCurrencyScreen" component={optimize(ChangeCurrencyScreen)} />
        <Stack.Screen name="ForgotPasswordChangePassword" component={optimize(ForgotPasswordChangePasswordScreen)} />
        <Stack.Screen name="Home" component={optimize(HomeScreen)} />
        <Stack.Screen name="Quiz" component={optimize(QuizScreen)} />
        <Stack.Screen name="QuizBuilding" component={optimize(QuizBuildingScreen)} />
        <Stack.Screen name="MyHealth" component={optimize(MyHealthScreen)} />
        <Stack.Screen name="SponsorshipDetail" component={optimize(SponsorshipDetailScreen)} />
        <Stack.Screen name="SeeAllSponsorshipPromo" component={optimize(SeeAllSponsorshipPromoScreen)} />
        <Stack.Screen name="SearchResultSponsorPromo" component={optimize(SearchResultSponsorPromoScreen)} />
        <Stack.Screen name="HelpScreen" component={optimize(HelpScreen)} />
        <Stack.Screen name="DetailHelpScreen" component={optimize(DetailHelpScreen)} />
        <Stack.Screen name="DetailProfileScreen" component={optimize(DetailProfileScreen)} />
        <Stack.Screen name="DetailPolicyScreen" component={optimize(DetailPolicyScreen)} />
        <Stack.Screen name="PolicyScreen" component={optimize(PolicyScreen)} />
        <Stack.Screen name="TipsAndTrickScreen" component={optimize(TipsAndTrickScreen)} />
        <Stack.Screen name="DetailTipsAndTrickScreen" component={optimize(DetailTipsAndTrickScreen)} />
        <Stack.Screen name="SeeAllFavoritesPlace" component={optimize(SeeAllFavoritesPlaceScreen)} />
        <Stack.Screen name="SeeAllFavoritesPlaceEvent" component={optimize(SeeAllFavoritesPlaceEventScreen)} />
        <Stack.Screen name="SeeAllFavoritesStore" component={optimize(SeeAllFavoritesStoreScreen)} />
        <Stack.Screen name="SeeAllFavoritesStorePromo" component={optimize(SeeAllFavoritesStorePromoScreen)} />
        <Stack.Screen name="SeeAllFavoritesResto" component={optimize(SeeAllFavoritesRestoScreen)} />
        <Stack.Screen name="SeeAllFavoritesRestoPromo" component={optimize(SeeAllFavoritesRestoPromoScreen)} />
        <Stack.Screen name="SeeAllTrendingPlace" component={optimize(SeeAllTrendingPlaceScreen)} />
        <Stack.Screen name="SeeAllTrendingPlaceEvent" component={optimize(SeeAllTrendingPlaceEventScreen)} />
        <Stack.Screen name="SeeAllTrendingAuction" component={optimize(SeeAllTrendingAuctionScreen)} />
        <Stack.Screen name="SeeAllTrendingStore" component={optimize(SeeAllTrendingStoreScreen)} />
        <Stack.Screen name="SeeAllTrendingStorePromo" component={optimize(SeeAllTrendingStorePromoScreen)} />
        <Stack.Screen name="SeeAllTrendingResto" component={optimize(SeeAllTrendingRestoScreen)} />
        <Stack.Screen name="SeeAllTrendingRestoPromo" component={optimize(SeeAllTrendingRestoPromoScreen)} />
        <Stack.Screen name="SeeMorePlaceEvent" component={optimize(SeeMorePlaceEventScreen)} />
        <Stack.Screen name="SeeMorePlaceAuction" component={optimize(SeeMorePlaceAuctionScreen)} />
        <Stack.Screen name="SeeMorePlaceStorePromo" component={optimize(SeeMorePlaceStorePromoScreen)} />
        <Stack.Screen name="SeeMorePlaceRestoPromo" component={optimize(SeeMorePlaceRestoPromoScreen)} />
        <Stack.Screen name="SeeMoreStorePromo" component={optimize(SeeMoreStorePromoScreen)} />
        <Stack.Screen name="SeeMoreRestoPromo" component={optimize(SeeMoreRestoPromoScreen)} />
        <Stack.Screen name="SeeMoreMostLikedStore" component={optimize(SeeMoreMostLikedStoreScreen)} />
        <Stack.Screen name="SeeMoreMostLikedResto" component={optimize(SeeMoreMostLikedRestoScreen)} />
        <Stack.Screen name="MallHome" component={optimize(MallHomeScreen)} />
        <Stack.Screen name="AddFavorites" component={optimize(AddFavoritesScreen)} />
        <Stack.Screen name="StoreHome" component={optimize(StoreHomeScreen)} />
        <Stack.Screen name="RestoHome" component={optimize(RestoHomeScreen)} />
        <Stack.Screen name="MyRewards" component={optimize(MyRewardsScreen)} />
        <Stack.Screen name="RewardDetail" component={optimize(RewardDetailScreen)} />
        <Stack.Screen name="PlaceEventDetail" component={optimize(PlaceEventDetailScreen)} />
        <Stack.Screen name="AuctionDetail" component={optimize(AuctionDetailScreen)} />
        <Stack.Screen name="StorePromoDetail" component={optimize(StorePromoDetailScreen)} />
        <Stack.Screen name="StoreProductDetail" component={optimize(StoreProductDetailScreen)} />
        <Stack.Screen name="FacilityDetail" component={optimize(FacilityDetailScreen)} />
        <Stack.Screen name="MallProfile" component={optimize(MallProfileScreen)} />
        <Stack.Screen name="StoreRestoProductList" component={optimize(StoreRestoProductListScreen)} />
        <Stack.Screen name="StoreRestoHashTagProductList" component={optimize(StoreRestoHashTagProductListScreen)} />
        <Stack.Screen name="StoreProfile" component={optimize(StoreProfileScreen)} />
        <Stack.Screen name="RestoProfile" component={optimize(RestoProfileScreen)} />
        <Stack.Screen name="RestoPromoDetail" component={optimize(RestoPromoDetailScreen)} />
        <Stack.Screen name="RestoMenuList" component={optimize(RestoMenuListScreen)} />
        <Stack.Screen name="RestoMenuDetail" component={optimize(RestoMenuDetailScreen)} />
        <Stack.Screen name="OrderList" component={optimize(OrderListScreen)} />
        <Stack.Screen name="OrderMenuList" component={optimize(OrderMenuListScreen)} />
        <Stack.Screen name="InputDataOrderMenu" component={optimize(InputDataOrderMenuScreen)} />
        <Stack.Screen name="AddChoosenOrder" component={optimize(AddChoosenOrderScreen)} />
        <Stack.Screen name="RequestBill" component={optimize(RequestBillScreen)} />
        <Stack.Screen name="RestoOrderMenuDetailScreen" component={optimize(RestoOrderMenuDetailScreen)} />
        <Stack.Screen name="RestoWaitingList" component={optimize(RestoWaitingListScreen)} />
        <Stack.Screen name="StoreWaitingList" component={optimize(StoreWaitingListScreen)} />
        <Stack.Screen name="RestoReservation" component={optimize(RestoReservationScreen)} />
        <Stack.Screen name="StoreReservation" component={optimize(StoreReservationScreen)} />
        <Stack.Screen name="AddWaitingList" component={optimize(AddWaitingListScreen)} />
        <Stack.Screen name="AddWaitingListStore" component={optimize(AddWaitingListStoreScreen)} />
        <Stack.Screen name="ViewWaitingList" component={optimize(ViewWaitingListScreen)} />
        <Stack.Screen name="ViewWaitingListStore" component={optimize(ViewWaitingListStoreScreen)} />
        <Stack.Screen name="RestoReservationDetail" component={optimize(RestoReservationDetailScreen)} />
        <Stack.Screen name="StoreReservationDetail" component={optimize(StoreReservationDetailScreen)} />
        <Stack.Screen name="RestoWaitingListDetail" component={optimize(RestoWaitingListDetailScreen)} />
        <Stack.Screen name="StoreWaitingListDetail" component={optimize(StoreWaitingListDetailScreen)} />
        <Stack.Screen name="MyRestoBooking" component={optimize(MyRestoBookingScreen)} />
        <Stack.Screen name="MyParkingSpotWithLayout" component={optimize(MyParkingSpotWithLayoutScreen)} />
        <Stack.Screen name="ProfileScreen" component={optimize(ProfileScreen)} />
        <Stack.Screen name="ChooseSettingScreen" component={optimize(ChooseSettingScreen)} />
        <Stack.Screen name="AskAlice" component={optimize(AskAliceScreen)} />
        <Stack.Screen name="AddLocationAskAlice" component={optimize(AddLocationAskAliceScreen)} />
        <Stack.Screen name="WhereToGoResult" component={optimize(WhereToGoResultScreen)} />
        <Stack.Screen name="InboxList" component={optimize(InboxListScreen)} />
        <Stack.Screen name="InboxDetail" component={optimize(InboxDetailScreen)} />
        <Stack.Screen name="Filter" component={optimize(FilterScreen)} />
        <Stack.Screen name="WhatToEatResult" component={optimize(WhatToEatResultScreen)} />
        <Stack.Screen name="WhatToEatResultDetail" component={optimize(WhatToEatResultDetailScreen)} />
        <Stack.Screen name="ClothToBuyResult" component={optimize(ClothToBuyResultScreen)} />
        <Stack.Screen name="ClothToBuyResultDetail" component={optimize(ClothToBuyResultDetailScreen)} />
        <Stack.Screen name="WhatToGiftResult" component={optimize(WhatToGiftResultScreen)} />
        <Stack.Screen name="WhatToGiftResultDetail" component={optimize(WhatToGiftResultDetailScreen)} />
        <Stack.Screen name="ParkingLayoutFullScreen" component={optimize(ParkingLayoutFullScreen)} />
        <Stack.Screen name="DemoVerificationScreen" component={optimize(DemoVerificationScreen)} />
        <Stack.Screen name="SearchStart" component={optimize(SearchStartScreen)} />
        <Stack.Screen name="SearchAll" component={optimize(SearchAllScreen)} />
        <Stack.Screen name="SearchResultPlace" component={optimize(SearchResultPlaceScreen)} />
        <Stack.Screen name="SearchResultStore" component={optimize(SearchResultStoreScreen)} />
        <Stack.Screen name="SearchResultResto" component={optimize(SearchResultRestoScreen)} />
        <Stack.Screen name="SearchResultPlaceEvent" component={optimize(SearchResultPlaceEventScreen)} />
        <Stack.Screen name="SearchResultAuction" component={optimize(SearchResultAuctionScreen)} />
        <Stack.Screen name="SearchResultStorePromo" component={optimize(SearchResultStorePromoScreen)} />
        <Stack.Screen name="SearchResultRestoPromo" component={optimize(SearchResultRestoPromoScreen)} />
        <Stack.Screen name="SearchResultStoreProduct" component={optimize(SearchResultStoreProductScreen)} />
        <Stack.Screen name="SearchResultRestoMenu" component={optimize(SearchResultRestoMenuScreen)} />
        <Stack.Screen name="SearchResultFavoritePlace" component={optimize(SearchResultFavoritePlaceScreen)} />
        <Stack.Screen name="SearchResultFavoriteStore" component={optimize(SearchResultFavoriteStoreScreen)} />
        <Stack.Screen name="SearchResultFavoriteResto" component={optimize(SearchResultFavoriteRestoScreen)} />
        <Stack.Screen name="SearchResultFavoritePlaceEvent" component={optimize(SearchResultFavoritePlaceEventScreen)} />
        <Stack.Screen name="SearchResultFavoriteStorePromo" component={optimize(SearchResultFavoriteStorePromoScreen)} />
        <Stack.Screen name="SearchResultFavoriteRestoPromo" component={optimize(SearchResultFavoriteRestoPromoScreen)} />
        <Stack.Screen name="SearchInThisPlace" component={optimize(SearchInThisPlaceScreen)} />
        <Stack.Screen name="SearchResultInThisPlacePlaceEvent" component={optimize(SearchResultInThisPlacePlaceEventScreen)} />
        <Stack.Screen name="SearchResultInThisPlaceAuction" component={optimize(SearchResultInThisPlaceAuctionScreen)} />
        <Stack.Screen name="SearchResultInThisPlaceStorePromo" component={optimize(SearchResultInThisPlaceStorePromoScreen)} />
        <Stack.Screen name="SearchResultInThisPlaceRestoPromo" component={optimize(SearchResultInThisPlaceRestoPromoScreen)} />
        <Stack.Screen name="SearchResultInThisPlaceStoreProduct" component={optimize(SearchResultInThisPlaceStoreProductScreen)} />
        <Stack.Screen name="SearchResultInThisPlaceRestoMenu" component={optimize(SearchResultInThisPlaceRestoMenuScreen)} />
        <Stack.Screen name="SearchResultInThisPlaceStore" component={optimize(SearchResultInThisPlaceStoreScreen)} />
        <Stack.Screen name="SearchResultInThisPlaceResto" component={optimize(SearchResultInThisPlaceRestoScreen)} />
        <Stack.Screen name="SearchInThisStore" component={optimize(SearchInThisStoreScreen)} />
        <Stack.Screen name="SearchInThisResto" component={optimize(SearchInThisRestoScreen)} />
        <Stack.Screen name="SearchResultInThisStoreStorePromo" component={optimize(SearchResultInThisStoreStorePromoScreen)} />
        <Stack.Screen name="SearchResultInThisStoreStoreProduct" component={optimize(SearchResultInThisStoreStoreProductScreen)} />
        <Stack.Screen name="SearchResultInThisRestoRestoPromo" component={optimize(SearchResultInThisRestoRestoPromoScreen)} />
        <Stack.Screen name="SearchResultInThisRestoRestoMenu" component={optimize(SearchResultInThisRestoRestoMenuScreen)} />
        <Stack.Screen name="SearchResultGroupResto" component={optimize(SearchResultGroupRestoScreen)} />
        <Stack.Screen name="SearchResultGroupStore" component={optimize(SearchResultGroupStoreScreen)} />
        <Stack.Screen name="Notification" component={optimize(NotificationScreen)} />
        <Stack.Screen name="NotificationDetail" component={optimize(NotificationDetailScreen)} />
        <Stack.Screen name="Sort" component={optimize(SortScreen)} />
        <Stack.Screen name="StoreProductList" component={optimize(StoreProductListScreen)} />
        <Stack.Screen name="PDFViewer" component={optimize(PDFViewerScreen)} />
        <Stack.Screen name="MyReferralInMyReward" component={optimize(MyReferralInMyRewardScreen)} />
        <Stack.Screen name="SelectMall" component={optimize(SelectMallScreen)} />
        <Stack.Screen name="SelectParking" component={optimize(SelectParkingScreen)} />
        <Stack.Screen name="ParkingDetailAndroidTV" component={optimize(ParkingDetailAndroidTVScreen)} />
        <Stack.Screen name="HomeMallDetailAndroidTV" component={optimize(HomeMallDetailAndroidTVScreen)} />
        <Stack.Screen name="ReferralHistory" component={optimize(ReferralHistoryScreen)} />
        <Stack.Screen name="ReferralRewardDetail" component={optimize(ReferralRewardDetailScreen)} />
        <Stack.Screen name="SeeMoreRestoAuction" component={optimize(SeeMoreRestoAuctionScreen)} />
        <Stack.Screen name="SeeMoreStoreAuction" component={optimize(SeeMoreStoreAuctionScreen)} />
        <Stack.Screen name="SearchResultInThisStoreAuction" component={optimize(SearchResultInThisStoreAuctionScreen)} />
        <Stack.Screen name="SearchResultInThisRestoAuction" component={optimize(SearchResultInThisRestoAuctionScreen)} />
        <Stack.Screen name="SeeAllFavoriteMyCardList" component={optimize(SpotgueAppMyCardList)} />
        <Stack.Screen name="CardDetail" component={optimize(CardDetail)} />
        <Stack.Screen name="LoyaltyRewardDetailScreen" component={optimize(LoyaltyRewardDetailScreen)} />
        <Stack.Screen name="PointHistory" component={optimize(PointHistory)} />
        <Stack.Screen name="EarnPoint" component={optimize(EarnPoint)} />
        <Stack.Screen name="LoyaltyDetail" component={optimize(HomeMallDetail)} />
        <Stack.Screen name="RegisterScreen" component={optimize(RegisterScreen)} />
        <Stack.Screen name="SeeMorePlaceLoyalty" component={optimize(ListHomeMall)}/>
        
        {/* <Stack.Screen name="MyReferral" component={optimize(MyReferralScreen)} /> */}
        </Stack.Navigator>
    </NavigationContainer>
  );
}

// AppRegistry.registerComponent(appName, () => App);
export default App;
