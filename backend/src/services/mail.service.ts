import FormData from "form-data";
import Mailgun, { MessagesSendResult } from "mailgun.js";
import { IMailgunClient } from "mailgun.js/Interfaces";
import * as ejs from "ejs";
import * as path from "path";

export default class MailService {
  mg: IMailgunClient;

  constructor() {
    const mailgun = new Mailgun(FormData);

    this.mg = mailgun.client({
      username: "api",
      key: process.env["MAILGUN_SECRET"] ?? "",
      url: "https://api.eu.mailgun.net",
    });
  }

  async sendMailConfirmation(
    email: string,
    challengeUUID: string
  ): Promise<MessagesSendResult> {
    const template = await ejs.renderFile(
      path.join(__dirname, "../templates/confirm-mail.template.ejs"),
      {
        email: email,
        confirmLink: `${process.env.FRONTEND_URL}/verify-email/${challengeUUID}`,
      }
    );

    const templateText = template
      .replace(/<style([\s\S]*?)<\/style>/gi, "")
      .replace(/<[^>]*>/g, "");

    return this.mg.messages.create("readyvetgo.de", {
      from: "ReadyVetGo <no-reply@readyvetgo.de>",
      to: [email],
      subject: "Confirm your email address for ReadyVetGo",
      text: templateText,
      html: template,
    });
  }

  async sendResetPasswordEmail(
    email: string,
    resetPasswordUUID: string
  ): Promise<MessagesSendResult> {
    const template = await ejs.renderFile(
      path.join(__dirname, "../templates/forgot-password.template.ejs"),
      {
        email: email,
        resetLink: `${process.env.FRONTEND_URL}/reset-password/${resetPasswordUUID}`,
      }
    );

    const templateText = template
      .replace(/<style([\s\S]*?)<\/style>/gi, "")
      .replace(/<[^>]*>/g, "");

    return this.mg.messages.create("readyvetgo.de", {
      from: "ReadyVetGo <no-reply@readyvetgo.de>",
      to: [email],
      subject: "Reset your password for ReadyVetGo",
      text: templateText,
      html: template,
    });
  }
}
