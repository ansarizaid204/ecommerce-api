
const fs = require("fs");
const ejs = require("ejs");
const { htmlToText } = require("html-to-text");
const juice = require("juice");
const config = require("../config/config");
const transporter = require("./smtp");

async function sendmail({
  template: templateName,
  templateVars,
  ...restOfOptions
}) {
  const templatePath = `email-templates/${templateName}.html`;
  const options = {
    ...restOfOptions,
  };

  if (templateName && fs.existsSync(templatePath)) {
    const template = fs.readFileSync(templatePath, "utf-8");
    const html = ejs.render(template, {
      ...templateVars,
      base_url: config.base_url,
    });
    const text = htmlToText(html);
    const htmlWithStylesInlined = juice(html);

    options.html = htmlWithStylesInlined;
    options.text = text;
  }



  // send mail with defined transport object

  try {
    let info = await transporter.sendMail(options);
    return info;
  } catch (error) {
    throw error;
  }
}



module.exports = { sendmail };
