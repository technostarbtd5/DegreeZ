class Course {
    #name;
    #code;
    #credits;
    constructor() {
        var c = document.getElementById("myCanvas");
        var ctx = c.getContext("2d");
        ctx.beginPath();
        ctx.rect(20, 20, 150, 100);
        ctx.stroke();
    }
}