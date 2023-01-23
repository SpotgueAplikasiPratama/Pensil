/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import { SGView, SGIcon, SGDialogBox, } from '../../core/control';
import { View, Text, } from 'react-native';
import MyCore from '../../core/core.js';
import { SGBaseScreen } from '../../core/screen/SGBaseScreen';

import RNFetchBlob from 'react-native-blob-util';
import { SGHelperWindow, SGHelperNavigation, SGHelperType, SGHelperGlobalVar } from '../../core/helper/';
import LogWindow from '../component/LogWindow';
import ErrorLogWindow from '../component/ErrorLogWindow';

export class PluginScreen extends SGBaseScreen {
  constructor(props, context, ...args) {
    super(props, context, ...args);
    this.GenerateComponent = () => { return (<SGView style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' }}><Text>{'- No Plugin Loaded -'}</Text></SGView>) };
    this.state = { showMenu: false, showLog: false, showErrorLog: false, loadError: false };
    this.dbID = SGDialogBox.getDialogBoxID();
    this._isSingleFile = false;
    this.props.navigation.setOptions({
      headerShown: false,
    });
  }

  componentDidMount() {
    SGDialogBox.pushActiveDialogBox(this.dbID);
    this.loadPlugin(false);
  }

  async loadServerFile(filePath, strLabel) {
    try {
      var APIURL = 'https://apihostlive.azurewebsites.net/api/LoadPluginNew?code=RmpriOFKeqEZrnaWA0AYw1bGzNcYviT6fGtkCksG5L1FTU1pV08O7g==';
      var _result = '';
      _result = await RNFetchBlob.fetch('GET', APIURL, { filepath: '/SGVisitorModule/'+filePath });
      if (_result.data === '') { throw 'Empty file!' }
      if (_result.respInfo.status !== 200) { throw _result.data }
      return { data: _result.data, exception: null, isError: false }
    } catch (e) {
      MyCore.logError(strLabel, e);
      return { data: '', exception: e, isError: true }
    }
  }

  async loadLocalFile(filePath, strLabel) {
    try {
      var _result = await RNFetchBlob.fs.readFile(filePath);
      return { data: _result, exception: null, isError: false }
    }
    catch (e) {
      MyCore.logError(strLabel, e);
      return { data: '', exception: e, isError: true }
    }
  }

  async evalPlugin() {
    if (SGHelperType.right(this.filePath, 2) === 'js' || SGHelperType.right(this.filePath, 11) === 'plugin.json') {
      try {
        var Comp;
        var Core = MyCore;
        var React = Core.React;
        eval(this.strCode);
        this.GenerateComponent = () => { return <Comp /> };

        //save to local file cache
        if (!SGHelperType.isDefined(SGHelperGlobalVar.getVar('PluginFileCache')[this.filePath]) || this.forceReload) { await this.cachePlugin(); }
        this.setState({});
        SGDialogBox.showToast(this.loadFromCache ? 'Plugin Loaded From Cache' : (this.forceReload ? 'Plugin Re-Loaded' : 'Plugin Loaded'));
      }
      catch (e) {
        MyCore.logError('PluginScreen.loadPlugin.eval', e);
      } finally {
        SGDialogBox.hideDialogBox(this.db1);
      }
    }
  }

  async cachePlugin() {
    let dirs = RNFetchBlob.fs.dirs
    var _cachePath = dirs.MainBundleDir + '/plugin/' + SGHelperType.getGUID() + '.js';
    await RNFetchBlob.fs.writeFile(_cachePath, this.strCode);
    SGHelperGlobalVar.getVar('PluginFileCache')[this.filePath] = { pluginName: this.pluginName, filePath: _cachePath };
  }

  async loadPlugin(forceReload = false) {
    // this.db1 = SGDialogBox.showLoading('Loading Plugin');
    SGDialogBox.updateProgress(0);
    this.db1 = SGDialogBox.showProgress('Loading plugin files')
    var _rootFolder = this.props.route.params.rootFolder + '/';
    this.filePath = _rootFolder + this.props.route.params.pluginFile;
    this.strCode = '';
    this.pluginFileLoaded = {};
    this.forceReload = forceReload;
    this.loadFromCache = false;
    this.pluginName = '';
    var _isError = false;

    if (SGHelperType.isDefined(SGHelperGlobalVar.getVar('PluginFileCache')[this.filePath]) && !forceReload) {
      this.pluginName = SGHelperGlobalVar.getVar('PluginFileCache')[this.filePath].pluginName;
      var _res = await this.loadLocalFile(SGHelperGlobalVar.getVar('PluginFileCache')[this.filePath].filePath, 'PluginScreen.loadPlugin.cache.' + this.filePath);
      this.strCode = _res.data;
      this.loadFromCache = true;
      this.evalPlugin();
    } else {
      if (SGHelperType.right(this.filePath, 11) === 'plugin.json') { //load plugin file as pack
        this._isSingleFile = true;
        this.pluginName = 'Plugin Pack: ' + this.filePath;
        var _res = await this.loadServerFile(this.filePath, 'PluginScreen.loadPlugin.pack.' + this.filePath);
        _isError = _isError || _res.isError;
        this.strCode = _res.data + String.fromCharCode(13) + " Comp = Main;";
        if (!_isError) {
          this.evalPlugin();
        } else {
          SGDialogBox.hideDialogBox(this.db1);
        }
      } else { //load single plugin file
        this._isSingleFile = true;
        this.pluginName = 'SingleFilePlugin: ' + this.filePath;
        var _res = await this.loadServerFile(this.filePath, 'PluginScreen.loadPlugin.single.' + this.filePath);
        _isError = _isError || _res.isError;
        if (SGHelperType.right(this.filePath, 2) === 'js') {
          this.strCode = _res.data + String.fromCharCode(13) + " Comp = Module;";
        } else {
          this.strCode = _res.data;
        }
        if (!_isError) {
          this.evalPlugin();
        } else {
          SGDialogBox.hideDialogBox(this.db1);
        }
      }
    }
  }

  renderBar() {
    var { w, h, p } = SGHelperWindow.getWHPNoHeader();
    return (
      <>
        <SGDialogBox dialogBoxID={this.dbID} />
        <SGView dontRandomColor style={{ position: 'absolute', alignItems: 'center', justifyContent: 'space-around', flexDirection: 'row', width: (this.state.showMenu ? w * 0.85 : w * 0.08), height: w * 0.08, borderRadius: 2 * p, bottom: 30, right: 10, backgroundColor: 'black' }}>
          <SGIcon hidden={this.state.showMenu} preset={SGIcon.preset.h3B} name={SGIcon.Icon.arrowLeft} style={{ color: 'white' }} onPress={() => { this.setState({ showMenu: true }) }} />
          <SGIcon hidden={!this.state.showMenu} preset={SGIcon.preset.h3B} name={SGIcon.Icon.arrowRight} style={{ color: 'white' }} onPress={() => { this.setState({ showMenu: false }) }} />
          <SGIcon hidden={!this.state.showMenu} preset={SGIcon.preset.h3B} name={SGIcon.Icon.download} style={{ color: 'white' }} onPress={() => { this.loadPlugin(true); }} />
          <SGIcon hidden={!this.state.showMenu} preset={SGIcon.preset.h3B} name={SGIcon.Icon.sync} style={{ color: 'white' }} onPress={() => { this.forceUpdate(); SGDialogBox.showToast('Screen Refreshed') }} />
          <SGIcon hidden={!this.state.showMenu} preset={SGIcon.preset.h3B} name={SGIcon.Icon.console} style={{ color: 'white' }} onPress={() => { this.setState({ showLog: true }); }} />
          <SGIcon hidden={!this.state.showMenu} preset={SGIcon.preset.h4B} name={SGIcon.Icon.error} style={{ color: 'white' }} onPress={() => { this.setState({ showErrorLog: true }); }} />
          <SGIcon hidden={!this.state.showMenu} preset={SGIcon.preset.h4B} name={SGIcon.Icon.question} style={{ color: 'white' }} onPress={() => { SGDialogBox.showSuccess(null, 'Plugin Info', this.pluginName, 'OK', () => { }); }} />
          <SGIcon hidden={!this.state.showMenu} preset={SGIcon.preset.h3B} name={SGIcon.Icon.home} style={{ color: 'white' }} onPress={() => { SGHelperNavigation.goBack(this.props.navigation); }} />
        </SGView>
        <SGView dontRandomColor hidden={!this.state.showLog} style={{ position: 'absolute', bottom: 0, right: p, width: w - 2 * p, height: w * 0.5, backgroundColor: 'rgba(0,0,0,0.95)', borderTopLeftRadius: p, borderTopRightRadius: p, padding: p }}>
          <LogWindow onClose={(() => { this.setState({ showLog: false }) }).bind(this)} />
        </SGView>
        <SGView dontRandomColor hidden={!this.state.showErrorLog} style={{ position: 'absolute', bottom: 0, right: p, width: w - 2 * p, height: w * 0.5, backgroundColor: 'rgba(255,255,255,0.95)', borderTopLeftRadius: p, borderTopRightRadius: p, padding: p }}>
          <ErrorLogWindow onClose={(() => { this.setState({ showErrorLog: false }) }).bind(this)} />
        </SGView>
      </>
    );
  }

  static getDerivedStateFromError(error) {
    return { loadError: true };
  }

  componentDidCatch(error, errorInfo) {
    MyCore.logError('PluginScreen.render', error + String.fromCharCode(10) + JSON.stringify(errorInfo).replace(/\\n/g, String.fromCharCode(10)));
  }

  render() {
    if (this.state.loadError) {
      this.GenerateComponent = () => { return (<SGView style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' }}><Text style={{ color: 'red' }}>{'- Error Loading Plugin! -\nPlease check the Error log'}</Text></SGView>) };
      this.state.loadError = false;
    }
    return React.createElement(View, { style: { flex: 1, } }, this.GenerateComponent(), this.renderBar());
  }
}