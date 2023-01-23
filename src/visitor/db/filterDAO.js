/**.
 * Version 1.1.0
 * 1 Yohanes , 10 March 2021
 * - delete filter Food Preference
 */
import { tbLookupDAO } from './tbLookupDAO';
import { SGLocalize } from '../locales/SGLocalize';
import {SGHelperGlobalVar} from '../../core/helper';

export class filterDAO {

    static getBuildingMatrix() {
        var res = [
            { buildingType: 'Mall', buildingTypeTitle: 'Mall', buildingName: 'TamanAnggrek', buildingNameTitle: 'Mall Taman Anggrek', city: 'WestJakarta', cityTitle: 'Jakarta Barat', province: 'DKIJakarta', provinceTitle: 'DKI Jakarta', country: 'Indonesia', countryTitle: 'Indonesia' },
            { buildingType: 'Mall', buildingTypeTitle: 'Mall', buildingName: 'CentralPark', buildingNameTitle: 'Central Park Mall', city: 'WestJakarta', cityTitle: 'Jakarta Barat', province: 'DKIJakarta', provinceTitle: 'DKI Jakarta', country: 'Indonesia', countryTitle: 'Indonesia' },
            { buildingType: 'Mall', buildingTypeTitle: 'Mall', buildingName: 'KotaCasablanca', buildingNameTitle: 'Mall Kota Casablanca', city: 'SouthJakarta', cityTitle: 'Jakarta Selatan', province: 'DKIJakarta', provinceTitle: 'DKI Jakarta', country: 'Indonesia', countryTitle: 'Indonesia' },
            { buildingType: 'Mall', buildingTypeTitle: 'Mall', buildingName: 'MallKelapaGading', buildingNameTitle: 'Mall Kelapa Gading', city: 'NorthJakarta', cityTitle: 'Jakarta Utara', province: 'DKIJakarta', provinceTitle: 'DKI Jakarta', country: 'Indonesia', countryTitle: 'Indonesia' },
            { buildingType: 'Mall', buildingTypeTitle: 'Mall', buildingName: 'TunjunganPlaza', buildingNameTitle: 'Tunjungan Plaza', city: 'Surabaya', cityTitle: 'Surabaya', province: 'EastJava', provinceTitle: 'Jawa Timur', country: 'Indonesia', countryTitle: 'Indonesia' },
            { buildingType: 'Mall', buildingTypeTitle: 'Mall', buildingName: 'PakuwonMall', buildingNameTitle: 'Pakuwon Mall', city: 'Surabaya', cityTitle: 'Surabaya', province: 'EastJava', provinceTitle: 'Jawa Timur', country: 'Indonesia', countryTitle: 'Indonesia' },
            { buildingType: 'Mall', buildingTypeTitle: 'Mall', buildingName: 'SuntecCity', buildingNameTitle: 'Suntec City', city: 'Singapore', cityTitle: 'Singapore', province: 'Singapore', provinceTitle: 'Singapore', country: 'Singapore', countryTitle: 'Singapore' },
            { buildingType: 'Mall', buildingTypeTitle: 'Mall', buildingName: 'TakashiMaya', buildingNameTitle: 'Takashimaya', city: 'Singapore', cityTitle: 'Singapore', province: 'Singapore', provinceTitle: 'Singapore', country: 'Singapore', countryTitle: 'Singapore' },
        ];
        for (var i = 0; i < res.length; i++) {
            res[i].buildingTypeTitle = SGLocalize.translate('placeCategory.' + res[i].buildingType);
            res[i].cityTitle = SGLocalize.translate('city.' + res[i].city);
            res[i].provinceTitle = SGLocalize.translate('province.' + res[i].province);
            res[i].countryTitle = SGLocalize.translate('country.' + res[i].country);
        }
        return (res);
    }

    static getPlaceFilterData(currentLanguage) {
        return ([
            { name: 'fCountry', operator: 'IN', value: null, type: 'country', title: SGLocalize.translate("filterSubTitle.country"), group: SGLocalize.translate("filterGroup.location"), visible: true },
            { name: 'fProvince', operator: 'IN', value: null, type: 'province', title: SGLocalize.translate("filterSubTitle.province"), group: SGLocalize.translate("filterGroup.location"), visible: true },
            { name: 'fCity', operator: 'IN', value: null, type: 'city', title: SGLocalize.translate("filterSubTitle.city"), group: SGLocalize.translate("filterGroup.location"), visible: true },
            { name: 'fBuildingType', operator: 'IN', value: null, type: 'buildingType', title: SGLocalize.translate("filterSubTitle.placeCategory"), group: SGLocalize.translate("filterGroup.location"), visible: true },
        ]);
    }

    static getQuickButtonMyRestoBooking(buildingKey) {
        return ([
            { name: 'fBuildingKey', operator: '=', value: buildingKey},
        ]);
    }

    static getQuickButtonMyRestoBookingBrand(brandKey) {
        return ([
            { name: 'fGroupTenantKey', operator: '=', value: brandKey},
        ]);
    }


    static getPlaceEventFilterData(language) {
        return ([
            { name: 'fCountry', operator: 'IN', value: null, type: 'country', title: SGLocalize.translate("filterSubTitle.country"), group: SGLocalize.translate("filterGroup.location"), visible: false },
            { name: 'fProvince', operator: 'IN', value: null, type: 'province', title: SGLocalize.translate("filterSubTitle.province"), group: SGLocalize.translate("filterGroup.location"), visible: true },
            { name: 'fCity', operator: 'IN', value: null, type: 'city', title: SGLocalize.translate("filterSubTitle.city"), group: SGLocalize.translate("filterGroup.location"), visible: true },
            { name: 'fBuildingType', operator: 'IN', value: null, type: 'buildingType', title: SGLocalize.translate("filterSubTitle.placeCategory"), group: SGLocalize.translate("filterGroup.location"), visible: true },
            { name: 'buildingKey', operator: 'IN', value: null, type: 'buildingName', title: SGLocalize.translate("filterSubTitle.specificPlace"), group: SGLocalize.translate("filterGroup.location"), visible: true },
            // { name: 'fActive', operator: '=', value: ['Y'], type: 'single', title: 'Active Status', group: SGLocalize.translate("filterGroup.contentCategory"), optionList: [{ key: 'Y', title: 'Active' }, { key: 'N', title: 'Inactive' }], visible: true },
            { name: 'fEventCategory', operator: 'IN', value: null, type: 'multi', title: SGLocalize.translate("filterSubTitle.eventCategory"), group: SGLocalize.translate("filterGroup.contentCategory"), optionList: this.getFilterList('EventBuildingCategory'), visible: true },
            { name: 'endDate', operator: '>=', value: null, type: 'date', title: SGLocalize.translate("filterSubTitle.startDate"), group: SGLocalize.translate("filterGroup.eventDate"), dateRange: { start: new Date(0), end: new Date() }, visible: true },
            { name: 'startDate',operator: '<=' ,value: null, type: 'date', title: SGLocalize.translate("filterSubTitle.endDate"), group: SGLocalize.translate("filterGroup.eventDate"), dateRange: { start: new Date(0), end: new Date() }, visible: true },
        ]);
    }

    static getAuctionFilterData(language) {
        return ([
            { name: 'fCountry', operator: 'IN', value: null, type: 'country', title: SGLocalize.translate("filterSubTitle.country"), group: SGLocalize.translate("filterGroup.location"), visible: true },
            { name: 'fProvince', operator: 'IN', value: null, type: 'province', title: SGLocalize.translate("filterSubTitle.province"), group: SGLocalize.translate("filterGroup.location"), visible: true },
            { name: 'fCity', operator: 'IN', value: null, type: 'city', title: SGLocalize.translate("filterSubTitle.city"), group: SGLocalize.translate("filterGroup.location"), visible: true },
            { name: 'fBuildingType', operator: 'IN', value: null, type: 'buildingType', title: SGLocalize.translate("filterSubTitle.placeCategory"), group: SGLocalize.translate("filterGroup.location"), visible: true },
            { name: 'buildingKey', operator: 'IN', value: null, type: 'buildingName', title: SGLocalize.translate("filterSubTitle.specificPlace"), group: SGLocalize.translate("filterGroup.location"), visible: true },
            { name: 'endDate', operator: '>=', value: null, type: 'date', title: SGLocalize.translate("filterSubTitle.startDate"), group: SGLocalize.translate("filterGroup.eventDate"), dateRange: { start: new Date(0), end: new Date() }, visible: true },
            { name: 'startDate',operator: '<=' ,value: null, type: 'date', title: SGLocalize.translate("filterSubTitle.endDate"), group: SGLocalize.translate("filterGroup.eventDate"), dateRange: { start: new Date(0), end: new Date() }, visible: true },
            { name: 'fAuctionMode', operator: 'IN', value: null, type: 'multi', title: SGLocalize.translate("filterSubTitle.auction"), group: SGLocalize.translate("filterGroup.auctionType"), optionList: this.getAuctionModeFilterList(), visible: true },
        ]);
    }

    static getRestoFilterData(language) {
        return ([
            { name: 'fCountry', operator: 'IN', value: null, type: 'country', title: SGLocalize.translate("filterSubTitle.country"), group: SGLocalize.translate("filterGroup.location"), visible: true },
            { name: 'fProvince', operator: 'IN', value: null, type: 'province', title: SGLocalize.translate("filterSubTitle.province"), group: SGLocalize.translate("filterGroup.location"), visible: true },
            { name: 'fCity', operator: 'IN', value: null, type: 'city', title: SGLocalize.translate("filterSubTitle.city"), group: SGLocalize.translate("filterGroup.location"), visible: true },
            { name: 'fBuildingType', operator: 'IN', value: null, type: 'buildingType', title: SGLocalize.translate("filterSubTitle.placeCategory"), group: SGLocalize.translate("filterGroup.location"), visible: true },
            { name: 'buildingKey', operator: 'IN', value: null, type: 'buildingName', title: SGLocalize.translate("filterSubTitle.specificPlace"), group: SGLocalize.translate("filterGroup.location"), visible: true },
            { name: 'restoCategory', operator: 'IN', value: null, type: 'multi', title: SGLocalize.translate("filterSubTitle.restoCategory"), group: SGLocalize.translate("filterGroup.contentCategory"), optionList: this.getFilterList('RestoCategory'), visible: true },
            { name: 'restoCuisine', operator: 'IN', value: null, type: 'multi', title: SGLocalize.translate("filterSubTitle.restoCuisine"), group: SGLocalize.translate("filterGroup.contentCategory"), optionList: this.getFilterList('CuisineCategory'), visible: true },
            { name: 'isHalal', operator: '=', value: null, type: 'single', title: SGLocalize.translate("filterSubTitle.foodHalalStatus"), group: SGLocalize.translate("filterGroup.foodPreference"), optionList: this.getIsHalalFilterList(), visible: true },
            { name: 'isVegetarian', operator: '=', value: null, type: 'single', title: SGLocalize.translate("filterSubTitle.foodVegetarianStatus"), group: SGLocalize.translate("filterGroup.foodPreference"), optionList: this.getIsVegetarianFilterList(), visible: true },
        ]);
    }

    static getRestoPromoFilterData(language) {
        return ([
            { name: 'fCountry', operator: 'IN', value: null, type: 'country', title: SGLocalize.translate("filterSubTitle.country"), group: SGLocalize.translate("filterGroup.location"), visible: true },
            { name: 'fProvince', operator: 'IN', value: null, type: 'province', title: SGLocalize.translate("filterSubTitle.province"), group: SGLocalize.translate("filterGroup.location"), visible: true },
            { name: 'fCity', operator: 'IN', value: null, type: 'city', title: SGLocalize.translate("filterSubTitle.city"), group: SGLocalize.translate("filterGroup.location"), visible: true },
            { name: 'fBuildingType', operator: 'IN', value: null, type: 'buildingType', title: SGLocalize.translate("filterSubTitle.placeCategory"), group: SGLocalize.translate("filterGroup.location"), visible: true },
            { name: 'buildingKey', operator: 'IN', value: null, type: 'buildingName', title: SGLocalize.translate("filterSubTitle.specificPlace"), group: SGLocalize.translate("filterGroup.location"), visible: true },
            { name: 'restoCategory', operator: 'IN', value: null, type: 'multi', title: SGLocalize.translate("filterSubTitle.restoCategory"), group: SGLocalize.translate("filterGroup.contentCategory"), optionList: this.getFilterList('RestoCategory'), visible: true },
            { name: 'restoCuisine', operator: 'IN', value: null, type: 'multi', title: SGLocalize.translate("filterSubTitle.restoCuisine"), group: SGLocalize.translate("filterGroup.contentCategory"), optionList: this.getFilterList('CuisineCategory'), visible: true },
            { name: 'endDate', operator: '>=', value: null, type: 'date', title: SGLocalize.translate("filterSubTitle.startDate"), group: SGLocalize.translate("filterGroup.eventDate"), dateRange: { start: new Date(0), end: new Date() }, visible: true },
            { name: 'startDate',operator: '<=' ,value: null, type: 'date', title: SGLocalize.translate("filterSubTitle.endDate"), group: SGLocalize.translate("filterGroup.eventDate"), dateRange: { start: new Date(0), end: new Date() }, visible: true },
        ]);
    }

    static getRestoPromoFilterDataSearch(language) {
        return ([
            { name: 'fCountry', operator: 'IN', value: null, type: 'country', title: SGLocalize.translate("filterSubTitle.country"), group: SGLocalize.translate("filterGroup.location"), visible: true },
            { name: 'fProvince', operator: 'IN', value: null, type: 'province', title: SGLocalize.translate("filterSubTitle.province"), group: SGLocalize.translate("filterGroup.location"), visible: true },
            { name: 'fCity', operator: 'IN', value: null, type: 'city', title: SGLocalize.translate("filterSubTitle.city"), group: SGLocalize.translate("filterGroup.location"), visible: true },
            { name: 'fBuildingType', operator: 'IN', value: null, type: 'buildingType', title: SGLocalize.translate("filterSubTitle.placeCategory"), group: SGLocalize.translate("filterGroup.location"), visible: true },
            { name: 'buildingKey', operator: 'IN', value: null, type: 'buildingName', title: SGLocalize.translate("filterSubTitle.specificPlace"), group: SGLocalize.translate("filterGroup.location"), visible: true },
            { name: 'restoCategory', operator: 'IN', value: null, type: 'multi', title: SGLocalize.translate("filterSubTitle.restoCategory"), group: SGLocalize.translate("filterGroup.contentCategory"), optionList: this.getFilterList('RestoCategory'), visible: true },
            { name: 'restoCuisine', operator: 'IN', value: null, type: 'multi', title: SGLocalize.translate("filterSubTitle.restoCuisine"), group: SGLocalize.translate("filterGroup.contentCategory"), optionList: this.getFilterList('CuisineCategory'), visible: true },
            { name: 'endDate', operator: '>=', value: null, type: 'date', title: SGLocalize.translate("filterSubTitle.startDate"), group: SGLocalize.translate("filterGroup.eventDate"), dateRange: { start: new Date(0), end: new Date() }, visible: true },
            { name: 'startDate',operator: '<=' ,value: null, type: 'date', title: SGLocalize.translate("filterSubTitle.endDate"), group: SGLocalize.translate("filterGroup.eventDate"), dateRange: { start: new Date(0), end: new Date() }, visible: true },
            { name: 'fRegistered', operator: '=', value: 'Y' }
        ]);
    }

    static getSponsorPromoFilterData() {
        var date = new Date();
        return ([
            { name: 'endDate', operator: '>=', value: null, type: 'date', title: SGLocalize.translate("filterSubTitle.startDate"), group: SGLocalize.translate("filterGroup.eventDate"), dateRange: { start: new Date(0), end: new Date() }, visible: true },
            { name: 'startDate',operator: '<=' ,value: null, type: 'date', title: SGLocalize.translate("filterSubTitle.endDate"), group: SGLocalize.translate("filterGroup.eventDate"), dateRange: { start: new Date(0), end: new Date() }, visible: true },
        ]);
    }

    static getRestoRestoPromoFilterData(language) {
        return ([
            { name: 'endDate', operator: '>=', value: null, type: 'date', title: SGLocalize.translate("filterSubTitle.startDate"), group: SGLocalize.translate("filterGroup.eventDate"), dateRange: { start: new Date(0), end: new Date() }, visible: true },
            { name: 'startDate',operator: '<=' ,value: null, type: 'date', title: SGLocalize.translate("filterSubTitle.endDate"), group: SGLocalize.translate("filterGroup.eventDate"), dateRange: { start: new Date(0), end: new Date() }, visible: true },
        ]);
    }

    static getRestoMenuFilterData() {
        return ([
            { name: 'fCountry', operator: 'IN', value: null, type: 'country', title: SGLocalize.translate("filterSubTitle.country"), group: SGLocalize.translate("filterGroup.location"), visible: true },
            { name: 'fProvince', operator: 'IN', value: null, type: 'province', title: SGLocalize.translate("filterSubTitle.province"), group: SGLocalize.translate("filterGroup.location"), visible: true },
            { name: 'fCity', operator: 'IN', value: null, type: 'city', title: SGLocalize.translate("filterSubTitle.city"), group: SGLocalize.translate("filterGroup.location"), visible: true },
            { name: 'fBuildingType', operator: 'IN', value: null, type: 'buildingType', title: SGLocalize.translate("filterSubTitle.placeCategory"), group: SGLocalize.translate("filterGroup.location"), visible: true },
            { name: 'buildingKey', operator: 'IN', value: null, type: 'buildingName', title: SGLocalize.translate("filterSubTitle.specificPlace"), group: SGLocalize.translate("filterGroup.location"), visible: true },
            { name: 'restoCategory', operator: 'IN', value: null, type: 'multi', title: SGLocalize.translate("filterSubTitle.restoCategory"), group: SGLocalize.translate("filterGroup.contentCategory"), optionList: this.getFilterList('RestoCategory'), visible: true },
            { name: 'restoCuisine', operator: 'IN', value: null, type: 'multi', title: SGLocalize.translate("filterSubTitle.restoCuisine"), group: SGLocalize.translate("filterGroup.contentCategory"), optionList: this.getFilterList('CuisineCategory'), visible: true },
            { name: 'isHalal', operator: '=', value: null, type: 'single', title: SGLocalize.translate("filterSubTitle.foodHalalStatus"), group: SGLocalize.translate("filterGroup.foodPreference"), optionList: this.getIsHalalFilterList(), visible: true },
            { name: 'isVegetarian', operator: '=', value: null, type: 'single', title: SGLocalize.translate("filterSubTitle.foodVegetarianStatus"), group: SGLocalize.translate("filterGroup.foodPreference"), optionList: this.getIsVegetarianFilterList(), visible: true },
            { name: 'fCPromoPrice', operator: '>=', value: null, type: 'decimal', title: SGLocalize.translate("filterSubTitle.minPrice"), group: SGLocalize.translate("filterGroup.price"), visible: true },
            { name: 'fCPromoPrice', operator: '<=', value: null, type: 'decimal', title: SGLocalize.translate("filterSubTitle.maxPrice"), group: SGLocalize.translate("filterGroup.price"), visible: true },
        ]);
    }

    static getWhereToGoFilterData(currentLanguage) {
        return ([
            { name: 'fCountry', operator: 'IN', value: null, type: 'country', title: SGLocalize.translate("filterSubTitle.country"), group: SGLocalize.translate("filterGroup.location"), visible: true },
            { name: 'fProvince', operator: 'IN', value: null, type: 'province', title: SGLocalize.translate("filterSubTitle.province"), group: SGLocalize.translate("filterGroup.location"), visible: true },
            { name: 'fCity', operator: 'IN', value: null, type: 'city', title: SGLocalize.translate("filterSubTitle.city"), group: SGLocalize.translate("filterGroup.location"), visible: true },
            { name: 'fBuildingType', operator: 'IN', value: null, type: 'buildingType', title: SGLocalize.translate("filterSubTitle.placeCategory"), group: SGLocalize.translate("filterGroup.location"), visible: true },
        ]);
    }

    static getWhatToEatFilterData(currentLanguage) {
        return ([
            { name: 'isHalal', operator: '=', value: null, type: 'single', title: SGLocalize.translate("filterSubTitle.foodHalalStatus"), group: SGLocalize.translate("filterGroup.foodPreference"), optionList: this.getIsHalalFilterList(), visible: true },
            { name: 'isVegetarian', operator: '=', value: null, type: 'single', title: SGLocalize.translate("filterSubTitle.foodVegetarianStatus"), group: SGLocalize.translate("filterGroup.foodPreference"), optionList: this.getIsVegetarianFilterList(), visible: true },
            { name: 'fWTEatGroup', operator: 'INARRAY', value: null, type: 'multi', title: SGLocalize.translate("filterSubTitle.WTEatGroup"), group: SGLocalize.translate("filterGroup.foodPreference"), optionList: this.getFilterList('WhatToEatGroup'), visible: true },
        ]);
    }

    static getWhatToGiftFilterData(currentLanguage) {
        return ([
            // { name: 'isHalal', operator: '=', value: null, type: 'single', title: SGLocalize.translate("filterSubTitle.foodHalalStatus"), group: SGLocalize.translate("filterGroup.foodPreference"), optionList: this.getFilterList('FoodHalalStatus'), visible: true },
            // { name: 'isVegetarian', operator: '=', value: null, type: 'single', title: SGLocalize.translate("filterSubTitle.foodVegetarianStatus"), group: SGLocalize.translate("filterGroup.foodPreference"), optionList: this.getFilterList('FoodVegetarianStatus'), visible: true },
            { name: 'fRecPromoPrice', operator: '>=', value: null, type: 'decimal', title: SGLocalize.translate("filterSubTitle.minPrice"), group: SGLocalize.translate("filterGroup.price"), visible: true },
            { name: 'fRecPromoPrice', operator: '<=', value: null, type: 'decimal', title: SGLocalize.translate("filterSubTitle.maxPrice"), group: SGLocalize.translate("filterGroup.price"), visible: true },
        ]);
    }

    static getClothToBuyFilterData(currentLanguage) {
        return ([
            { name: 'fCTBuyGender', operator: 'INARRAY', value: null, type: 'multi', title: SGLocalize.translate("filterSubTitle.gender"), group: SGLocalize.translate("filterGroup.userCriteria"), optionList: this.getFilterList('Gender'), visible: true },
        ]);
    }

    static getStoreFilterData(language) {
        return ([
            { name: 'fCountry', operator: 'IN', value: null, type: 'country', title: SGLocalize.translate("filterSubTitle.country"), group: SGLocalize.translate("filterGroup.location"), visible: true },
            { name: 'fProvince', operator: 'IN', value: null, type: 'province', title: SGLocalize.translate("filterSubTitle.province"), group: SGLocalize.translate("filterGroup.location"), visible: true },
            { name: 'fCity', operator: 'IN', value: null, type: 'city', title: SGLocalize.translate("filterSubTitle.city"), group: SGLocalize.translate("filterGroup.location"), visible: true },
            { name: 'fBuildingType', operator: 'IN', value: null, type: 'buildingType', title: SGLocalize.translate("filterSubTitle.placeCategory"), group: SGLocalize.translate("filterGroup.location"), visible: true },
            { name: 'buildingKey', operator: 'IN', value: null, type: 'buildingName', title: SGLocalize.translate("filterSubTitle.specificPlace"), group: SGLocalize.translate("filterGroup.location"), visible: true },
            { name: 'storeCategory', operator: 'IN', value: null, type: 'multi', title: SGLocalize.translate("filterSubTitle.storeCategory"), group: SGLocalize.translate("filterGroup.contentCategory"), optionList: this.getFilterList('StoreCategory'), visible: true },
        ]);
    }

    static getGroupStoreFilterData() {
        return ([
            { name: 'fCountry', operator: 'IN', value: null, type: 'country', title: SGLocalize.translate("filterSubTitle.country"), group: SGLocalize.translate("filterGroup.location"), visible: true },
            { name: 'fProvince', operator: 'IN', value: null, type: 'province', title: SGLocalize.translate("filterSubTitle.province"), group: SGLocalize.translate("filterGroup.location"), visible: true },
            { name: 'fCity', operator: 'IN', value: null, type: 'city', title: SGLocalize.translate("filterSubTitle.city"), group: SGLocalize.translate("filterGroup.location"), visible: true },
            { name: 'fBuildingType', operator: 'IN', value: null, type: 'buildingType', title: SGLocalize.translate("filterSubTitle.placeCategory"), group: SGLocalize.translate("filterGroup.location"), visible: true },
            { name: 'buildingKey', operator: 'IN', value: null, type: 'buildingName', title: SGLocalize.translate("filterSubTitle.specificPlace"), group: SGLocalize.translate("filterGroup.location"), visible: true },
        ]);
    }

    static getStorePromoFilterData(language) {
        return ([
            { name: 'fCountry', operator: 'IN', value: null, type: 'country', title: SGLocalize.translate("filterSubTitle.country"), group: SGLocalize.translate("filterGroup.location"), visible: true },
            { name: 'fProvince', operator: 'IN', value: null, type: 'province', title: SGLocalize.translate("filterSubTitle.province"), group: SGLocalize.translate("filterGroup.location"), visible: true },
            { name: 'fCity', operator: 'IN', value: null, type: 'city', title: SGLocalize.translate("filterSubTitle.city"), group: SGLocalize.translate("filterGroup.location"), visible: true },
            { name: 'fBuildingType', operator: 'IN', value: null, type: 'buildingType', title: SGLocalize.translate("filterSubTitle.placeCategory"), group: SGLocalize.translate("filterGroup.location"), visible: true },
            { name: 'buildingKey', operator: 'IN', value: null, type: 'buildingName', title: SGLocalize.translate("filterSubTitle.specificPlace"), group: SGLocalize.translate("filterGroup.location"), visible: true },
            { name: 'storeCategory', operator: 'IN', value: null, type: 'multi', title: SGLocalize.translate("filterSubTitle.storeCategory"), group: SGLocalize.translate("filterGroup.contentCategory"), optionList: this.getFilterList('StoreCategory'), visible: true },
            { name: 'endDate', operator: '>=', value: null, type: 'date', title: SGLocalize.translate("filterSubTitle.startDate"), group: SGLocalize.translate("filterGroup.eventDate"), dateRange: { start: new Date(0), end: new Date() }, visible: true },
            { name: 'startDate',operator: '<=' ,value: null, type: 'date', title: SGLocalize.translate("filterSubTitle.endDate"), group: SGLocalize.translate("filterGroup.eventDate"), dateRange: { start: new Date(0), end: new Date() }, visible: true },
        ]);
    }

    static getAuctionFilterDataSearch(language) {
        return ([
            { name: 'fCountry', operator: 'IN', value: null, type: 'country', title: SGLocalize.translate("filterSubTitle.country"), group: SGLocalize.translate("filterGroup.location"), visible: true },
            { name: 'fProvince', operator: 'IN', value: null, type: 'province', title: SGLocalize.translate("filterSubTitle.province"), group: SGLocalize.translate("filterGroup.location"), visible: true },
            { name: 'fCity', operator: 'IN', value: null, type: 'city', title: SGLocalize.translate("filterSubTitle.city"), group: SGLocalize.translate("filterGroup.location"), visible: true },
            { name: 'fBuildingType', operator: 'IN', value: null, type: 'buildingType', title: SGLocalize.translate("filterSubTitle.placeCategory"), group: SGLocalize.translate("filterGroup.location"), visible: true },
            { name: 'buildingKey', operator: 'IN', value: null, type: 'buildingName', title: SGLocalize.translate("filterSubTitle.specificPlace"), group: SGLocalize.translate("filterGroup.location"), visible: true },
            { name: 'endDate', operator: '>=', value: null, type: 'date', title: SGLocalize.translate("filterSubTitle.startDate"), group: SGLocalize.translate("filterGroup.eventDate"), dateRange: { start: new Date(0), end: new Date() }, visible: true },
            { name: 'startDate',operator: '<=' ,value: null, type: 'date', title: SGLocalize.translate("filterSubTitle.endDate"), group: SGLocalize.translate("filterGroup.eventDate"), dateRange: { start: new Date(0), end: new Date() }, visible: true },
            { name: 'fAuctionMode', operator: 'IN', value: null, type: 'multi', title: SGLocalize.translate("filterSubTitle.auction"), group: SGLocalize.translate("filterGroup.auctionType"), optionList: this.getAuctionModeFilterList(), visible: true },
            { name: 'fRegistered', operator: '=', value: 'Y' }
        ]);
    }

    static getStorePromoFilterDataSearch(language) {
        return ([
            { name: 'fCountry', operator: 'IN', value: null, type: 'country', title: SGLocalize.translate("filterSubTitle.country"), group: SGLocalize.translate("filterGroup.location"), visible: true },
            { name: 'fProvince', operator: 'IN', value: null, type: 'province', title: SGLocalize.translate("filterSubTitle.province"), group: SGLocalize.translate("filterGroup.location"), visible: true },
            { name: 'fCity', operator: 'IN', value: null, type: 'city', title: SGLocalize.translate("filterSubTitle.city"), group: SGLocalize.translate("filterGroup.location"), visible: true },
            { name: 'fBuildingType', operator: 'IN', value: null, type: 'buildingType', title: SGLocalize.translate("filterSubTitle.placeCategory"), group: SGLocalize.translate("filterGroup.location"), visible: true },
            { name: 'buildingKey', operator: 'IN', value: null, type: 'buildingName', title: SGLocalize.translate("filterSubTitle.specificPlace"), group: SGLocalize.translate("filterGroup.location"), visible: true },
            { name: 'storeCategory', operator: 'IN', value: null, type: 'multi', title: SGLocalize.translate("filterSubTitle.storeCategory"), group: SGLocalize.translate("filterGroup.contentCategory"), optionList: this.getFilterList('StoreCategory'), visible: true },
            { name: 'endDate', operator: '>=', value: null, type: 'date', title: SGLocalize.translate("filterSubTitle.startDate"), group: SGLocalize.translate("filterGroup.eventDate"), dateRange: { start: new Date(0), end: new Date() }, visible: true },
            { name: 'startDate',operator: '<=' ,value: null, type: 'date', title: SGLocalize.translate("filterSubTitle.endDate"), group: SGLocalize.translate("filterGroup.eventDate"), dateRange: { start: new Date(0), end: new Date() }, visible: true },
            { name: 'fRegistered', operator: '=', value: 'Y' }
        ]);
    }
    

    static getStoreStorePromoFilterData(language) {
        return ([
            { name: 'endDate', operator: '>=', value: null, type: 'date', title: SGLocalize.translate("filterSubTitle.startDate"), group: SGLocalize.translate("filterGroup.eventDate"), dateRange: { start: new Date(0), end: new Date() }, visible: true },
            { name: 'startDate',operator: '<=' ,value: null, type: 'date', title: SGLocalize.translate("filterSubTitle.endDate"), group: SGLocalize.translate("filterGroup.eventDate"), dateRange: { start: new Date(0), end: new Date() }, visible: true },
        ]);
    }

    static getStoreStoreAuctionFilterData(language) {
        return ([
            { name: 'endDate', operator: '>=', value: null, type: 'date', title: SGLocalize.translate("filterSubTitle.startDate"), group: SGLocalize.translate("filterGroup.eventDate"), dateRange: { start: new Date(0), end: new Date() }, visible: true },
            { name: 'startDate',operator: '<=' ,value: null, type: 'date', title: SGLocalize.translate("filterSubTitle.endDate"), group: SGLocalize.translate("filterGroup.eventDate"), dateRange: { start: new Date(0), end: new Date() }, visible: true },
        ]);
    }

    static getRestoRestoAuctionFilterData(storeID) {
        return ([
            { name: 'endDate', operator: '>=', value: null, type: 'date', title: SGLocalize.translate("filterSubTitle.startDate"), group: SGLocalize.translate("filterGroup.eventDate"), dateRange: { start: new Date(0), end: new Date() }, visible: true },
            { name: 'startDate',operator: '<=' ,value: null, type: 'date', title: SGLocalize.translate("filterSubTitle.endDate"), group: SGLocalize.translate("filterGroup.eventDate"), dateRange: { start: new Date(0), end: new Date() }, visible: true },
        ]);
    }

    static getStoreProductFilterData() {
        return ([
            { name: 'fCountry', operator: 'IN', value: null, type: 'country', title: SGLocalize.translate("filterSubTitle.country"), group: SGLocalize.translate("filterGroup.location"), visible: true },
            { name: 'fProvince', operator: 'IN', value: null, type: 'province', title: SGLocalize.translate("filterSubTitle.province"), group: SGLocalize.translate("filterGroup.location"), visible: true },
            { name: 'fCity', operator: 'IN', value: null, type: 'city', title: SGLocalize.translate("filterSubTitle.city"), group: SGLocalize.translate("filterGroup.location"), visible: true },
            { name: 'fBuildingType', operator: 'IN', value: null, type: 'buildingType', title: SGLocalize.translate("filterSubTitle.placeCategory"), group: SGLocalize.translate("filterGroup.location"), visible: true },
            { name: 'buildingKey', operator: 'IN', value: null, type: 'buildingName', title: SGLocalize.translate("filterSubTitle.specificPlace"), group: SGLocalize.translate("filterGroup.location"), visible: true },
            { name: 'storeCategory', operator: 'IN', value: null, type: 'multi', title: SGLocalize.translate("filterSubTitle.storeCategory"), group: SGLocalize.translate("filterGroup.contentCategory"), optionList: this.getFilterList('StoreCategory'), visible: true },
            { name: 'fCPromoPrice', operator: '>=', value: null, type: 'decimal', title: SGLocalize.translate("filterSubTitle.minPrice"), group: SGLocalize.translate("filterGroup.price"), visible: true },
            { name: 'fCPromoPrice', operator: '<=', value: null, type: 'decimal', title: SGLocalize.translate("filterSubTitle.maxPrice"), group: SGLocalize.translate("filterGroup.price"), visible: true },
        ]);
    }

    static getInThisPlacePlaceEventFilterData() {
        return ([
            { name: 'fEventCategory', operator: 'IN', value: null, type: 'multi', title: SGLocalize.translate("filterSubTitle.eventCategory"), group: SGLocalize.translate("filterGroup.contentCategory"), optionList: this.getFilterList('EventBuildingCategory'), visible: true },
            { name: 'endDate', operator: '>=', value: null, type: 'date', title: SGLocalize.translate("filterSubTitle.startDate"), group: SGLocalize.translate("filterGroup.eventDate"), dateRange: { start: new Date(0), end: new Date() }, visible: true },
            { name: 'startDate',operator: '<=' ,value: null, type: 'date', title: SGLocalize.translate("filterSubTitle.endDate"), group: SGLocalize.translate("filterGroup.eventDate"), dateRange: { start: new Date(0), end: new Date() }, visible: true },
        ]);
    }

    static getPlacePlaceEventFilterData() {
        return ([
            { name: 'eventCategory', operator: 'IN', value: null, type: 'multi', title: SGLocalize.translate("filterSubTitle.eventCategory"), group: SGLocalize.translate("filterGroup.contentCategory"), optionList: this.getFilterList('EventBuildingCategory'), visible: true },
            { name: 'endDate', operator: '>=', value: null, type: 'date', title: SGLocalize.translate("filterSubTitle.startDate"), group: SGLocalize.translate("filterGroup.eventDate"), dateRange: { start: new Date(0), end: new Date() }, visible: true },
            { name: 'startDate',operator: '<=' ,value: null, type: 'date', title: SGLocalize.translate("filterSubTitle.endDate"), group: SGLocalize.translate("filterGroup.eventDate"), dateRange: { start: new Date(0), end: new Date() }, visible: true },
        ]);
    }

    static getInThisPlaceRestoPromoFilterData() {
        return ([
            { name: 'restoCategory', operator: 'IN', value: null, type: 'multi', title: SGLocalize.translate("filterSubTitle.restoCategory"), group: SGLocalize.translate("filterGroup.contentCategory"), optionList: this.getFilterList('RestoCategory'), visible: true },
            { name: 'restoCuisine', operator: 'IN', value: null, type: 'multi', title: SGLocalize.translate("filterSubTitle.restoCuisine"), group: SGLocalize.translate("filterGroup.contentCategory"), optionList: this.getFilterList('CuisineCategory'), visible: true },
            { name: 'endDate', operator: '>=', value: null, type: 'date', title: SGLocalize.translate("filterSubTitle.startDate"), group: SGLocalize.translate("filterGroup.eventDate"), dateRange: { start: new Date(0), end: new Date() }, visible: true },
            { name: 'startDate',operator: '<=' ,value: null, type: 'date', title: SGLocalize.translate("filterSubTitle.endDate"), group: SGLocalize.translate("filterGroup.eventDate"), dateRange: { start: new Date(0), end: new Date() }, visible: true },
        ]);
    }

    static getInThisPlaceRestoPromoFilterDataSearch() {
        return ([
            { name: 'restoCategory', operator: 'IN', value: null, type: 'multi', title: SGLocalize.translate("filterSubTitle.restoCategory"), group: SGLocalize.translate("filterGroup.contentCategory"), optionList: this.getFilterList('RestoCategory'), visible: true },
            { name: 'restoCuisine', operator: 'IN', value: null, type: 'multi', title: SGLocalize.translate("filterSubTitle.restoCuisine"), group: SGLocalize.translate("filterGroup.contentCategory"), optionList: this.getFilterList('CuisineCategory'), visible: true },
            { name: 'endDate', operator: '>=', value: null, type: 'date', title: SGLocalize.translate("filterSubTitle.startDate"), group: SGLocalize.translate("filterGroup.eventDate"), dateRange: { start: new Date(0), end: new Date() }, visible: true },
            { name: 'startDate',operator: '<=' ,value: null, type: 'date', title: SGLocalize.translate("filterSubTitle.endDate"), group: SGLocalize.translate("filterGroup.eventDate"), dateRange: { start: new Date(0), end: new Date() }, visible: true },
            { name: 'fRegistered', operator: '=', value: 'Y' }
        ]);
    }

    static gePlaceRestoPromoFilterData() {
        return ([
            { name: 'restoCategory', operator: 'IN', value: null, type: 'multi', title: SGLocalize.translate("filterSubTitle.restoCategory"), group: SGLocalize.translate("filterGroup.contentCategory"), optionList: this.getFilterList('RestoCategory'), visible: true },
            { name: 'restoCuisine', operator: 'IN', value: null, type: 'multi', title: SGLocalize.translate("filterSubTitle.restoCuisine"), group: SGLocalize.translate("filterGroup.contentCategory"), optionList: this.getFilterList('CuisineCategory'), visible: true },
            { name: 'endDate', operator: '>=', value: null, type: 'date', title: SGLocalize.translate("filterSubTitle.startDate"), group: SGLocalize.translate("filterGroup.eventDate"), dateRange: { start: new Date(0), end: new Date() }, visible: true },
            { name: 'startDate',operator: '<=' ,value: null, type: 'date', title: SGLocalize.translate("filterSubTitle.endDate"), group: SGLocalize.translate("filterGroup.eventDate"), dateRange: { start: new Date(0), end: new Date() }, visible: true },
        ]);
    }


    static getInThisPlaceStorePromoFilterData() {
        return ([
            { name: 'storeCategory', operator: 'IN', value: null, type: 'multi', title: SGLocalize.translate("filterSubTitle.storeCategory"), group: SGLocalize.translate("filterGroup.contentCategory"), optionList: this.getFilterList('StoreCategory'), visible: true },
            { name: 'endDate', operator: '>=', value: null, type: 'date', title: SGLocalize.translate("filterSubTitle.startDate") , group: SGLocalize.translate("filterGroup.eventDate"), dateRange: { start: new Date(0), end: new Date() }, visible: true },
            { name: 'startDate', operator: '<=', value: null, type: 'date', title: SGLocalize.translate("filterSubTitle.endDate"), group: SGLocalize.translate("filterGroup.eventDate"), dateRange: { start: new Date(0), end: new Date() }, visible: true },

        ]);
    }


    static getInThisPlaceAuctionilterDataSearch() {
        return ([
            { name: 'endDate', operator: '>=', value: null, type: 'date', title: SGLocalize.translate("filterSubTitle.startDate") , group: SGLocalize.translate("filterGroup.eventDate"), dateRange: { start: new Date(0), end: new Date() }, visible: true },
            { name: 'startDate', operator: '<=', value: null, type: 'date', title: SGLocalize.translate("filterSubTitle.endDate"), group: SGLocalize.translate("filterGroup.eventDate"), dateRange: { start: new Date(0), end: new Date() }, visible: true },
            { name: 'fRegistered', operator: '=', value: 'Y' },
            { name: 'fAuctionMode', operator: 'IN', value: null, type: 'multi', title: SGLocalize.translate("filterSubTitle.auction"), group: SGLocalize.translate("filterGroup.auctionType"), optionList: this.getAuctionModeFilterList(), visible: true }

        ]);
    }

    static getInThisStoreAuctionilterDataSearch() {
        return ([
            { name: 'endDate', operator: '>=', value: null, type: 'date', title: SGLocalize.translate("filterSubTitle.startDate") , group: SGLocalize.translate("filterGroup.eventDate"), dateRange: { start: new Date(0), end: new Date() }, visible: true },
            { name: 'startDate', operator: '<=', value: null, type: 'date', title: SGLocalize.translate("filterSubTitle.endDate"), group: SGLocalize.translate("filterGroup.eventDate"), dateRange: { start: new Date(0), end: new Date() }, visible: true },
            { name: 'fRegistered', operator: '=', value: 'Y' },
            { name: 'fAuctionMode', operator: 'IN', value: null, type: 'multi', title: SGLocalize.translate("filterSubTitle.auction"), group: SGLocalize.translate("filterGroup.auctionType"), optionList: this.getAuctionModeFilterList(), visible: true }

        ]);
    }


    static getInThisPlaceStorePromoFilterDataSearch() {
        return ([
            { name: 'storeCategory', operator: 'IN', value: null, type: 'multi', title: SGLocalize.translate("filterSubTitle.storeCategory"), group: SGLocalize.translate("filterGroup.contentCategory"), optionList: this.getFilterList('StoreCategory'), visible: true },
            { name: 'endDate', operator: '>=', value: null, type: 'date', title: SGLocalize.translate("filterSubTitle.startDate") , group: SGLocalize.translate("filterGroup.eventDate"), dateRange: { start: new Date(0), end: new Date() }, visible: true },
            { name: 'startDate', operator: '<=', value: null, type: 'date', title: SGLocalize.translate("filterSubTitle.endDate"), group: SGLocalize.translate("filterGroup.eventDate"), dateRange: { start: new Date(0), end: new Date() }, visible: true },
            { name: 'fRegistered', operator: '=', value: 'Y' }

        ]);
    }

    static getPlaceStorePromoFilterData() {
        var date = new Date();
        return ([
            { name: 'storeCategory', operator: 'IN', value: null, type: 'multi', title: SGLocalize.translate("filterSubTitle.storeCategory"), group: SGLocalize.translate("filterGroup.contentCategory"), optionList: this.getFilterList('StoreCategory'), visible: true },
            { name: 'endDate', operator: '>=', value: null, type: 'date', title: SGLocalize.translate("filterSubTitle.startDate"), group: SGLocalize.translate("filterGroup.eventDate"), dateRange: { start: new Date(0), end: new Date() }, visible: true },
            { name: 'startDate',operator: '<=' ,value: null, type: 'date', title: SGLocalize.translate("filterSubTitle.endDate"), group: SGLocalize.translate("filterGroup.eventDate"), dateRange: { start: new Date(0), end: new Date() }, visible: true },
        ]);
    }

    static getPlaceAuctionFilterData() {
        var date = new Date();
        return ([
            { name: 'endDate', operator: '>=', value: null, type: 'date', title: SGLocalize.translate("filterSubTitle.startDate"), group: SGLocalize.translate("filterGroup.eventDate"), dateRange: { start: new Date(0), end: new Date() }, visible: true },
            { name: 'startDate',operator: '<=' ,value: null, type: 'date', title: SGLocalize.translate("filterSubTitle.endDate"), group: SGLocalize.translate("filterGroup.eventDate"), dateRange: { start: new Date(0), end: new Date() }, visible: true },
            { name: 'fAuctionMode', operator: 'IN', value: null, type: 'multi', title: SGLocalize.translate("filterSubTitle.auction"), group: SGLocalize.translate("filterGroup.auctionType"), optionList: this.getAuctionModeFilterList(), visible: true }
        ]);
    }

    static getInThisPlaceStoreFilterData() {
        return ([
            { name: 'storeCategory', operator: 'IN', value: null, type: 'multi', title: SGLocalize.translate("filterSubTitle.storeCategory"), group: SGLocalize.translate("filterGroup.contentCategory"), optionList: this.getFilterList('StoreCategory'), visible: true },
        ]);
    }

    static getInThisPlaceStorePromoFilterData() {
        return ([
            { name: 'storeCategory', operator: 'IN', value: null, type: 'multi', title: SGLocalize.translate("filterSubTitle.storeCategory"), group: SGLocalize.translate("filterGroup.contentCategory"), optionList: this.getFilterList('StoreCategory'), visible: true },
            { name: 'endDate', operator: '>=', value: null, type: 'date', title: SGLocalize.translate("filterSubTitle.startDate") , group: SGLocalize.translate("filterGroup.eventDate"), dateRange: { start: new Date(0), end: new Date() }, visible: true },
            { name: 'startDate', operator: '<=', value: null, type: 'date', title: SGLocalize.translate("filterSubTitle.endDate"), group: SGLocalize.translate("filterGroup.eventDate"), dateRange: { start: new Date(0), end: new Date() }, visible: true },
        ]);
    }

    static getInThisPlaceStoreProductFilterData() {
        return ([
            { name: 'storeCategory', operator: 'IN', value: null, type: 'multi', title: SGLocalize.translate("filterSubTitle.storeCategory"), group: SGLocalize.translate("filterGroup.contentCategory"), optionList: this.getFilterList('StoreCategory'), visible: true },
            { name: 'fCPromoPrice', operator: '>=', value: null, type: 'decimal', title: SGLocalize.translate("filterSubTitle.minPrice"), group: SGLocalize.translate("filterGroup.price"), visible: true },
            { name: 'fCPromoPrice', operator: '<=', value: null, type: 'decimal', title: SGLocalize.translate("filterSubTitle.maxPrice"), group: SGLocalize.translate("filterGroup.price"), visible: true },
        ]);
    }

    static getInThisPlaceRestoFilterData() {
        return ([
            { name: 'restoCategory', operator: 'IN', value: null, type: 'multi', title: SGLocalize.translate("filterSubTitle.restoCategory"), group: SGLocalize.translate("filterGroup.contentCategory"), optionList: this.getFilterList('RestoCategory'), visible: true },
            { name: 'restoCuisine', operator: 'IN', value: null, type: 'multi', title: SGLocalize.translate("filterSubTitle.restoCuisine"), group: SGLocalize.translate("filterGroup.contentCategory"), optionList: this.getFilterList('CuisineCategory'), visible: true },
            { name: 'isHalal', operator: '=', value: null, type: 'single', title: SGLocalize.translate("filterSubTitle.foodHalalStatus"), group: SGLocalize.translate("filterGroup.foodPreference"), optionList: this.getIsHalalFilterList(), visible: true },
            { name: 'isVegetarian', operator: '=', value: null, type: 'single', title: SGLocalize.translate("filterSubTitle.foodVegetarianStatus"), group: SGLocalize.translate("filterGroup.foodPreference"), optionList: this.getIsVegetarianFilterList(), visible: true },
        ]);
    }

    static getInThisPlaceRestoMenuFilterData() {
        return ([
            { name: 'restoCategory', operator: 'IN', value: null, type: 'multi', title: SGLocalize.translate("filterSubTitle.restoCategory"), group: SGLocalize.translate("filterGroup.contentCategory"), optionList: this.getFilterList('RestoCategory'), visible: true },
            { name: 'restoCuisine', operator: 'IN', value: null, type: 'multi', title: SGLocalize.translate("filterSubTitle.restoCuisine"), group: SGLocalize.translate("filterGroup.contentCategory"), optionList: this.getFilterList('CuisineCategory'), visible: true },
            { name: 'isHalal', operator: '=', value: null, type: 'single', title: SGLocalize.translate("filterSubTitle.foodHalalStatus"), group: SGLocalize.translate("filterGroup.foodPreference"), optionList: this.getIsHalalFilterList(), visible: true },
            { name: 'isVegetarian', operator: '=', value: null, type: 'single', title: SGLocalize.translate("filterSubTitle.foodVegetarianStatus"), group: SGLocalize.translate("filterGroup.foodPreference"), optionList: this.getIsVegetarianFilterList(), visible: true },
            { name: 'fCPromoPrice', operator: '>=', value: null, type: 'decimal', title: SGLocalize.translate("filterSubTitle.minPrice"), group: SGLocalize.translate("filterGroup.price"), visible: true },
            { name: 'fCPromoPrice', operator: '<=', value: null, type: 'decimal', title: SGLocalize.translate("filterSubTitle.maxPrice"), group: SGLocalize.translate("filterGroup.price"), visible: true },
        ]);
    }

    static getInThisStoreStorePromoFilterData() {
        return ([
            { name: 'endDate', operator: '>=', value: null, type: 'date', title: SGLocalize.translate("filterSubTitle.startDate") , group: SGLocalize.translate("filterGroup.eventDate"), dateRange: { start: new Date(0), end: new Date() }, visible: true },
            { name: 'startDate', operator: '<=', value: null, type: 'date', title: SGLocalize.translate("filterSubTitle.endDate"), group: SGLocalize.translate("filterGroup.eventDate"), dateRange: { start: new Date(0), end: new Date() }, visible: true },
        ]);
    }

    static getInThisStoreStorePromoFilterDataSearch() {
        return ([
            { name: 'endDate', operator: '>=', value: null, type: 'date', title: SGLocalize.translate("filterSubTitle.startDate") , group: SGLocalize.translate("filterGroup.eventDate"), dateRange: { start: new Date(0), end: new Date() }, visible: true },
            { name: 'startDate', operator: '<=', value: null, type: 'date', title: SGLocalize.translate("filterSubTitle.endDate"), group: SGLocalize.translate("filterGroup.eventDate"), dateRange: { start: new Date(0), end: new Date() }, visible: true },
            { name: 'fRegistered', operator: '=', value: 'Y' }
        ]);
    }

    static getInThisStoreStoreProductFilterData(categoryKey) {
        return ([
            { name: 'fCategoryProductKey', operator: 'PARAMS', value: categoryKey, type: 'single', visible: false },
            { name: 'fCPromoPrice', operator: '>=', value: null, type: 'decimal', title: SGLocalize.translate("filterSubTitle.minPrice"), group: SGLocalize.translate("filterGroup.price"), visible: true },
            { name: 'fCPromoPrice', operator: '<=', value: null, type: 'decimal', title: SGLocalize.translate("filterSubTitle.maxPrice"), group: SGLocalize.translate("filterGroup.price"), visible: true },
        ]);
    }

    static getInThisStoreStoreProductData() {
        return ([
            { name: 'fCPromoPrice', operator: '>=', value: null, type: 'decimal', title: SGLocalize.translate("filterSubTitle.minPrice"), group: SGLocalize.translate("filterGroup.price"), visible: true },
            { name: 'fCPromoPrice', operator: '<=', value: null, type: 'decimal', title: SGLocalize.translate("filterSubTitle.maxPrice"), group: SGLocalize.translate("filterGroup.price"), visible: true },
        ]);
    }

    static getInThisRestoRestoPromoFilterData() {
        return ([
            { name: 'endDate', operator: '>=', value: null, type: 'date', title: SGLocalize.translate("filterSubTitle.startDate"), group: SGLocalize.translate("filterGroup.eventDate"), dateRange: { start: new Date(0), end: new Date() }, visible: true },
            { name: 'startDate',operator: '<=' ,value: null, type: 'date', title: SGLocalize.translate("filterSubTitle.endDate"), group: SGLocalize.translate("filterGroup.eventDate"), dateRange: { start: new Date(0), end: new Date() }, visible: true },
        ]);
    }

    static getInThisRestoRestoPromoFilterDataSearch() {
        return ([
            { name: 'endDate', operator: '>=', value: null, type: 'date', title: SGLocalize.translate("filterSubTitle.startDate"), group: SGLocalize.translate("filterGroup.eventDate"), dateRange: { start: new Date(0), end: new Date() }, visible: true },
            { name: 'startDate',operator: '<=' ,value: null, type: 'date', title: SGLocalize.translate("filterSubTitle.endDate"), group: SGLocalize.translate("filterGroup.eventDate"), dateRange: { start: new Date(0), end: new Date() }, visible: true },
            { name: 'fRegistered', operator: '=', value: 'Y' }
        ]);
    }

    static getInThisRestoRestoMenuFilterData(categoryKey) {
        return ([
            { name: 'fCategoryProductKey', operator: 'PARAMS', value: categoryKey, type: 'single', visible: false },
            { name: 'fCPromoPrice', operator: '>=', value: null, type: 'decimal', title: SGLocalize.translate("filterSubTitle.minPrice"), group: SGLocalize.translate("filterGroup.price"), visible: true },
            { name: 'fCPromoPrice', operator: '<=', value: null, type: 'decimal', title: SGLocalize.translate("filterSubTitle.maxPrice"), group: SGLocalize.translate("filterGroup.price"), visible: true },
        ]);
    }

    static getInThisRestoRestoMenuData() {
        return ([
            { name: 'fCPromoPrice', operator: '>=', value: null, type: 'decimal', title: SGLocalize.translate("filterSubTitle.minPrice"), group: SGLocalize.translate("filterGroup.price"), visible: true },
            { name: 'fCPromoPrice', operator: '<=', value: null, type: 'decimal', title: SGLocalize.translate("filterSubTitle.maxPrice"), group: SGLocalize.translate("filterGroup.price"), visible: true },
        ]);
    }

    static getIsHalalFilterList() {
        return (
            [
                { key: 'Y', title: SGLocalize.translate("isHalal.Y") },
                { key: 'N', title: SGLocalize.translate("isHalal.N") }
            ]
        )
    }

    static getIsVegetarianFilterList() {
        return (
            [
                { key: 'Y', title: SGLocalize.translate("isVegetarian.Y") },
                { key: 'N', title: SGLocalize.translate("isVegetarian.N") }
            ]
        )
    }

    static getAuctionModeFilterList() {
        return (
            [
                { key: 'HighestBid', title: SGLocalize.translate('filterSubTitle.auctionTitle') },
                { key: 'LuckyBid', title: SGLocalize.translate('filterSubTitle.giveawayTitle') },
                { key: 'FastestBid', title: SGLocalize.translate('filterSubTitle.raffleTitle') }
            ]
        )
    }

    static getFilterList(group) {
        var data = tbLookupDAO.getSpecificLookupByGroup(group);
        var language = SGHelperGlobalVar.getVar('GlobalLanguage');
        if(language !== 'ID' && language !=='id' &&  language !=='en' && language !== 'EN' && language !== 'cn' && language !== 'CN'){
            language = 'en'
        }
        var resData = [];
        for (var i = 0; i < data.length; i++) {
            var label = data[i].fLanguage[language];
            var x = { key: data[i].fLookUpKey, title: label }
            resData.push(x);
        }
        return (resData);
    }
    
}

