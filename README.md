# html-query-plan

html-query-plan is a JavaScript library for showing Microsoft SQL Server execution plans in HTML.

![html-query-plan screenshot](screenshot.png "Screenshot")

To use in a web page:

 - Find the latest release [here](https://github.com/JustinPealing/html-query-plan/releases/latest).
 - Include jQuery
 - Include `qp.css` and `qp.min.js`
 - Call `QP.showPlan`, passing the container in which to show the plan and the query plan XML (as a string).


    <div id="container"></div>
    <script>
        QP.showPlan(document.getElementById("container"), '<ShowPlanXML...');
    </script> 

See the `examples` folder for comlete examples.

## Browser Support

html-query-plan uses `display: table` and so won't layout correctly in IE7 or earlier.

The `<canvas>` element is used to draw lines between nodes, and so these lines will only show in browsers with canvas support (IE9+).

## Icons

The icons used are adapted from the Fat Cow "Farm Fresh" web icons pack, which can be found at (http://www.fatcow.com/free-icons).  (Unfortunately some of the adapting was done by myself and I'm no artist - I apologise unreservedly for mangling someone elses masterpiece)
