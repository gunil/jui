var chart = jui.include("chart.builder");

chart("#chart", {
    width : 100,
    height : 50,	
    padding : "empty",
    data : [
        { quarter : "1Q", sales : 50, profit : 35 },
        { quarter : "2Q", sales : -20, profit : -30 },
        { quarter : "3Q", sales : 10, profit : -5 },
        { quarter : "4Q", sales : 30, profit : 25 }
    ],
    grid : {
        x : {
            target : "quarter",
            line : true,
            hide : true
        },
        y : {
            type : "range",
            target : "sales",
            step : 10,
            hide : true
        }
    },
    brush : {
        type : "line",
        target : [ "sales", "profit" ]
    }
});