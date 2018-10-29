
console.log("connected");
$(".commentText").fadeOut(1);
var buttonOn = true;//to the turn the comment bar on and off
var fadeInB = false;
$(".commentButton").on("click", function(){
    console.log("clicked")
    event.stopPropagation();
    if(buttonOn === true){
        $(".commentText").fadeIn(400);
        buttonOn = false;
    }
    else if(buttonOn === false)
    {
        $(".commentText").fadeOut(400);
        fadeInB = true;
        /* $(".commentText").css({
            visibility : "hidden",
            widht: "0",
            height: "0"
        }) */
        buttonOn = true;
    }
})