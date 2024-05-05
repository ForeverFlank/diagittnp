function comma(str) {
    let pattern = /(?=(?!^)\d{3}(?:\b|(?:\d{3})+)\b)/g;
    if (str.includes(".")) {
        pattern = /(?=(?!^)\d{3}(?:\b|(?:\d{3})+)\b\.)/g;
    }
    return str.replace(pattern, ",");
}

function format(num, decimal = 2, smallDecimal = false) {
    if (num.cmp(1e6) < 0) {
        return comma(num.mag.toFixed(smallDecimal ? decimal : 0));
    }
    if (num.layer == 0) {
        let mag = num.mag;
        let d = Math.floor(Math.log10(mag));
        mag = mag / 10 ** d;
        if (mag.toFixed(2) == "10.00") mag /= 10;
        return mag.toFixed(decimal) + " x 10" + "<sup>" + d + "</sup>";
    }
    if (num.layer == 1 && num.mag < 1e12) {
        let mag = 10 ** (num.mag - Math.floor(num.mag));
        let d = Math.floor(num.mag);
        if (mag.toFixed(2) == "10.00") mag /= 10;
        return (
            mag.toFixed(decimal) + " x 10" + "<sup>" + comma(d.toString()) + "</sup>"
        );
    }
    if (num.layer < 3) {
        let str = "";
        let mag = Math.log10(num.mag);
        for (let l = 0; l <= num.layer; l++) {
            str += "10<sup>";
        }
        str += mag.toFixed(1);
        for (let l = 0; l <= num.layer; l++) {
            str += "</sup>";
        }
        return str;
    }
    return "10 ↑↑ " + format(num.slog(10), decimal);
}