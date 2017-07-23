var _ = require('lodash'),
    Promise = require('bluebird'),
    db = require('../../data/db'),
    commands = require('../schema').commands,
    serverUtils = require('../../utils'),
    ghostVersion = require('../../utils/ghost-version'),
    errors      = require('../../errors'),
    logging     = require('../../logging'),
    models      = require('../../models'),
    i18n        = require('../../i18n'),
    excludedTables = ['accesstokens', 'refreshtokens', 'clients', 'client_trusted_domains'],
    modelOptions = {context: {internal: true}},

    // private
    getVersionAndTables,
    exportTable,

    // public
    doExport,
    exportFileName;

exportFileName = function exportFileName() {
    var datetime = (new Date()).toJSON().substring(0, 10),
        title = '';

    return models.Settings.findOne(_.merge({key: 'title'}, modelOptions)).then(function (result) {
        if (result) {
            title = serverUtils.safeString(result.get('value')) + '.';
        }

        return title + 'ghost.' + datetime + '.json';
    }).catch(function (err) {
        logging.error(new errors.GhostError({err: err}));
        return 'ghost.' + datetime + '.json';
    });
};

getVersionAndTables = function getVersionAndTables() {
    var props = {
        version: ghostVersion.full,
        tables: commands.getTables()
    };

    return Promise.props(props);
};

exportTable = function exportTable(tableName) {
    if (excludedTables.indexOf(tableName) < 0) {
        return db.knex(tableName).select();
    }
};

doExport = function doExport() {
    var tables, version;

    return getVersionAndTables().then(function exportAllTables(result) {
        tables = result.tables;
        version = result.version;

        return Promise.mapSeries(tables, exportTable);
    }).then(function formatData(tableData) {
        var exportData = {
            meta: {
                exported_on: new Date().getTime(),
                version: version
            },
            data: {
                // Filled below
            }
        };

        _.each(tables, function (name, i) {
            exportData.data[name] = tableData[i];
        });

        return exportData;
    }).catch(function (err) {
        return Promise.reject(new errors.DataExportError({
            err: err,
            context: i18n.t('errors.data.export.errorExportingData')
        }));
    });
};

module.exports = {
    doExport: doExport,
    fileName: exportFileName
};
