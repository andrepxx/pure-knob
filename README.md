# pure-knob

Initially a (circular) knob / dial control with mouse, wheel, touch and keyboard support, implemented in pure JavaScript.

In addition, this script can also render (linear) bar graphs.

- Canvas-based, no image files required.
- Mouse, wheel, touch and keyboard controls.

pure-knob as generated in [index.xhtml](index.xhtml):

![pure-knob as generated in index.xhtml](doc/pure-knob.png)

Example for knob control
------------------------

```javascript
// Create knob element, 300 x 300 px in size.
const knob = pureknob.createKnob(300, 300);

// Set properties.
knob.setProperty('angleStart', -0.75 * Math.PI);
knob.setProperty('angleEnd', 0.75 * Math.PI);
knob.setProperty('colorFG', '#88ff88');
knob.setProperty('trackWidth', 0.4);
knob.setProperty('valMin', 0);
knob.setProperty('valMax', 100);

// Set initial value.
knob.setValue(50);

/*
 * Event listener.
 *
 * Parameter 'knob' is the knob object which was
 * actuated. Allows you to associate data with
 * it to discern which of your knobs was actuated.
 *
 * Parameter 'value' is the value which was set
 * by the user.
 */
const listener = function(knob, value) {
	console.log(value);
};

knob.addListener(listener);

// Create element node.
const node = knob.node();

// Add it to the DOM.
const elem = document.getElementById('some_element');
elem.appendChild(node);
```

Properties
----------

- `angleStart`: Angle in radians, at which the knob track starts.
- `angleEnd`: Angle in radians, at which the knob track ends.
- `angleOffset`: Offset in radians, relative to the positive x-axis.
- `colorBG`: Color of the knob track.
- `colorFG`: Color of the knob gauge / indicator.
- `colorLabel`: Color of the (optional) label.
- `fnStringToValue`: Function turning a string into a (numeric) value. (Check the "custom formatting" section below for more information.)
- `fnValueToString`: Function turning a (numeric) value into a string. (Check the "custom formatting" section below for more information.)
- `label`: A label (string) displayed at the bottom of the knob, a track radius length away from the center. Set to null to not print any label.
- `needle`: Boolean indicating whether we should use a simple marker / needle instead of a filling gauge to indicate value along the knob's track.
- `readonly`: Boolean indicating whether the value of the knob is write-protected and thus not editable by the user. Useful for displaying values without allowing them to get edited.
- `textScale`: Linear scaling factor for increasing / decreasing the font size. (`1.0` is default font size.)
- `trackWidth`: Width of the track, relative to the average radius of the knob.
- `valMin`: Minimum selectable value.
- `valMax`: Maximum selectable value.
- `val`: Default value. (Do not edit directly! Use `setValue(...)` to set this.)

Events / Actions
----------------

- Normal left click / drag / touch changes value, releasing button commits value.
- Pulling mouse / touch outside the element before release restores back to old value.
- Double click or middle click enables entry of value via keyboard.
- When keyboard entry is enabled, use arrow keys to navigate cursor, backspace or `Del` to delete character before / after cursor, `ESC` to restore old value and disable keyboard entry, `Enter`/`Return` to commit new value and disable keyboard entry.

Custom formatting
-----------------

You may provide a set of two *JavaScript* functions and set them as the `fnStringToValue` and `fnValueToString` properties, respectively, to support custom formatting of your numbers, for example to support fractional parts and / or custom units. Note that this is an advanced feature, which is not required for basic functionality of the knob.

The function provided in the `fnValueToString` property is called when the knob needs to obtain a string representation from an integer value. This is usually the case when the knob needs to get rendered. A single argument is passed into the function, which is the integer value, for which the string representation should be obtained. The function must generate and return the string representation to the knob.

On the other hand, the function provided in the `fnStringToValue` property is called when the knob needs to obtain an integer value from a string representation. This is usually the case after the user entered and committed a new value for the knob via the (physical or on-screen) keyboard. A single argument is passed into the function, which is the string representation, for which the integer value should be obtained. The function must generate and return the integer value to the knob.

The default implementation of both functions is as follows.

```javascript
knob.setProperty('fnStringToValue', function(string) { return parseInt(string); });
knob.setProperty('fnValueToString', function(value) { return value.toString(); });
```

We will now provide a more complicated example, which uses a knob control with a value range from `0` to `1000` (both inclusive), but displays it as a fractional percentage value with one decimal place between `0.0 %` and `100.0 %`. The relative font size has to be reduced in order for the relatively long string `100.0 %` to fit inside the control.

```javascript
knob.setProperty('valMin', 0);
knob.setProperty('valMax', 1000);
knob.setProperty('textScale', 0.75);

/*
 * Function for converting integer value to string for display.
 */
knob.setProperty('fnValueToString', function(value) {
	let string = value.toString();
	let n = string.length;

	/*
	 * If value is just a single digit, add leading zero.
	 */
	if (n < 2) {
		string = '0' + string;
		n += 1;
	}

	const prefix = string.slice(0, n - 1);
	const suffix = string.slice(n - 1, n);
	const result = prefix + '.' + suffix + ' %';
	return result;
});

/*
 * Function for converting string entered by user to integer value.
 */
knob.setProperty('fnStringToValue', function(string) {
	let val = 0;
	const numerals = string.match(/\d*(\.\d*)?/);

	/*
	 * Ensure that numerals are non-null.
	 */
	if (numerals !== null) {

		/*
		 * Check if we found a numeral.
		 */
		if (numerals.length > 0) {
			const numeral = numerals[0];
			const f = parseFloat(numeral);
			val = Math.round(10.0 * f);
		}

	}

	return val;
});
```

Example for bar graph control
-----------------------------

```javascript
// Create bar graph element, 400 x 40 px in size.
const graph = pureknob.createBarGraph(400, 40);

// Set properties.
graph.setProperty('colorFG', '#88ff88');
graph.setProperty('colorMarkers', '#ffffff');
graph.setProperty('markerStart', 50);
graph.setProperty('markerEnd', 100);
graph.setProperty('markerStep', 10);
graph.setProperty('valMin', 0);
graph.setProperty('valMax', 100);

// Set initial value.
graph.setValue(50);

// Set peak value. (Multiple peak values may be passed as a list.)
graph.setPeaks([75]);

// Create element node.
const node = graph.node();

// Add it to the DOM.
const elem = document.getElementById('some_element');
elem.appendChild(node);
```

You may update both the bar graph value (`setValue(...)`) and the peak values (`setPeaks(...)`) programmatically in your script to display new values.

Properties
----------

- `colorBG`: Color of the bar graph track.
- `colorFG`: Color of the bar graph filling / indicator.
- `colorMarkers`: Color of the markers (scale) on both sides (top and bottom) of the bar graph track.
- `markerStart`: Value where the first marker will be drawn along the track.
- `markerEnd`: Value where the last marker will be drawn along the track.
- `markerStep`: Spacing (increment) between the markers.
- `trackWidth`: Width of the track, relative to the absolute height of the control.
- `valMin`: Minimum value which can be displayed (left-hand side of the track).
- `valMax`: Maximum value which can be displayed (right-hand side of the track).
- `valPeaks`: List of peak values to be displayed. (Do not edit directly! Use `setPeaks(...)` to set this.)
- `val`: Default value. (Do not edit directly! Use `setValue(...)` to set this.)

There is also a small sample provided for the bar graph control in the `index.xhtml` file.

