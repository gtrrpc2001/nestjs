import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { commonFun } from "src/clsfunc/commonfunc";

@Injectable()
export class CloudTypeGuard implements CanActivate {
    constructor() { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        try {
            const request = context.switchToHttp().getRequest<Request>();
            const headers = request.headers['cloud-type'];
            const checkedHeader = await commonFun.validateHeader(headers);
            if (!checkedHeader)
                throw new HttpException('Invalid headers', HttpStatus.BAD_REQUEST);
            return checkedHeader;
        } catch (error) {
            throw new HttpException(error, HttpStatus.FORBIDDEN);
        }
    }
}