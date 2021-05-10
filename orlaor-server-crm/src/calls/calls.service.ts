import { Injectable } from '@nestjs/common';
import { CallDtoModel, TableRecordModel } from '../model/callDto.model';
import { InjectModel } from '@nestjs/mongoose';
import { ReturnModelType } from '@typegoose/typegoose';
import { CallEntity } from '../model/call.entity';
import { Cron, CronExpression } from '@nestjs/schedule';
import * as _ from 'underscore';
import * as nunjucks from 'nunjucks';
import * as nodemailer from 'nodemailer';
import { ENV } from '../env';
import * as path from 'path';
import * as moment from 'moment-timezone';

@Injectable()
export class CallsService {
  constructor(
    @InjectModel('CallEntity')
    private readonly repo: ReturnModelType<typeof CallEntity>,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_7AM, {
    name: 'notifications',
    timeZone: 'Asia/Jerusalem',
  })
  async handleCron() {
    await this.sendEmailReport();
  }

  async saveCallOnDb(calls: CallDtoModel[]) {
    console.log('calling to db');
    for await (const call of calls) {
      const found = await this.repo.findOne({ hash: call.hash });
      if (!found) {
        try {
          const callEntity = new this.repo(call);
          callEntity._id = call.id;
          await callEntity.save();
        } catch (err) {
          console.error(err);
        }
      } else {
        console.log('skip same hash');
      }
    }
  }

  private async sendEmailReport() {
    // get all calls in last 1 week
    const lastTwoWeek = new Date();
    lastTwoWeek.setDate(lastTwoWeek.getDate() - 14);

    const regexMatch = [/הדרכה/i, /לקוח/i, /קורס/i, /לייזר/i];
    const records = await this.repo.find({
      // TODO ADD
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

    const groups = _.groupBy(records, (r) => r.number);
    await this.createTable(groups);
  }

  private async createTable(groups: any) {
    const table: TableRecordModel[] = [];

    for await (const number of Object.keys(groups)) {
      const arrayCalls: CallEntity[] = groups[number];

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

    await this.sendTableByEmail(table);
  }

  private async sendTableByEmail(table: TableRecordModel[]) {
    const html = await nunjucks.render(
      path.resolve(__dirname, '../assets/table-report/index.html'),
      {
        items: table,
      },
    );

    const mailOptions = {
      from: ENV.EMAIL_AUTH_GMAIL,
      to: ENV.CLIENT_EMAIL,
      subject: 'report customers ' + new Date().toString(),
      html: html,
    };

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: ENV.EMAIL_AUTH_GMAIL,
        pass: ENV.PASS_AUTH_GMAIL,
      },
    });

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
  }
}
