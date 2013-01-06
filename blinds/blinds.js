var htmlblindid = "blindapp";

function slat(parent, width, height, orientation, light)
{
	//public functions//
	this.init = function(ID, Class, z_index)
	{
		_id = ID;
		_class = Class;
		_z_index = z_index;
	};

	this.draw = function()
	{
		$("#" + _id).remove();
		$("#" + _parent).append($("<div></div>")
			.attr({"class": _class, "id": _id})
			.css({"width": _width, "height": _height,
					"z-index": _z_index}));

	};

	this.update_dimensions = function(JSONargs)
	{
		if (JSONargs.hasOwnProperty("width"))
		{
			_width = JSONargs.width;
			$("#" + _id).css({"width": _width});
		}
		if (JSONargs.hasOwnProperty("height"))
		{
			_height = JSONargs.height;
			$("#" + _id).css({"height": _height});
		}
	};

	this.get_dimensions = function()
	{
		return {"width": _width, "height": _height};
	};

	this.set_light = function(light)
	{
		_light = light;
	};

	this.set_orientation = function(orientation)
	{
		_orientation = orientation;
	};


	//private variables//
	var _parent			= parent;
	var _orientation	= orientation;
	var _width			= width;
	var _height			= height;
	var _light			= light;
	var _id				= "slat";
	var _class			= "slat_class";
	var _z_index		= 0;
}

//blinds container
var blinds = 
{
	_parent				: "body",
	_background_light	: "sunny",
	_screen_width		: $("body").width(),
	_screen_height		: $("body").height(),
	_number_of_slats	: 20,
	_slat_min_height	: 2,
	_slat_max_height	: this._screen_height / this._number_of_slats,
	_slat_height		: 2,
	_footer_slat_height	: 30,
	_blinds_max_height	: this._screen_height,
	_blinds_height 		: this._slat_height * this._number_of_slats + this._footer_slat_height,
	_blinds_width 		: this._screen_width,

	_slats				: [],
	_footer_slat		: {},
	_blinds_id			: "blind_container", 
	_blinds_class		: "blinds", 
	_dragging			: false,
	_dragpos			: {},

	init: function(JSONargs)
	{
		if (JSONargs.hasOwnProperty("parent"))
			this._parent 			= JSONargs.parent;
		if (JSONargs.hasOwnProperty("background_light"))
			this._background_light 	= JSONargs.background_light;
		if (JSONargs.hasOwnProperty("screen_width"))
			this._screen_width 		= JSONargs.screen_width;
		if (JSONargs.hasOwnProperty("screen_height"))
		{
			this._screen_height 	= JSONargs.screen_height;
			this._slat_max_height 	= this._screen_height / 
										this._number_of_slats;
		}
		if (JSONargs.hasOwnProperty("number_of_slats"))
		{
			this._number_of_slats 	= JSONargs.number_of_slats;
			this._slat_max_height 	= this._screen_height / 
										this._number_of_slats;
		}
		if (JSONargs.hasOwnProperty("blinds_max_height"))
			this._blinds_max_height = JSONargs.blinds_max_height;
		if (JSONargs.hasOwnProperty("blinds_width"))
			this._blinds_width 		= JSONargs.blinds_width;


		for (var i = 0; i < this._number_of_slats; i ++)
		{
			var new_slat = new slat(
							this._blinds_id, this._screen_width, 
							this._slat_height, i % 2, 
							this._background_light);
			new_slat.init("slat_" + i, "slats", this._number_of_slats - i);
			this._slats.push(new_slat);
		}
		this._footer_slat = new slat(this._blinds_id, this._screen_width, 
								this._footer_slat_height, 0,
								this._background_light);
		this._footer_slat.init("footer_slat", "blindsBorder");
	},

	moveBlindsDown: function(distance)
	{
		for (var i = 0; i < this._number_of_slats; i ++)
		{
			var slat = this._slats[i];
			var slat_height = slat.get_dimensions().height;

			//	If the distance to extend the slat 
			// 	is less than the temporary allowed
			//	height for that slat, extend the slat
			//	to height = distance and then return
			//	to stop the for loop.
			if ( ( distance + slat_height ) < this._slat_max_height )
			{
				slat.update_dimensions({"height": distance + slat_height});
				return;
			}
			//	Else if the distance to extend the slat
			//	puts it over the allowed temporary size,
			//	then extend the slat up to the temporary 
			//	size, update the slat data to indicate
			//	that it has reached it's temporarily allowable
			//	size and then set the remaining un-utilized
			//	distance to be the new distance to extend.
			else
			{
				slat.update_dimensions({"height": this._slat_max_height});
				slat.temp_extended = true;
				distance = distance - ( this._slat_max_height - slat_height );
			}

		}
	},

	moveBlindsUp: function(distance)
	{
		for (var i = this._number_of_slats - 1; i > -1; i --)
		{
			var slat = this._slats[i];
			var slat_height = slat.get_dimensions().height;

			//	If the distance to extend the slat 
			// 	keeps the slat larger than minimum slat
			//	size, decrease the size of the slat
			//	by distance and return.
			if ( ( slat_height - distance ) > this._slat_min_height )
			{
				slat.update_dimensions({"height": slat_height - distance});
				return;
			}
			//	Else if the distance to extend the slat
			//	makes a slat smaller than its minimum
			//	size, decrease the size of the slat
			//	to minimum and then decrease distance
			else
			{
				slat.update_dimensions({"height": this._slat_min_height});
				distance = distance - ( slat_height - this._slat_min_height );
			}

		}
	},

	blindsmousemove: function(event)
	{
		if (event.clientY > blinds._dragpos.y)
			blinds.moveBlindsDown(event.clientY - blinds._dragpos.y);
		else if (event.clientY < blinds._dragpos.y)
			blinds.moveBlindsUp(blinds._dragpos.y - event.clientY);
		blinds._dragpos.x = event.clientX;
		blinds._dragpos.y = event.clientY;
		event.preventDefault();
	},

	blindsmousedown: function(event)
	{
		this._dragging = true;
		this._dragpos  = {"x": event.clientX, "y": event.clientY};
		$("#" + this._blinds_id)
			.bind('mousemove', this.blindsmousemove);
		event.preventDefault();
	},

	blindsmouseup: function(event)
	{
		this._dragging = false;
		$("#" + this._blinds_id)
			.unbind('mousemove', this.blindsmousemove);
		event.preventDefault();
	},

	draw: function()
	{
		$("#" + this._blinds_id).remove();
		$("#" + this._parent).append($("<div></div>")
			.attr({"class": this._blinds_class, 
					"id": this._blinds_id})
			.mousedown(function(event){blinds.blindsmousedown(event)})
			.mouseup(function(event){blinds.blindsmouseup(event)}));
		for (var i = 0; i < this._number_of_slats; i ++ )
		{
			this._slats[i].draw();
		}
		this._footer_slat.draw();
	}
};

// document ready
$(function()
{
	blinds.init({"screen_width": $("body").width(),
					"screen_height": $("body").height(),
					"parent": htmlblindid});
	blinds.draw();

});
