/*
 * pure-knob
 *
 * Canvas-based JavaScript UI element implementing touch,
 * keyboard, mouse and scroll wheel support.
 *
 * Copyright 2018 - 2019 Andre Plötze
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

"use strict";

/*
 * Custom user interface elements for pure knob.
 */
function PureKnob() {

	/*
	 * Creates a bar graph element.
	 */
	this.createBarGraph = function(width, height) {
		const heightString = height.toString(),
			  widthString = width.toString(),
			  canvas = document.createElement('canvas'),
			  div = document.createElement('div');
		div.style.display = 'inline-block';
		div.style.height = heightString + 'px';
		div.style.position = 'relative';
		div.style.textAlign = 'center';
		div.style.width = widthString + 'px';
		div.appendChild(canvas);

		/*
		 * The bar graph object.
		 */
		const graph = {
			'_canvas': canvas,
			'_div': div,
			'_height': height,
			'_width': width,

			/*
			 * Properties of this bar graph.
			 */
			'_properties': {
				'colorBG': '#181818',
				'colorFG': '#ff8800',
				'colorMarkers': '#888888',
				'markerStart': 0,
				'markerEnd': 100,
				'markerStep': 20,
				'trackWidth': 0.5,
				'valMin': 0,
				'valMax': 100,
				'valPeaks': [],
				'val': 0
			},

			/*
			 * Returns the peak values for this bar graph.
			 */
			'getPeaks': function() {
				const properties = this._properties,
					  peaks = properties.valPeaks,
					  numPeaks = peaks.length,
					  peaksCopy = [];

				/*
				 * Iterate over the peak values and copy them.
				 */
				for (let i = 0; i < numPeaks; i++) {
					const peak = peaks[i];
					peaksCopy.push(peak);
				}

				return peaksCopy;
			},

			/*
			 * Returns the value of a property of this bar graph.
			 */
			'getProperty': function(key) {
				const properties = this._properties,
					  value = properties[key];
				return value;
			},

			/*
			 * Returns the current value of the bar graph.
			 */
			'getValue': function() {
				const properties = this._properties,
					  value = properties.val;
				return value;
			},

			/*
			 * Return the DOM node representing this bar graph.
			 */
			'node': function() {
				const div = this._div;
				return div;
			},

			/*
			 * Redraw the bar graph on the canvas.
			 */
			'redraw': function() {
				this.resize();
				const properties = this._properties,
					  colorTrack = properties.colorBG,
					  colorFilling = properties.colorFG,
					  colorMarkers = properties.colorMarkers,
					  markerStart = properties.markerStart,
					  markerEnd = properties.markerEnd,
					  markerStep = properties.markerStep,
					  trackWidth = properties.trackWidth,
					  valMin = properties.valMin,
					  valMax = properties.valMax,
					  peaks = properties.valPeaks,
					  value = properties.val,
					  height = this._height,
					  width = this._width,
					  lineWidth = Math.round(trackWidth * height),
					  halfWidth = 0.5 * lineWidth,
					  centerY = 0.5 * height,
					  lineTop = centerY - halfWidth,
					  lineBottom = centerY + halfWidth,
					  relativeValue = (value - valMin) / (valMax - valMin),
					  fillingEnd = width * relativeValue,
					  numPeaks = peaks.length,
					  canvas = this._canvas,
					  ctx = canvas.getContext('2d');

				/*
				 * Clear the canvas.
				 */
				ctx.clearRect(0, 0, width, height);

				/*
				 * Check if markers should be drawn.
				 */
				if ((markerStart !== null) & (markerEnd !== null) & (markerStep !== null) & (markerStep !== 0)) {

					/*
					 * Draw the markers.
					 */
					for (let v = markerStart; v <= markerEnd; v += markerStep) {
						const relativePos = (v - valMin) / (valMax - valMin),
							  pos = Math.round(width * relativePos);
						ctx.beginPath();
						ctx.moveTo(pos, 0);
						ctx.lineTo(pos, height);
						ctx.lineCap = 'butt';
						ctx.lineWidth = '2';
						ctx.strokeStyle = colorMarkers;
						ctx.stroke();
					}

				}

				/*
				 * Draw the track.
				 */
				ctx.beginPath();
				ctx.rect(0, lineTop, width, lineWidth);
				ctx.fillStyle = colorTrack;
				ctx.fill();

				/*
				 * Draw the filling.
				 */
				ctx.beginPath();
				ctx.rect(0, lineTop, fillingEnd, lineWidth);
				ctx.fillStyle = colorFilling;
				ctx.fill();

				/*
				 * Draw the peaks.
				 */
				for (let i = 0; i < numPeaks; i++) {
					const peak = peaks[i],
						  relativePeak = (peak - valMin) / (valMax - valMin),
						  pos = Math.round(width * relativePeak);
					ctx.beginPath();
					ctx.moveTo(pos, lineTop);
					ctx.lineTo(pos, lineBottom);
					ctx.lineCap = 'butt';
					ctx.lineWidth = '2';
					ctx.strokeStyle = colorFilling;
					ctx.stroke();
				}

			},

			/*
			 * This is called as the canvas or the surrounding DIV is resized.
			 */
			'resize': function() {
				const canvas = this._canvas;
				canvas.style.height = '100%';
				canvas.style.width = '100%';
				canvas.height = this._height;
				canvas.width = this._width;
			},

			/*
			 * Sets the peak values of this bar graph.
			 */
			'setPeaks': function(peaks) {
				const properties = this._properties,
					  peaksCopy = [],
					  numPeaks = peaks.length;

				/*
				 * Iterate over the peak values and append them to the array.
				 */
				for (let i = 0; i < numPeaks; i++) {
					const peak = peaks[i];
					peaksCopy.push(peak);
				}

				this.setProperty('valPeaks', peaksCopy);
			},

			/*
			 * Sets the value of a property of this bar graph.
			 */
			'setProperty': function(key, value) {
				this._properties[key] = value;
				this.redraw();
			},

			/*
			 * Sets the value of this bar graph.
			 */
			'setValue': function(value) {
				const properties = this._properties,
					  valMin = properties.valMin,
					  valMax = properties.valMax;

				/*
				 * Clamp the actual value into the [valMin; valMax] range.
				 */
				if (value < valMin)
					value = valMin;
				else if (value > valMax)
					value = valMax;

				value = Math.round(value);
				this.setProperty('val', value);
			}

		};

		/*
		 * This is called when the size of the canvas changes.
		 */
		const resizeListener = function(e) {
			graph.redraw();
		};

		canvas.addEventListener('resize', resizeListener);
		return graph;
	}

	/*
	 * Creates a knob element.
	 */
	this.createKnob = function(width, height) {
		const heightString = height.toString(),
			  widthString = width.toString(),
			  smaller = width < height ? width : height,
			  fontSize = 0.2 * smaller,
			  fontSizeString = fontSize.toString(),
			  canvas = document.createElement('canvas'),
			  div = document.createElement('div');

		div.style.display = 'inline-block';
		div.style.height = heightString + 'px';
		div.style.position = 'relative';
		div.style.textAlign = 'center';
		div.style.width = widthString + 'px';
		div.appendChild(canvas);

		const input = document.createElement('input');
		input.style.appearance = 'textfield';
		input.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
		input.style.border = 'none';
		input.style.color = '#ff8800';
		input.style.fontFamily = 'sans-serif';
		input.style.fontSize = fontSizeString + 'px';
		input.style.height = heightString + 'px';
		input.style.margin = 'auto';
		input.style.padding = '0px';
		input.style.textAlign = 'center';
		input.style.width = widthString + 'px';

		const inputMode = document.createAttribute('inputmode');
		inputMode.value = 'numeric';
		input.setAttributeNode(inputMode);

		const  inputDiv = document.createElement('div');
		inputDiv.style.bottom = '0px';
		inputDiv.style.display = 'none';
		inputDiv.style.left = '0px';
		inputDiv.style.position = 'absolute';
		inputDiv.style.right = '0px';
		inputDiv.style.top = '0px';
		inputDiv.appendChild(input);
		div.appendChild(inputDiv);

		/*
		 * The knob object.
		 */
		const knob = {
			'_canvas': canvas,
			'_div': div,
			'_height': height,
			'_input': input,
			'_inputDiv': inputDiv,
			'_listeners': [],
			'_mousebutton': false,
			'_previousVal': 0,
			'_timeout': null,
			'_timeoutDoubleTap': null,
			'_touchCount': 0,
			'_width': width,

			/*
			 * Notify listeners about value changes.
			 */
			'_notifyUpdate': function() {
				const properties = this._properties,
					  value = properties.val,
					  listeners = this._listeners,
					  numListeners = listeners.length;

				/*
				 * Call all listeners.
				 */
				for (let i = 0; i < numListeners; i++) {
					const listener = listeners[i];

					/*
					 * Call listener, if it exists.
					 */
					if (listener !== null)
						listener(this, value);

				}

			},

			/*
			 * Properties of this knob.
			 */
			'_properties': {
				'angleEnd': 2.0 * Math.PI,
				'angleOffset': -0.5 * Math.PI,
				'angleStart': 0,
				'colorBG': '#181818',
				'colorFG': '#ff8800',
				'colorLabel': '#ffffff',
				'fnStringToValue': function(string) { return parseInt(string); },
				'fnValueToString': function(value) { return value.toString(); },
				'label': null,
				'needle': false,
				'readonly': false,
				'textScale': 1.0,
				'trackWidth': 0.4,
				'valMin': 0,
				'valMax': 100,
				'val': 0
			},

			/*
			 * Abort value change, restoring the previous value.
			 */
			'abort': function() {
				const previousValue = this._previousVal;
				const properties = this._properties;
				properties.val = previousValue;
				this.redraw();
			},

			/*
			 * Adds an event listener.
			 */
			'addListener': function(listener) {
				const listeners = this._listeners;
				listeners.push(listener);
			},

			/*
			 * Commit value, indicating that it is no longer temporary.
			 */
			'commit': function() {
				const properties = this._properties,
					  value = properties.val;
				this._previousVal = value;
				this.redraw();
				this._notifyUpdate();
			},

			/*
			 * Returns the value of a property of this knob.
			 */
			'getProperty': function(key) {
				const properties = this._properties,
					  value = properties[key];
				return value;
			},

			/*
			 * Returns the current value of the knob.
			 */
			'getValue': function() {
				const properties = this._properties
					  value = properties.val;
				return value;
			},

			/*
			 * Return the DOM node representing this knob.
			 */
			'node': function() {
				const div = this._div;
				return div;
			},

			/*
			 * Redraw the knob on the canvas.
			 */
			'redraw': function() {
				this.resize();
				const properties = this._properties,
					  needle = properties.needle,
					  angleStart = properties.angleStart,
					  angleOffset = properties.angleOffset,
					  angleEnd = properties.angleEnd,
					  actualStart = angleStart + angleOffset,
					  actualEnd = angleEnd + angleOffset,
					  label = properties.label,
					  value = properties.val,
					  valueToString = properties.fnValueToString,
					  valueStr = valueToString(value),
					  valMin = properties.valMin,
					  valMax = properties.valMax,
					  relValue = (value - valMin) / (valMax - valMin),
					  relAngle = relValue * (angleEnd - angleStart),
					  angleVal = actualStart + relAngle,
					  colorTrack = properties.colorBG,
					  colorFilling = properties.colorFG,
					  colorLabel = properties.colorLabel,
					  textScale = properties.textScale,
					  trackWidth = properties.trackWidth,
					  height = this._height,
					  width = this._width,
					  smaller = width < height ? width : height,
					  centerX = 0.5 * width,
					  centerY = 0.5 * height,
					  radius = 0.4 * smaller,
					  labelY = centerY + radius,
					  lineWidth = Math.round(trackWidth * radius),
					  labelSize = Math.round(0.8 * lineWidth),
					  labelSizeString = labelSize.toString(),
					  fontSize = (0.2 * smaller) * textScale,
					  fontSizeString = fontSize.toString(),
					  canvas = this._canvas,
					  ctx = canvas.getContext('2d');

				/*
				 * Clear the canvas.
				 */
				ctx.clearRect(0, 0, width, height);

				/*
				 * Draw the track.
				 */
				ctx.beginPath();
				ctx.arc(centerX, centerY, radius, actualStart, actualEnd);
				ctx.lineCap = 'butt';
				ctx.lineWidth = lineWidth;
				ctx.strokeStyle = colorTrack;
				ctx.stroke();

				/*
				 * Draw the filling.
				 */
				ctx.beginPath();

				/*
				 * Check if we're in needle mode.
				 */
				if (needle)
					ctx.arc(centerX, centerY, radius, angleVal - 0.1, angleVal + 0.1);
				else
					ctx.arc(centerX, centerY, radius, actualStart, angleVal);

				ctx.lineCap = 'butt';
				ctx.lineWidth = lineWidth;
				ctx.strokeStyle = colorFilling;
				ctx.stroke();

				/*
				 * Draw the number.
				 */
				ctx.font = fontSizeString + 'px sans-serif';
				ctx.fillStyle = colorFilling;
				ctx.textAlign = 'center';
				ctx.textBaseline = 'middle';
				ctx.fillText(valueStr, centerX, centerY);

				/*
				 * Draw the label
				 */
				if (label !== null) {
					ctx.font = labelSizeString + 'px sans-serif';
					ctx.fillStyle = colorLabel;
					ctx.textAlign = 'center';
					ctx.textBaseline = 'middle';
					ctx.fillText(label, centerX, labelY);
				}

				/*
				 * Set the color and font size of the input element.
				 */
				const elemInput = this._input;
				elemInput.style.color = colorFilling;
				elemInput.style.fontSize = fontSizeString + 'px';
			},

			/*
			 * This is called as the canvas or the surrounding DIV is resized.
			 */
			'resize': function() {
				const canvas = this._canvas;
				canvas.style.height = '100%';
				canvas.style.width = '100%';
				canvas.height = this._height;
				canvas.width = this._width;
			},

			/*
			 * Sets the value of a property of this knob.
			 */
			'setProperty': function(key, value) {
				this._properties[key] = value;
				this.redraw();
			},

			/*
			 * Sets the value of this knob.
			 */
			'setValue': function(value) {
				this.setValueFloating(value);
				this.commit();
			},

			/*
			 * Sets floating (temporary) value of this knob.
			 */
			'setValueFloating': function(value) {
				const properties = this._properties,
					  valMin = properties.valMin,
					  valMax = properties.valMax;

				/*
				 * Clamp the actual value into the [valMin; valMax] range.
				 */
				if (value < valMin)
					value = valMin;
				else if (value > valMax)
					value = valMax;

				value = Math.round(value);
				this.setProperty('val', value);
			}

		};

		/*
		 * Convert mouse event to value.
		 */
		const mouseEventToValue = function(e, properties) {
			const canvas = e.target,
				  width = canvas.scrollWidth,
				  height = canvas.scrollHeight,
				  centerX = 0.5 * width,
				  centerY = 0.5 * height,
				  x = e.offsetX,
				  y = e.offsetY,
				  relX = x - centerX,
				  relY = y - centerY,
				  angleStart = properties.angleStart,
				  angleEnd = properties.angleEnd,
				  angleDiff = angleEnd - angleStart,
				  angle = Math.atan2(relX, -relY) - angleStart,
				  twoPi = 2.0 * Math.PI;

			/*
			 * Make negative angles positive.
			 */
			if (angle < 0) {

				if (angleDiff >= twoPi)
					angle += twoPi;
				else
					angle = 0;

			}

			const valMin = properties.valMin,
				  valMax = properties.valMax,
				  value = ((angle / angleDiff) * (valMax - valMin)) + valMin;

			/*
			 * Clamp values into valid interval.
			 */
			if (value < valMin)
				value = valMin;
			else if (value > valMax)
				value = valMax;

			return value;
		};

		/*
		 * Convert touch event to value.
		 */
		const touchEventToValue = function(e, properties) {
			const canvas = e.target,
				  rect = canvas.getBoundingClientRect(),
				  offsetX = rect.left,
				  offsetY = rect.top,
				  width = canvas.scrollWidth,
				  height = canvas.scrollHeight,
				  centerX = 0.5 * width,
				  centerY = 0.5 * height,
				  touches = e.targetTouches,
				  touch = null;

			/*
			 * If there are touches, extract the first one.
			 */
			if (touches.length > 0)
				touch = touches.item(0);

			let x = 0.0,
				y = 0.0;

			/*
			 * If a touch was extracted, calculate coordinates relative to
			 * the element position.
			 */
			if (touch !== null) {
				const touchX = touch.pageX;
				x = touchX - offsetX;
				const touchY = touch.pageY;
				y = touchY - offsetY;
			}

			const relX = x - centerX,
				  relY = y - centerY,
				  angleStart = properties.angleStart,
				  angleEnd = properties.angleEnd,
				  angleDiff = angleEnd - angleStart,
				  twoPi = 2.0 * Math.PI;

			let angle = Math.atan2(relX, -relY) - angleStart;


			/*
			 * Make negative angles positive.
			 */
			if (angle < 0) {

				if (angleDiff >= twoPi)
					angle += twoPi;
				else
					angle = 0;

			}

			const valMin = properties.valMin,
				  valMax = properties.valMax;
			let value = ((angle / angleDiff) * (valMax - valMin)) + valMin;

			/*
			 * Clamp values into valid interval.
			 */
			if (value < valMin)
				value = valMin;
			else if (value > valMax)
				value = valMax;

			return value;
		};

		/*
		 * Show input element on double click.
		 */
		const doubleClickListener = function(e) {
			const properties = knob._properties,
				  readonly = properties.readonly;

			/*
			 * If knob is not read-only, display input element.
			 */
			if (!readonly) {
				e.preventDefault();
				const inputDiv = knob._inputDiv;
				inputDiv.style.display = 'block';
				const inputElem = knob._input;
				inputElem.focus();
				knob.redraw();
			}

		};

		/*
		 * This is called when the mouse button is depressed.
		 */
		const mouseDownListener = function(e) {
			const btn = e.buttons;

			/*
			 * It is a left-click.
			 */
			if (btn === 1) {
				const properties = knob._properties,
					  readonly = properties.readonly;

				/*
				 * If knob is not read-only, process mouse event.
				 */
				if (!readonly) {
					e.preventDefault();
					const val = mouseEventToValue(e, properties);
					knob.setValueFloating(val);
				}

				knob._mousebutton = true;
			}

			/*
			 * It is a middle click.
			 */
			if (btn === 4) {
				const properties = knob._properties,
					  readonly = properties.readonly;

				/*
				 * If knob is not read-only, display input element.
				 */
				if (!readonly) {
					e.preventDefault();
					const inputDiv = knob._inputDiv;
					inputDiv.style.display = 'block';
					const inputElem = knob._input;
					inputElem.focus();
					knob.redraw();
				}

			}

		};

		/*
		 * This is called when the mouse cursor is moved.
		 */
		const mouseMoveListener = function(e) {
			const btn = knob._mousebutton;

			/*
			 * Only process event, if mouse button is depressed.
			 */
			if (btn) {
				const properties = knob._properties,
					  readonly = properties.readonly;

				/*
				 * If knob is not read-only, process mouse event.
				 */
				if (!readonly) {
					e.preventDefault();
					const val = mouseEventToValue(e, properties);
					knob.setValueFloating(val);
				}

			}

		};

		/*
		 * This is called when the mouse button is released.
		 */
		const mouseUpListener = function(e) {
			const btn = knob._mousebutton;

			/*
			 * Only process event, if mouse button was depressed.
			 */
			if (btn) {
				const properties = knob._properties,
					  readonly = properties.readonly;

				/*
				 * If knob is not read only, process mouse event.
				 */
				if (!readonly) {
					e.preventDefault();
					const val = mouseEventToValue(e, properties);
					knob.setValue(val);
				}

			}

			knob._mousebutton = false;
		};

		/*
		 * This is called when the drag action is canceled.
		 */
		const mouseCancelListener = function(e) {
			const btn = knob._mousebutton;

			/*
			 * Abort action if mouse button was depressed.
			 */
			if (btn) {
				knob.abort();
				knob._mousebutton = false;
			}

		};

		/*
		 * This is called when a user touches the element.
		 */
		const touchStartListener = function(e) {
			const properties = knob._properties,
				  readonly = properties.readonly;

			/*
			 * If knob is not read-only, process touch event.
			 */
			if (!readonly) {
				const touches = e.targetTouches,
					  numTouches = touches.length,
					  singleTouch = (numTouches === 1);

				/*
				 * Only process single touches, not multi-touch
				 * gestures.
				 */
				if (singleTouch) {
					knob._mousebutton = true;

					/*
					 * If this is the first touch, bind double tap
					 * interval.
					 */
					if (knob._touchCount === 0) {

						/*
						 * This is executed when the double tap
						 * interval times out.
						 */
						const f = function() {

							/*
							 * If control was tapped exactly
							 * twice, enable on-screen keyboard.
							 */
							if (knob._touchCount === 2) {
								const properties = knob._properties,
									  readonly = properties.readonly;

								/*
								 * If knob is not read-only,
								 * display input element.
								 */
								if (!readonly) {
									e.preventDefault();
									const inputDiv = knob._inputDiv;
									inputDiv.style.display = 'block';
									const inputElem = knob._input;
									inputElem.focus();
									knob.redraw();
								}

							}

							knob._touchCount = 0;
						};

						const timeout = knob._timeoutDoubleTap;
						window.clearTimeout(timeout);
						timeout = window.setTimeout(f, 500);
						knob._timeoutDoubleTap = timeout;
					}

					knob._touchCount++;
					const val = touchEventToValue(e, properties);
					knob.setValueFloating(val);
				}

			}

		};

		/*
		 * This is called when a user moves a finger on the element.
		 */
		var touchMoveListener = function(e) {
			const btn = knob._mousebutton;

			/*
			 * Only process event, if mouse button is depressed.
			 */
			if (btn) {
				const properties = knob._properties,
					  readonly = properties.readonly;

				/*
				 * If knob is not read-only, process touch event.
				 */
				if (!readonly) {
					const touches = e.targetTouches,
						  numTouches = touches.length,
						  singleTouch = (numTouches === 1);

					/*
					 * Only process single touches, not multi-touch
					 * gestures.
					 */
					if (singleTouch) {
						e.preventDefault();
						const val = touchEventToValue(e, properties);
						knob.setValueFloating(val);
					}

				}

			}

		};

		/*
		 * This is called when a user lifts a finger off the element.
		 */
		const touchEndListener = function(e) {
			const btn = knob._mousebutton;

			/*
			 * Only process event, if mouse button was depressed.
			 */
			if (btn) {
				const properties = knob._properties,
					  readonly = properties.readonly;

				/*
				 * If knob is not read only, process touch event.
				 */
				if (!readonly) {
					const touches = e.targetTouches,
						  numTouches = touches.length,
						  noMoreTouches = (numTouches === 0);

					/*
					 * Only commit value after the last finger has
					 * been lifted off.
					 */
					if (noMoreTouches) {
						e.preventDefault();
						knob._mousebutton = false;
						knob.commit();
					}

				}

			}

			knob._mousebutton = false;
		};

		/*
		 * This is called when a user cancels a touch action.
		 */
		const touchCancelListener = function(e) {
			const btn = knob._mousebutton;

			/*
			 * Abort action if mouse button was depressed.
			 */
			if (btn) {
				knob.abort();
				knob._touchCount = 0;
				const timeout = knob._timeoutDoubleTap;
				window.clearTimeout(timeout);
			}

			knob._mousebutton = false;
		};

		/*
		 * This is called when the size of the canvas changes.
		 */
		const resizeListener = function(e) {
			knob.redraw();
		};

		/*
		 * This is called when the mouse wheel is moved.
		 */
		const scrollListener = function(e) {
			const readonly = knob.getProperty('readonly');

			/*
			 * If knob is not read only, process mouse wheel event.
			 */
			if (!readonly) {
				e.preventDefault();
				const delta = e.deltaY,
					  direction = delta > 0 ? 1 : (delta < 0 ? -1 : 0),
					  val = knob.getValue();
				val += direction;
				knob.setValueFloating(val);

				/*
				 * Perform delayed commit.
				 */
				const commit = function() {
					knob.commit();
				};

				const timeout = knob._timeout;
				window.clearTimeout(timeout);
				timeout = window.setTimeout(commit, 250);
				knob._timeout = timeout;
			}

		};

		/*
		 * This is called when the user presses a key on the keyboard.
		 */
		const keyPressListener = function(e) {
			const kc = e.keyCode;

			/*
			 * Hide input element when user presses enter or escape.
			 */
			if ((kc === 13) || (kc === 27)) {
				const inputDiv = knob._inputDiv;
				inputDiv.style.display = 'none';
				const input = e.target;

				/*
				 * Only evaluate value when user pressed enter.
				 */
				if (kc === 13) {
					const properties = knob._properties,
						  value = input.value,
						  stringToValue = properties.fnStringToValue,
						  val = stringToValue(value),
						  valid = isFinite(val);

					/*
					 * Check if input is a valid number.
					 */
					if (valid)
						knob.setValue(val);

				}

				input.value = '';
			}

		};

		canvas.addEventListener('dblclick', doubleClickListener);
		canvas.addEventListener('mousedown', mouseDownListener);
		canvas.addEventListener('mouseleave', mouseCancelListener);
		canvas.addEventListener('mousemove', mouseMoveListener);
		canvas.addEventListener('mouseup', mouseUpListener);
		canvas.addEventListener('resize', resizeListener);
		canvas.addEventListener('touchstart', touchStartListener);
		canvas.addEventListener('touchmove', touchMoveListener);
		canvas.addEventListener('touchend', touchEndListener);
		canvas.addEventListener('touchcancel', touchCancelListener);
		canvas.addEventListener('wheel', scrollListener);
		input.addEventListener('keypress', keyPressListener);
		return knob;
	};

}

const pureknob = new PureKnob();

