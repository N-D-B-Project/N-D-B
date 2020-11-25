function comparePerms(member, target) {
    return member.roles.highest.position < target.roles.highest.position;
}