function isTextWithChinese(text) {
    return /\p{Unified_Ideograph}/u.test(text);
}

module.exports = function(context, options = {}) {
    const {Syntax, RuleError, report, getSource} = context;
    const textWithHalfWidthBracketsRegex = /\((.+?)\)/g;
    const textWithFullWidthBracketsRegex = /（(.+?)）?/g;
    const bracketOption = options.bracket || 'mixed';

    return {
        [Syntax.Str](node){
            const text = getSource(node);
            const textWithHalfWidthBrackets = textWithHalfWidthBracketsRegex.exec(text);
            const textWithFullWidthBrackets = textWithFullWidthBracketsRegex.exec(text);

            if (!textWithFullWidthBrackets && !textWithHalfWidthBrackets) {
                return;
            }

            if (bracketOption === 'halfWidth' && textWithFullWidthBrackets) {
                const ruleError = new RuleError("Found full width brackets.", {
                    index: textWithFullWidthBrackets.index
                });
                report(node, ruleError);
                return;
            }

            if (bracketOption === 'fullWidth' && textWithHalfWidthBrackets) {
                const ruleError = new RuleError("Found half width brackets.", {
                    index: textWithHalfWidthBrackets.index
                });
                report(node, ruleError);
                return;
            }

            if (bracketOption === 'mixed') {
                if (textWithHalfWidthBrackets && isTextWithChinese(textWithHalfWidthBrackets[1])) {
                    const ruleError = new RuleError("Found half width brackets around Chinese text.", {
                        index: textWithHalfWidthBrackets.index
                    });
                    report(node, ruleError);
                    return;
                }

                if (textWithFullWidthBrackets && !isTextWithChinese(textWithFullWidthBrackets[1])) {
                    const ruleError = new RuleError("Found full width brackets around non-Chinese text.", {
                        index: textWithFullWidthBrackets.index
                    });
                    report(node, ruleError);
                    return;
                }
            }
        }
    }
};
