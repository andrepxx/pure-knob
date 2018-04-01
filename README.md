# pure-knob

A knob / dial control with mouse, wheel, touch and keyboard support, implemented in pure JavaScript.

- Canvas-based, no image files required.
- Mouse, wheel, touch and keyboard controls.

Example
-------

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

