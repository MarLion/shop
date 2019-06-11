export default {
  //将时间转换为'yyyy-mm-dd HH:mm:ss'
  TransChinaTime:function (date) {
    let dataFor = /^(\d{4})-(\d{2})-(\d{2})\s(\d{2}):(\d{2}):(\d{2})$/;
    let transed = '';
    if (!dataFor.test(date)) {
      let da = new Date(date);
      let year = da.getFullYear();
      let mon = da.getMonth() + 1;
      let day = da.getDate();
      let hour = da.getHours();
      let min = da.getMinutes();
      let sec = da.getSeconds();
      mon = mon > 9 ? mon : '0' + mon;
      day = day > 9 ? day : '0' + day;
      hour = hour > 9 ? hour : '0' + hour;
      min = min > 9 ? min : '0' + min;
      sec = sec > 9 ? sec : '0' + sec;
      transed = year + '-' + mon + '-' + day + ' ' + hour + ':' + min + ':' + sec;
    } else {
      transed = date;
    }
    return transed;
  },
  //转换时间戳
  /**
   * @return {number}
   */
  TransTimestamp:function (date) {
    let res = new Date(date).getTime();
    return res;
  },

  //去除字符串所有空格
  DeleteSpaceFromStr:function (str) {
    return str.replace(/\s*/g,"");
  },
 }
