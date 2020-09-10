const pug = require("pug");

function templateHandler(v) {
  let attrList = [];
  let attributes = v.attributes;
  let templateText = "";
  let langMode = "html";
  for (let index = 0; index < attributes.length; index++) {
    const obj = attributes[index];
    if (obj.name === "lang") {
      // 改变语言模式
      langMode = obj.value;
    } else {
      attrList.push(obj.name + '="' + obj.value + '"');
    }
  }
  if (langMode.toLowerCase() === "html") {
    templateText = v.childNodes.toString();
    templateText = templateText.replace(/&quot;/gi, '"');
    templateText = templateText.replace(/a-_-a/gi, '@')
    templateText = templateText.replace(/dot-_-dot/gi, ':')
    templateText = templateText.replace(/v-else="v-else"/gi, 'v-else')
    templateText += "\r\n";
  } else if (langMode.toLowerCase() === "pug") {
    templateText = pug.render(v.childNodes.toString(), {
      pretty: true,
      doctype: "html",
    });
    templateText = templateText.replace(/&quot;/gi, '"');
    templateText = templateText.replace(/a-_-a/gi, '@')
    templateText = templateText.replace(/dot-_-dot/gi, ':')
    templateText = templateText.replace(/v-else="v-else"/gi, 'v-else')
    templateText += "\r\n";
  }
  //div / li / ul 标签转换为 view
  const textOwnView = templateText.replace(
    /(<\/?)(div|ul|li)([^>]*>)/gi,
    (rs, $1, $2, $3) => $1 + "view" + $3
  );
  // img 转换为 image，添加 mode = 'widthFix'属性
  const textOwnImage = textOwnView.replace(
    /(<)(img)([^>]*>)/gi,
    (rs, $1, $2, $3) => $1 + "image mode='widthFix'" + $3
  );
  // span 转换为 text 标签
  const textOwnSpan = textOwnImage.replace(
    /(<\/?)(span)([^>]*>)/gi,
    (rs, $1, $2, $3) => $1 + "text" + $3
  );
  // transition 转换为 uni-transition 后续要做引入对应组件的处理
  const textOwnTrans = textOwnSpan.replace(
    /(<\/?)(transition)([^>]*>)/gi,
    (rs, $1, $2, $3) => $1 + "uni-transition" + $3
  );
  // 内部的 template 标签，转换为 block 标签
  const textAllTransfer = textOwnTrans.replace(
    /(<\/?)(template)([^>]*>)/gi,
    (rs, $1, $2, $3) => $1 + "block" + $3
  );
  const attrStr = attrList.length > 0 ? ` ${attrList.join(" ")}` : "";
  const templateContent = `<template${attrStr}>${textAllTransfer}</template>`;

  return templateContent;
}

module.exports = templateHandler;
