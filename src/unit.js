/*
 * Wysie Unit: Super class that Scope and Primitive inherit from
 */
(function($, $$){

var _ = Wysie.Unit = $.Class({ abstract: true,
	constructor: function(element, wysie, collection) {
		if (!element || !wysie) {
			throw new Error("Wysie.Unit constructor requires an element argument and a wysie object");
		}

		this.wysie = wysie;
		this.element = element;
		this.element._.data.unit = this;

		this.property = _.normalizeProperty(this.element);
		this.collection = collection;

		this.computed = this.element.matches(Wysie.selectors.computed);

		this.required = this.element.matches("[required], [data-required]");
	},

	toJSON: Wysie.prototype.toJSON,

	get data() {
		return this.getData();
	},

	static: {
		create: function(element, wysie, collection) {
			if (!element || !wysie) {
				throw new TypeError("Wysie.Unit.create() requires an element argument and a wysie object");
			}

			var isScope = Wysie.is("scope", element)
				|| ( // Heuristic for matching scopes without a scoping attribute
					$$(Wysie.selectors.property, element).length // contains properties
					// TODO what if these properties are in another typeof?
					&& (
						Wysie.is("multiple", element)
						|| !element.matches("[data-attribute], [href], [src], time[datetime]") // content not in attribute
					)
				);

			return new Wysie[Wysie.Scope.is(element)? "Scope" : "Primitive"](element, wysie, collection);
		},

		normalizeProperty: function(element) {
			// Get & normalize property name, if exists
			var property = element.getAttribute("property") || element.getAttribute("itemprop");

			if (!property && element.hasAttribute("property")) {
				property = element.name || element.id || element.classList[0];
			}

			if (property) {
				element.setAttribute("property", property);
			}

			return property;
		},
	}
});

})(Bliss, Bliss.$);
