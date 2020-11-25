function checkOwner(client, target) {
    return client.owners.includes(target);
}

module.exports = checkOwner;