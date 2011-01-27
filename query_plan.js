function qp_drawLines(canvas) {
    canvas.width = $("#qp-root").width();
    canvas.height = $("#qp-root").height();
    var context = canvas.getContext("2d");

    context.moveTo(20, 20);
    context.lineTo(100, 100);
    context.stroke();
}