'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function getClass (type, current, span) {
  if (!span) { return }
  var start = span.start;
  var end = span.end;
  var result = {};
  result[("" + type)] = current >= start && current <= end;
  result[(type + "-start")] = current === start;
  result[(type + "-end")] = current === end;
  return result
}

var mixin = {
  props: {
    filter: {
      type: Function,
      default: function default$1 () { return true }
    },

    selected: Object,

    pending: {
      type: Array,
      default: function default$2 () { return [] }
    }
  },

  methods: {
    getClass: function getClass$1 (ref) {
      var date = ref.date;
      var enabled = ref.enabled;

      var ref$1 = this;
      var selected = ref$1._selected;
      var pending = ref$1._pending;
      var current = date.getTime();

      return Object.assign({
        disabled: !enabled
      }, getClass('selected', current, selected),
        getClass('pending', current, pending))
    },

    enter: function enter (ref) {
      var date = ref.date;
      var enabled = ref.enabled;

      if (enabled) {
        this.$emit('enter', new Date(date));
      }
    },

    leave: function leave (ref) {
      var date = ref.date;
      var enabled = ref.enabled;

      if (enabled) {
        this.$emit('leave', new Date(date));
      }
    },

    click: function click (ref) {
      var date = ref.date;
      var enabled = ref.enabled;

      if (enabled) {
        this.$emit('click', new Date(date));
      }
    }
  }
};

var ONE_DAY = 3600 * 24 * 1000;
var ONE_WEEK = 7 * ONE_DAY;

/**
 * 修剪日期（2000-01-01 01:01:01 -> 2000-01-01 00:00:00）
 * @param - 所有参数会被直接传递给 Date 构造函数
 * @return {Date}
 */
function trim () {
  var args = [], len = arguments.length;
  while ( len-- ) args[ len ] = arguments[ len ];

  var result = new (Function.prototype.bind.apply( Date, [ null ].concat( args) ));
  result.setHours(0, 0, 0, 0);
  return result
}

/**
 * 按照时间顺序排序
 * @param {array} dates
 * @return {array}
 */
function sort (arr) {
  return arr.slice().sort(function (a, b) { return a.getTime() - b.getTime(); })
}

/**
 * 获取给定日期所在周的第一天
 * @param {Date} date
 * @param {number} startDay 0 -> 周日；1 -> 周一
 * @return {Date}
 */
function getStartDateOfWeek (date, startDay) {
  if ( startDay === void 0 ) startDay = 1;

  var day = date.getDay();
  var offset = (day + 7 - startDay) % 7;
  return trim(date.getTime() - offset * ONE_DAY)
}

/**
 * 获取给定日期所在周的最后一天
 * @param {Date} date
 * @param {number} startDay 0 -> 周日；1 -> 周一
 * @return {Date}
 */
function getEndDateOfWeek (date, startDay) {
  if ( startDay === void 0 ) startDay = 1;

  var day = date.getDay();
  var offset = 6 - (day + 7 - startDay) % 7;
  return trim(date.getTime() + offset * ONE_DAY)
}

/**
 * 获取给定日期所在月的第一天
 * @param {Date} date
 * @return {Date}
 */
function getStartDateOfMonth (date) {
  var copy = new Date(date);
  copy.setDate(1);
  return trim(copy)
}

/**
 * 获取周数（ISO 周日历）
 * @param {Date} date
 * @return {number} week number
 */
function getWeekOfYear (date) {
  // 周四确定当前周所属年
  var weekYear =
    new Date(getStartDateOfWeek(date, 1).getTime() + 3 * ONE_DAY).getFullYear();
  // 1 月 4 日确定本年第一周
  var startOfWeekYear = getStartDateOfWeek(new Date(weekYear, 0, 4), 1);
  return Math.floor((date.getTime() - startOfWeekYear.getTime()) / ONE_WEEK) + 1
}


var utils = Object.freeze({
	ONE_DAY: ONE_DAY,
	ONE_WEEK: ONE_WEEK,
	trim: trim,
	sort: sort,
	getStartDateOfWeek: getStartDateOfWeek,
	getEndDateOfWeek: getEndDateOfWeek,
	getStartDateOfMonth: getStartDateOfMonth,
	getWeekOfYear: getWeekOfYear
});

var Day = {render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('table',{staticClass:"vc__calendar-day"},[_c('tr',[_c('th',{staticClass:"vc__title",attrs:{"colspan":"7"}},[_c('div',[_vm._v(_vm._s(_vm.y)+" 年 "+_vm._s(_vm.m)+" 月")])])]),_vm._v(" "),_c('tr',_vm._l((_vm.dayNames),function(name){return _c('th',{staticClass:"vc__day-name"},[_c('div',[_vm._v(_vm._s(name))])])})),_vm._v(" "),_vm._l((_vm.calendar),function(week){return _c('tr',_vm._l((week),function(day){return _c('td',{staticClass:"vc__day",class:_vm.getClass(day),on:{"mouseenter":function($event){_vm.enter(day);},"mouseleave":function($event){_vm.leave(day);},"click":function($event){_vm.click(day);}}},[_c('div',[_vm._v(_vm._s(day.text))])])}))})],2)},staticRenderFns: [],
  name: 'calendar-day',

  mixins: [mixin],

  props: {
    month: {
      type: Date,
      required: true
    }
  },

  data: function data () {
    this.dayNames = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
    return {}
  },

  computed: {
    y: function y (ref) {
      var month = ref.month;

      return month.getFullYear()
    },

    m: function m (ref) {
      var month = ref.month;

      return month.getMonth() + 1
    },

    calendar: function calendar (ref) {
      var y = ref.y;
      var m = ref.m;
      var filter = ref.filter;

      var first = getStartDateOfWeek(new Date(y, m - 1)).getTime();
      var last = getEndDateOfWeek(new Date(y, m, 0)).getTime();
      var calendar = [];
      for (var i = first; i < last; i += ONE_WEEK) {
        var week = [];
        for (var j = i, end = i + ONE_WEEK; j < end; j += ONE_DAY) {
          var date = new Date(j);
          week.push({
            text: date.getDate(),
            date: date,
            outside: date.getMonth() !== m - 1,
            enabled: filter(date)
          });
        }
        calendar.push(week);
      }
      return calendar
    },

    _selected: function _selected (ref) {
      var selected = ref.selected;

      if (
        selected &&
        selected.start instanceof Date &&
        selected.end instanceof Date
      ) {
        var start = selected.start;
        var end = selected.end;
        return {
          start: trim(start).getTime(),
          end: trim(end).getTime()
        }
      }
    },

    _pending: function _pending (ref) {
      var pending = ref.pending;

      if (pending[0] instanceof Date && pending[1] instanceof Date) {
        var sorted = sort(pending);
        return {
          start: trim(sorted[0]).getTime(),
          end: trim(sorted[1]).getTime()
        }
      }
    }
  }
};

function mmdd (date) {
  var mm = date.getMonth() + 1;
  var dd = date.getDate();
  return ("" + ((mm < 10 ? '0' : '') + mm) + ((dd < 10 ? '0' : '') + dd))
}

var Week = {render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('table',{staticClass:"vc__calendar-week"},[_c('tr',[_c('th',{staticClass:"vc__title"},[_c('div',[_vm._v(_vm._s(_vm.y)+" 年 "+_vm._s(_vm.m)+" 月")])])]),_vm._v(" "),_vm._l((_vm.calendar),function(week){return _c('tr',[_c('td',{staticClass:"vc__week",class:_vm.getClass(week),on:{"mouseenter":function($event){_vm.enter(week);},"mouseleave":function($event){_vm.leave(week);},"click":function($event){_vm.click(week);}}},[_c('div',[_vm._v(_vm._s(week.text))])])])})],2)},staticRenderFns: [],
  name: 'calendar-week',

  mixins: [mixin],

  props: {
    month: {
      type: Date,
      required: true
    }
  },

  computed: {
    y: function y (ref) {
      var month = ref.month;

      return month.getFullYear()
    },

    m: function m (ref) {
      var month = ref.month;

      return month.getMonth() + 1
    },

    calendar: function calendar (ref) {
      var y = ref.y;
      var m = ref.m;
      var filter = ref.filter;

      var first = getStartDateOfWeek(new Date(y, m - 1)).getTime();
      var last = getStartDateOfWeek(new Date(y, m, 0)).getTime();
      var calendar = [];
      for (var i = first; i <= last; i += ONE_WEEK) {
        var start = new Date(i);
        var end = getEndDateOfWeek(start);
        calendar.push({
          text: ("第 " + (getWeekOfYear(start)) + " 周 (" + (mmdd(start)) + " - " + (mmdd(end)) + ")"),
          date: start,
          enabled: filter(start)
        });
      }
      return calendar
    },

    _selected: function _selected (ref) {
      var selected = ref.selected;

      if (
        selected &&
        selected.start instanceof Date &&
        selected.end instanceof Date
      ) {
        var start = selected.start;
        var end = selected.end;
        return {
          start: getStartDateOfWeek(start).getTime(),
          end: getStartDateOfWeek(end).getTime()
        }
      }
    },

    _pending: function _pending (ref) {
      var pending = ref.pending;

      if (pending[0] instanceof Date && pending[1] instanceof Date) {
        var sorted = sort(pending);
        return {
          start: getStartDateOfWeek(sorted[0]).getTime(),
          end: getStartDateOfWeek(sorted[1]).getTime()
        }
      }
    }
  }
};

var Month = {render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('table',{staticClass:"vc__calendar-month"},[_c('tr',[_c('th',{staticClass:"vc__title",attrs:{"colspan":"4"}},[_c('div',[_vm._v(_vm._s(_vm.y)+" 年")])])]),_vm._v(" "),_vm._l((_vm.calendar),function(row){return _c('tr',_vm._l((row),function(month){return _c('td',{staticClass:"vc__month",class:_vm.getClass(month),on:{"mouseenter":function($event){_vm.enter(month);},"mouseleave":function($event){_vm.leave(month);},"click":function($event){_vm.click(month);}}},[_c('div',[_vm._v(" "+_vm._s(month.text)+" 月 ")])])}))})],2)},staticRenderFns: [],
  name: 'month-calendar',

  mixins: [mixin],

  props: {
    year: {
      type: Date,
      required: true
    }
  },

  computed: {
    y: function y (ref) {
      var year = ref.year;

      return year.getFullYear()
    },

    calendar: function calendar (ref) {
      var y = ref.y;
      var filter = ref.filter;

      var calendar = [];
      for (var i = 0; i < 3; i++) {
        var row = [];
        for (var j = 0; j < 4; j++) {
          var m = i * 4 + j;
          var date = new Date(y, m);
          row.push({
            text: m + 1,
            date: date,
            enabled: filter(date)
          });
        }
        calendar.push(row);
      }
      return calendar
    },

    _selected: function _selected (ref) {
      var selected = ref.selected;

      if (
        selected &&
        selected.start instanceof Date &&
        selected.end instanceof Date
      ) {
        var start = selected.start;
        var end = selected.end;
        return {
          start: getStartDateOfMonth(start).getTime(),
          end: getStartDateOfMonth(end).getTime()
        }
      }
    },

    _pending: function _pending (ref) {
      var pending = ref.pending;

      if (pending[0] instanceof Date && pending[1] instanceof Date) {
        var sorted = sort(pending);
        return {
          start: getStartDateOfMonth(sorted[0]).getTime(),
          end: getStartDateOfMonth(sorted[1]).getTime()
        }
      }
    }
  }
};

exports.Day = Day;
exports.Week = Week;
exports.Month = Month;
exports.utils = utils;
