$(document).ready(function () {
    var SidebarAnim = new TimelineLite({paused : true});
    SidebarAnim
        .to($(".social-icons, #main-nav"), 0.2, {left : 0})
        .to($("#main"), 0.2, {left : 250, right : "-=250"}, "-=0.2");

	$(document).on('click', 'a[href^="#"]', function (e) {
        var href = this.getAttribute('href');
        if (href.length <= 1) return;
        var target = document.querySelector(href);
        if (!target) return;
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
        history.pushState(null, '', href);
    });

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
	var par = $(this).parent();
        var sib = par.siblings();
        for (var i=0; i<sib.length; i++){
		var elem = $(sib[i]);
        	if (!elem.hasClass('external')) {
                	elem.removeClass();
                }
        }
	if (!par.hasClass('external')) {
		par.addClass('currentmenu');
	}
    });

    $("ul.timeline").children().eq(0)
        .find(".text").slideDown()
        .addClass("open");
	
    $("ul.timeline").on("click", "li", function () {
        const $this = $(this);
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
