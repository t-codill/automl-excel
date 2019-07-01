from azureml.core.webservice import Webservice
from azureml.core.webservice import AciWebservice
from azureml.core.image import Image, ContainerImage
from azureml.core.conda_dependencies import CondaDependencies
from azureml.widgets import RunDetails
from azureml.train.automl.run import AutoMLRun
from azureml.core.workspace import Workspace
from azureml.core.experiment import Experiment
import azureml.core
import pandas as pd
import os

workspace_name = "Ke_EastUS_1228"
subscription_id = "381b38e9-9840-4719-a5a0-61d9585e1e91"
resource_group = "Ke"
experiment_name = "test"
run_id = "AutoML_d4cd5bc2-afae-4ac5-9219-6c774b329178"
iteration = 1
description = 'AutoML Model'
tags = None
aci_service_name = 'automl-sample-01' + \
    "_" + str(run_id) + "_" + str(iteration)
image_name = "automlsampleimage"

directory = "./autoDeployment/" + run_id + "/" + str(iteration)
conda_env_file_name = "myenv.yml"
scoring_file_name = "scoring.py"

if not os.path.exists(directory):
    os.makedirs(directory)

os.chdir(directory)
os.getcwd()

ws = Workspace.get(
    workspace_name, subscription_id=subscription_id, resource_group=resource_group)

experiment = Experiment(ws, experiment_name)

ml_run = AutoMLRun(experiment=experiment, run_id=run_id)

if ml_run.model_id is None:
    model = ml_run.register_model(
        description=description, tags=tags, iteration=iteration)

file = open(scoring_file_name, "w")

file.writelines(["import pickle\n",
                 "import json\n",
                 "import numpy\n",
                 "import azureml.train.automl\n",
                 "from sklearn.externals import joblib\n",
                 "from azureml.core.model import Model\n",
                 "def init():\n",
                 "    global model\n",
                 "    model_path = Model.get_model_path(model_name = '" +
                 ml_run.model_id + "')\n",
                 "    model = joblib.load(model_path)\n",
                 "def run(rawdata):\n",
                 "    try:\n",
                 "        data = json.loads(rawdata)['data']\n",
                 "        data = numpy.array(data)\n",
                 "        result = model.predict(data)\n",
                 "    except Exception as e:\n",
                 "        result = str(e)\n",
                 "        return json.dumps({\"error\": result})\n",
                 "    return json.dumps({\"result\":result.tolist()})"])

file.close()

dependencies = ml_run.get_run_sdk_dependencies(iteration=iteration)
for p in ['azureml-train-automl', 'azureml-sdk', 'azureml-core']:
    print('{}\t{}'.format(p, dependencies[p]))


myenv = CondaDependencies.create(
    conda_packages=['numpy', 'scikit-learn'], pip_packages=['azureml-train-automl'])

myenv.save_to_file('.', conda_env_file_name)

with open(conda_env_file_name, 'r') as cefr:
    content = cefr.read()

with open(conda_env_file_name, 'w') as cefw:
    cefw.write(content.replace(
        azureml.core.VERSION, dependencies['azureml-sdk']))


image_config = ContainerImage.image_configuration(runtime="python",
                                                  execution_script=scoring_file_name,
                                                  conda_file=conda_env_file_name,
                                                  tags={},
                                                  description="Image for automl")

image = Image.create(name=image_name,
                     # this is the model object
                     models=[model],
                     image_config=image_config,
                     workspace=ws)

image.wait_for_creation(show_output=True)

if image.creation_state == 'Failed':
    raise Exception("Image failed to build, log at: " +
                    image.image_build_log_uri)

aciconfig = AciWebservice.deploy_configuration(cpu_cores=1,
                                               memory_gb=1,
                                               tags={},
                                               description=description)


aci_service = Webservice.deploy_from_image(deployment_config=aciconfig,
                                           image=image,
                                           name=aci_service_name,
                                           workspace=ws)
aci_service.wait_for_deployment(True)
