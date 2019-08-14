import { RunHistoryAPIsModels } from "@vienna/runhistory";
import { getSdkVersion } from "../getSdkVersion";

const condaEnvTemplate = `
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
  - azureml-train-automl==##sdkVersion##
- numpy
- scikit-learn
- py-xgboost<=0.80
`;

export const getCondaFileFromTemplate = (
  run: RunHistoryAPIsModels.MicrosoftMachineLearningRunHistoryContractsRunDetailsDto | undefined
): string => {
  const sdkVersion = getSdkVersion(run);
  return condaEnvTemplate.replace("##sdkVersion##", sdkVersion);
};
