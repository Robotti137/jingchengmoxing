let getFormatTime = (time) => {
    let date = time || new Date();
    let seperator1 = "-";
    let seperator2 = ":";
    let month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
    let strDate = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
    let currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
        + " " + date.getHours() + seperator2 + date.getMinutes();
    return currentdate;
}

let transformTimestamp = (time) => {
    return new Date(time.replace(/-/g, "/"));
}

let intervalTime = (end_time) => {
    let start_time = transformTimestamp(getFormatTime().substring(0, 10));
    end_time = transformTimestamp(end_time);
    let runTime = parseInt((end_time.getTime() - start_time.getTime()) / 1000);
    let year = Math.floor(runTime / 86400 / 365);
    runTime = runTime % (86400 * 365);
    let month = Math.floor(runTime / 86400 / 30);
    runTime = runTime % (86400 * 30);
    let day = Math.floor(runTime / 86400);
    runTime = runTime % 86400;
    let hour = Math.floor(runTime / 3600);
    runTime = runTime % 3600;
    let minute = Math.floor(runTime / 60);
    runTime = runTime % 60;
    let second = runTime;
    return {
        year,
        month,
        day,
        hour,
        minute,
        second
    }
}

export {
    getFormatTime,
    transformTimestamp,
    intervalTime
}