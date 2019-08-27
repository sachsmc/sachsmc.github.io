var thispt = d3.select("[id^='geom_point.points.41.1.1']")

var curx = thispt.attr("x")
var cury = thispt.attr("y")
var count = 1

var move = setInterval(function(){
	
	if(count >= 5){
	    thispt.transition().duration(100)
	    .attr("x", curx)
	    .attr("y", cury);
		count = 1;
	} else {
	
  thispt.transition().duration(500)
  .attr("x", Math.random() * 90 + 30)
  .attr("y", Math.random() * 90 + 30);
 	count++
}
}, 1000);

