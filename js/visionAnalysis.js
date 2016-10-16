var oxford = require('project-oxford');
var fs = require('fs');
var client = new oxford.Client("38e7527a222d42919cd631cd65f3c3f6");

var data = {};
var path_constants = "../data/constants.json";

client.vision.ocr({
    path: '../data/test5.jpg',
    language: 'en'
}).then(function(response) {

    initialize();
    var regions = response.regions;
    for (i in regions) {
        var lines = regions[i].lines;
        var cur_day = "";
        var cur_course = {};

        for (var j = 0; j < lines.length; j++) {
            var words = lines[j].words;
            cur_day = get_day(words, cur_day);
            process_analysis(words, cur_day, cur_course);
        }

    }
    write_files();

});

var initialize = function() {
    if (fs.existsSync(path_constants)) {
        var reading = fs.readFileSync(path_constants, "utf-8");
        var constants = JSON.parse(reading);
        var days = constants.DAYS;
        for (i in days) {
            data[days[i]] = { "courses": [] };
        }
    }

}

var get_day = function(words, cur_day) {
    if (words.length == 1) {
        if (data.hasOwnProperty(words[0].text)) {
            return words[0].text;
        }
    }
    return cur_day;
}

var process_analysis = function(words, cur_day, cur_course) {

    if (cur_day != "") {
        if (words.length == 3) {
            var single_course = { "name": {} };
            single_course.name.major = words[0].text;
            single_course.name.code = words[1].text;
            single_course.name.section = words[2].text;
            data[cur_day].courses.push(single_course);
        } else if (words.length == 2 && data[cur_day].courses != undefined) {
            var length = data[cur_day].courses.length;
            if (data[cur_day].courses[length - 1] != undefined) {
                data[cur_day].courses[length - 1].place = {};
                data[cur_day].courses[length - 1].place.building = words[0].text;
                data[cur_day].courses[length - 1].place.number = words[1].text;
            }
        }

    }
}

var write_files = function() {
    console.log("writing data.json");
    fs.writeFile('../data/data.json', JSON.stringify(data), (err) => {
        if (err) throw err
    });
}