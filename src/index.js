function isTextWithChinese(text) {
    return /\p{Unified_Ideograph}/u.test(text);
}


function reporter(context, options = {}) {
    const {Syntax, RuleError, report, getSource, fixer} = context;
    const bracketOption = options.bracket || 'mixed';

    return {
        [Syntax.Str](node){
            function reportRuleError(tip, fixWith) {
                return match => {
                    const index = match.index;
                    const ruleError = new RuleError(tip, {
                        index,
                        fix: fixer.replaceTextRange(
                            [index, index + match[0].length],
                            `${fixWith[0]}${match[1]}${fixWith[1]}`,
                    )});
                    report(node, ruleError);
                }
            }

            const text = getSource(node);
            const textWithHalfWidthBrackets = [...text.matchAll(/\((.+?)\)/g)];
            const textWithFullWidthBrackets = [...text.matchAll(/（(.+?)）/g)];

            if (bracketOption === 'halfWidth') {
                textWithFullWidthBrackets.forEach(reportRuleError('Found full width brackets.', '()'));
            }

            if (bracketOption === 'fullWidth') {
                textWithHalfWidthBrackets.forEach(reportRuleError('Found half width brackets.', '（）'));
            }

            if (bracketOption === 'mixed') {
                textWithHalfWidthBrackets
                    .filter(([matched, captured]) => isTextWithChinese(captured))
                    .forEach(reportRuleError('Found half width brackets around Chinese text.', '（）'));

                textWithFullWidthBrackets
                    .filter(([matched, captured]) => !isTextWithChinese(captured))
                    .forEach(reportRuleError('Found full width brackets around non-Chinese text.', '()'));
            }
        }
    }
}

export default {
    linter: reporter,
    fixer: reporter,
};