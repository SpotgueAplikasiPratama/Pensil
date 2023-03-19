/**
* MAG Core Helper for playing sound file
* wrap react-native-sound implementation and hide from MAG UI App
* @format 
* @flow 
* 1. Play Sound with loop
* 2. Pause Sound (pause sound that is playing status - one or all)
* 3. Resume Sound (resume sound that is on pause status - one or all)
* 4. Stop Sound (stop sound that is on playing status - one or all)
* 5. Clear Sound (clear cached sound - one or all)
*/
import React, { Component } from 'react';
import { Alert, Platform, PermissionsAndroid } from 'react-native';
import Sound from 'react-native-sound';
import Tts from 'react-native-tts';
// import Voice from '@react-native-voice/voice';
import {SGHelperType} from './SGHelperType';
import { min } from 'ramda';

export class SGHelperSoundPlayer extends Component {
  static BGMPlayer = null;
  static SFXPlayer = Array();
  static _muteBGM = false;

  //BGM Sound Player Helper (single channel)
  static PlayBGM(soundfile) {
    if (!SGHelperSoundPlayer._muteBGM) {
      Sound.setCategory('Playback', true); // true = mixWithOthers
      if (SGHelperSoundPlayer.BGMPlayer !== null) {
        SGHelperSoundPlayer.BGMPlayer.release();
      }
      const callback = (error, sound) => {
        if (error) {
          return;
        }
        sound.setVolume(0.2);
        sound.setNumberOfLoops(-1);
        sound.play(() => {
          sound.release();
        });
      };
      SGHelperSoundPlayer.BGMPlayer = new Sound(soundfile, error => callback(error, SGHelperSoundPlayer.BGMPlayer));
    }
  }

  static MuteBGM() {
    SGHelperSoundPlayer._muteBGM = true;
    SGHelperSoundPlayer.PauseBGM();
  }

  static UnMuteBGM() {
    SGHelperSoundPlayer._muteBGM = false;
  }

  static StopBGM() {
    if (SGHelperSoundPlayer.BGMPlayer !== null) {
      SGHelperSoundPlayer.BGMPlayer.release();
      SGHelperSoundPlayer.BGMPlayer = null;
    }
  }

  static PauseBGM() {
    if (SGHelperSoundPlayer.BGMPlayer !== null) {
      SGHelperSoundPlayer.BGMPlayer.pause();
    }
  }

  static ResumeBGM() {
    if (!SGHelperSoundPlayer._muteBGM) {
      if (SGHelperSoundPlayer.BGMPlayer !== null) {
        SGHelperSoundPlayer.BGMPlayer.play();
      }
    }
  }

  static isLoadedBGM() {
    return (SGHelperSoundPlayer.BGMPlayer !== null);
  }

  //Sound FX Player Helper (multi channel)
  static playSFX(soundfile, loop, onEnd) {
    Sound.setCategory('Playback', true); // true = mixWithOthers
    const callbackSFX = (error, i) => {
      if (error) {
        return;
      }
      let sound = SGHelperSoundPlayer.SFXPlayer[i];
      sound.setVolume(0.2);
      sound.setNumberOfLoops(loop);
      sound.play(() => {
        onEnd();
        sound.release();
      });
    };
    let n = SGHelperSoundPlayer.SFXPlayer.length;
    SGHelperSoundPlayer.SFXPlayer[n] = new Sound(soundfile, error => callbackSFX(error, n));
  }

  static stopAllSFX() {
    let n = SGHelperSoundPlayer.SFXPlayer.length;
    let i = 0;
    for (i = 0; i < n; i++) {
      if (SGHelperSoundPlayer.SFXPlayer[i]) {
        SGHelperSoundPlayer.SFXPlayer[i].release();
      }
    }
    SGHelperSoundPlayer.SFXPlayer = Array();
  }

  static _isTTSInit = false;
  static _isTTSAvailable = false;
  static _isVoiceAvailable = false;
  static _ttsLanguages = {
    id: { key: ["in-ID", "id-ID"], pitch: 1, volRate: 0.5 },
    en: { key: ["en-US"], pitch: 1, volRate: 0.5 },
    cn: { key: ["zh-CN"], pitch: 1, volRate: 0.5 },
  };
  static _ttsEngines = [];
  static _ttsVoices = [];
  static _ttsEngine = null;
  static _ttsVoice = null;
  static _ttsLanguage = null;
  static _initLanguage = null;
  static async isTTSAvailable(lang) {
    if(!SGHelperSoundPlayer._isTTSInit){
      await SGHelperSoundPlayer.initTTS(lang);
      return SGHelperSoundPlayer._isTTSAvailable;
    }
  }
  static async initTTS(language) {
    if (!SGHelperSoundPlayer._isTTSInit || (SGHelperSoundPlayer._isTTSInit && SGHelperSoundPlayer._initLanguage !== language)) {
      SGHelperSoundPlayer._isTTSInit = true;
      SGHelperSoundPlayer._initLanguage = language;
      SGHelperSoundPlayer._isTTSAvailable = false;
      SGHelperSoundPlayer._isVoiceAvailable = false;
      if (Platform.OS === 'android') {
        //SETUP TTS ENGINE
        SGHelperSoundPlayer._ttsEngine = 'com.google.android.tts';
        SGHelperSoundPlayer._ttsEngines = await Tts.engines();
        for (var i = 0; i < SGHelperSoundPlayer._ttsEngines.length; i++) {
          if (SGHelperSoundPlayer._ttsEngine === SGHelperSoundPlayer._ttsEngines[i].name) {
            SGHelperSoundPlayer._isTTSAvailable = true;
            break;
          }
        }
      }
      //FOR IOS
      if (Platform.OS === 'ios') {
        SGHelperSoundPlayer._isTTSAvailable = true;
      }
      //SETUP TTS VOICE
      if (SGHelperSoundPlayer._isTTSAvailable) {
        SGHelperSoundPlayer._ttsVoices = await Tts.voices();
        for (var i = 0; i < SGHelperSoundPlayer._ttsVoices.length; i++) {
          if ((SGHelperSoundPlayer._ttsLanguages[language].key).includes(SGHelperSoundPlayer._ttsVoices[i].language)) {
            SGHelperSoundPlayer._isVoiceAvailable = true;
            SGHelperSoundPlayer._ttsLanguage = SGHelperSoundPlayer._ttsVoices[i].language;
            SGHelperSoundPlayer._ttsVoice = SGHelperSoundPlayer._ttsVoices[i].id;
            break;
          }
        }
        //SETUP TTS SETTING
        if (SGHelperSoundPlayer._isTTSAvailable && SGHelperSoundPlayer._isVoiceAvailable) {
          Tts.setDefaultLanguage(SGHelperSoundPlayer._ttsLanguage);
          //Tts.setDefaultVoice(SGHelperSoundPlayer._ttsVoice);
          Tts.setDefaultRate(SGHelperSoundPlayer._ttsLanguages[language].volRate);
          Tts.setDefaultPitch(SGHelperSoundPlayer._ttsLanguages[language].pitch);
        }
      }
    }
  }
  static readText(strText, lang) {
    SGHelperSoundPlayer.initTTS(lang).then(() => {
      if (SGHelperSoundPlayer._isTTSAvailable && SGHelperSoundPlayer._isVoiceAvailable) {
        Tts.getInitStatus().then(() => {
          Tts.stop();
          Tts.speak(strText);
        });
      }
    });
  }
  static stopReadingText() {
      if (SGHelperSoundPlayer._isTTSAvailable && SGHelperSoundPlayer._isVoiceAvailable) {
        Tts.getInitStatus().then(() => {
          Tts.stop();
        });
      }
  }
  /*
  static _permissionGranted = false;
  static async STTInit(){
    if(SGHelperSoundPlayer._permissionGranted) return;
    PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.RECORD_AUDIO).then((granted) => {
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        SGHelperSoundPlayer._permissionGranted = true;
      } else {
        SGHelperSoundPlayer._permissionGranted = false;
      }
    }).catch((e)=>{alert(e)});
  }

  static STTStart(lang, onEnd, onResult, onError){
    SGHelperSoundPlayer.STTInit();
    Voice.onSpeechEnd = onEnd;
    Voice.onSpeechResults = onResult;
    Voice.onSpeechError = onError;
    Voice.start(lang);  
  }
  static STTStop(){
    Voice.stop();
  }
  static STTAvailable(){
    return Voice.isAvailable();
  }
  static STTGetServices(){
    return Voice.getSpeechRecognitionServices();
  }
  */
}
