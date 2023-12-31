import React from 'react';
import Core from '../../../core/core';

export default class MyTranslator {
    static _json = {
      id:{
        SpotgueAppMyCardList:{
          orangmenyukai: 'orang menyukai ini',
          cards:'Kartu',
          confirmation:'Konfirmasi',
          Location: 'Lokasi',
          specificPlace: 'Tempat Tertentu',
          DateLabel: 'Tanggal Registrasi : ',
          ReasonLabel: 'Alasan : ',
          Status: 'Status',
          StatusTitle: "Status Registrasi",
          Submitted: "Diajukan",
          Accepted: "Diterima",
          Rejected: "Ditolak",
          SortNewestRegisDate: "Tanggal Daftar Terbaru",
          SortOldestRegisDate: "Tanggal Daftar Terlama",
          SortNewestExpiredDate: "Tanggal Kadaluwarsa Terbaru",
          SortOldestExpiredDate: "Tanggal Kadaluwarsa Terlama"

        },
        SpotgueAppMyCard:{
          MyCard: 'Kartu Saya',
          SeeMore: 'Lihat Selengkapnya',
        },

        LoyatyCard:{
          PointAvailable: 'Poin Tersedia',
          ExpiredLabel: 'Kadaluarsa Pada',
          valid: 'berlaku',
          Thru: 'hingga',
          Expired: 'Kedaluwarsa',
          Blocked: 'Diblokir'
        },
        Lesson23Screen : {
            login: 'masuk',
            update: 'ubah',
            welcome: 'Selamat Datang',  
        },
        Lesson20Screen : {
            rotate: 'putar',
            scale: 'Perbesar Lingkaran 1x-2x'
        },
        CardDetail:{
            memberCard: 'Kartu Member',
            cardBenefits: 'Manfaat Kartu',
            tandc: 'Syarat dan Ketentuan',
            rewardsSelection:'Pemilihan Hadiah',
            tc:'Syarat & Ketentuan',
            EarnPoint: '️Dapatkan Poin',
            PointHistory: 'Riwayat Poin',
            RegistrerButton: "Daftar Sekarang",
            tabCard: 'Kartu Saya',
            tabEarn: 'Tambah Poin',
            showQRLabel: 'Tampilkan QR Saya >'
        },
        PointHistory:{
          EarnLabel: 'Dapat',
          RedeemLabel: "Tukar",
          ExpiredLabel: "Kadaluwarsa"
        },
        EarnPoint:{
          earnPoints:'Dapatkan Poin',
          tandc: 'Syarat dan Ketentuan',
          titleEarn:'Untuk Mendapatkan Poin',
          SelfLabel: 'Sendiri',
          MallLabel: 'Mall',
          TenantLabel: 'Tenant'
        },
        EarnPointForm:{
          receiptNumberLabel:'Nomor Struk',
          receiptNumberPlaceholder:'Masukkan Nomor Struk',
          receiptImageLabel: 'Foto struk',
          minReceiptAmountLabel: 'Minimum Total Belanja  : ',
          receiptAmountLabel: 'Total Belanja',
          receiptAmountPlaceholder: 'Masukkan Total Harga Struk',
          receiptDateLabel: 'Tanggal Struk',
          storeName: 'Nama Toko/Resto',
          addReceiptButton: 'Tambahkan Struk',
          receiptNumberValidator: 'Nomor Struk harus diisi',
          receiptImageValidator: 'Foto Struk harus diisi',
          receiptSameValidator: 'Anda memasukkan nomor struk yang sama dengan nomor struk sebelumnya. pastikan kembali nomor struk yang anda isi',
          receiptAmountValidator: 'Harga Struk Harus Melebihi Minimum Total Belanja',
          storeNameValidator: 'Nama Toko/Resto harus dipilih',
          receiptDateValidator: 'Struk untuk Tanggal yang dipilih sudah tidak berlaku',
        },
        EarnPointSelf:{
          upload:'Unggah Bukti Transaksi',
          overReceipt:'Total Struk yang anda masukkan melebihi batas struk yang diperbolehkan',
          confirmationLabel: 'Apakah Anda Sudah Yakin Untuk Mengirim Permintaan Penambahan Poin?',
          successLabel: 'Struk Berhasil diUnggah'
        },
        RegisterScreen:{
          title: 'Pendaftaran Anggota',
          tabNew: 'Anggota Baru',
          tabExisting: 'Anggota Lama',
          registerButton: 'Daftar'
        },
        AddNewRegistrationForm:{
          cardNumberLabel: 'Nomor Kartu Anggota',
          cardNumberPlaceholder: 'Masukkan Nomor Kartu Anggota',
          cardTypeLabel: 'Jenis Kartu',
          IDCardNumberLabel: 'Nomor KTP',
          IDCardNumberPlaceholder: 'Masukkan Nomor KTP',
          IDCardImageLabel: 'Foto KTP',
          fullNameLabel: 'Nama Lengkap',
          fullNamePlaceholder: 'Masukkan Nama Lengkap',
          emailLabel: 'Email',
          emailPlaceholder: 'Masukkan Email',
          phoneNumberLabel : 'Nomor Handphone',
          phoneNumberPlaceholder: 'Masukkan Nomor Handphone',
          birthDateLabel: 'Tanggal Lahir',
          birthPlaceLabel: 'Tempat Lahir',
          birthPlacePlaceholder: 'Masukkan Tempat Lahir',
          genderLabel: 'Jenis Kelamin',
          religionLabel: 'Agama',
          maritalStatusLabel: 'Status Pernikahan',
          countryLabel: 'Negara',
          provinceLabel: 'Provinsi',
          cityLabel: 'Kota',
          addressLabel: 'Alamat',
          addressPlaceholder: 'Masukkan Alamat',
          occupationLabel: 'Pekerjaan',
          occupationPlaceholder: 'Masukkan Pekerjaan',
          incomeLabel: 'Pendapatan',
          receiptLabel: 'Struk Belanja',
          cardNumberValidator: 'Nomor Kartu Harus Diisi',
          referralCodeValidator: 'Referral Code MAG Harus Diisi',
          cardTypeValidator: 'Jenis Kartu Harus Diisi',
          fullNameValidator: 'Nama Harus Diisi',
          emailValidator: 'Email Harus Diisi',
          phoneNumberValidator: 'Nomor telepon Harus Diisi',
          birthDateValidator: 'Tanggal lahir Harus Diisi',
          birthPlaceValidator: 'Tempat Lahir Harus Diisi',
          IDCardNumberValidator: 'Nomor KTP Harus Diisi',
          IDCardImageValidator: 'Foto KTP Harus Diisi',
          genderValidator: 'Jenis Kelamin Harus Diisi',
          religionValidator: 'Agama Harus Diisi',
          maritalStatusValidator: 'Status Pernikahan Harus Diisi',
          countryValidator: 'Negara Harus Diisi',
          provinceValidator: 'Provinsi Harus Diisi',
          cityValidator: 'Kota Harus Diisi',
          addressValidator: 'Alamat Harus Diisi',
          occupationValidator: 'Pekerjaan Harus Diisi',
          incomeValidator: 'Pendapatan Harus Diisi',
          postalCodeValidator:'Kode Pos Harus Diisi',
          postalCode:'Kode Pos'
        },

        AlertMessage: {
          Waiting: "Mohon tunggu",
          Success: "Sukses",
          Fail: "Gagal",
          Confirmation: "Konfirmasi",
          Processing: "Memproses",
          Cancel: "Batal",
          OK: "OK",
          No:"Tidak",
          Yes:"Ya",
        },
        ShowToastMessage:{
          SuccessUpdateEmail:"Email berhasil diperbaharui",
          SuccessUpdatePhoneNumber:"Nomor Handphone berhasil diperbaharui",
          SuccessUpdateSecurityQuestion:"Pertanyaan Sekuritas berhasil diperbaharui",
          Copied:"Di salin",
          pdfDownloaded:"file pdf berhasil diundah",
          SuccessAdd:"Konten berhasil ditambahkan",
        },
      },
      en:{
        SpotgueAppMyCardList:{
          orangmenyukai: 'people like this',
          cards:'Cards',
          confirmation:'Confirmation',
          Location: 'Location',
          specificPlace: 'Specific Place',
          DateLabel: 'Registration Date : ',
          ReasonLabel: 'Reason : ',
          Status: 'Status',
          StatusTitle: "Registration Status",
          Submitted: "Submitted",
          Accepted: "Accepted",
          Rejected: "Rejected",
          SortNewestRegisDate: "Newest Registration Date",
          SortOldestRegisDate: "Oldest Registration Date",
          SortNewestExpiredDate: "Newest Expired Date",
          SortOldestExpiredDate: "Oldest Expired Date"

        },
        SpotgueAppMyCard:{
          MyCard: 'My Cards',
          SeeMore: 'See More',
        },
        LoyatyCard:{
          PointAvailable: 'Point Available',
          ExpiredLabel: 'Expired in',
          valid: 'valid',
          Thru: 'thru',
          Expired: 'Expired',
          Blocked: 'Blocked'
        },
        Lesson23Screen : {
          login: 'login',
          update: 'update',
          welcome: 'Welcome',  
        },
        Lesson20Screen : {
            rotate: 'rotate',
            scale: 'Scale the circle 1x-2x'
        },
        CardDetail:{
            memberCard:'Member Card',
            cardBenefits:'Card Benefits',
            tandc: 'Terms and Conditions',
            rewardsSelection:'Rewards Selection',
            tc:'Terms & Conditions',
            EarnPoint: '️Earn Points',
            PointHistory: 'Points History',
            RegistrerButton: "Register Now",
            tabCard: 'My Card',
            tabEarn: 'Earn Point',
            showQRLabel: 'Show My QR >'
        },
        PointHistory:{
          EarnLabel: 'Earn',
          RedeemLabel: "Redeem",
          ExpiredLabel: "Expired"
        },
        EarnPoint:{
            earnPoints:'Earn Points',
            tandc: 'Terms and Conditions',
            titleEarn:'To Earn Point',
            SelfLabel: 'Self',
            MallLabel: 'Mall',
            TenantLabel: 'Tenant'
        },
        EarnPointForm:{
          receiptNumberLabel:'Receipt Number',
          receiptNumberPlaceholder:'Enter Receipt Number',
          receiptImageLabel: 'Receipt Image',
          minReceiptAmountLabel: 'Minimum Spending Receipt : ',
          receiptAmountLabel: 'Total Spending Receipt',
          receiptAmountPlaceholder: 'Enter Total Spending',
          receiptDateLabel: 'Receipt Date',
          storeName: 'Store/Resto Name',
          addReceiptButton: 'Add Receipt',
          receiptNumberValidator: 'Receipt Number must be filled',
          receiptImageValidator: 'Receipt Image must be filled',
          receiptSameValidator: 'You enter the same receipt number as the previous receipt number. Verify the receipt number that you filled in again',
          receiptAmountValidator: 'The Receipt Spending Must Exceed The Minimum Total Spend',
          storeNameValidator: 'Store/Resto Name must be filled',
          receiptDateValidator: 'Selected Receipt Date is no longer valid',
        },
        EarnPointSelf:{
            upload:'Upload Transaction Receipt',
            overReceipt:'The total receipt you entered exceeds the allowed receipt limit',
            confirmationLabel: 'Are you sure want to send request Earn Points?',
            successLabel: 'Receipt Uploaded Successfully'
        },
        RegisterScreen:{
          title: 'Register Member',
          tabNew: 'New Member',
          tabExisting: 'Existing Member',
          registerButton: 'Register'
        },
        AddNewRegistrationForm:{
          cardNumberLabel: 'Card Number',
          cardNumberPlaceholder: 'Enter Card Number',
          cardTypeLabel: 'Card Type',
          IDCardNumberLabel: 'ID Card Number',
          IDCardNumberPlaceholder: 'Enter ID Card',
          IDCardImageLabel: 'ID Card Image',
          fullNameLabel: 'Full Name',
          fullNamePlaceholder: 'Enter Full Name',
          emailLabel: 'Email',
          emailPlaceholder: 'Enter Email',
          phoneNumberLabel : 'Phone Number',
          phoneNumberPlaceholder: 'Enter Phone Number',
          birthDateLabel: 'Birth Date',
          birthPlaceLabel: 'Birth Place',
          birthPlacePlaceholder: 'Enter Birth Place',
          genderLabel: 'Gender',
          religionLabel: 'Religion',
          maritalStatusLabel: 'Marital Status',
          countryLabel: 'Country',
          provinceLabel: 'Province',
          cityLabel: 'City',
          addressLabel: 'Address',
          addressPlaceholder: 'Enter Address',
          occupationLabel: 'Occupation',
          occupationPlaceholder: 'Enter Occupation',
          incomeLabel: 'Income',
          receiptLabel: 'Receipt',
          cardNumberValidator: 'Card Number must be filled',
          referralCodeValidator: 'Referral Code MAG must be filled',
          cardTypeValidator: 'Card Type must be filled',
          fullNameValidator: 'Full Name must be filled',
          emailValidator: 'Email must be filled',
          phoneNumberValidator: 'Phone Number must be filled',
          birthDateValidator: 'Birth Date must be filled',
          birthPlaceValidator: 'Birth Place must be filled',
          IDCardNumberValidator: 'ID Card Number must be filled',
          IDCardImageValidator: 'ID Card Image must be filled',
          genderValidator: 'Gender must be filled',
          religionValidator: 'Religion must be filled',
          maritalStatusValidator: 'Marital Status must be filled',
          countryValidator: 'Country must be filled',
          provinceValidator: 'Province must be filled',
          cityValidator: 'City must be filled',
          addressValidator: 'Address must be filled',
          occupationValidator: 'Occupation must be filled',
          incomeValidator: 'Income must be filled',
          postalCodeValidator:'Postal Code must be filled',
          postalCode:'Postal Code'
        },

        AlertMessage: {
          Waiting: "Please wait",
          Success: "Success",
          Fail: "Fail",
          Confirmation: "Confirmation",
          Processing: "on Processing",
          Cancel: "Cancel",
          OK: "OK",
          No:"No",
          Yes:"Yes",
        },

        ShowToastMessage:{
          SuccessUpdateEmail:"Email updated successfully",
          SuccessUpdatePhoneNumber:"Phone Number updated successfully",
          SuccessUpdateSecurityQuestion:"Securities Question updated successfully",
          Copied:"Copied",
          pdfDownloaded:"pdf file successfully downloaded",
          SuccessAdd:"Content added successfully",
        },
      },
      cn:{
        SpotgueAppMyCardList:{
          orangmenyukai: '人喜欢这个',
          cards:'牌',
          confirmation:'确认',
          Location: '地点',
          specificPlace: '具体地点',
          DateLabel: '注册日期 : ',
          ReasonLabel: '原因 : ',

        },
        SpotgueAppMyCard:{
          MyCard: '我的卡片',
          SeeMore: '看更多',
        },
        LoyatyCard:{
          PointAvailable: '可用积分',
          ExpiredLabel: '过期时间',
          valid: '有效的',
          Thru: '直通',
          Expired: '已到期',
          Blocked: '被封锁'
        },
        Lesson23Screen : {
          login: '登录',
          update: '更新',
          welcome: '欢迎',  
        },
        Lesson20Screen : {
            rotate: '旋转',
            scale: '欢迎欢迎欢迎1x-2x'
        },
        CardDetail:{
            memberCard:'会员卡',
            cardBenefits:'卡福利',
            tandc:'规则与条例',
            rewardsSelection:'奖励选择',
            tc:'条款和条件',
            EarnPoint: '️赚取积分',
            PointHistory: '积分历史',
            RegistrerButton: "现在注册",
            tabCard: '我的卡',
            tabEarn: '赚取积分',
            showQRLabel: '显示我的二维码 >'
        },
        PointHistory:{
          EarnLabel: '赚',
          RedeemLabel: "赎回",
          ExpiredLabel: "已到期"
        },
        EarnPoint:{
          earnPoints:'赚取积分',
          tandc:'规则与条例',
          titleEarn:'赚取积分',
          SelfLabel: '自己',
          MallLabel: '购物中心',
          TenantLabel: '租户'
        },
        EarnPointForm:{
          receiptNumberLabel:'收据号',
          receiptNumberPlaceholder:'输入收据编号',
          receiptImageLabel: '收据图片',
          minReceiptAmountLabel: '最低消费收据 : ',
          receiptAmountLabel: '总支出收据',
          receiptAmountPlaceholder: '输入总支出',
          receiptDateLabel: '收据日期',
          storeName: '商店/餐厅名称',
          addReceiptButton: '添加收据',
          receiptNumberValidator: '收据编号必须填写',
          receiptImageValidator: '收据图片必须填写',
          receiptSameValidator: '您输入与先前收据编号相同的收据编号。再次验证您填写的收据编号',
          receiptAmountValidator: '收据支出必须超过最低总支出',
          storeNameValidator: '必须填写商店/餐厅名称',
          receiptDateValidator: '所选日期的收据不再有效',
        },
        EarnPointSelf:{
          upload:'上传交易收据',
          overReceipt:'您输入的收据总额超过了允许的收据限额',
          confirmationLabel: '您确定要发送请求赚取积分吗？',
          successLabel: '收据上传成功'
        },
        RegisterScreen:{
          title: '注册会员',
          tabNew: '新成员',
          tabExisting: '现有会员',
          registerButton: '登记'
        },
        AddNewRegistrationForm:{
          cardNumberLabel: '卡号',
          cardNumberPlaceholder: '输入卡号',
          cardTypeLabel: '卡的种类',
          IDCardNumberLabel: '身份证号码',
          IDCardNumberPlaceholder: '输入身份证',
          IDCardImageLabel: '身份证图片',
          fullNameLabel: '全名',
          fullNamePlaceholder: '输入全名',
          emailLabel: '电子邮件',
          emailPlaceholder: '输入电子邮件',
          phoneNumberLabel : '电话号码',
          phoneNumberPlaceholder: '输入电话号码',
          birthDateLabel: '出生日期',
          birthPlaceLabel: '出生地',
          birthPlacePlaceholder: '输入出生地',
          genderLabel: '性别',
          religionLabel: '宗教',
          maritalStatusLabel: '婚姻状况',
          countryLabel: '国家',
          provinceLabel: '省',
          cityLabel: '城市',
          addressLabel: '地址',
          addressPlaceholder: '输入地址',
          occupationLabel: '职业',
          occupationPlaceholder: '输入职业',
          incomeLabel: '收入',
          receiptLabel: '收据',
          cardNumberValidator: '卡号必须填写',
          referralCodeValidator: '必须填写推荐代码 MAG',
          cardTypeValidator: '卡类型必须填写',
          fullNameValidator: '必须填写全名',
          emailValidator: '电子邮件必须填写',
          phoneNumberValidator: '必须填写电话号码',
          birthDateValidator: '必须填写出生日期',
          birthPlaceValidator: '出生地必须填写',
          IDCardNumberValidator: '身份证号码必须填写',
          IDCardImageValidator: '必须填写身份证图片',
          genderValidator: '必须填写性别',
          religionValidator: '必须填写宗教',
          maritalStatusValidator: '婚姻状况必须填写',
          countryValidator: '国家必须填写',
          provinceValidator: '省份必须填写',
          cityValidator: '城市必须填写',
          addressValidator: '地址必须填写',
          occupationValidator: '必须填写职业',
          incomeValidator: '收入必须填写',
          postalCodeValidator:'邮政编码不能为空',
          postalCode:'邮政编码'
        },

        AlertMessage: {
          Waiting: "请耐心等待",
          Success: "成功",
          Fail: "失败",
          Confirmation: "确认书",
          Processing: "处理中",
          Cancel: "取消",
          OK: "好",
          No:"不是",
          Yes:"是的",
        },
        ShowToastMessage:{
          SuccessUpdateEmail:"电子邮件更新成功",
          SuccessUpdatePhoneNumber:"电话号码更新成功",
          SuccessUpdateSecurityQuestion:"证券问题已成功更新",
          Copied:"复制的",
          pdfDownloaded:"pdf文件已成功下载",
          SuccessAdd:"内容添加成功",
        },
      },
    };
    static _chosenLanguage='id';
    static changeLanguage(lang){
      MyTranslator._chosenLanguage = lang.toLowerCase();
    }
    static tr(key){
      var arrKey = key.split('.');
      const {SGHelperType} = Core.Helper;
      if(SGHelperType.isDefined(MyTranslator._json[MyTranslator._chosenLanguage][arrKey[0]])){
        if(SGHelperType.isDefined(MyTranslator._json[MyTranslator._chosenLanguage][arrKey[0]][arrKey[1]])){
            return MyTranslator._json[MyTranslator._chosenLanguage][arrKey[0]][arrKey[1]];
        }        
      } 
      return MyTranslator._chosenLanguage +'.'+key +' N/A';
    }
  }
  