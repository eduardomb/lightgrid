/**
* Lightgrid plugin.
*
* Usage Example:
*   <div id="#my-grid">
*     <div data-rows="1" data-cols="1" data-x="0" data-y="0">#1</div>
*     <div data-rows="1" data-cols="2" data-x="0" data-y="1">#2</div>
*     <div data-rows="2" data-cols="1" data-x="0" data-y="3">#3</div>
*     <div data-rows="1" data-cols="3" data-x="1" data-y="0">#4</div>
*   </div>
*
*   <script type="text/javascript">
*     $('#mygrid').lightgrid({'cols': 4})
*   </script>
*
* The above example will generate a 4-column grid with the following format:
*   ┌──────────────────┐
*   | #1 |   #2   |    |
*   |─────────────| #3 |
*   |      #4     |    |
*   └──────────────────┘
*
* The default options are:
*   - cols: 3            Number of columns
*   - hSpacing: 10       Horizontal spacing from border to sep line
*   - vSpacing: 10       Vertical spacing from element border to sep line
*   - selector: div      Selector for elements in grid
*   - aspectRatio        Number of times box height should be bigger than
*                        width.
*   - hBox               Overrides automatic box height calculation via
*                        aspectRatio
*/
(function($){
  'use strict';

  function getViewportWidth() {
    var docW = document && document.documentElement.clientWidth,
        winW = window.innerWidth;

    return docW > winW ? docW : winW;
  }

  $.fn.lightgrid = function(options) {
    // Default params.
    var s = $.extend({
      'cols': 3,
      'hSpacing': 10,
      'vSpacing': 10,
      'selector': 'div',
      'aspectRatio': 1,
      'hBox': 0,
      'fluid': false
    }, options);

    // Aux vars.
    var vs = s.vSpacing * 2,
        hs = s.hSpacing * 2,
        self = this,
        boxWidth = (this.width() - (s.cols - 1) * vs) / s.cols,
        boxHeight = (s.hBox ? s.hBox : (boxWidth * s.aspectRatio)),
        $elements = $(s.selector, this),
        numRows = 0,
        lastWidth = getViewportWidth();

    // Aux functions
    var configElem = function($elm) {
      numRows = Math.max(numRows, $elm.data('x') + $elm.data('rows'));

      // Set element position and dimensions on screen.
      $elm.css({
        'position': 'absolute',
        'display': 'block',
        'width': $elm.data('cols') * (boxWidth + vs) - vs,
        'height': $elm.data('rows') * (boxHeight + hs) - hs,
        'left': $elm.data('y') * (boxWidth + vs),
        'top': $elm.data('x') * (boxHeight + hs)
      });
    };

    var redraw = function () {
      // check resize only width
      if (lastWidth != getViewportWidth()) {
        // Recalculates boxWidth and boxHeight with current window width.
        boxWidth = (self.width() - (s.cols - 1) * vs) / s.cols;
        boxHeight = (s.hBox ? s.hBox : (boxWidth * s.aspectRatio));

        // Reconfigure elements.
        $elements.each(function() {
          configElem($(this));
        });

        lastWidth = getViewportWidth();
      }
    };

    // Throttle
    var waitForFinalEvent = (function() {
      var timers = {};
      return function(callback, ms, uniqueId) {
        if (!uniqueId) {
          uniqueId = 'noId';
        }
        if (timers[uniqueId]) {
          clearTimeout (timers[uniqueId]);
        }
        timers[uniqueId] = setTimeout(callback, ms);
      };
    })();

    // Grid position must be relative or absolute in order to position posts
    // with position absolute in relation to grid. If the grid element position
    // is static (default css position) it will be set to relative. If the
    // element position is fixed we raise an error and return because changing
    // its position is a potencial harm to the layout.
    if (this.css('position') == 'fixed') {
      $.error('Grid objects can\'t have position: fixed on CSS.');

      return this;
    } else if (this.css('position') == 'static') {
      this.css('position', 'relative');
    }

    if (!$elements.length) {
      return this;
    }

    $elements.each(function() {
      configElem($(this));
    });

    // 4. Set the grid total height.
    this.height(numRows * (boxHeight + hs));

    if (s.fluid) {
      $(window).resize(function() {
        waitForFinalEvent(redraw, 500);
      });

      window.matchMedia('(orientation: portrait)').addListener(redraw);
    }

    return this;
  };
})(jQuery);
