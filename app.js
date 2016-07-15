"use strict";
var fs = require('fs');
// To setup typings:
// I ran typings install dt~node --global
var Startup = (function () {
    function Startup() {
    }
    Startup.main = function () {
        //console.log('Hello World');
        Draft.parse_draft("data/Draft Recap - Free Fantasy Baseball - ESPN.html");
        return 0;
    };
    return Startup;
}());
var Draft = (function () {
    function Draft() {
    }
    Draft.parse_draft = function (draft_html_file) {
        var text = fs.readFileSync(draft_html_file, "utf8");
        var parts = text.split("<td colspan=\"3\" align=\"center\" valign=\"top\">");
        var good_parts = parts.slice(1);
        var draft = [];
        for (var _i = 0, good_parts_1 = good_parts; _i < good_parts_1.length; _i++) {
            var p = good_parts_1[_i];
            var round_text = p.slice(0, p.lastIndexOf("</a></td></tr></tbody></table></td></tr>"));
            var round = Draft.parse_round(round_text);
            draft.push(round);
        }
        console.log(JSON.stringify(draft));
    };
    Draft.parse_round = function (round_text) {
        var round_num = Draft.parse_round_num(round_text);
        var picks = [];
        var parts = round_text.split("</tr>").slice(1);
        for (var _i = 0, parts_1 = parts; _i < parts_1.length; _i++) {
            var p = parts_1[_i];
            var pick = Draft.parse_pick(p);
            picks.push(pick);
        }
        return new Round(round_num, picks);
    };
    Draft.parse_round_num = function (round_text) {
        var parts = round_text.split("<");
        var round_name = parts[0];
        var num_str = round_name.split("ROUND ")[1];
        return parseInt(num_str);
    };
    Draft.parse_pick = function (pick_text) {
        //console.log(pick_text);
        return new Pick(Draft.parse_pick_team(pick_text), Draft.parse_pick_name(pick_text));
    };
    Draft.parse_pick_name = function (pick_text) {
        var parts = pick_text.split("</a>");
        var name_part = parts[0];
        var name_begin = name_part.lastIndexOf(">");
        var name = name_part.slice(name_begin + 1);
        var names = name.split(" ");
        return new Player(names[0], names[1]);
    };
    Draft.parse_pick_team = function (pick_text) {
        //console.log(pick_text);
        var trimmed = pick_text.slice(0, pick_text.indexOf("</a></td>"));
        //console.log(trimmed);
        return trimmed.slice(trimmed.lastIndexOf(">") + 1);
    };
    return Draft;
}());
var Pick = (function () {
    function Pick(team, player) {
        this.team = team;
        this.player = player;
    }
    return Pick;
}());
var Round = (function () {
    function Round(number, picks) {
        this.number = number;
        this.picks = picks;
    }
    return Round;
}());
var Player = (function () {
    function Player(first_name, last_name) {
        this.last_name = last_name;
        this.first_name = first_name;
    }
    return Player;
}());
Startup.main();
//# sourceMappingURL=app.js.map