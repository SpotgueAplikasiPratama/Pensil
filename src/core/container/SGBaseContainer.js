/**
* MAG Core BaseControl class for all custom control in the project
* wrap react native React.Component implementation and hide from MAG UI App
* @format 
* @flow 
* 1. Toggle hide/show
* 2. Definable style from selected list
* 3. width and height as relative % from parent component
* 4. link to certain data model object
*/
import React from 'react';
import { Linking } from 'react-native';
import {SGBaseControl} from '../control/SGBaseControl';
import { SGHelperNavigation, SGHelperType } from '../helper';
import {SGHelperGlobalVar} from '../helper/SGHelperGlobalVar';

export class SGBaseContainer extends SGBaseControl {
    constructor(props, context, ...args) {
        super(props, context, ...args);
        this._language = SGHelperGlobalVar.getVar('GlobalLanguage');
    }

    handleLink(url) {
        var valid = SGHelperType.validURL(url)
        console.log(url)
        console.log(valid)
        console.log('handle link')
        if (valid) {
            Linking.canOpenURL(url
            ).then(supported => {
                if ((SGHelperType.left(url, 8) != 'https://')) {
                    Linking.openURL('https://' + url);
                } else {
                    Linking.openURL(url);
                }
            });
        }
    };

    _checkDeepLinkingHandlerShareMessage(value) {
      var url = value;
      if (url != null && url != '') {
        var urischeme = '';
        if(url.includes(SGHelperGlobalVar.getVar('UriScheme1'))){
          urischeme = SGHelperGlobalVar.getVar('UriScheme1');
        } else if (url.includes(SGHelperGlobalVar.getVar('UriScheme2'))){
          urischeme = SGHelperGlobalVar.getVar('UriScheme2');
        } else if (url.includes(SGHelperGlobalVar.getVar('UriScheme3'))){
          urischeme = SGHelperGlobalVar.getVar('UriScheme3');
        } else if (url.includes(SGHelperGlobalVar.getVar('UriScheme4'))){
          urischeme = SGHelperGlobalVar.getVar('UriScheme4');
        }
  
        if (urischeme!=='') {       
          var app_link = url.split(urischeme);
          var link = app_link[1].split('/');
          if(link.length === 2){
            var tmp = link[1].split('?');
            link[1] = tmp[0];
          }else if(link.length === 3){
            var tmp = link[2].split('?');
            link[2] = tmp[0];
          }
          switch (link[0]) {
            case '': break;//do nothing
            case 'building':
              SGHelperGlobalVar.addVar('deepLinkingURL', '');
              SGHelperNavigation.navigatePush(this.props.navigation, "MallHome", { contentKey: link[1] });
              break;
            case 'store':
              SGHelperGlobalVar.addVar('deepLinkingURL', '');
              SGHelperNavigation.navigatePush(this.props.navigation, "StoreHome", { contentKey: link[1] });
              break;
            case 'resto':
              SGHelperGlobalVar.addVar('deepLinkingURL', '');
              SGHelperNavigation.navigatePush(this.props.navigation, "RestoHome", { contentKey: link[1] });
              break;
            case 'id-ID':
              SGHelperGlobalVar.addVar('deepLinkingURL', '');
              this.handleLink(url)
              break;
            case 'en-EN':
              SGHelperGlobalVar.addVar('deepLinkingURL', '');
              this.handleLink(url)
              break;
            case 'restomenu':
              SGHelperGlobalVar.addVar('deepLinkingURL', '');
              SGHelperNavigation.navigatePush(this.props.navigation, "RestoHome", { contentKey: link[1],movetoRestoMenu:true });
              break;
            case 'storecatalog':
                SGHelperGlobalVar.addVar('deepLinkingURL', '');
                SGHelperNavigation.navigatePush(this.props.navigation, "StoreHome", { contentKey: link[1],movetostorecatalog:true });
                break;
            case 'facility':
              SGHelperGlobalVar.addVar('deepLinkingURL', '');
              SGHelperNavigation.navigatePush(this.props.navigation, "FacilityDetail", { contentKey: link[1] });
              break;
            case 'eventbuilding':
              SGHelperGlobalVar.addVar('deepLinkingURL', '');
              SGHelperNavigation.navigatePush(this.props.navigation, "PlaceEventDetail", { contentKey: link[1] });
              break;
            case 'eventstore':
              SGHelperGlobalVar.addVar('deepLinkingURL', '');
              SGHelperNavigation.navigatePush(this.props.navigation, "StorePromoDetail", { contentKey: link[1] });
              break;
            case 'eventresto':
              SGHelperGlobalVar.addVar('deepLinkingURL', '');
              SGHelperNavigation.navigatePush(this.props.navigation, "RestoPromoDetail", { contentKey: link[1] });
              break;
            case 'productstore':
              SGHelperGlobalVar.addVar('deepLinkingURL', '');
              SGHelperNavigation.navigatePush(this.props.navigation, "StoreProductDetail", { contentKey: link[1], storeKey: link[2] });
              break;
            case 'productresto':
              SGHelperGlobalVar.addVar('deepLinkingURL', '');
              SGHelperNavigation.navigatePush(this.props.navigation, "RestoMenuDetail", { contentKey: link[1], restoKey: link[2] });
              break;
            case 'inbox':
              SGHelperGlobalVar.addVar('deepLinkingURL', '');
              SGHelperNavigation.navigatePush(this.props.navigation, "InboxDetail", { commentKey: link[1] });
              break;
            case 'notification':
              SGHelperGlobalVar.addVar('deepLinkingURL', '');
              SGHelperNavigation.navigatePush(this.props.navigation, "NotificationDetail", { fID: link[1] });
              break;
            case 'storewhattogift':
              SGHelperGlobalVar.addVar('deepLinkingURL', '');
              SGHelperNavigation.navigatePush(this.props.navigation, "WhatToGiftResultDetail", { contentKey: link[1] });
              break;
            case 'restowhattogift':
              SGHelperGlobalVar.addVar('deepLinkingURL', '');
              SGHelperNavigation.navigatePush(this.props.navigation, "WhatToGiftResultDetail", { contentKey: link[1] });
              break;
            case 'clothtobuy':
              SGHelperGlobalVar.addVar('deepLinkingURL', '');
              SGHelperNavigation.navigatePush(this.props.navigation, "ClothToBuyResultDetail", { contentKey: link[1] });
              break;
            case 'whattoeat':
              SGHelperGlobalVar.addVar('deepLinkingURL', '');
              SGHelperNavigation.navigatePush(this.props.navigation, "WhatToEatResultDetail", { contentKey: link[1] });
              break;
            case 'eventsponsor':
              SGHelperGlobalVar.addVar('deepLinkingURL', '');
              SGHelperNavigation.navigatePush(this.props.navigation, "SponsorshipDetail", { contentKey: link[1] });
              break;
            case 'StoreAuction':
              SGHelperGlobalVar.addVar('deepLinkingURL', '');
              SGHelperNavigation.navigatePush(this.props.navigation, "AuctionDetail", { contentKey: link[1] });
              break;
            case 'RestoAuction':
              SGHelperGlobalVar.addVar('deepLinkingURL', '');
              SGHelperNavigation.navigatePush(this.props.navigation, "AuctionDetail", { contentKey: link[1] });
              break;
            case 'download':
                SGHelperGlobalVar.addVar('deepLinkingURL', '');
                SGHelperNavigation.navigatePush(this.props.navigation, "MyReferralInMyReward", { referral: true } );
            break;
            case 'quiztenant':
              SGHelperGlobalVar.addVar('deepLinkingURL', '');
              SGHelperNavigation.navigatePush(this.props.navigation, "Quiz", { fID: link[1]});
              break;
            case 'quizbuilding':
              SGHelperGlobalVar.addVar('deepLinkingURL', '');
              SGHelperNavigation.navigatePush(this.props.navigation, "QuizBuilding", { fID: link[1]});
              break;
            case 'qrproductstore':
                SGHelperGlobalVar.addVar('deepLinkingURL', '');
                SGHelperNavigation.navigatePush(this.props.navigation, "StoreProductDetail", { contentKey: link[1], storeKey: link[2],qr:true });
                break;
            case 'qrproductresto':
                SGHelperGlobalVar.addVar('deepLinkingURL', '');
                SGHelperNavigation.navigatePush(this.props.navigation, "RestoMenuDetail", { contentKey: link[1], restoKey: link[2],qr:true });
                break;
            default: console.log("do nothing")
          }
        } 
      }
    }
}

