'use strict';

const debug = require('ghost-ignition').debug('importer:users'),
    _ = require('lodash'),
    BaseImporter = require('./base'),
    globalUtils = require('../../../../utils');

class UsersImporter extends BaseImporter {
    constructor(options) {
        super(_.extend(options, {
            modelName: 'User',
            dataKeyToImport: 'users',
            requiredData: ['roles', 'roles_users']
        }));

        // Map legacy keys
        this.legacyKeys = {
            image: 'profile_image',
            cover: 'cover_image',
            last_login: 'last_seen'
        };
    }

    /**
     * - all imported users are locked and get a random password
     * - they have to follow the password forgotten flow
     * - we add the role by name [supported by the user model, see User.add]
     *   - background: if you import roles, but they exist already, the related user roles reference to an old model id
     */
    beforeImport() {
        debug('beforeImport');

        let self = this, role;

        // Remove legacy field language
        this.dataToImport = _.filter(this.dataToImport, function (data) {
            return _.omit(data, 'language');
        });

        this.dataToImport = this.dataToImport.map(self.legacyMapper);

        _.each(this.dataToImport, function (model) {
            model.password = globalUtils.uid(50);
            model.status = 'locked';
        });

        _.each(this.roles_users, function (attachedRole) {
            role = _.find(self.roles, function (role) {
                if (attachedRole.role_id === role.id) {
                    return role;
                }
            });

            // CASE: default fallback role
            if (!role) {
                role = {name: 'Author'};
            }

            _.each(self.dataToImport, function (obj) {
                if (attachedRole.user_id === obj.id) {
                    if (!_.isArray(obj.roles)) {
                        obj.roles = [];
                    }

                    // CASE: we never import the owner, the owner is always present in the database
                    // That's why it is not allowed to import the owner role
                    if (role.name === 'Owner') {
                        role.name = 'Administrator';
                    }

                    obj.roles.push(role.name);
                }
            });
        });

        return super.beforeImport();
    }

    doImport(options) {
        return super.doImport(options);
    }
}

module.exports = UsersImporter;
