/**.
 * Version 1.1.0
 * 1 Yohanes , 10 March 2021
 * - fix sorting
 */

 import { tbLookupDAO } from './tbLookupDAO';
 import { SGLocalize } from '../locales/SGLocalize';
 import {SGHelperGlobalVar} from '../../core/helper';
 
 export class sortDAO {
     
     //IN THIS PLACE
 
     static getPlacePlaceEventSortData(language) {
         return ([
             { name: 'fLikeCountBuildingEvent', descending: true, title: SGLocalize.translate('sortOptions.MostLiked'), selected: false, visible: true },
             { name: 'startDate', descending: true, title: SGLocalize.translate('sortOptions.Newest'), selected: false, visible: true },
             { name: 'fEventName'+language, descending: false,title: SGLocalize.translate('sortOptions.PlaceEventName'), selected: false, visible: true },
              { name: '[key]', descending: true, selected: false, visible: false }
         ]);
     }
     
     //IN THIS RESTO
 
     static getRestoRestoPromoSortData(language) {
         return ([
             { name: 'fLikeCountRestoPromo', descending: true, title: SGLocalize.translate('sortOptions.MostLiked'), selected: true, visible: true },
             { name: 'startDate', descending: true, title: SGLocalize.translate('sortOptions.Newest'), selected: false, visible: true },
             { name: 'fEventName'+language, descending: false,title: SGLocalize.translate('sortOptions.RestoEventName'), selected: false, visible: true },
              { name: '[key]', descending: true, selected: true, visible: false }
         ]);
     }
     
     //IN THIS STORE
     
     static getStoreStorePromoSortData(language) {
         return ([
             { name: 'fLikeCountStorePromo', descending: true, title: SGLocalize.translate('sortOptions.MostLiked'), selected: true, visible: true },
             { name: 'startDate', descending: true, title: SGLocalize.translate('sortOptions.Newest'), selected: false, visible: true },
             { name: 'fEventName'+language, descending: false,title: SGLocalize.translate('sortOptions.StoreEventName'), selected: false, visible: true },
             { name: '[key]', descending: true, selected: true, visible: false }
         ]);
     }

     static getStoreStoreAuctionSortData(language) {
        return ([
            { name: 'fLikeCountAuction', descending: true, title: SGLocalize.translate('sortOptions.MostLiked'), selected: true, visible: true },
            { name: 'startDate', descending: true, title: SGLocalize.translate('sortOptions.Newest'), selected: false, visible: true },
            { name: 'fAuctionName'+language, descending: false,title: SGLocalize.translate('sortOptions.StoreEventName'), selected: false, visible: true },
            { name: '[key]', descending: true, selected: true, visible: false }
        ]);
    }

    static getRestoRestoAuctionSortData(language) {
        return ([
            { name: 'fLikeCountAuction', descending: true, title: SGLocalize.translate('sortOptions.MostLiked'), selected: true, visible: true },
            { name: 'startDate', descending: true, title: SGLocalize.translate('sortOptions.Newest'), selected: false, visible: true },
            { name: 'fAuctionName'+language, descending: false,title: SGLocalize.translate('sortOptions.StoreEventName'), selected: false, visible: true },
            { name: '[key]', descending: true, selected: true, visible: false }
        ]);
    }

 
     //GENERAL SEARCH ALL
 
     static getPlaceSearchSortData(language) {
         return ([
             { name: 'rank', descending: true, title: SGLocalize.translate('sortOptions.MostRelevant'), selected: true, visible: true },
             { name: 'fLikeCount', descending: true, title: SGLocalize.translate('sortOptions.MostLiked'), selected: false, visible: true },
             { name: 'fSpendCriteria', descending: false, title:'User Spending Criteria', selected: false, visible: false },
             { name: 'fBuildingName'+language, descending: false,title: SGLocalize.translate('sortOptions.PlaceName'), selected: false, visible: true },
              { name: '[key]', descending: true, selected: true, visible: false }
         ]);
     }

     static getPlaceFavoriteSearchSortData(language) {
        return ([
            { name: 'rank', descending: true, title: SGLocalize.translate('sortOptions.MostRelevant'), selected: true, visible: true },
            { name: 'fLikeCount', descending: true, title: SGLocalize.translate('sortOptions.MostLiked'), selected: false, visible: true },
            { name: 'fSpendCriteria', descending: false, title:'User Spending Criteria', selected: false, visible: false },
            { name: 'fBuildingName'+language, descending: false,title: SGLocalize.translate('sortOptions.PlaceName'), selected: false, visible: true },
             { name: '[key]', descending: true, selected: false, visible: false }
        ]);
    }
 
     static getStoreSearchSortData(language) {
         return ([
             { name: 'rank', descending: true, title: SGLocalize.translate('sortOptions.MostRelevant'), selected: true, visible: true },
             { name: 'fLikeCountStore', descending: true, title: SGLocalize.translate('sortOptions.MostLiked'), selected: false, visible: true },
             { name: 'fSpendCriteria', descending: false, title:'User Spending Criteria', selected: false, visible: false },
             { name: 'fStoreName'+language, descending: false,title: SGLocalize.translate('sortOptions.StoreName'), selected: false, visible: true },
              { name: '[key]', descending: true, selected: true, visible: false }
         ]);
     }

     static getStoreFavoriteSearchSortData(language) {
        return ([
            { name: 'rank', descending: true, title: SGLocalize.translate('sortOptions.MostRelevant'), selected: true, visible: true },
            { name: 'fLikeCountStore', descending: true, title: SGLocalize.translate('sortOptions.MostLiked'), selected: false, visible: true },
            { name: 'fSpendCriteria', descending: false, title:'User Spending Criteria', selected: false, visible: false },
            { name: 'fStoreName'+language, descending: false,title: SGLocalize.translate('sortOptions.StoreName'), selected: false, visible: true },
             { name: '[key]', descending: true, selected: false, visible: false }
        ]);
    }
 
     static getRestoSearchSortData(language) {
         return ([
             { name: 'rank', descending: true, title: SGLocalize.translate('sortOptions.MostRelevant'), selected: true, visible: true },
             { name: 'fLikeCountResto', descending: true, title: SGLocalize.translate('sortOptions.MostLiked'), selected: false, visible: true },
             { name: 'fSpendCriteria', descending: false, title:'User Spending Criteria', selected: false, visible: false },
             { name: 'fRestoName'+language, descending: false,title: SGLocalize.translate('sortOptions.RestoName'), selected: false, visible: true },
              { name: '[key]', descending: true, selected: true, visible: false }
         ]);
     }

     static getRestoFavoriteSearchSortData(language) {
        return ([
            { name: 'rank', descending: true, title: SGLocalize.translate('sortOptions.MostRelevant'), selected: true, visible: true },
            { name: 'fLikeCountResto', descending: true, title: SGLocalize.translate('sortOptions.MostLiked'), selected: false, visible: true },
            { name: 'fSpendCriteria', descending: false, title:'User Spending Criteria', selected: false, visible: false },
            { name: 'fRestoName'+language, descending: false,title: SGLocalize.translate('sortOptions.RestoName'), selected: false, visible: true },
             { name: '[key]', descending: true, selected: false, visible: false }
        ]);
    }
 
     static getPlaceEventSearchSortData(language) {
         return ([
             { name: 'rank', descending: false, title: SGLocalize.translate('sortOptions.MostRelevant'), selected: true, visible: true },
             { name: 'fLikeCountBuildingEvent', descending: true, title: SGLocalize.translate('sortOptions.MostLiked'), selected: false, visible: true },
             { name: 'fSpendCriteria', descending: false, title:'User Spending Criteria', selected: false, visible: false },
             { name: 'startDate', descending: true, title: SGLocalize.translate('sortOptions.Newest'), selected: false, visible: true },
             { name: 'fEventName'+language, descending: false,title: SGLocalize.translate('sortOptions.PlaceEventName'), selected: false, visible: true },
             { name: '[key]', descending: true, selected: true, visible: false }
         ]);
     }

     static getPlaceFavoriteEventSearchSortData(language) {
        return ([
            { name: 'rank', descending: false, title: SGLocalize.translate('sortOptions.MostRelevant'), selected: true, visible: true },
            { name: 'fLikeCountBuildingEvent', descending: true, title: SGLocalize.translate('sortOptions.MostLiked'), selected: false, visible: true },
            { name: 'fSpendCriteria', descending: false, title:'User Spending Criteria', selected: false, visible: false },
            { name: 'startDate', descending: true, title: SGLocalize.translate('sortOptions.Newest'), selected: false, visible: true },
            { name: 'fEventName'+language, descending: false,title: SGLocalize.translate('sortOptions.PlaceEventName'), selected: false, visible: true },
            { name: '[key]', descending: true, selected: false, visible: false }
        ]);
    }

    static getAuctionSearchSortData(language) {
        return ([
            { name: 'rank', descending: true, title: SGLocalize.translate('sortOptions.MostRelevant'), selected: true, visible: true },
            { name: 'fLikeCountAuction', descending: true, title: SGLocalize.translate('sortOptions.MostLiked'), selected: false, visible: true },
            { name: 'startDate', descending: true, title: SGLocalize.translate('sortOptions.Newest'), selected: false, visible: true },
            { name: 'fAuctionName'+language, descending: false, selected: true, visible: false },
            { name: '[key]', descending: true, selected: true, visible: false }
        ]);
    }

     static getStorePromoSearchSortData(language) {
         return ([
             { name: 'rank', descending: true, title: SGLocalize.translate('sortOptions.MostRelevant'), selected: true, visible: true },
             { name: 'fLikeCountStorePromo', descending: true, title: SGLocalize.translate('sortOptions.MostLiked'), selected: false, visible: true },
             { name: 'startDate', descending: true, title: SGLocalize.translate('sortOptions.Newest'), selected: false, visible: true },
             { name: 'fSpendCriteria', descending: false, title:'User Spending Criteria', selected: false, visible: false },
             { name: 'fEventName'+language, descending: false,title: SGLocalize.translate('sortOptions.StoreEventName'), selected: false, visible: true },
              { name: '[key]', descending: true, selected: true, visible: false }
         ]);
     }

     static getStoreFavoritePromoSearchSortData(language) {
        return ([
            { name: 'rank', descending: true, title: SGLocalize.translate('sortOptions.MostRelevant'), selected: true, visible: true },
            { name: 'fLikeCountStorePromo', descending: true, title: SGLocalize.translate('sortOptions.MostLiked'), selected: false, visible: true },
            { name: 'startDate', descending: true, title: SGLocalize.translate('sortOptions.Newest'), selected: false, visible: true },
            { name: 'fSpendCriteria', descending: false, title:'User Spending Criteria', selected: false, visible: false },
            { name: 'fEventName'+language, descending: false,title: SGLocalize.translate('sortOptions.StoreEventName'), selected: false, visible: true },
             { name: '[key]', descending: true, selected: false, visible: false }
        ]);
    }
 
     static getRestoPromoSearchSortData(language) {
         return ([
             { name: 'rank', descending: true, title: SGLocalize.translate('sortOptions.MostRelevant'), selected: true, visible: true },
             { name: 'fLikeCountRestoPromo', descending: true, title: SGLocalize.translate('sortOptions.MostLiked'), selected: false, visible: true },
             { name: 'startDate', descending: true, title: SGLocalize.translate('sortOptions.Newest'), selected: false, visible: true },
             { name: 'fSpendCriteria', descending: false, title:'User Spending Criteria', selected: false, visible: false },
             { name: 'fEventName'+language, descending: false,title: SGLocalize.translate('sortOptions.RestoEventName'), selected: false, visible: true },
              { name: '[key]', descending: true, selected: true, visible: false }
         ]);
     }

     static getRestoFavoritePromoSearchSortData(language) {
        return ([
            { name: 'rank', descending: true, title: SGLocalize.translate('sortOptions.MostRelevant'), selected: true, visible: true },
            { name: 'fLikeCountRestoPromo', descending: true, title: SGLocalize.translate('sortOptions.MostLiked'), selected: false, visible: true },
            { name: 'startDate', descending: true, title: SGLocalize.translate('sortOptions.Newest'), selected: false, visible: true },
            { name: 'fSpendCriteria', descending: false, title:'User Spending Criteria', selected: false, visible: false },
            { name: 'fEventName'+language, descending: false,title: SGLocalize.translate('sortOptions.RestoEventName'), selected: false, visible: true },
             { name: '[key]', descending: true, selected: false, visible: false }
        ]);
    }
 
     static getStoreProductSearchSortData() {
         return ([
             { name: 'rank', descending: true, title: SGLocalize.translate('sortOptions.MostRelevant'), selected: true, visible: true },
             { name: 'fCreatedDate', descending: true, title: SGLocalize.translate('sortOptions.Newest'), selected: false, visible: true },
             { name: 'fLikeCountProduct', descending: true, title: SGLocalize.translate('sortOptions.MostLiked'), selected: false, visible: true },
             { name: 'fCPromoPrice', descending: false, title: SGLocalize.translate('sortOptions.LowestPrice'), selected: false, visible: true },
             { name: 'fCPromoPrice', descending: true, title: SGLocalize.translate('sortOptions.HighestPrice'), selected: false, visible: true },
             { name: 'fSpendCriteria', descending: false, title:'User Spending Criteria', selected: true, visible: false },
              { name: '[key]', descending: true, selected: true, visible: false }
         ]);
     }
 
     static getStoreProductSearchSortData() {
         return ([
             { name: 'rank', descending: true, title: SGLocalize.translate('sortOptions.MostRelevant'), selected: true, visible: true },
             { name: 'fCreatedDate', descending: true, title: SGLocalize.translate('sortOptions.Newest'), selected: false, visible: true },
             { name: 'fLikeCountProduct', descending: true, title: SGLocalize.translate('sortOptions.MostLiked'), selected: false, visible: true },
             { name: 'fCPromoPrice', descending: false, title: SGLocalize.translate('sortOptions.LowestPrice'), selected: false, visible: true },
             { name: 'fCPromoPrice', descending: true, title: SGLocalize.translate('sortOptions.HighestPrice'), selected: false, visible: true },
             { name: 'fSpendCriteria', descending: false, title:'User Spending Criteria', selected: true, visible: false },
              { name: '[key]', descending: true, selected: true, visible: false }
         ]);
     }
 
     static getRestoMenuSearchSortData() {
         return ([
             // { name: '', descending: false, title: SGLocalize.translate('sortOptions.MostRelevant'), selected: true, visible: true },
             { name: 'rank', descending: true, title: SGLocalize.translate('sortOptions.MostRelevant'), selected: true, visible: true },
             { name: 'fLikeCountProduct', descending: true, title: SGLocalize.translate('sortOptions.MostLiked'), selected: false, visible: true },
             { name: 'fCPromoPrice', descending: false, title: SGLocalize.translate('sortOptions.LowestPrice'), selected: false, visible: true },
             { name: 'fCPromoPrice', descending: true, title: SGLocalize.translate('sortOptions.HighestPrice'), selected: false, visible: true },
             { name: 'fSpendCriteria', descending: false, title:'User Spending Criteria', selected: true, visible: false },
              { name: '[key]', descending: true, selected: true, visible: false }
         ]);
     }
 
     //GENERAL SEARCH IN THIS STORE 
 
     static getStorePromoSearchInStoreSortData(language) {
         return ([
             { name: 'rank', descending: true, title: SGLocalize.translate('sortOptions.MostRelevant'), selected: true, visible: true },
             { name: 'fLikeCountStorePromo', descending: true, title: SGLocalize.translate('sortOptions.MostLiked'), selected: false, visible: true },
             { name: 'startDate', descending: true, title: SGLocalize.translate('sortOptions.Newest'), selected: false, visible: true },
             { name: 'fEventName'+language, descending: false,title: SGLocalize.translate('sortOptions.StoreEventName'), selected: false, visible: true },
              { name: '[key]', descending: true, selected: true, visible: false }
         ]);
     }
 
     static getStoreProductSearchInStoreSortData() {
         return ([
             { name: 'rank', descending: true, title: SGLocalize.translate('sortOptions.MostRelevant'), selected: true, visible: true },
             { name: 'fCreatedDate', descending: true, title: SGLocalize.translate('sortOptions.Newest'), selected: false, visible: true },
             { name: 'fLikeCountProduct', descending: true, title: SGLocalize.translate('sortOptions.MostLiked'), selected: false, visible: true },
             { name: 'fCPromoPrice', descending: false, title: SGLocalize.translate('sortOptions.LowestPrice'), selected: false, visible: true },
             { name: 'fCPromoPrice', descending: true, title: SGLocalize.translate('sortOptions.HighestPrice'), selected: false, visible: true },
              { name: '[key]', descending: true, selected: true, visible: false }
         ]);
     }
 
     //GENERAL SEARCH IN THIS RESTO 
 
     static getRestoPromoSearchInRestoSortData(language) {
         return ([
             { name: 'rank', descending: true, title: SGLocalize.translate('sortOptions.MostRelevant'), selected: true, visible: true },
             { name: 'fLikeCountRestoPromo', descending: true, title: SGLocalize.translate('sortOptions.MostLiked'), selected: false, visible: true },
             { name: 'displayDate', descending: false,  selected: false, visible: false },
             { name: 'startDate', descending: true, title: SGLocalize.translate('sortOptions.Newest'), selected: false, visible: true },
             { name: 'fEventName'+language, descending: false,title: SGLocalize.translate('sortOptions.RestoEventName'),  selected: false, visible: true },
             { name: 'fRestoName'+language, descending: false,  selected: false, visible: false },
              { name: '[key]', descending: true, selected: true, visible: false }
         ]);
     }
 
     static getRestoMenuSearchInRestoSortData(language) {
         return ([
             { name: 'rank', descending: true, title: SGLocalize.translate('sortOptions.MostRelevant'), selected: true, visible: true },
             { name: 'fLikeCountProduct', descending: true, title: SGLocalize.translate('sortOptions.MostLiked'), selected: false, visible: true },
             { name: 'fCPromoPrice', descending: false, title: SGLocalize.translate('sortOptions.LowestPrice'), selected: false, visible: true },
             { name: 'fCPromoPrice', descending: true, title: SGLocalize.translate('sortOptions.HighestPrice'), selected: false, visible: true },
             { name: 'fRestoName'+language, descending: false,  selected: false, visible: false },
             { name: 'fProductName'+language, descending: false,  selected: false, visible: false },
              { name: '[key]', descending: true, selected: true, visible: false }
         ]);
     }
     
     //Profile
    static getPlaceProfileSortData(language) {
        return ([
            { name: 'fLikeCount', descending: true, title: SGLocalize.translate('sortOptions.MostLiked'), selected: true, visible: true },
            { name: 'fSpendCriteria', descending: true, title: 'User Spending Criteria', selected: false, visible: false },
            { name: 'fBuildingName'+language, descending: false,title: SGLocalize.translate('sortOptions.PlaceName'), selected: false, visible: true },
             { name: 'buildingKey', descending: true, selected: false, visible: false }
        ]);
    }

    static getRestoProfileSortData(language) {
        return ([
            { name: 'fLikeCountResto', descending: true, title: SGLocalize.translate('sortOptions.MostLiked'), selected: true, visible: true },
            { name: 'fSpendCriteria', descending: true, title: 'User Spending Criteria', selected: false, visible: false },   
            { name: 'fRestoName'+language, descending: false,title: SGLocalize.translate('sortOptions.RestoName'), selected: false, visible: true },
             { name: '[key]', descending: true, selected: false, visible: false }
        ]);
    }

    static getStoreProfileSortData(language) {
        return ([
            { name: 'fLikeCountStore', descending: true, title: SGLocalize.translate('sortOptions.MostLiked'), selected: true, visible: true },
            { name: 'fSpendCriteria', descending: true, title: 'User Spending Criteria', selected: false, visible: false },   
            { name: 'fStoreName'+language, descending: false,title: SGLocalize.translate('sortOptions.StoreName'), selected: false, visible: true },
             { name: '[key]', descending: true, selected: false, visible: false }
        ]);
    }
    
     //GENERAL FAVORITE 
 
     static getPlaceFavoriteSortData(language) {
         return ([
             { name: 'fLikeCount', descending: true, title: SGLocalize.translate('sortOptions.MostLiked'), selected: true, visible: true },
             { name: 'fSpendCriteria', descending: true, title: 'User Spending Criteria', selected: false, visible: false },
             { name: 'fBuildingName'+language, descending: false,title: SGLocalize.translate('sortOptions.PlaceName'), selected: false, visible: true },
              { name: 'buildingKey', descending: true, selected: false, visible: false }
         ]);
     }
 
     static getPlaceEventFavoriteSortData(language) {
         return ([
             { name: 'fLikeCountBuildingEvent', descending: true, title: SGLocalize.translate('sortOptions.MostLiked'), selected: true, visible: true },
             { name: 'fSpendCriteria', descending: true, title: 'User Spending Criteria', selected: false, visible: false },   
             { name: 'startDate', descending: true, title: SGLocalize.translate('sortOptions.Newest'), selected: false, visible: true },
             { name: 'fEventName'+language, descending: false,title: SGLocalize.translate('sortOptions.PlaceEventName'), selected: false, visible: true },
             { name: '[key]', descending: true, selected: false, visible: false }
         ]);
     }
 
     static getRestoFavoriteSortData(language) {
         return ([
             { name: 'fLikeCountResto', descending: true, title: SGLocalize.translate('sortOptions.MostLiked'), selected: true, visible: true },
             { name: 'fSpendCriteria', descending: true, title: 'User Spending Criteria', selected: false, visible: false },   
             { name: 'fRestoName'+language, descending: false,title: SGLocalize.translate('sortOptions.RestoName'), selected: false, visible: true },
              { name: '[key]', descending: true, selected: false, visible: false }
         ]);
     }
 
     static getRestoPromoFavoriteSortData(language) {
         return ([
             { name: 'fLikeCountRestoPromo', descending: true, title: SGLocalize.translate('sortOptions.MostLiked'), selected: true, visible: true },
             { name: 'fSpendCriteria', descending: true, title: 'User Spending Criteria', selected: false, visible: false },   
             { name: 'startDate', descending: true, title: SGLocalize.translate('sortOptions.Newest'), selected: false, visible: true },
             { name: 'fEventName'+language, descending: false,title: SGLocalize.translate('sortOptions.RestoEventName'), selected: false, visible: true },
              { name: '[key]', descending: true, selected: false, visible: false }
         ]);
     }
 
     static getSponsorPromoSortData(language) {
         return ([
             {name:'fOrderNumber',descending:true,title:'',selected:true,visible:false},
             { name: 'startDate', descending: true, title: SGLocalize.translate('sortOptions.Newest'), selected: false, visible: false },
             { name: 'fEventName'+language, descending: false,title: SGLocalize.translate('sortOptions.SponsorEventName'), selected: true, visible: false },
              { name: 'fID', descending: true, selected: true, visible: false }
         ]);
     }
 
     static getStoreFavoriteSortData(language) {
         return ([
             { name: 'fLikeCountStore', descending: true, title: SGLocalize.translate('sortOptions.MostLiked'), selected: true, visible: true },
             { name: 'fSpendCriteria', descending: true, title: 'User Spending Criteria', selected: false, visible: false },   
             { name: 'fStoreName'+language, descending: false,title: SGLocalize.translate('sortOptions.StoreName'), selected: false, visible: true },
              { name: '[key]', descending: true, selected: false, visible: false }
         ]);
     }
 
     static getStorePromoFavoriteSortData(language) {
         return ([
             { name: 'fLikeCountStorePromo', descending: true, title: SGLocalize.translate('sortOptions.MostLiked'), selected: true, visible: true },
             { name: 'fSpendCriteria', descending: true, title: 'User Spending Criteria', selected: false, visible: false },   
             { name: 'startDate', descending: true, title: SGLocalize.translate('sortOptions.Newest'), selected: false, visible: true },
             { name: 'fEventName'+language, descending: false,title: SGLocalize.translate('sortOptions.StoreEventName'), selected: false, visible: true },
              { name: '[key]', descending: true, selected: false, visible: false }
         ]);
     }
 
     static getSortHistoryLikedData(language) {
         return ([
             { name: 'fLastModifiedDate', descending: true, selected: true, visible: false },   
         ]);
     }
 
     // ALICE RESULT
 
     static getWhatToEatSortData(language) {
         return ([
             { name: 'fLikeCountRec', descending: true, title: SGLocalize.translate('sortOptions.MostLiked'), selected: true, visible: true },
             { name: 'fSpendCriteria', descending: false, title: 'User Spending Criteria', selected: false, visible: true },   
             { name: 'fRecPromoPrice', descending: false, title: SGLocalize.translate('sortOptions.LowestPrice'), selected: false, visible: true },
             { name: 'fRecPromoPrice', descending: true, title: SGLocalize.translate('sortOptions.HighestPrice'), selected: false, visible: true },
             { name: 'fRecName'+language, descending: false, selected: true, visible: false },
              { name: '[key]', descending: true, selected: true, visible: false }
          
         ]);
     }
 
     static getClothToBuySortData(language) {
         return ([
             { name: 'fLikeCountRec', descending: true, title: SGLocalize.translate('sortOptions.MostLiked'), selected: true, visible: true },
             { name: 'fSpendCriteria', descending: false, title: 'User Spending Criteria', selected: false, visible: true },  
             { name: 'fRecPromoPrice', descending: false, title: SGLocalize.translate('sortOptions.LowestPrice'), selected: false, visible: true },
             { name: 'fRecPromoPrice', descending: true, title: SGLocalize.translate('sortOptions.HighestPrice'), selected: false, visible: true },
             { name: 'fRecName'+language, descending: false, selected: true, visible: false },
              { name: '[key]', descending: true, selected: true, visible: false }
             
         ]);
     }
 
     static getWhatToGiftSortData(language) {
         return ([
             { name: 'fLikeCountRec', descending: true, title: SGLocalize.translate('sortOptions.MostLiked'), selected: true, visible: true },
             { name: 'fSpendCriteria', descending: false, title: 'User Spending Criteria', selected: false, visible: true }, 
             { name: 'fRecPromoPrice', descending: false, title: SGLocalize.translate('sortOptions.LowestPrice'), selected: false, visible: true },
             { name: 'fRecPromoPrice', descending: true, title: SGLocalize.translate('sortOptions.HighestPrice'), selected: false, visible: true },
             { name: 'fRecName'+language, descending: false, selected: true, visible: false },
              { name: '[key]', descending: true, selected: true, visible: false }
         ]);
     }
 
     static getWhereToGoSortData(language) {
         return ([
             { name: 'fSpendCriteria', descending: true, title: 'User Spending Criteria', selected: true, visible: false }, 
             { name: 'fLikeCountBuilding', descending: true, title: SGLocalize.translate('sortOptions.MostLiked'), selected: false, visible: false },
             { name: 'fBuildingName'+language, descending: false, selected: true, visible: false }, 
              { name: 'buildingKey', descending: true, selected: true, visible: false }
         ]);
     }
 
 
     static getPlaceSortData() {
         return ([
             { name: 'rank', descending: true, title: SGLocalize.translate('sortOptions.MostRelevant'), selected: true, visible: true },
             { name: 'fSpendCriteria', descending: false, title: SGLocalize.translate('sortOptions.MostRelevant'), selected: true, visible: false },
             { name: 'fLikeCount', descending: true, title: SGLocalize.translate('sortOptions.MostLiked'), selected: false, visible: true },
             //  { name: '[key]', descending: true, selected: true, visible: false }
         ]);
     }
 
     static getPlaceNoSearchSortData(language) {
         return ([
             { name: 'fBuildingName'+language, descending: false,title: SGLocalize.translate('sortOptions.PlaceName'), selected: true, visible: true },
             { name: 'fLikeCount', descending: true, title: SGLocalize.translate('sortOptions.MostLiked'), selected: true, visible: false },
              { name: '[key]', descending: true, selected: true, visible: false }
         ]);
     }

     static getQuickButtonMyRestoBookingSortData(language) {
        return ([
             { name: 'fStoreName'+language, descending: false, selected: true ,visible:false},
             { name: 'fID', descending: true, selected: true, visible: false }
        ]);
    }

    static getQuickButtonMyRestoBookingSortDataBrand(language) {
        return ([
             { name: 'fGroupName'+language, descending: false, selected: true ,visible:false},
             { name: 'fID', descending: true, selected: true, visible: false }
        ]);
    }

 
     static getAlicePlaceNoSearchSortData(language) {
         return ([
             { name: 'fLikeCount', descending: true, title: SGLocalize.translate('sortOptions.MostLiked'), selected: true, visible: true },
             { name: 'fBuildingName'+language, descending: false, selected: true, visible: false },
              { name: 'fID', descending: true, selected: true, visible: false }
         ]);
     }
 
     static getAlicePlaceSearchSortData(language) {
         return ([
             { name: 'rank', descending: true, title: SGLocalize.translate('sortOptions.MostRelevant'), selected: true, visible: true },
             { name: 'fLikeCount', descending: true, title: SGLocalize.translate('sortOptions.MostLiked'), selected: false, visible: true },
             { name: 'fSpendCriteria', descending: false, title:'User Spending Criteria', selected: true, visible: false },
             { name: 'fBuildingName'+language, descending: false, selected: true, visible: false },
              { name: 'fID', descending: true, selected: true, visible: false }
         ]);
     }
 
     static getPlaceEventSortData(language) {
         return ([
             { name: 'rank', descending: true, title: SGLocalize.translate('sortOptions.MostRelevant'), selected: true, visible: true },
             { name: 'fLikeCountBuildingEvent', descending: true, title: SGLocalize.translate('sortOptions.MostLiked'), selected: false, visible: true },
             { name: 'startDate', descending: true, title: SGLocalize.translate('sortOptions.Newest'), selected: false, visible: true },
             { name: 'fEventName'+language, descending: false,title: SGLocalize.translate('sortOptions.PlaceEventName'), selected: false, visible: true },
              { name: '[key]', descending: true, selected: true, visible: false }
         ]);
     }
     //-----------------
     static getPlaceEventTrendingSortData(language) {
         return ([
             { name: 'fLikeCountBuildingEvent', descending: true, title: SGLocalize.translate('sortOptions.MostLiked'), selected: false, visible: false },
             { name: 'fSpendCriteria', descending: false, title: SGLocalize.translate('sortOptions.MostLiked'), selected: false, visible: false },
             { name: 'startDate', descending: true, title: SGLocalize.translate('sortOptions.Newest'), selected: false, visible: true },
             { name: 'fEventName'+language, descending: false, selected: true, visible: false },
              { name: '[key]', descending: true, selected: true, visible: false }
         ]);
     }

     static getAuctionTrendingSortData(language) {
        return ([
            { name: 'fLikeCountAuction', descending: true, title: SGLocalize.translate('sortOptions.MostLiked'), selected: false, visible: true },
            { name: 'startDate', descending: true, title: SGLocalize.translate('sortOptions.Newest'), selected: true, visible: true },
            { name: 'fAuctionName'+language, descending: false, selected: true, visible: false },
             { name: '[key]', descending: true, selected: true, visible: false }
        ]);
    }
 
     static getRestoPromoTrendingSortData(language) {
         return ([
             { name: 'fLikeCountRestoPromo', descending: true, title: SGLocalize.translate('sortOptions.MostLiked'), selected: false, visible: true },
             { name: 'fSpendCriteria', descending: false, title: 'User Spending Criteria', selected: false, visible: false },   
             { name: 'startDate', descending: true, title: SGLocalize.translate('sortOptions.Newest'), selected: true, visible: true },
             { name: 'fEventName'+language, descending: false, selected: true, visible: false },
              { name: '[key]', descending: true, selected: true, visible: false }
         ]);
     }
 
     static getRestoTrendingSortData(language) {
         return ([
             { name: 'fLikeCountResto', descending: true, title: SGLocalize.translate('sortOptions.MostLiked'), selected: false, visible: true },
             { name: 'fSpendCriteria', descending: false, title: 'User Spending Criteria', selected: false, visible: false },   
             { name: 'fRestoName'+language, descending: false, selected: true, visible: false },
              { name: '[key]', descending: true, selected: true, visible: false }
         ]);
     }
 
     static getPlaceTrendingSortData(language) {
         return ([
             { name: 'fLikeCount', descending: true, title: SGLocalize.translate('sortOptions.MostLiked'), selected: false, visible: true },
             { name: 'fSpendCriteria', descending: false, title: 'User Spending Criteria', selected: false, visible: false },
             { name: 'fBuildingName'+language, descending: false, selected: true, visible: false },
              { name: '[key]', descending: true, selected: true, visible: false }
         ]);
     }
 
     static getStorePromoTrendingSortData(language) {
         return ([
             { name: 'fLikeCountStorePromo', descending: true, title: SGLocalize.translate('sortOptions.MostLiked'), selected: false, visible: true },
             { name: 'fSpendCriteria', descending: false, title: 'User Spending Criteria', selected: false, visible: false },   
             { name: 'startDate', descending: true, title: SGLocalize.translate('sortOptions.Newest'), selected: false, visible: true },
             { name: 'fEventName'+language, descending: false, selected: false, visible: true },
              { name: '[key]', descending: true, selected: true, visible: false }
         ]);
     }
 
     static getStoreTrendingSortData(language) {
         return ([
             { name: 'fLikeCountStore', descending: true, title: SGLocalize.translate('sortOptions.MostLiked'), selected: false, visible: true },
             { name: 'fSpendCriteria', descending: false, title: 'User Spending Criteria', selected: false, visible: false },   
             { name: 'fStoreName'+language, descending: false, selected: true, visible: false },
              { name: '[key]', descending: true, selected: true, visible: false }
         ]);
     }
 
     static getRestoSortData() {
         return ([
             { name: 'rank', descending: true, title: SGLocalize.translate('sortOptions.MostRelevant'), selected: true, visible: true },
             { name: 'fLikeCountResto', descending: true, title: SGLocalize.translate('sortOptions.MostLiked'), selected: false, visible: true },
              { name: '[key]', descending: true, selected: true, visible: false }
         ]);
     }
     static getRestoNoSearchSortData(language) {
         return ([
             { name: 'fRestoName'+language, descending: false,title: SGLocalize.translate('sortOptions.RestoName'),  selected: true, visible: true },
             { name: 'fLikeCountResto', descending: true, title: SGLocalize.translate('sortOptions.MostLiked'), selected: true, visible: false },
              { name: '[key]', descending: true, selected: true, visible: false }
         ]);
     }
 
     static getMostLikedPlaceRestoSortData(language) {
         return ([
             { name: 'fLikeCountResto', descending: true, title: SGLocalize.translate('sortOptions.MostLiked'), selected: true, visible: true },
             { name: 'fRestoName'+language, descending: false, selected: false, visible: true },
              { name: '[key]', descending: true, selected: true, visible: false }
         ]);
     }
 
     static getRestoPromoSortData() {
         return ([
             { name: 'rank', descending: true, title: SGLocalize.translate('sortOptions.MostRelevant'), selected: true, visible: true },
             { name: 'fLikeCountRestoPromo', descending: true, title: SGLocalize.translate('sortOptions.MostLiked'), selected: false, visible: true },
             { name: 'startDate', descending: true, title: SGLocalize.translate('sortOptions.Newest'), selected: false, visible: true },
              { name: '[key]', descending: true, selected: true, visible: false }
         ]);
     }
 
     static getPlaceRestoPromoSortData(language) {
         return ([
             { name: 'fLikeCountRestoPromo', descending: true, title: SGLocalize.translate('sortOptions.MostLiked'), selected: false, visible: true },
             { name: 'startDate', descending: true, title: SGLocalize.translate('sortOptions.Newest'), selected: false, visible: true },
             { name: 'fEventName'+language, descending: true,title: SGLocalize.translate('sortOptions.RestoEventName'),  selected: false, visible: true },
              { name: '[key]', descending: true, selected: false, visible: false }
         ]);
     }
 
 
     static getRestoMenuSortData() {
         return ([
             { name: 'rank', descending: true, title: SGLocalize.translate('sortOptions.MostRelevant'), selected: true, visible: true },
             { name: 'fLikeCountProduct', descending: true, title: SGLocalize.translate('sortOptions.MostLiked'), selected: false, visible: true },
             { name: 'fCPromoPrice', descending: false, title: SGLocalize.translate('sortOptions.LowestPrice'), selected: false, visible: true },
             { name: 'fCPromoPrice', descending: true, title: SGLocalize.translate('sortOptions.HighestPrice'), selected: false, visible: true },
              { name: '[key]', descending: true, selected: true, visible: false }
         ]);
     }
 
     static getRestoMenuNoSearchSortData() {
         return ([
             { name: 'fLikeCountProduct', descending: true, title: SGLocalize.translate('sortOptions.MostLiked'), selected: true, visible: true },
             { name: 'fCPromoPrice', descending: false, title: SGLocalize.translate('sortOptions.LowestPrice'), selected: false, visible: true },
             { name: 'fCPromoPrice', descending: true, title: SGLocalize.translate('sortOptions.HighestPrice'), selected: false, visible: true },
              { name: '[key]', descending: true, selected: true, visible: false }
         ]);
     }

     static getProductStoreRestoNoSearchSortData() {
        return ([
            { name: 'fLikeCountProduct', descending: true, title: SGLocalize.translate('sortOptions.MostLiked'), selected: true, visible: true },
            { name: 'fCPromoPrice', descending: false, title: SGLocalize.translate('sortOptions.LowestPrice'), selected: false, visible: true },
            { name: 'fCPromoPrice', descending: true, title: SGLocalize.translate('sortOptions.HighestPrice'), selected: false, visible: true },
        ]);
    }

 
     static getStoreSortData(language) {
         return ([
             { name: 'rank', descending: true, title: SGLocalize.translate('sortOptions.MostRelevant'), selected: true, visible: true },
             { name: 'fLikeCountStore', descending: true, title: SGLocalize.translate('sortOptions.MostLiked'), selected: false, visible: true },
             { name: 'fStoreName'+language, descending: false,title: SGLocalize.translate('sortOptions.StoreName'),  selected: false, visible: true },
              { name: '[key]', descending: true, selected: true, visible: false }
         ]);
     }
 
     static getStoreNoSearchSortData(language) {
         return ([
             { name: 'fStoreName'+language, descending: false,title: SGLocalize.translate('sortOptions.StoreName'),  selected: true, visible: true },
             { name: 'fLikeCountStore', descending: true, title: SGLocalize.translate('sortOptions.MostLiked'), selected: true, visible: false },
              { name: '[key]', descending: true, selected: true, visible: false }
         ]);
     }
 
     static getGroupStoreNoSearchSortData() {
         return ([
             { name: 'fLikeCountStore', descending: true, title: SGLocalize.translate('sortOptions.MostLiked'), selected: true, visible: true },
              { name: '[key]', descending: true, selected: true, visible: false }
         ]);
     }
 
     static getGroupStoreSortData() {
         return ([
             { name: 'rank', descending: true, title: SGLocalize.translate('sortOptions.MostRelevant'), selected: true, visible: true },
             { name: 'fLikeCountStore', descending: true, title: SGLocalize.translate('sortOptions.MostLiked'), selected: false, visible: true },
              { name: '[key]', descending: true, selected: true, visible: false }
         ]);
     }
 
     static getMostLikedPlaceStoreSortData(language) {
         return ([
             { name: 'fLikeCountStore', descending: true, title: SGLocalize.translate('sortOptions.MostLiked'), selected: true, visible: true },
             { name: 'fStoreName'+language, descending: true, selected: true, visible: false },
              { name: '[key]', descending: true, selected: true, visible: false }
         ]);
     }
 
     static getStorePromoSortData() {
         return ([
             { name: 'rank', descending: true, title: SGLocalize.translate('sortOptions.MostRelevant'), selected: true, visible: true },
             { name: 'fLikeCountStorePromo', descending: true, title: SGLocalize.translate('sortOptions.MostLiked'), selected: false, visible: true },
             { name: 'startDate', descending: true, title: SGLocalize.translate('sortOptions.Newest'), selected: false, visible: true },
              { name: '[key]', descending: true, selected: true, visible: false }
         ]);
     }

     static getAuctionPlaceSortData(language) {
        return ([
            { name: 'fLikeCountAuction', descending: true, title: SGLocalize.translate('sortOptions.MostLiked'), selected: true, visible: true },
            { name: 'startDate', descending: true, title: SGLocalize.translate('sortOptions.Newest'), selected: false, visible: true },
            { name: 'fAuctionName'+language, descending: false,title: SGLocalize.translate('sortOptions.AuctionName'), selected: false, visible: true },
             { name: '[key]', descending: true, selected: true, visible: false }
        ]);
    }
 
     static getStorePromoPlaceSortData(language) {
         return ([
             { name: 'fLikeCountStorePromo', descending: true, title: SGLocalize.translate('sortOptions.MostLiked'), selected: false, visible: true },
             { name: 'startDate', descending: true, title: SGLocalize.translate('sortOptions.Newest'), selected: false, visible: true },
             { name: 'fEventName'+language, descending: false,title: SGLocalize.translate('sortOptions.StoreEventName'), selected: false, visible: true },
              { name: '[key]', descending: true, selected: false, visible: false }
         ]);
     }
 
     static getStoreProductSortData() {
         return ([
             { name: 'rank', descending: true, title: SGLocalize.translate('sortOptions.MostRelevant'), selected: true, visible: true },
             { name: 'fCreatedDate', descending: true, title: SGLocalize.translate('sortOptions.Newest'), selected: false, visible: true },
             { name: 'fLikeCountProduct', descending: true, title: SGLocalize.translate('sortOptions.MostLiked'), selected: false, visible: true },
             { name: 'fCPromoPrice', descending: false, title: SGLocalize.translate('sortOptions.LowestPrice'), selected: false, visible: true },
             { name: 'fCPromoPrice', descending: true, title: SGLocalize.translate('sortOptions.HighestPrice'), selected: false, visible: true },
              { name: '[key]', descending: true, selected: true, visible: false }
         ]);
     }
 
     static getStoreProductNoSearchSortData() {
         return ([
             { name: 'fLikeCountProduct', descending: true, title: SGLocalize.translate('sortOptions.MostLiked'), selected: true, visible: true },
             { name: 'fCreatedDate', descending: true, title: SGLocalize.translate('sortOptions.Newest'), selected: false, visible: true },
             { name: 'fCPromoPrice', descending: false, title: SGLocalize.translate('sortOptions.LowestPrice'), selected: false, visible: true },
             { name: 'fCPromoPrice', descending: true, title: SGLocalize.translate('sortOptions.HighestPrice'), selected: false, visible: true },
              { name: '[key]', descending: true, selected: true, visible: false }
         ]);
     }
 }
 
 