/**
* MAG Core Helper for Managing File stored in mobile devices
* wrap react native file implementation and hide from MAG UI App
* @format 
* @flow 
* 1. get file
* 2. save / create file
* 3. rename file
* 4. download file (full or partial + merge)
* 5. delete file
* 6. get file info
* 7. duplicate file
* 8. move file
* 9. upload file
*/

import React from 'react';
import {Platform} from 'react-native';
import RNFetchBlob from 'react-native-blob-util';

export class SGHelperFileMgr {
    static getRealmDir(){
        return Platform.OS === 'android'? '' : RNFetchBlob.fs.dirs.LibraryDir+'/';
    }
    static getDownloadDir(){
        return Platform.OS === 'android'? RNFetchBlob.fs.dirs.DownloadDir : RNFetchBlob.fs.dirs.DocumentDir;
    }
}
