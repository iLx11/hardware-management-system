$(function() {

	    //页面跳转
    class PageChange {
        constructor(page) {
            $(".nav").on("click", 'div', function() {
                let index = $(this).index();
                for (let i = 0; i < page.length; i++) { $(page[i]).hide(); }
                $(page[index]).show();
            	$(this).css("background","rgba(51, 51, 51, 0.4)").siblings().css("background","rgba(51, 51, 51, 0)").find('.icon').css("filter","brightness(100%)");
            	$(this).find('.icon').css("filter","brightness(400%)");
            });
        }
    }
    new PageChange(['.controlPage', '.userPage', '.hardwarePage', '.chartPage']);
});