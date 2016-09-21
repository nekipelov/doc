window['register_replication_tab'] = function (id) {
    $(document).on({
        click: function(event) {
            event.preventDefault();
            var link = $(this).children('a');
            var target = link.attr('href');
            if (!(link.hasClass('p-active'))) {
                var active = $('#catalog-' + id + ' .b-tab_switcher-item-url.p-active');
                $(active.attr('href')).hide();
                active.removeClass('p-active');
                link.addClass('p-active');
                $(link.attr('href')).show();
            }
        }
    }, '#catalog-' + id + ' .b-tab_switcher-item');
    $(document).ready(function(event) {
        var maxHeight = Math.max(
          $('#terminal-' + id + '-1').height(),
          $('#terminal-' + id + '-2').height()
        );
        $('#catalog-'  + id + '-content').height(maxHeight + 15);
        $('#terminal-' + id + '-1').height(maxHeight);
        $('#terminal-' + id + '-2').height(maxHeight);
        $('#terminal-' + id + '-1').show();
        $('#terminal-' + id + '-2').hide();
    });
}


$(document).ready(function () {
  /* Remove first headers, since we move them into Black stripe */
  $("div>h1").remove();

  /* Add anchor before every function name. Also, add divs for good wrapping */
  $(''.concat(
    "[id^='lua-object'], [id^='lua-function'], [id^='lua-data'],       ",
    "[id^='lua-объект'], [id^='lua-функция'],  [id^='lua-данные'],     ",
    "[id^='c.'], [id^='_CPP'], [id^='lua-varfunc']"
  )).each(
    function(i, el) {
      var icon = '<i class="fa fa-link"></i>';
      var hll = '<div class="b-doc-flink_left"></div>';
      var hlr = '<div class="b-doc-flink_right"></div>'
      var hlp = '<div class="b-doc-flink></div>">'
      var hlink = $(el).find(".headerlink");
      var hlink_id = hlink.attr("href");
      if (typeof(hlink_id) != 'undefined') {
        $(hlink).remove();
        var lpane = $("<a />").addClass("headerlink").attr("href", hlink_id);
        lpane = lpane.html(icon).wrap(hll).parent();
        var rpane = $(el).clone().wrapInner(hlr);
        var pane = rpane.prepend(lpane).wrapInner(hlp);
        $(el).replaceWith(pane);
      }
    }
  );

  /* Add anchor before every function name. Also, add divs for good wrapping */
  $('h2, h3, h4, h5, h6').each(
    function(i, el) {
      var icon = '<i class="fa fa-link"></i>';
      var hll = '<div class="b-doc-hlink_left"></div>';
      var hlr = '<div class="b-doc-hlink_right"></div>'
      var hlp = '<div class="b-doc-hlink></div>">'
      var hlink = $(el).find(".headerlink");
      var hlink_id = hlink.attr("href");
      if (typeof(hlink_id) != 'undefined') {
        $(hlink).remove();
        var lpane = $("<a />").addClass("headerlink").attr("href", hlink_id);
        lpane = lpane.html(icon).wrap(hll).parent();
        var rpane = $(el).clone().wrapInner(hlr);
        var pane = rpane.prepend(lpane).wrapInner(hlp);
        $(el).replaceWith(pane);
      }
    }
  );

  function admonition_icon(name) {
    return function(i, el) {
      var icon = $('<i class="fa"></i>').addClass(name);
      $(el).prepend(icon);
    }
  }

  /* Add icon to NOTES */
  $(".admonition.note p.first.admonition-title").each(
    admonition_icon("fa-comments-o")
  );

  /* Add icon to WARNINGS */
  $(".admonition.warning p.first.admonition-title").each(
    admonition_icon("fa-exclamation-triangle")
  );

  /* Add icon to FACTS */
  $(".admonition.fact p.first.admonition-title").each(
    admonition_icon("fa-hand-o-up")
  );


  /* Move all rparams from table */
  $("table.docutils.field-list").each(
    function(i, table) {
      $(table).find("tr").each(function(i, el) {
        /* name of parameter */
        var left = $(el).children("th.field-name");
        if (left.html() == "Rtype:") {
          left.html("Return type:");
        }
        left = $("<div />").addClass("b-doc-param_left").html(
          $("<p />").html(left.html())
        );
        /* body of parameter */
        var right = $(el).children("td.field-body");
        right = $("<div />").addClass("b-doc-param_right").html(right.html());
        /* result of (l + r) */
        var pane = $("<div />").addClass("b-doc-param").append([left, right]);
        // return pane
        $(table).before(pane);
      })
      $(table).empty().remove();
    }
  );

  if (!String.prototype.startsWith) {
    Object.defineProperty(String.prototype, 'startsWith', {
        enumerable: false,
        configurable: false,
        writable: false,
        value: function(searchString, position) {
          position = position || 0;
          return this.lastIndexOf(searchString, position) === position;
        }
    });
  }

  $(function() {
    $("ul.b-menu a").each(function() {
      if (($(this).attr('href') === window.location.pathname) ||
          ($(this).attr('href').startsWith("/doc/") &&
           window.location.pathname.startsWith("/doc/")) ||
          ($(this).attr('href').startsWith("/download") &&
           window.location.pathname.startsWith("/download"))) {
        $(this).addClass("p-active");
      }
    });
  });

  $(function() {
    $(".b-header-search input").focusin(function() {
      $(this).attr("placeholder", "Search this manual");
    });
    $(".b-header-search input").focusout(function() {
      $(this).attr("placeholder", "");
    });
    $(".b-doc-search .b-header-search input").focus();
  });

  $("html").click(function() {
    $(".b-menu-toc").removeClass("active");
    $(".toggle-navigation").removeClass("active");
  });

  $("b-cols_content_left").click(function() {
    event.stopPropagation();
  });

  function toggle_recursive() {
    var menu = $(this)
    if (menu.is('li')) {
      var ul = menu.children("ul");
      var has_ul = (ul.length > 0);
      if (ul.length > 0) {
        var link = menu.children("a");
        link.css("position", "relative").css("left", "-12px").before(
          $('<i class="fa fa-minus-square-o fa-1"></i>')
        );
        link.siblings("i").click(function(event) {
          event.stopPropagation();
          menu.children("ul").slideToggle();
          $(this).toggleClass("fa-plus-square-o").toggleClass("fa-minus-square-o");
          $(".b-cols_content_left").trigger("sticky_kit:stick")
          $(".b-cols_content_left").trigger("sticky_kit:recalc")
          $(".b-cols_content_left").trigger("sticky_kit:unstick")
        }).css("position", "relative").css("left", "-17px").click();
        ul.children("li").each(toggle_recursive);
      }
    }
  }

  $(function() {
    var is_mobile = $("#mobile-checker").css("display") == "none";

    if (is_mobile) {
      $(".b-cols_content_left li.toctree-l3 ul").remove()
      $(".b-cols_content_left li.toctree-l2:not(.current) ul").remove()
    }
    $(".b-cols_content_left li.toctree-l1").each(toggle_recursive)
    $(".b-cols_content_left a.current").each(function() {
      $(this).siblings("i").click();
      $(this).parents("ul.current").prev().siblings("i").click();
    });
    $(".b-cols_content_left a").click(function() {
      $(".b-menu-toc").removeClass('active');
      $(".toggle-navigation").removeClass('active');
    });

    $(".b-cols_content_left").stick_in_parent({
      parent: ".b-cols_content",
      spacer: false
    });

    $(".b-cols_content_left").trigger("sticky_kit:stick");
    $(".b-cols_content_left").trigger("sticky_kit:recalc");
    $(".b-cols_content_left").trigger("sticky_kit:unstick");
  });
});

// vim: syntax=javascript ts=2 sts=2 sw=2 expandtab