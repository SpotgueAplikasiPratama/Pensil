import OneSignal from 'react-native-onesignal'; //OneSignal Push Notification
export class SGHelperOneSignal {

    static setNotificationOpenedHandler(handler){
        OneSignal.setNotificationOpenedHandler(handler);
    }
    static clearHandlers(){
        OneSignal.clearHandlers();   
    }
    static setAppId(apikey){
        OneSignal.setAppId(apikey);
    }
    static async getDeviceState(){
        return OneSignal.getDeviceState();
    }

    static setNotificationWillShowInForegroundHandler(handler){
        OneSignal.setNotificationWillShowInForegroundHandler(handler);
    }
}
