//
// getQuery plugin.
//

prism.run(["dashboard-base.services.$query", function ($query)
{

	var blacklist = [

		"explicit",
		"grandTotals",
		"format",
		"offset",
		"field",
		"handlers",
		"merged",
		"datatype",
		"multiSelection",
		"isMaskedResult",
		"isCascading",
		"collapsed",
		"table",
		"custom",
		"title",
		"column"
	];

	function clean(o) {

		var v;
		
		for (var p in o) {

			if (!o.hasOwnProperty(p)) {

				continue;
			}

			v = o[p];

			if (blacklist.indexOf(p) > -1 || p === "disabled" && v === false) {

				delete o[p];
				continue;
			}

			// continue drilling
			if (Array.isArray(v) || typeof (v) === "object") {
				
				clean(v);
			}
		}

		return o;
	}

	function getJaqlString(widget) {

		return JSON.stringify(clean($query.buildWidgetQuery(widget)), null, 4);
	}

	function handler(e, args) {
		
		args.items.push(
			{ 
				caption: "Query Tools", 
				items: [	
					{
							
						caption: "Open JAQL Runner",
						execute: function () {
				
							window.open("/app/jaqleditor#" + encodeURI(getJaqlString(args.widget)), "_blank");
						}
					},

					{
							
						caption: "Print JAQL",
						execute: function () {

							console.log(getJaqlString(args.widget));
						}
					},

					{
							
						caption: "Print SQL",
						execute: function () {

							prism.debugging.GetSql(args.widget);
						}
					}]});
	}

	prism.on("beforewidgetmenu", handler);
	prism.on("beforewidgetindashboardmenu", handler);
}]);


