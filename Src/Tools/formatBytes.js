function formatBytes(bytes) {
    if(bytes === 0) return "0 Bytes"
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "ZB", "YB"];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${parseFloat((bytes / Math.pow(1024, i)).toFixed(2))} ${sizes[i]}`;
}

module.exports = formatBytes;