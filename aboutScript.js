$("#dark-mode").on("click", function () {
    if ($(".toggle-dark").css("background-color") === "rgb(255, 255, 255)") {
        $(".toggle-dark").css("background-color", "black");
        $(".toggle-dark").css("color", "#FFFFFF");
        $(".text-element").css("color", "#FFFFFF");
    }
    else {
        $(".toggle-dark").css("background-color", "#FFFFFF");
        $(".toggle-dark").css("color", "black");
        $(".text-element").css("color", "black");
    }
})