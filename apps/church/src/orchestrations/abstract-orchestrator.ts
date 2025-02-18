import { BadRequestException, Injectable } from "@nestjs/common";
import { DataSource } from "typeorm";

@Injectable()
export abstract class AbstractOrchestrator<D, R> {

    constructor(protected readonly dataSource: DataSource) {}

    public async orchestrate(request: D): Promise<R> {
        try {
            const preprocessedData = await this.preProcess(request);
            const processedData: R = await this.doProcess(preprocessedData);
            return await this.postProcess(processedData);
        } catch (error) {
            if (error instanceof TypeError) {
                // Handle the TypeError specifically
                throw new BadRequestException('A TypeError occurred: ' + error.message);
              }

            throw error;
        }
    }

    protected abstract preProcess(request: D): Promise<D>;
    protected abstract doProcess(request: D): Promise<R>;
    protected abstract postProcess(data: R): Promise<R>
}