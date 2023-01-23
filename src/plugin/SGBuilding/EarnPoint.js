import React from 'react';
import { SGButton, SGDatePicker, SGImagePicker } from '../../core/control';
import Core from '../../core/core';

export default class EarnPoint extends Core.Screen.SGBaseScreen {
  createStyleSheet = (whp) => {
    var { w, h, p } = whp;
    return Core.StyleSheet.create({
      v1: { justifyContent: 'center', alignItems: 'flex-start', width: w, height: h, overflow: 'visible' },
      to1: { marginBottom: 10 },
      t1: { color: 'blue' },
    });
  }

  constructor(props, context, ...args) {
    super(props, context, ...args);
    this.style = this.createStyleSheet(this.WHP);
    this.pvID1 = Core.Control.SGPopView.getPopViewID();
    this.pvID2 = Core.Control.SGPopView.getPopViewID();
    this.pvID3 = Core.Control.SGPopView.getPopViewID();
    this.x = [{
        Id: '000000000000',
        Points:20, 
        Name: 'Gerry Hasang', 
        Uri:'https://cdn.discordapp.com/attachments/708928890990493697/940120464292995092/unknown.png', 
     }];
  }

  showPopHistoryDetail(){
    Core.Control.SGPopView.showPopView(this.pvID1);
  }

  showPopViewConfirmation(){
    Core.Control.SGPopView.showPopView(this.pvID3);
  }
  showPopRequestDetail(){
    Core.Control.SGPopView.showPopView(this.pvID2);
  }

  cetakdata(data){
    const { SGText,SGIcon, SGRootView,SGView, SGImage,SGTouchableOpacity, SGButton} = Core.Control;
    const { SGHelperNavigation } = Core.Helper;
    var { w, h, p } = this.WHPNoHeader;
    var style = this.style;
    return(
    <SGTouchableOpacity style={style.to1} onPress={this.showPopRequestDetail.bind(this)}>
    <SGRootView style={{marginTop:5*p, flexDirection:'row', width:0.9*w, justifyContent:'space-between', borderWidth:1, borderRadius:10}}>
        <SGView style={{alignItems:'flex-start'}}>
        <SGText>Customer ID   : {data.item.Id}</SGText>
        <SGText>Customer Name : {data.item.Name}</SGText>
        <SGText>Points : + {data.item.Points}</SGText>
        </SGView>
        <SGView style={{flexDirection:'row', justifyContent:'space-between',width:0.25*w }}>
        <SGIcon name={SGIcon.Icon.check} preset={SGIcon.preset.h1B} style={{color:'green'}} onPress={() => { SGPopView.hidePopView(this.pvID2) }}/>
          <SGIcon name={SGIcon.Icon.close} preset={SGIcon.preset.h1B} style={{color:'red'}} onPress={() => { SGPopView.hidePopView(this.pvID2) }}/>
        </SGView>
    </SGRootView>
     </SGTouchableOpacity>
    )
}

cetakdata2(data){
    const { SGText,SGIcon, SGRootView,SGView, SGImage,SGTouchableOpacity, SGButton} = Core.Control;
    const { SGHelperNavigation } = Core.Helper;
    var { w, h, p } = this.WHPNoHeader;
    var style = this.style;
    return(
        <SGTouchableOpacity onPress={this.showPopHistoryDetail.bind(this)}>
    <SGRootView style={{marginTop:5*p, flexDirection:'row', width:0.9*w, justifyContent:'space-between', borderWidth:1, borderRadius:10}}>
        <SGView style={{alignItems:'flex-start'}}>
        <SGText>Customer ID   : {data.item.Id}</SGText>
        <SGText>Customer Name : {data.item.Name}</SGText>
        <SGText>Points added : {data.item.Points}</SGText>
        <SGText>Dates added : 20/03/2022</SGText>
        </SGView>
    </SGRootView>
    </SGTouchableOpacity>
    )
}

  render() {
    const { SGPopView, SGIcon,SGView,SGRootView, SGTouchableOpacity, SGText, SGFlatList, SGViewPager, SGImage, SGRootScrollView, SGTabView, SGTextInput, SGDatePicker, SGImagePicker, SGButton, SGPicker, SGScrollView} = Core.Control;
    const { SGHelperNavigation, SGHelperType } = Core.Helper;
    var style = this.style;
    var { w, h, p } = this.WHPNoHeader;
    return (
    <SGRootView style = {{backgroundColor: 'white'}}>
    <SGTabView locked={false} hideTabBar={this._hideTabView} ref={this._tabView} scrollableTabBar={true}  style={{alignSelf: 'center'}} onChangeTab={(e) => { this._tabIndex = e.i; this.forceUpdate(); }}>
                <SGView tabLabel='Earn Point' style={{height:h*0.73,justifyContent: 'flex-start', backgroundColor:'white'}}>
                <SGScrollView>
                    <SGImage style={{backgroundColor:'hidden',marginBottom:10, width: w*0.5, height:w*0.5,borderRadius:10, alignItems:'flex-start', justifyContent:'flex-start',paddingVertical:4*p}}source={{ uri:'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/Icons8_flat_add_image.svg/1024px-Icons8_flat_add_image.svg.png' }}/>
                    <SGText style={{alignSelf:'flex-start',marginLeft:w*0.05}}>Visitor ID</SGText>
                    <SGTextInput disabled={true} style={{width:w*0.8}}dataType={SGTextInput.dataType.number} label={'ID'} placeholder={'Asumsikan Sudah terisi dari scan'} value={this.temp} onChangeText={(v) => { this.stock = v; this.forceUpdate(); }}/>
                    <SGText style={{alignSelf:'flex-start',marginLeft:w*0.05}}>Store/Resto</SGText>
                    <SGPicker style={{width:w*0.8}} label={'Pilih Resto'} language={'ID'} value={'b'} optionList={[{ key: 'a', title: 'Resto1' }, { key: 'b', title: 'Resto2' }, { key: 3, title: 'Resto3' }, { key: 4, title: 'Resto' }]} />
                    <SGText style={{alignSelf:'flex-start',marginLeft:w*0.05}}>Receipt No</SGText>
                    <SGTextInput style={{width:w*0.8}}dataType={SGTextInput.dataType.number} label={'ID'} placeholder={'Enter Here'} value={this.temp} onChangeText={(v) => { this.stock = v; this.forceUpdate(); }}/>
                    <SGText style={{alignSelf:'flex-start',marginLeft:w*0.05}}>Receipt Date</SGText>
                    <SGDatePicker style={{width:w*0.8}} dateRange={{ start: new Date(0), end: new Date() }} label={'Date'} placeholder={'Input Harga disini'} value={this.temp} onChangeText={(v) => { this.harga = v; this.forceUpdate(); }}/>
                    <SGText style={{alignSelf:'flex-start',marginLeft:w*0.05}}>Receipt Ammount</SGText>
                    <SGTextInput style={{width:w*0.8}} dataType={SGTextInput.dataType.number} label={'ID'} placeholder={'Enter Here'} value={this.temp} onChangeText={(v) => { this.stock = v; this.forceUpdate(); }}/>
                    <SGButton label={'Earn Points'} onPress={this.showPopViewConfirmation.bind(this)} />
                </SGScrollView>
                </SGView>
                <SGView tabLabel='Request' style={{height:h*0.73,justifyContent: 'flex-start', backgroundColor:'white'}}>
                <SGScrollView>
                        <SGFlatList data = {this.x} renderItem={this.cetakdata.bind(this)}> 
                        </SGFlatList>
                    </SGScrollView>
                </SGView>
                <SGView tabLabel='History' style={{height:h*0.73,justifyContent: 'flex-start', backgroundColor:'white'}}>
                <SGScrollView>
                        <SGFlatList data = {this.x} renderItem={this.cetakdata2.bind(this)}> 
                        </SGFlatList>
                </SGScrollView>
                </SGView>
            </SGTabView>    


    <SGPopView modal vPos={'center'} hPos={'center'} animationType={'none'} popViewID={this.pvID3}>
        <SGView style={{ width: w * 0.9, height: w * 0.5, backgroundColor: 'white',borderWidth:2, borderRadius:10, justifyContent:'center'}}>
          <SGText preset={SGText.preset.h4B}>Apakah anda yakin ingin menambahkan point?</SGText>
          <SGView style={{width: '70%', flexDirection:'row', justifyContent:'space-between'}}>
          <SGIcon name={SGIcon.Icon.check} preset={SGIcon.preset.w7} style={{color:'green'}} onPress={() => { SGPopView.hidePopView(this.pvID3) }}/>
          <SGIcon name={SGIcon.Icon.close} preset={SGIcon.preset.w7} style={{color:'red'}} onPress={() => { SGPopView.hidePopView(this.pvID3) }}/>
          </SGView>
        </SGView>
    </SGPopView>

    <SGPopView vPos={'center'} hPos={'center'} animationType={'none'} popViewID={this.pvID1}>
        <SGView style={{height:1.5*w}}>
          <SGScrollView style={{ width: w * 0.9, backgroundColor: 'white',borderWidth:2, borderRadius:10, justifyContent:'flex-start'}}>
          <SGIcon name={SGIcon.Icon.close} style={{color:'black',alignSelf:'flex-end', marginRight:5}} preset={SGIcon.preset.h2B} onPress={() => { SGPopView.hidePopView(this.pvID1) }}/>
          <SGView style={{width:w * 0.9, alignItems:'flex-start'}}>
          <SGText>Customer ID   : {this.x[0].Id}</SGText>
          <SGText>Customer Name : {this.x[0].Name}</SGText>
          <SGText>Points : + {this.x[0].Points}</SGText>
          <SGText>Dates Proposed : 20/03/2022</SGText>
          <SGImage style={{ alignSelf:'center',width:w * 0.8 , height:1.3*w,borderRadius:10, justifyContent:'flex-start'}}source={{ uri: 'https://cdn.discordapp.com/attachments/708928890990493697/940120464292995092/unknown.png' }}>
          </SGImage>
          <SGButton style={{marginBottom:2*p,alignSelf:'center'}} label={'Cancel'} onPress={() => { SGPopView.hidePopView(this.pvID1) }}/>
          </SGView>  
        </SGScrollView>
        </SGView>
    </SGPopView>

    <SGPopView vPos={'center'} hPos={'center'} animationType={'none'} popViewID={this.pvID2}>
         <SGView style={{height:1.5*w}}>
          <SGScrollView style={{ width: w * 0.9, backgroundColor: 'white',borderWidth:2, borderRadius:10, justifyContent:'flex-start'}}>
          <SGIcon name={SGIcon.Icon.close} style={{color:'black',alignSelf:'flex-end', marginRight:5}} preset={SGIcon.preset.h2B} onPress={() => { SGPopView.hidePopView(this.pvID2) }}/>
          <SGView style={{width:w * 0.9, alignItems:'flex-start'}}>
          <SGText>Customer ID   : {this.x[0].Id}</SGText>
          <SGText>Customer Name : {this.x[0].Name}</SGText>
          <SGText>Points : + {this.x[0].Points}</SGText>
          <SGText>Dates Proposed : 20/03/2022</SGText>
          <SGImage style={{marginBottom: 2*p,alignSelf:'center', width:w * 0.8 , height:1.3*w,borderRadius:10, justifyContent:'flex-start'}}source={{ uri: 'https://cdn.discordapp.com/attachments/708928890990493697/940120464292995092/unknown.png' }}>
          </SGImage>
          </SGView>  
        </SGScrollView>
        </SGView>
    </SGPopView>
    </SGRootView>
    );
  }
}