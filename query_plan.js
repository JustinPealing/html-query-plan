function qp_drawLines(canvas) {
    window.setTimeout(function () {
        var canvasOffset = canvas.offset();
        var context = canvas[0].getContext("2d");

        $(".qp-node").each(function () {
            var from = $(this).parent().offset();

            // This is horrible and needs fixing pronto!
            $("> ul > li > div > div", $(this).parent().parent()).each(function () {
                var to = $(this).offset();
                debugger;
                context.moveTo(from.left, from.top);
                context.lineTo(to.left, to.top);
            });
        });

        context.stroke();
    }, 10);
}