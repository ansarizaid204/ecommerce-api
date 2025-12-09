const Agenda = require("agenda");
const con = require("../helpers/db");

const orderMailJob = require("./orderMail");

const agenda = new Agenda({ mongo: con });

agenda.define("order-email", orderMailJob);

agenda.start();
module.exports = agenda;
