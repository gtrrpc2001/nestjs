import { isDefined } from 'class-validator';
import { parentsEntity } from '../entity/parents.entity';
import { pwBcrypt } from './pwAES';
export class commonFun {

  static converterJson(result: any) {
    return JSON.stringify(result);
  }

  static async convertCsv(jsonFile: string) {
    const json_array = JSON.parse(jsonFile)
    let csv_string = '';
    const titles = Object.keys(json_array[0])

    titles.forEach((title, index) => {
      csv_string += (index != titles.length - 1 ? `${title}|` : `${title}\n`);
    });

    json_array.forEach((content, index) => {
      let row = '';

      for (let title in content) {
        row += (row === '' ? `${content[title]}` : `|${content[title]}`)
      }

      csv_string += (index !== json_array.length - 1 ? `${row}\r\n` : `${row}`);
    });

    return csv_string;
  }

  static getWritetime(): string {
    let today = new Date()
    const year = today.getFullYear()
    const month = today.getMonth() + 1
    var monthStr: string = month < 10 ? `0${month}` : month.toString()
    const date = today.getDate()
    var dateStr: string = date < 10 ? `0${date}` : date.toString()
    const hour = today.getHours()
    var getHour = hour < 10 ? `0${hour}` : hour.toString()
    const minute = today.getMinutes()
    var getMinute = minute < 10 ? `0${minute}` : minute.toString()
    const second = today.getSeconds()
    var getSecond = second < 10 ? `0${second}` : second.toString()
    return `${year}-${monthStr}-${dateStr} ${getHour}:${getMinute}:${getSecond}`
  }

  static getTokens(parentsArr: parentsEntity[]): string[] {
    let tokens: string[] = []
    let i = 0
    for (const parents of parentsArr) {
      const token = parents.token
      if (token != "" && token != null) {
        tokens[i] = parents.token
        i += 1
      }
    }
    return tokens
  }

  static async getEcgNumArr(result: any[]): Promise<number[]> {
    const changeEcg: number[] = []
    const ecgArr = result?.map((ecg: any) => {
      const ecgArr = ecg.ecgpacket
      const after = ecgArr?.replaceAll(';', '')
      after?.split('][').forEach((data: string) => {
        const sliceEcg = data?.replaceAll('[', '')?.replaceAll(']', '')?.split(',')
        sliceEcg.forEach(d => {
          changeEcg.push(Number(d))

        })
      })
      return changeEcg
    })
    return changeEcg
  }

  static async getFromStringToNumberArrEcg(ecg: string): Promise<number[]> {
    const changeEcg: number[] = []
    const after = ecg?.replaceAll(';', '')
    after?.split('][').forEach((data: string) => {
      const sliceEcg = data?.replaceAll('[', '')?.replaceAll(']', '')?.split(',')
      sliceEcg.forEach(d => {
        changeEcg.push(Number(d))

      })
    })
    return changeEcg
  }

  static getStartLen(len: number): number {
    switch (len) {
      case 10:
        return 9
      case 7:
        return 6
      case 13:
        return 12
    }
  }

  static getEcgBuffer(ecg: number[]): Buffer {
    const uint16Array = new Uint16Array(ecg);
    const arrBuffer = uint16Array.buffer
    const buffer = Buffer.from(arrBuffer)
    return buffer
  }

  static getEcgNumber(ecg: Buffer): number[] {
    const uint8Arr = new Uint8Array(ecg);
    const uint16Arr = new Uint16Array(uint8Arr.buffer);
    const newArr = [...uint16Arr]
    return newArr
  }

  static async validateHeader(key: string) {
    const originKey = Buffer.from(key, 'base64');
    return await pwBcrypt.validatePwd(process.env.SEND_DATA_SECRET_KEY, originKey.toString());
  }

}

export const db = { test: 'test', deploy: 'deploy' }