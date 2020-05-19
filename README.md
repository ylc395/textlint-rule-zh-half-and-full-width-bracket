# textlint-rule-zh-half-and-full-width-bracket [![textlint rule](https://img.shields.io/badge/textlint-fixable-green.svg?style=social)](https://textlint.github.io/)

textlint rule to check if correct full-width or half-width brackets are used.

检测是否正确地使用了全角或半角括号。

## 安装 Install

Install with [npm](https://www.npmjs.com/):

```
npm install textlint-rule-zh-half-and-full-width-bracket
```

## 使用 Usage

Via `.textlintrc`(Recommended)

在`.textlintrc`中添加（推荐）

```json
{
  "rules": {
    "zh-half-and-full-width-bracket": true
  }
}
```

Via CLI

通过命令行调用

```
textlint --rule zh-half-and-full-width-bracket README.md
```

### 选项 Options

#### `bracket`
可配置`bracket`选项，可选的值包括`"halfWidth"`，`"fullWidth"`,`"mixed"`（默认）。

`"halfWidth"`，`"fullWidth"`,`"mixed"`(default) is available for `bracket` option.

+ `"halfWidth"`：一律使用半角括号 Always use half-width brackets
+ `"fullWidth"`：一律使用全角括号 Always use full-width brackets
+ `"mixed"`：括号内有中文的情况下，使用中文全角括号；括号内是全英文、数字的情况下，使用英文半角括号 Using full-width brackets when all the text in brackets is in Chinese characters; otherwise using half-width brackets

```json
{
  "rules": {
    "zh-half-and-full-width-bracket": {
    // type of brackets you want
    // 选择你需要的括号类型
      "bracket": "halfWidth"
    }
  }
}
```
#### `ignoredHtmlTags`
搭配[textlint-plugin-html](https://github.com/textlint/textlint-plugin-html)使用时，可以配置`ignoredHtmlTags`选项，它是一个数组，表示忽略哪些 HTML 标签内的内容。默认为`["code", "pre"]`。

When using with [textlint-plugin-html](https://github.com/textlint/textlint-plugin-html), add this option to ignore contents of some tags. Default Value is `["code", "pre"]`.

## 开发 Development
### Build

Builds source codes for publish to the `lib` folder. You can write ES2015+ source codes in `src/`
folder.

    npm run build

### Tests

Run test code in `test` folder. Test textlint rule by
[textlint-tester](https://github.com/textlint/textlint-tester "textlint-tester").

    npm test

## License

MIT © chenyulu
