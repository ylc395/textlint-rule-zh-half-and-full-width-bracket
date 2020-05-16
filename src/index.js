function isTextWithChinese(text) {
    return /\p{Unified_Ideograph}/u.test(text);
}


function reporter(context, options = {}) {
    const {Syntax, RuleError, report, getSource, fixer} = context;
    const textWithHalfWidthBracketsRegex = /\((.+?)\)/g;
    const textWithFullWidthBracketsRegex = /（(.+?)）?/g;
    const bracketOption = options.bracket || 'mixed';

    function createRuleError(match, tip, fixWith) {
        const index = match.index;
        return new RuleError(tip, {
            index,
            fix: fixer.replaceTextRange(
                [index, index + match[0].length],
                `${fixWith[0]}${match[1]}${fixWith[1]}`,
        )});
    }

    return {
        [Syntax.Str](node){
            const text = getSource(node);
            const textWithHalfWidthBrackets = textWithHalfWidthBracketsRegex.exec(text);
            const textWithFullWidthBrackets = textWithFullWidthBracketsRegex.exec(text);

            if (!textWithFullWidthBrackets && !textWithHalfWidthBrackets) {
                return;
            }

            if (bracketOption === 'halfWidth' && textWithFullWidthBrackets) {
                const ruleError = createRuleError(textWithFullWidthBrackets, 'Found full width brackets.', '()');
                report(node, ruleError);
                return;
            }

            if (bracketOption === 'fullWidth' && textWithHalfWidthBrackets) {
                const ruleError = createRuleError(textWithHalfWidthBrackets, 'Found half width brackets.', '（）');
                report(node, ruleError);
                return;
            }

            if (bracketOption === 'mixed') {
                if (textWithHalfWidthBrackets && isTextWithChinese(textWithHalfWidthBrackets[1])) {
                    const ruleError = createRuleError(textWithHalfWidthBrackets, 'Found half width brackets around Chinese text.', '（）');
                    report(node, ruleError);
                    return;
                }

                if (textWithFullWidthBrackets && !isTextWithChinese(textWithFullWidthBrackets[1])) {
                    const ruleError = createRuleError(textWithFullWidthBrackets, 'Found full width brackets around non-Chinese text.', '()');
                    report(node, ruleError);
                    return;
                }
            }
        }
    }
}

module.exports = {
    linter: reporter,
    fixer: reporter,
};