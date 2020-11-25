function formatPerms(perm) {
    return perm
        .toLowerCase()
        .replace(/(^|"|_)(\S)/g, (s) => s.toUpperCase())
        .replace(/_/g, ' ')
        .replace(/Guild/g, 'Server')
        .replace(/Use Vad/g, 'Use Voice Acitvity');
}

module.exports = formatPerms;