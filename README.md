Lightgrid
==========

Usage Example
-------------

    <div id="#my-grid">
      <div data-rows="1" data-cols="1" data-x="0" data-y="0">#1</div>
      <div data-rows="1" data-cols="2" data-x="0" data-y="1">#2</div>
      <div data-rows="2" data-cols="1" data-x="0" data-y="3">#3</div>
      <div data-rows="1" data-cols="3" data-x="1" data-y="0">#4</div>
    </div>

    <script type="text/javascript">
      $('#mygrid').lightgrid({'cols': 4})
    </script>

The above example will generate a 4-column grid with the following format:
<pre>
┌──────────────────┐
| #1 |   #2   |    |
|─────────────| #3 |
|      #4     |    |
└──────────────────┘
</pre>

Default options
---------------
    cols: 3            Number of columns
    hSpacing: 10       Horizontal spacing from border to sep line
    vSpacing: 10       Vertical spacing from element border to sep line
    selector: div      Selector for elements in grid
    aspectRatio        Number of times box height should be bigger than
                       width.
    hBox               Overrides automatic box height calculation via
                       aspectRatio
