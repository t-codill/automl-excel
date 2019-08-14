import { RunHistoryAPIsModels } from "@vienna/runhistory";
import { getModelNameFromRunId } from "../getModelNameFromRunId";
import { safeParseJson } from "../safeParseJson";

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
    runId: string | undefined
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

    return scoringTemplate
        .replace("##modelName##", modelName)
        .replace("##featureColumns##", featureColumns);
};
