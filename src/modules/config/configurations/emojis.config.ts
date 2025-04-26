const getEmoji = (productionValue: string, developmentValue: string) =>
	process.env.NODE_ENV === "production" ? productionValue : developmentValue;

export const emojisConfig = {
	logo: getEmoji("1352772075290366003", "1352772541248442398"),
	fail: getEmoji("1352772052859228250", "1352773368621039719"),
	success: getEmoji("1352772021519646801", "1352773415425282068"),
	loading: getEmoji("1352771989823033435", "1352773472333594686"),
	loading2: getEmoji("1352771940678504498", "1352773504889782322"),
	youtube: getEmoji("1352771919518367898", "1352773617280221225"),
	spotify: getEmoji("1352771883958931526", "1352773649672704001"),
};
