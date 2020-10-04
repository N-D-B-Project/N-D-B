function capitalise(string) {
    return string.split(" ")
        .map(str => str.slice(0, 1)
        .toLowerCase() + str.slice(1))
        .join(" ");
}

module.exports = capitalise;