const path = require("path");
const fs = require("fs-extra");

const XmlParser = require("./parser/xml/XmlParser");
const templateHandler = require("./parser/template/handler.js");
const styleHandler = require("./parser/style/haneler.js");
const utils = require("./utils/utils.js");
const pathUtil = require("./utils/pathUtil.js");
/**
 * @param {原始文件夹路径} folder
 * @param {目标文件夹路径} target
 */
function transferFolder(folder, target, callback) {
  fs.readdir(folder, function(err, files) {
    files.forEach((fileName) => {
      if (fileName.includes(".vue")) {
        const originPath = folder + path.sep + fileName;
        const targetFile = target + path.sep + fileName;
        data_vue = fs.readFileSync(originPath, "utf8");
        filesHandle(data_vue, originPath, targetFile);
      }
    });
  });
}
/**
 * 转换vue文件
 * @param {文件的内容} fileText
 * @param {*} filePath
 * @param {*} targetFile
 */
async function filesHandle(fileText, filePath, targetFile) {
  let targetFilePath = targetFile;
  let xmlParser = new XmlParser();

  //解析代码内容
  xmlParserObj = xmlParser.parse(fileText);
  // 用于保存文件的字符串内容
  let fileContent = {
    style: [],
    template: "",
    script: "",
  };

  //最后根据xml解析出来的节点类型进行不同处理
  for (let i = 0; i < xmlParserObj.childNodes.length; i++) {
    let v = xmlParserObj.childNodes[i];
    if (v.nodeName === "style") {
      let style = await styleHandler(v, filePath, targetFilePath);
      fileContent.style.push(style);
    }
    // script 标签内容暂时保持不变
    if (v.nodeName === "script") {
      fileContent.script += [
        "\r\n<script>",
        v.firstChild.nodeValue,
        "</script>\r\n",
      ].join("");
    }
    if (v.nodeName === "template") {
      fileContent.template += templateHandler(v);
    }
  }

  let content = "\uFEFF"; // BOM
  // 把处理好后的内容拼接到一块进行文件输出
  content =
    fileContent.template + fileContent.script + fileContent.style.join("\r\n");

  fs.writeFileSync(targetFile, content, () => {
    console.log(`Convert file ${fileName}.vue success!`);
  });
}

async function transform(sourceFolder, targetFolder) {
  if (!fs.existsSync(sourceFolder)) {
    console.log("Error: source目录不存在! 请按照说明创建要转换的目标文件夹");
    return;
  }
  if (!fs.existsSync(targetFolder)) {
    fs.mkdirSync(targetFolder);
  }
  utils.sleep(500); // 暂停一下，防止IO饥饿
  transferFolder(sourceFolder, targetFolder, () => {});
}

transform("./source", "./result");
