const path = require("path");

const utils = require("../../utils/utils.js");

/**
 * @param {样式字符串} styleText
 * 对于 rem 单位，乘以 200 转换为 px 单位
 */
function handleRem(styleText) {
  const remTransPx = styleText.replace(/([\d|\.]+)(rem)/gi, (rs, $1, $2) => {
    return Math.floor(Number($1) * 200) + "px";
  });
  return remTransPx;
}
/**
 * 对于 px 单位，乘以 2 保持为 px 单位, 1px除外
 * 之前都是按照375进行的，现在uni-app里面是750
 * @param {*} styleText
 */
function handlePxUnit(styleText) {
  const pxTransPx = styleText.replace(/([\d|\.]+)(px)/gi, (rs, $1, $2) => {
    if (Number($1) === 1) {
      return "1px";
    } else {
      return Math.floor(Number($1) * 2) + $2;
    }
  });
  return pxTransPx;
}
/**
 * 处理css文件
 * 1.内部引用的wxss文件修改为css文件
 * 2.修正引用的wxss文件的路径
 *
 * @param {*} fileContent       css文件内容
 * @param {*} file_wxss         当前处理的文件路径
 */
async function styleHandle(v, filePath, filename, targetFilePath) {
  // let styleContent = v.toString();

  // console.log(styleContent)
  // console.log(styleContent)
  let styleContent = utils.decode(v.childNodes.toString());

  //去掉命名空间及标志
  styleContent = utils.restoreTagAndEventBind(styleContent);
  styleContent = utils.decode(styleContent);

  styleContent = handlePxUnit(styleContent); // 先转px单位
  styleContent = handleRem(styleContent); // 再转rem单位
  //css文件所在目录
  // let fileDir = path.dirname(filePath);
  // let reg_import = /@import +['"](.*?\..*?)['"];*/g; //应该没有写单引号的呗？(服输，还真可能有单引号)
  // styleContent = styleContent.replace(reg_import, function(
  //   match,
  //   pos,
  //   orginText
  // ) {
  //   //先转绝对路径，再转相对路径
  //   let filePath = pos;
  //   filePath = pathUtil.relativePath(filePath, global.miniprogramRoot, fileDir);

  //   filePath = filePath.replace(/\.wxss/i, ".css");

  //   //虽可用path.posix.前缀来固定为斜杠，然而改动有点小多，这里只单纯替换一下
  //   return '@import "' + filePath + '";';
  // });
  let attrList = [];
  let attributes = v.attributes;
  for (let index = 0; index < attributes.length; index++) {
    const obj = attributes[index];
    attrList.push(obj.name + '="' + obj.value + '"');
  }

  // console.log(styleContent)
  styleContent = `<style ${attrList.join(" ")}>\r\n${styleContent}\r\n</style>`;
  try {
    return await new Promise((resolve, reject) => {
      resolve(styleContent);
    });
  } catch (err) {
    console.log(err);
  }
}

module.exports = styleHandle;
