export const scoringTemplate = `
import pickle
import json
import azureml.train.automl
import pandas as pd
from sklearn.externals import joblib
from azureml.core.model import Model


def init():
    global model
    model_path = Model.get_model_path(model_name='##modelid##')
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

export const condaEnvTemplate = `
# Conda environment specification. The dependencies defined in this file will
# be automatically provisioned for runs with userManagedDependencies=False.
# Details about the Conda environment file format:
# https://conda.io/docs/user-guide/tasks/manage-environments.html#create-env-file-manually


name: project_environment
dependencies:
  # The python interpreter version.
  # Currently Azure ML only supports 3.5.2 and later.
- python=3.6.2

- pip:
  - azureml-sdk[automl]==##sdkVersion##
- numpy
- scikit-learn
- py-xgboost<=0.80
`;