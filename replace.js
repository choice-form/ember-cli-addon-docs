const fs = require('fs');

/**
 * 要扫描的文件夹
 */
const folder = './addon';
/**
 * 要处理的文件类型
 */
const fileTypes = ['.hbs', '.js'];
/**
 * 要移除的内容正则表达式
 */
const removeRegExp = /docs-/g;
/**
 * 锁定范围的正则表达式,只有匹配该范围内的内容会被移除
 */
const rangeRegExp = /[cC]lass=(['"])[^'"]*docs-[^'"]+\n?\1/g;

function replaceFile(file) {
  let text = fs.readFileSync(file).toString();
  const match = text.match(rangeRegExp);

  if (match) {
    console.log('文件: ' + file + ' 发现' + match.length + '处,替换.');
    replacedFileCount += 1;
    match.forEach((part) => {
      replacedSpotCount += 1;
      const replaced = part.replace(removeRegExp, '');
      text = text.replace(part, replaced);
    });
    fs.writeFileSync(file, text);
  } else {
    console.log('文件: ' + file + ' 未发现内容,跳过.');
  }
}

function replaceFolder(folder) {
  const fileList = fs.readdirSync(folder);
  fileList.forEach((file) => {
    const filePath = folder + '/' + file;
    const stats = fs.statSync(filePath);
    if (stats.isDirectory()) {
      replaceFolder(filePath);
    } else if (fileTypes.some((f) => filePath.endsWith(f))) {
      replaceFile(filePath);
    }
  });
}

console.log('开始处理...');
let replacedFileCount = 0;
let replacedSpotCount = 0;
replaceFolder(folder);

console.log(
  `处理完成,一共替换${replacedFileCount}个文件中的${replacedSpotCount}个内容`
);
