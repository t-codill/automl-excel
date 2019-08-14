import { RunHistoryAPIsModels } from "@vienna/runhistory";
import { getModelNameFromRunId } from "../getModelNameFromRunId";
import { safeParseJson } from "../safeParseJson";

const schemaTemplate = `
from inference_schema.schema_decorators import input_schema, output_schema
from inference_schema.parameter_types.numpy_parameter_type import NumpyParameterType

input_sample = np.array([[##input##]])
output_sample = np.array(##output##])
`;

const scoringTemplate = `
import pickle
import json
import azureml.train.automl
import pandas as pd
from sklearn.externals import joblib
from azureml.core.model import Model

def init():
    global model
    model_path = Model.get_model_path(model_name='##modelName##')
    model = joblib.load(model_path)

##schemaDecorators##
def run(rawdata):
    try:
        data = json.loads(rawdata)['data']
        df = pd.DataFrame(data,columns=##featureColumns##)
        result = model.predict(df)
    except Exception as e:
        result = str(e)
        return json.dumps({"error": result})
    return json.dumps({"result": result.tolist()})
`;

export const getScoringFileFromTemplate = (
    parentRun: RunHistoryAPIsModels.MicrosoftMachineLearningRunHistoryContractsRunDetailsDto | undefined,
    runId: string | undefined,
    inputSample?: any,
    outputSample?: any
) => {
    const dataPrepJson = parentRun && parentRun.properties && parentRun.properties.DataPrepJsonString;
    if (!dataPrepJson || !runId) {
        return undefined;
    }

    const dataPrep = safeParseJson(safeParseJson(`"${dataPrepJson}"`));
    if (!dataPrep || !dataPrep.features) {
        return undefined;
    }

    const featureColumns = JSON.stringify(dataPrep.features);
    const modelName = getModelNameFromRunId(runId);

    let scoringScript = scoringTemplate
    .replace("##modelName##", modelName)
    .replace("##featureColumns##", featureColumns);

    if(inputSample !== undefined && outputSample != undefined){
        scoringScript = scoringScript.replace("##schemaDecorators##", schemaTemplate);
    }else{
        scoringScript = scoringScript.replace("##schemaDecorators##", "");
    }

    return scoringScript;
};
