const department_options = [
    {value:'机械与汽车工程学院',label:'机械与汽车工程学院'},
    {value:'建筑学院',label:'建筑学院'},
    {value:'土木与交通学院',label:'土木与交通学院'},
    {value:'电子与信息学院',label:'电子与信息学院'},
    {value:'材料科学与工程学院（先进材料国际化示范学院）',label:'材料科学与工程学院（先进材料国际化示范学院）'},
    {value:'化学与化工学院',label:'化学与化工学院'},
    {value:'轻工科学与工程学院',label:'轻工科学与工程学院'},
    {value:'食品科学与工程学院',label:'食品科学与工程学院'},
    {value:'数学学院',label:'数学学院'},
    {value:'物理与光电学院',label:'物理与光电学院'},
    {value:'经济与金融学院',label:'经济与金融学院'},
    {value:'旅游管理系',label:'旅游管理系'},
    {value:'电子商务系',label:'电子商务系'},
    {value:'自动化科学与工程学院',label:'自动化科学与工程学院'},
    {value:'计算机科学与工程学院',label:'计算机科学与工程学院'},
    {value:'电力学院',label:'电力学院'},
    {value:'生物科学与工程学院',label:'生物科学与工程学院'},
    {value:'环境与能源学院',label:'环境与能源学院'},
    {value:'软件学院',label:'软件学院'},
    {value:'工商管理学院（创业教育学院）',label:'工商管理学院（创业教育学院）'},
    {value:'公共管理学院',label:'公共管理学院'},
    {value:'马克思主义学院',label:'马克思主义学院'},
    {value:'外国语学院',label:'外国语学院'},
    {value:'法学院（知识产权学院）',label:'法学院（知识产权学院）'},
    {value:'新闻与传播学院',label:'新闻与传播学院'},
    {value:'艺术学院',label:'艺术学院'},
    {value:'体育学院',label:'体育学院'},
    {value:'设计学院',label:'设计学院'},
    {value:'医学院（生命科学研究院）',label:'医学院（生命科学研究院）'},
    {value:'国际教育学院',label:'国际教育学院'},
    {value:'生物医学科学与工程学院',label:'生物医学科学与工程学院'},
    {value:'吴贤铭智能工程学院',label:'吴贤铭智能工程学院'},
    {value:'分子科学与工程学院（华南软物质科学与技术高等研究院）',label:'分子科学与工程学院（华南软物质科学与技术高等研究院 ）'},
    {value:'微电子学院',label:'微电子学院'}
  ]

function getCurrentTime () {
    var date = new Date();
    var y = date.getFullYear();
    var m = date.getMonth() + 1;
    m = m < 10 ? ('0' + m) : m;
    var d = date.getDate();
    d = d < 10 ? ('0' + d) : d;
    var h = date.getHours();
    h = h < 10 ? ('0' + h) : h;
    var minute = date.getMinutes();
    var second = date.getSeconds();
    minute = minute < 10 ? ('0' + minute) : minute;
    second = second < 10 ? ('0' + second) : second;
    return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second + '.' + date.getMilliseconds();
}

export{
  getCurrentTime,
  department_options
}
