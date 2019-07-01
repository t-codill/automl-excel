import { AzureMachineLearningJasmineManagementModels } from "@vienna/jasmine";

export class JasmineService {

    public async createRun(): Promise<string | undefined> {
        return "AutoML_123";
    }

    public async startRun()
        : Promise<AzureMachineLearningJasmineManagementModels.RunStatus | undefined> {
        return {};
    }

    public async cancelRun(): Promise<{} | undefined> {
        return {};
    }

    public async continueRun(): Promise<{} | undefined> {
        return {};
    }

    public dispose(): void {
        return;
    }

    public reset(): void {
        return;
    }
}
