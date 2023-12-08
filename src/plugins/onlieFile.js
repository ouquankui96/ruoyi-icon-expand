export default {
  // 在线预览word，excel，pptx，pdf文件 支持.doc、.docx。 xls、.xlsx、.pot、.potx、.ppt 和 .pptx
  onlinePreview(fileUrl) {
    let url = encodeURIComponent(fileUrl)
    let officeUrl = 'http://view.officeapps.live.com/op/view.aspx?src='+url
    // 在新窗口打开编码后 的链接
    window.open(officeUrl,'_target')
  }
}
