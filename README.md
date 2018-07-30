# pure-knob

Initially a (circular) knob / dial control with mouse, wheel, touch and keyboard support, implemented in pure JavaScript.

In addition, this script can also render (linear) bar graphs.

- Canvas-based, no image files required.
- Mouse, wheel, touch and keyboard controls.

Example for knob control
------------------------

```javascript
// Create knob element, 300 x 300 px in size.
var knob = pureknob.createKnob(300, 300);

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
var listener = function(knob, value) {
	console.log(value);
};

knob.addListener(listener);

// Create element node.
var node = knob.node();

// Add it to the DOM.
var elem = document.getElementById('some_element');
elem.appendChild(node);
```

Properties
----------

- `angleStart`: Angle in radians, at which the knob track starts.
- `angleEnd`: Angle in radians, at which the knob track ends.
- `angleOffset`: Offset in radians, relative to the positive x-axis.
- `colorBG`: Color of the knob track.
- `colorFG`: Color of the knob gauge / indicator.
- `needle`: Boolean indicating whether we should use a simple marker / needle instead of a filling gauge to indicate value along the knob's track.
- `readonly`: Boolean indicating whether the value of the knob is write-protected and thus not editable by the user. Useful for displaying values without allowing them to get edited.
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

Example for bar graph control
-----------------------------

```javascript
// Create bar graph element, 400 x 40 px in size.
var graph = pureknob.createBarGraph(400, 40);

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
var node = graph.node();

// Add it to the DOM.
var elem = document.getElementById('some_element');
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

