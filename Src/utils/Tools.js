module.exports = class Registry {

    constructor(client) {
        this.client = client;
    }

    checkOwner(target) {
		return this.client.owners.includes(target);
	}
}