"use strict";
const TextLintTester = require("textlint-tester");
const tester = new TextLintTester();
// rule
const rule = require("../lib/index").default;
// ruleName, rule, { valid, invalid }
tester.run("half-and-full-width-bracket", rule, {
    valid: [
        {text: "text", options: {bracket: 'fullWidth'}},
        {text: "text", options: {bracket: 'halfWidth'}},
        {text: "text(aaaa)", options: {bracket: 'halfWidth'}},
        {text: "text（aaaa）", options: {bracket: 'fullWidth'}},
        {text: "text(aaaa)", options: {bracket: 'mixed'}},
        {text: "text(11123312)", options: {bracket: 'mixed'}},
        {text: "text（中文）", options: {bracket: 'mixed'}},
        {text: "text（中文aaa）", options: {bracket: 'mixed'}},
    ],
    invalid: [
        {
            text: "text(ddddd)",
            options: {bracket: 'fullWidth'},
            errors: [
                {
                    message: "Found half width brackets.",
                    line: 1,
                    column: 5
                }
            ]
        },
        {
            text: "text（ddddd）",
            options: {bracket: 'halfWidth'},
            errors: [
                {
                    message: "Found full width brackets.",
                    line: 1,
                    column: 5
                }
            ]
        },
        {
            text: "text（aaaaa23）   text(啊啊123)",
            errors: [
                {
                    message: "Found full width brackets around non-Chinese text.",
                    line: 1,
                    column: 5
                },
                {
                    message: "Found half width brackets around Chinese text.",
                    line: 1,
                    column: 21
                }
            ]
        },
    ]
});