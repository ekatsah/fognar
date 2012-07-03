// Copyright 2012, RespLab. All rights reserved.

function rdump_(obj, indent, depth) {
    if (depth > 10)
        return 'max depth';

    var str = '';
    for (key in obj)
        if (typeof obj[key] == 'object')
            str += indent + key + ':\n' + rdump_(obj, indent + '   ', depth + 1);
        else 
            str += indent + key + ': ' + obj[key] + '\n';
    return str;
}

function dump_(obj) {
    var str = '';
    for (key in obj)
        str += key + ': ' + obj[key] + '\n';
    return str;
}

function dump(obj) {
    return dump_(obj);
}

function recurloop(func, delay, times, count) {
    if (count == undefined)
        var count = 0;
    if (count < times) {
        func();
        setTimeout(function() { recurloop(func, delay, times, count + 1); }, delay);
    }
}