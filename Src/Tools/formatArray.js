function formatArray(array, type = 'conjunction') {
    return new Intl.ListFormat('pt-BR', { style: 'short', type: type }).format(array);
}

module.exports = formatArray;