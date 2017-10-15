const cheerio=require('cheerio');
const Base64_module = require('./Base64');
const Base64 = new Base64_module();
const problem_status = {
    "Pending": 0,
    "Queuing": 0,
    "Compiling": 2,
    "Running": 3,
    "Accepted": 4,
    "Presentation Error": 5,
    "Wrong Answer": 6,
    "Time Limit Exceeded": 7,
    "Memory Limit Exceeded": 8,
    "Output Limit Exceeded": 9,
    "Runtime Error":10,
    "Compile Error": 11
};

exports.format=function (response,sid) {
    const $ = cheerio.load(response.text);
    const result=$("table").eq(4).find('tr').eq(1).find('td');
    const runner_id = result.eq(0).text();
    let status = result.eq(3).text();
    let time = result.eq(5).text();
    time = time.substr(0, time.length - 2);
    let memory = result.eq(4).text();
    memory = memory.substr(0, memory.length - 1);
    log("runner_id:"+runner_id+"memory:"+memory+",time:"+time);
    status = problem_status[status];
    return [runner_id, status, time, memory, sid];
};

exports.post_format=function(pid,lang,code)
{
    return {
        problem_id: pid,
        language: lang,
        source: Base64.encode(code),
        encoded:1
    };
};

exports.updateurl=function(pid,username)
{
    return "http://poj.org/status?problem_id="+pid+"&user_id="+username['user_id1']+"&result=&language=";
};

exports.formatAccount=function(account)
{
    return account['user_id1'];
};