import {Injectable} from "@angular/core";
import {CallDtoModel, TableRecordModel} from "../../../../../orlaor-server-crm/src/model/callDto.model";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import * as moment from 'moment-timezone';
import * as _ from 'underscore';

@Injectable({providedIn: "root"})
export class CallsService
{
  constructor(private httpClient:HttpClient) {
  }

  async callInformationTwoWeekAgo() {
    // get all calls in last 1 week
    const lastTwoWeek = new Date();
    lastTwoWeek.setDate(lastTwoWeek.getDate() - 14);

    const regexMatch = [/הדרכה/i, /לקוח/i, /קורס/i, /לייזר/i];
    const records = await this.getInformation({
      $and: [
        {
          timestamp: {
            $gte: lastTwoWeek.getTime(),
            $lt: new Date().getTime(),
          },
        },
        {
          $or: [
            { name: { $in: regexMatch } },
            { type: 'MISSED', name: { $exists: false } },
          ],
        },
      ],
    });

    // @ts-ignore
    const groups = _.groupBy(records, (r) => r.number);
    return this.createTable(groups);
  }


  private async createTable(groups: any) {
    const table: TableRecordModel[] = [];

    for await (const number of Object.keys(groups)) {
      const arrayCalls: CallDtoModel[] = groups[number];

      const numberOfCallOnThisWeekInput: number = arrayCalls?.filter(
        (call) => call?.type === 'INCOMING' || call?.type === 'MISSED',
      )?.length;
      const numberOfCallOnThisWeekOutput: number = arrayCalls?.filter(
        (call) => call?.type === 'OUTGOING',
      )?.length;

      const latestInputCall = arrayCalls
        ?.filter((call) => call?.type === 'INCOMING' || call?.type === 'MISSED')
        ?.sort((a, b) => (a?.timestamp > b?.timestamp ? 1 : -1))?.[0];

      let lastCallDateInput = '';
      if (latestInputCall?.timestamp) {
        try {
          lastCallDateInput =
            moment
              .tz(new Date(latestInputCall?.timestamp), 'Asia/Jerusalem')
              .format('dddd, MMMM Do YYYY, h:mm:ss a') || '';
        } catch (err) {
          console.error(err);
        }
      }

      const latestOutCall = arrayCalls
        ?.filter((call) => call.type === 'OUTGOING')
        ?.sort((a, b) => (a?.timestamp > b?.timestamp ? 1 : -1))?.[0];

      let lastCallDateOutput = '';

      if (latestOutCall?.timestamp) {
        try {
          lastCallDateOutput =
            moment
              .tz(new Date(latestOutCall?.timestamp), 'Asia/Jerusalem')
              .format('dddd, MMMM Do YYYY, h:mm:ss a') || '';
        } catch (err) {
          console.error(err);
        }
      }

      const beforeThreeDay = new Date();
      beforeThreeDay.setDate(beforeThreeDay.getDate() - 3);

      let redSignal = false;

      if (
        beforeThreeDay.getTime() > latestOutCall?.timestamp ||
        beforeThreeDay.getTime() > latestInputCall?.timestamp
      ) {
        redSignal = true;
      }
      const status: string =
        arrayCalls?.filter((call) => call?.type === 'MISSED')?.length ===
        arrayCalls.length
          ? 'MISSED'
          : '';

      const name: string = arrayCalls?.[0]?.name
        ? arrayCalls?.[0]?.name
        : 'unknown';

      const message2 = `
היי ,
זו סוזי נחמן מאור לעור טכנולוגיות.

אני אשמח לשוב אלייך בהקדם.😊
קורסים-טיפולים-מכשירים לייזר ועוד

בברכה
סוזי נחמן
054-4969106
orlaor.org.il
https://www.orlaor.org.il/orlaor-technolaty-about`;

      let message1 = `שלום ${name.split(' ')[0]} `;
      message1 += ' מה נשמע ? יש משהו שנוכל להתקדם בו ? ';
      const numberWhatsapp = number.startsWith('+')
        ? number
        : '+972' + number.slice(1);
      table.push({
        name: name,
        lastCallInput: lastCallDateInput,
        lastCallOutput: lastCallDateOutput,
        status: status,
        number: number,
        numberOfInputCalls: numberOfCallOnThisWeekInput,
        numberOfOutputCalls: numberOfCallOnThisWeekOutput,
        redSignal: redSignal,
        message1: encodeURI(
          `https://wa.me/${numberWhatsapp}/?text=${message1}`,
        ),
        messageWelcome: encodeURI(
          `https://wa.me/${numberWhatsapp}/?text=${message2}`,
        ),
      });
    }

    return table;
  }



  async getInformation(filter={}){

    let data = (await this.httpClient.post(environment.url + `/data?apiKey=${environment.API_KEY}`,{filter : filter}).toPromise());

    return data;

  }
}
