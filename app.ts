import fs = require('fs');

// To setup typings:
// I ran typings install dt~node --global

class Startup {
    public static main(): number {
        //console.log('Hello World');
        Draft.parse_draft("data/Draft Recap - Free Fantasy Baseball - ESPN.html");
        return 0;
    }
}

class Draft {
    public static parse_draft(draft_html_file: string) {
        var text = fs.readFileSync(draft_html_file, "utf8");
        var parts = text.split("<td colspan=\"3\" align=\"center\" valign=\"top\">");
        var good_parts = parts.slice(1);
        let draft = [];
        for (var p of good_parts) {
            let round_text = p.slice(0, p.lastIndexOf("</a></td></tr></tbody></table></td></tr>"));
            let round = Draft.parse_round(round_text);
            draft.push(round);
        }
        console.log(JSON.stringify(draft));
    }

    public static parse_round(round_text: string): Round {
        let round_num = Draft.parse_round_num(round_text);
        let picks: Pick[] = [];
        var parts = round_text.split("</tr>").slice(1);
        for (var p of parts) {
            let pick = Draft.parse_pick(p);
            picks.push(pick);
        }
        return new Round(round_num, picks);
    }

    public static parse_round_num(round_text: string): number {
        var parts = round_text.split("<");
        var round_name = parts[0];
        var num_str = round_name.split("ROUND ")[1];
        return parseInt(num_str);
    }

    public static parse_pick(pick_text: string): Pick {
        //console.log(pick_text);
        return new Pick (Draft.parse_pick_team(pick_text), Draft.parse_pick_name(pick_text));
    }

    public static parse_pick_name(pick_text: string): Player {
        var parts = pick_text.split("</a>");
        var name_part = parts[0];
        var name_begin = name_part.lastIndexOf(">");
        var name = name_part.slice(name_begin+1);
        var names = name.split(" ");
        return new Player(names[0], names[1]);
    }

    public static parse_pick_team(pick_text: string): string {
        //console.log(pick_text);
        var trimmed = pick_text.slice(0, pick_text.indexOf("</a></td>"));
        //console.log(trimmed);
        return trimmed.slice(trimmed.lastIndexOf(">") + 1);
    }
}
class Pick {
    team: string;
    player: Player;
    constructor(team: string, player: Player) {
        this.team = team;
        this.player = player;
    }
}

class Round {
    number: number;
    picks: Pick[];
    constructor(number: number, picks: Pick[]) {
        this.number = number;
        this.picks = picks;
    }
}
class Player {
    last_name: string;
    first_name: string;
    constructor(first_name: string, last_name: string) {
        this.last_name = last_name;
        this.first_name = first_name
    }
}

Startup.main();