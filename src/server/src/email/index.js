import handlebars from 'handlebars';
import fs from 'fs';
import juice from 'juice';
import path from 'path';

const buildEmailComponent = (topic, component, data) => {
  const filePath = path.join(`${__dirname}/templates`, topic, `${component}.hbs`);
  const templateContent = fs.readFileSync(filePath, { encoding: 'utf-8' });

  if (!templateContent) {
    return null;
  }

  const template = handlebars.compile(templateContent);
  const rendered = template(data);
  if (component === 'html') {
    return juice(rendered);
  }
  return rendered;
};

const buildEmail = (topic, data) => {
  return {
    subject: buildEmailComponent(topic, 'subject', data),
    html: buildEmailComponent(topic, 'html', data),
    txt: buildEmailComponent(topic, 'txt', data),
  };
};

export default buildEmail;
