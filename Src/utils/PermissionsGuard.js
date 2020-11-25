class PermissionsGuard {
    constructor(permissions, /*required*/) {
        this.permissions = permissions;
        //this.required = required;
    }

    check(memberPermissions) {
        return this.permissions.every(
            (permission) => memberPermissions.includes(permission)
        );
    }
}

module.exports = PermissionsGuard;
