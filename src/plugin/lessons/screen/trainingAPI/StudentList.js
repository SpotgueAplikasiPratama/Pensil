import { element, string } from 'prop-types';
import React from 'react';
import Description from '../../component/Description';
import Core from '../../core/core';


export default class StudentList extends Core.Screen.SGBaseScreen {

    createStyleSheet = (whp) => {
        const { StyleSheet, } = Core;
        var { w, h, p } = whp;
     
        return StyleSheet.create({
            rv1: { height: 0.7*w,justifyContent: 'center', alignItems: 'flex-start', backgroundColor:'#fff3d1'},
            v1_header: { width: w*0.9, padding: p, borderRadius: p, borderColor: 'rgb(150,150,150)', borderWidth: p / 4, justifyContent: 'flex-start', },
            v2_header: { width: w - 2 * p, padding: 0, marginBottom: p, flexDirection: 'row', justifyContent: 'space-between' },
            //v3: { flexDirection: 'row', justifyContent: 'flex-end' },
            v4: { width: w - 2 * p, padding: 0, justifyContent: 'flex-start', },
            sv1: { width: w - 2 * p, maxHeight: w, },
            c1: { width: w - 2 * p, padding: p },
            c1_1: { width: 0.5*w - 2 * p, padding: p },
            c2: { width: w - 2 * p, padding: p },
            img1: { width: (w - 2 * p) * 0.2, height: (w - 2 * p) * 0.2, backgroundColor:'transparent', marginLeft:w*0.1},
            img2: { width: (w - 2 * p) * 0.2, height: (w - 2 * p) * 0.2, backgroundColor:'transparent', marginLeft:w*0.145},

            t1: { fontSize: w * 0.035, fontWeight: 'bold' },
            v1: { width: w*0.9, padding: p, borderRadius: p, borderColor: 'rgb(150,150,150)', borderWidth: 1, marginBottom: p, flexDirection: 'column', justifyContent: 'space-between', alignItems: 'flex-start', backgroundColor:'#f0ffff' },
            v2: { width: (w - 2 * p) * 0.92, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
            v3: { width: (w - 2 * p) * 0.72, paddingHorizontal: p, padding: 0, justifyContent: 'flex-start', alignItems: 'flex-start' },
            
               
        });
    }
    constructor(props, context, ...args) {
        super(props, context, ...args);
        //this._style = this.createStyleSheet(this.WHP);
        //this._whp = { w: props.style.width, h: props.style.height, p: props.style.padding }
        this._style = this.createStyleSheet(this._whp);
        this.SV1 = React.createRef();
        this.props.navigation.setOptions({
            title: '',
            headerShown: false
          });
          this.state= {data: []};    
          this.sekolah='';
          Core.Helper.SGHelperGlobalVar.addVar('id','');
          Core.Helper.SGHelperGlobalVar.addVar('nama','');
          Core.Helper.SGHelperGlobalVar.addVar('umur',0);
          Core.Helper.SGHelperGlobalVar.addVar('sekolah',"");

        }
    // async getData(){
    //     const { SGHelperNavigation,SGHelperDB } = Core.Helper;
    //     try{
    //         this.state.data = await SGHelperDB._get("tbFO");
    //         Core.log(JSON.stringify(this.state.data));

    //     }
    //     catch(e){
    //         Core.log(e);
    //     }
    // }
    async componentDidMount(){
        this._unsubscribe = this.props.navigation.addListener('focus', async () => {
          await this._onCallAPIStudent();
          this.forceUpdate()
        });
      }
      // async _onCallAPIStudent(){
      //   try{
      //     this.state.data = await Core.Helper.SGHelperAPICall.callAPIAsync('GET',"https://skolineapilessonrh.azurewebsites.net/api/FunctionGetAll?code=RN8M4QY4QmPGZyUNyhBapwGmnkliTNM7pxSYcEolKqkyGkZaTaDdRQ==");
      //     Core.log(JSON.stringify(this.state.data));
      //     Core.log('data masuk');
      //   } catch(e){
      //     Core.log(e);
      //   }
      // }
      async _onCallAPIStudent(){
        var data1 = {id:'', nama: '', umur: 0, sekolah:''};
        try{
          var v = await Core.Helper.SGHelperAPICall.callAPIAsync("POST",
          "https://skolineapilessonrh.azurewebsites.net/api/FunctionSearchByName?code=FhMeVXhiFOEz71N/wk7d16Fec11xU6v4q2hzr4pW5aaV0YnmTUimeg==","",
          JSON.stringify(data1));
          Core.log(JSON.stringify(v));
          this.state.data = JSON.parse(v.data);
          this.forceUpdate();
          
        } catch(e){
          Core.log(e);
        }
      }

      async _onCallAPISearchStudent(){
        var data1 = {id:'', nama: this.nama, umur: 0, sekolah:''};
        try{
          var v = await Core.Helper.SGHelperAPICall.callAPIAsync("POST",
          "https://skolineapilessonrh.azurewebsites.net/api/FunctionSearchByName?code=FhMeVXhiFOEz71N/wk7d16Fec11xU6v4q2hzr4pW5aaV0YnmTUimeg==","",
          JSON.stringify(data1));
          Core.log(JSON.stringify(v));
          this.state.data = JSON.parse(v.data);
          this.forceUpdate();
          
        } catch(e){
          Core.log(e);
        }
      }
      async _deleteEdit(){
        Core.Helper.SGHelperGlobalVar.setVar('id',item.id);
        Core.Helper.SGHelperGlobalVar.setVar('nama',item.nama);
        Core.Helper.SGHelperGlobalVar.setVar('umur',item.umur);
        Core.Helper.SGHelperGlobalVar.setVar('sekolah',item.sekolah);
        Core.Helper.SGHelperNavigation.navigatePush(this.props.navigation,'EditStudent');
        this.forceUpdate();
      }
  render() {
    const { SGRootScrollView,SGIcon,SGButton,SGView,SGRootView,SGImage,SGText,SGFlatList,SGTouchableOpacity ,SGTextInput} = Core.Control;
    const { SGHelperNavigation } = Core.Helper;
    
    var { w, h, p } = this._whp;
    var style = this._style;
    return (
        <SGRootView style={style.rv1}>
            <SGView style={{ flexDirection: 'row', top:20,marginBottom:15}}>
            <SGTextInput style={{width:w*0.5}} value={this.nama} placeholder={'Masukan Nama'} onValueChange={(v)=>{this.nama=v;}}/>
            <SGButton label={'Cari'} onPress={()=>{this._onCallAPISearchStudent()}} />        
            <SGTouchableOpacity style= {{backgroundColor:'#8E2B2B',width:w*0.1, height:w*0.1,justifyContent:'center',alignItems:'center',borderRadius:0.25*w}} onPress={()=>{SGHelperNavigation.navigatePush(this.props.navigation, 'AddStudent')}}>
                    <SGText preset={SGText.preset.h5B}style= {{color:'white'}} >+</SGText>
                </SGTouchableOpacity>
         </SGView>
         <SGText preset={SGText.preset.h3B}>Student List</SGText>
         {/* <SGText preset={SGText.preset.h3B}>{this.state.data}</SGText> */}
            <SGRootScrollView   >    
                <SGView style={style.v1_header}>
                <SGFlatList
                    data={this.state.data}
                    renderItem={({ item }) =>{ 
                      return(
                        <SGTouchableOpacity onPress= {(async)=>{Core.Helper.SGHelperGlobalVar.setVar('id',item.id);Core.Helper.SGHelperGlobalVar.setVar('nama',item.nama);Core.Helper.SGHelperGlobalVar.setVar('umur',item.umur);Core.Helper.SGHelperGlobalVar.setVar('sekolah',item.sekolah);Core.Helper.SGHelperNavigation.navigatePush(this.props.navigation,'EditStudent');this.forceUpdate();}}>
                          <SGView style={style.v1} >
                              <SGText preset={SGText.preset.h7B}>{'Nama      : '+item.nama}</SGText>  
                              <SGText preset={SGText.preset.h7B}>{'Umur      : '+item.umur}</SGText>   
                              <SGView style={style.v2} >
                              <SGText preset={SGText.preset.h7B}>{'Sekolah  : '+item.sekolah}</SGText>    
                              <SGView style={style.v3} >
                              </SGView>
                              </SGView> 

                          </SGView>
                        </SGTouchableOpacity>
                      )}}
                    keyExtractor={item => item.id}
                /> 
                </SGView>
            </SGRootScrollView> 
            {/* <SGButton label={'Simpan'} onPress={()=>{this._onCallAPIStudent()}} />         */}

            
        </SGRootView>
        

    );
  }
}
