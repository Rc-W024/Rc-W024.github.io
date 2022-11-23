$(document).ready(function () {
    var SidebarAnim = new TimelineLite({paused : true});
    SidebarAnim
        .to($(".social-icons, #main-nav"), 0.2, {left : 0})
        .to($("#main"), 0.2, {left : 250, right : "-=250"}, "-=0.2");

    $("a.mobilemenu").on("click", function () {
        if (SidebarAnim.isOpen) {
            SidebarAnim.reverse();
            SidebarAnim.isOpen = false;
        } else {
            SidebarAnim.play();
            SidebarAnim.isOpen = true;
        }
    });
	
    $(".social-icons, #main-nav a, #main").on("click", function () {
        SidebarAnim.reverse();
        SidebarAnim.isOpen = false;
        for(var i=0;i<document.getElementsByTagName("currentmenu").length;i++){
            document.getElementsByTagName("currentmenu")[i].onclick=function(){
                for(var j=0;j<document.getElementsByTagName("currentmenu").length;j++){
                    if(this==document.getElementsByTagName("currentmenu")[j]){
                        this.className="external";
                    }else{
                        document.getElementsByTagName("currentmenu")[j].className="";
                    }
                }   
            }
        }
    });

    $("ul.timeline").children().eq(0)
        .find(".text").slideDown()
        .addClass("open");
	
    $("ul.timeline").on("click", "li", function () {
        $this = $(this);
        $this.find(".text").slideDown();
        $this.addClass("open");
        $this.siblings('li.open').find(".text").slideUp();
        $this.siblings('li').removeClass("open");
    });

    $("#main-nav").perfectScrollbar({
        wheelPropagation : true,
        wheelSpeed       : 50
    });
});
