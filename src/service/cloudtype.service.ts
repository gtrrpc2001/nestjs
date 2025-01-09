import { Injectable } from '@nestjs/common';
import { CloudTypeDTO } from 'src/dto/cloudtype.dto';
import axios from 'axios';
import { Method } from 'src/interface/cloudtype.enum';
import { ConfigService } from '@nestjs/config';
import { encrypt } from 'src/clsfunc/secertFunc';

@Injectable()
export class CloudTypeService {
    constructor(
        private config: ConfigService
    ) { }

    private url = this.config.get<string>('CLOUDTYPE_BASE_API')

    async api(method: Method, url: string, data?: any) {
        try {
            const headers = {
                'Authorization': `Bearer ${this.config.get<string>('CLOUDTYPE_API_KEY')}`,
            };
            let response;
            switch (method) {
                case Method.get:
                    response = await axios.get(url, { headers });
                    break;
                case Method.put:
                    response = await axios.put(url, data, { headers });
                    break;
                default:
                    throw new Error('Unsupported method');
            }
            return response.data;
        } catch (error) {
            console.error('API call error:', error);
            throw error;
        }
    }

    async stat() {
        try {
            const myData: any[] = await this.api(Method.get, this.url);
            const result = await Promise.all(myData.map(async (value) => {
                const projectName = value.name;
                const json = await this.api(Method.get, `${this.url}/${projectName}/stage/main/stat`);
                const arr = json["stats"].map(v => {
                    const name = v["name"]
                    const status = v["status"]
                    const link = v["entrypoints"].map((l, index) => {
                        return l["link"]
                    })
                    return { projectName: projectName, name: name, status: status, link: link }
                });
                return arr;
            }));
            return result.flat();
        } catch (error) {
            console.log(error)
            return error;
        }
    }

    async start(body: CloudTypeDTO) {
        try {
            console.log(body)
            const url = `${this.url}/${body.projectName}/stage/main/deployment/${body.name}/start`
            return await this.api(Method.put, url);
        } catch (error) {
            console.log(error)
            return error;
        }
    }

    async stop(body: CloudTypeDTO) {
        try {
            const url = `${this.url}/${body.projectName}/stage/main/deployment/${body.name}/stop`
            return await this.api(Method.put, url);
        } catch (error) {
            console.log(error)
            return error;
        }
    }
}