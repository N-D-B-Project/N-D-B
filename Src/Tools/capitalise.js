function capitalise(string) {
    return string.split(" ")
        .map(str => str.slice(0, 1)
        .toUpperCase() + str.slice(1))
        .join(" ");
}

module.exports = capitalise;