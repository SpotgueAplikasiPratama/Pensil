import { VAliceResultAPI } from '../api/VAliceResultAPI';

export class WhereToGoResultDAO {

    static async getWhereToGoRecommendationResult(data, arrFilter,arrSort,pagingParam) {

        console.log(arrSort);
        var tempData = await VAliceResultAPI.getWhereToGoUnsortedData(arrFilter,arrSort,pagingParam);
        var WTGoRecommendationData = [];
        var WTGoMatrix = [];
        for (var i = 0; i < tempData.length; i++) {
            var acceptJSON = tempData[i]
            var purposePriorArr = [];
            for (var j = 0; j < acceptJSON.fPurposeSort.length; j++) {
                purposePriorArr.push(acceptJSON.fPurposeSort.indexOf(j));
            }
            var matrixJSON = { fContentJSON: acceptJSON, fPurposePriority: purposePriorArr };
            WTGoMatrix.push(matrixJSON);
            WTGoRecommendationData.push(acceptJSON);
        }
        for (var i = 0; i < WTGoMatrix.length; i++) {
            var valueBox = [];
            for (var j = 0; j < WTGoMatrix[i].fPurposePriority.length; j++) {
                var val = WTGoMatrix[i].fPurposePriority.length - WTGoMatrix[i].fPurposePriority[j];
                valueBox.push(val);
            }
            WTGoMatrix[i].fPurposePriority = valueBox;
        }
        var arrMax = [];
        for (var i = 0; i < WTGoMatrix.length; i++) {
            var val1 = WTGoMatrix[i].fPurposePriority[data.mainPurpose.value];
            var val2 = WTGoMatrix[i].fPurposePriority[data.secondaryPurpose.value];
            arrMax.push(val1);
            arrMax.push(val2);
        }
        var maxValue = Math.max(...arrMax);
        for (var i = 0; i < WTGoMatrix.length; i++) {
            WTGoMatrix[i].fPurposePriority[data.mainPurpose.value] = WTGoMatrix[i].fPurposePriority[data.mainPurpose.value] / maxValue;
            WTGoMatrix[i].fPurposePriority[data.secondaryPurpose.value] = WTGoMatrix[i].fPurposePriority[data.secondaryPurpose.value] / maxValue;
            WTGoMatrix[i].weight = (WTGoMatrix[i].fPurposePriority[data.mainPurpose.value] * 2 + WTGoMatrix[i].fPurposePriority[data.secondaryPurpose.value] * 1) / WTGoMatrix.length
            arrMax.push(val1);
            arrMax.push(val2);
        }

        function sortWTGo(a, b) {
            var x = a.weight;
            var y = b.weight;
            if (x < y) { return -1; }
            if (x > y) { return 1; }
            return 0;
        }
        var res = WTGoMatrix.sort(sortWTGo);
        var result = [];
        console.log('aaa');
        console.log(res);
        for (var i = 0; i < res.length; i++) {
            result.push(res[i].fContentJSON);
        }
        return (tempData);
    }
}