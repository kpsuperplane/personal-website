var _ = require('lodash').runInContext(),
    fs = require('fs'),
    Promise = require('bluebird'),
    path = require('path'),
    htmlToText = require('html-to-text'),
    urlService = require('../services/url'),
    templatesDir = path.resolve(__dirname, '..', 'mail', 'templates');

_.templateSettings.interpolate = /{{([\s\S]+?)}}/g;

exports.generateContent = function generateContent(options) {
    var defaults,
        data;

    defaults = {
        siteUrl: urlService.utils.urlFor('home', true)
    };

    data = _.defaults(defaults, options.data);

    // read the proper email body template
    return Promise.promisify(fs.readFile)(path.join(templatesDir, options.template + '.html'), 'utf8')
        .then(function (content) {
            var compiled,
                htmlContent,
                textContent;

            // insert user-specific data into the email
            compiled = _.template(content);
            htmlContent = compiled(data);

            // generate a plain-text version of the same email
            textContent = htmlToText.fromString(htmlContent);

            return {
                html: htmlContent,
                text: textContent
            };
        });
};
