export class SGConfigCore {
    static config = {
        SGBaseControl: {},
        SGView: {},
        SGSmartText: { helpColor: 'rgba(0,0,255,1)', },
        SGTimerMessage: { bgColorOutside: 'rgba(120,120,120,0.25)', backgroundColor: 'rgba(220,220,150,1)', textColor: 'rgba(50,50,50,1)', wF: 0.8, hF: 0.2, titleFontF: 0.04, bodyFontF: 0.03, timeOut: 5000, animationDuration: 400 },
        SGBaseContainer: {},
        SGBaseScreen: {},
        SGBaseModel: {},
        SGHelperStyle: { defaultBGColor: 'rgba(0,0,0,0)', },
        SGHelperAnimation: { delay: 1000 / 40, },
        SGIcon: { sizeF: 0.06, color: 'black' },
        SGIconText: { size: 50, borderRadius: 10 },
    }
    static lang = {
        Common: {
            HelpTitle: { ID: 'Informasi field', EN: 'Field information', CN: '现场信息' },
        },
    }
}