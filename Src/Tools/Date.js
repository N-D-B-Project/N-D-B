const options = {
	timeZone: 'America/Sao_Paulo',
	hour: 'numeric',
    minute: 'numeric',
    seconds: 'numeric'
};
const date = new Intl.DateTimeFormat([], options);
const datalog = date.format(new Date())
//console.log(data.format(new Date()));

module.exports = {
    options,
    date,
    datalog
}