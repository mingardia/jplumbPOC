jsPlumb.ready(function () {

    var instance = jsPlumb.getInstance({
        Connector: "Straight",
        PaintStyle: { strokeWidth: 2, stroke: "#ffa500" },
        Endpoint: [ "Dot", { radius: 3 } ],
        EndpointStyle: { fill: "#ffa500" },
        Container: "canvas",
        ListStyle:{
            endpoint:[ "Rectangle", { width:10, height:10 }]
        }
    });

    window.jsp = instance;

    // get the two elements that contain a list inside them
    var list1El = document.querySelector("#list-one"),
        list2El = document.querySelector("#list-two"),
        list1Ul = list1El.querySelector("ul"),
        list2Ul = list2El.querySelector("ul");

    instance.draggable(list1El);
    instance.draggable(list2El);

    // get uls
    var lists = jsPlumb.getSelector("ul");

    // suspend drawing and initialise.
    instance.batch(function () {

        var selectedSources = [], selectedTargets = [];

        for (var l = 0; l < lists.length; l++) {

            var isSource = lists[l].getAttribute("source") != null,
                isTarget = lists[l].getAttribute("target") != null;

            // configure items
            var items = lists[l].querySelectorAll("li");
            for (var i = 0; i < items.length; i++) {

                if (isSource) {
                    instance.makeSource(items[i], {
                        allowLoopback: false,
                        anchor: ["Right" ],
						filter: ":not(button)",
					   //anchors:["Right", "Left" ],
					    endpoint:"Dot",
					    endpointStyle:{ fill: "red", radius:2}
                    });

                    if (Math.random() < 0.2) {
                        selectedSources.push(items[i]);
                    }
                }

                if (isTarget) {
                    instance.makeTarget(items[i], {
                        anchor: ["Left" ],
					    endpoint:"Dot",
					    endpointStyle:{ fill: "red", radius:2 }
                    });
                    if (Math.random() < 0.2) {
                        selectedTargets.push(items[i]);
                    }
                }
            }
        }

        var connCount = Math.min(selectedSources.length, selectedTargets.length);
        for (var i = 0; i < connCount; i++) {
            instance.connect({source:selectedSources[i], target:selectedTargets[i]});
        }
    });

    // configure list1Ul manually, as it does not have a `jtk-scrollable-list` attribute, whereas list2Ul does, and is therefore
    // configured automatically.
    instance.addList(list1Ul, {
        endpoint:["Rectangle", {width:40, height:20}]
	});


    instance.bind("click", function(connection, originalEvent) {instance.deleteConnection(connection); });

    jsPlumb.on(document, "change", "[type='checkbox']", function(e) {
        instance[e.srcElement.checked ? "addList" : "removeList"](e.srcElement.value === "list1" ? list1Ul : list2Ul);
    });
	
	

    jsPlumb.fire("jsPlumbDemoLoaded", instance); 
});
