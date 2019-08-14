import { AzureMachineLearningWorkspacesModels } from "@azure/arm-machinelearningservices";
import { defaultSdkVersion } from "../common/defaultSdkVersion";

export type SDKFlight = "default" | "master" | "candidate" | "preview" | "custom";

function getPipDependency(flight: SDKFlight | undefined, sdkVersion: string | undefined): string[] {
    const sdkVersionEquals = sdkVersion ? `==${sdkVersion}` : undefined;
    const noCacheVersion = sdkVersionEquals || `>1.0.0.${Date.now()}`;

    switch (flight) {
        case "master":
            return [
                "--extra-index-url https://azuremlsdktestpypi.azureedge.net/sdk-release/master/588E708E0DF342C4A80BD954289657CF",
                // TODO: Remove the below dataprep*** indexurl once the Feature 422830 is done
                // https://msdata.visualstudio.com/vienna/_workitems/edit/422830/
                // Share Release Pipeline for AzuremlSDK and DataPrep Python SD
                "--extra-index-url https://dataprepdownloads.azureedge.net/pypi/weekly-rc-932B96D048E011E8B56608/latest/",
                `azureml-train-automl${sdkVersionEquals || `<0.1.50.${Date.now()}`}`
            ];
        case "candidate":
            return [
                "--extra-index-url https://azuremlsdktestpypi.azureedge.net/sdk-release/Candidate/604C89A437BA41BD942B4F46D9A3591D",
                `azureml-train-automl${noCacheVersion}`
            ];
        case "preview":
            return [
                "--extra-index-url https://azuremlsdktestpypi.azureedge.net/sdk-release/Preview/E7501C02541B433786111FE8E140CAA1",
                `azureml-train-automl${noCacheVersion}`
            ];
        case "custom":
            return decodeURIComponent(sdkVersion || "")
                .split(";");
        default:
            return [
                `azureml-train-automl${sdkVersionEquals || `==${defaultSdkVersion}`}`
            ];
    }
}

export const getJsonDefinition = (
    compute: AzureMachineLearningWorkspacesModels.ComputeResource,
    flight: SDKFlight | undefined,
    sdkVersion: string | undefined) => {
    return {
        Configuration: {
            script: "train.py",
            arguments: [],
            target: compute.name,
            framework: "python",
            communicator: "None",
            autoPrepareEnvironment: true,
            maxRunDurationSeconds: null,
            nodeCount: 1,
            environment: {
                environmentVariables: {
                    EXAMPLE_ENV_VAR: "EXAMPLE_VALUE"
                },
                python: {
                    userManagedDependencies: false,
                    interpreterPath: "python",
                    condaDependencies: {
                        channels: [
                            "conda-forge"
                        ],
                        name: "project_environment",
                        dependencies: [
                            "python=3.6.2",
                            {
                                pip: getPipDependency(flight, sdkVersion)
                            },
                            "numpy",
                            "py-xgboost<=0.80"
                        ]
                    }
                },
                docker: {
                    enabled: (compute.properties && compute.properties.computeType === "AmlCompute") || false,
                    baseImage: "mcr.microsoft.com/azureml/base:intelmpi2018.3-ubuntu16.04",
                    sharedVolumes: true,
                    gpuSupport: false,
                    shmSize: "1g",
                    arguments: [],
                    baseImageRegistry: {
                        address: null,
                        username: null,
                        password: null
                    }
                },
                spark: {
                    repositories: [],
                    packages: [],
                    precachePackages: true
                },
                databricks: {
                    mavenLibraries: [],
                    pypiLibraries: [],
                    rcranLibraries: [],
                    jarLibraries: [],
                    eggLibraries: []
                }
            },
            history: {
                outputCollection: true,
                snapshotProject: true,
                directoriesToWatch: [
                    "logs"
                ]
            },
            spark: {
                configuration: {
                    "spark.app.name": "Azure ML Experiment",
                    "spark.yarn.maxAppAttempts": 1
                }
            },
            hdi: {
                yarnDeployMode: "cluster"
            },
            tensorflow: {
                workerCount: 1,
                parameterServerCount: 1
            },
            mpi: {
                processCountPerNode: 1
            },
            dataReferences: {},
            sourceDirectoryDataStore: null,
            amlcompute: {
                vmSize: null,
                vmPriority: null,
                retainCluster: false,
                name: null,
                clusterMaxNodeCount: 1
            }
        }
    };
};
