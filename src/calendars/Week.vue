<template>
  <table class="vc__calendar-week">
    <tr>
      <th class="vc__title">
        <div>{{ y }} 年 {{ m }} 月</div>
      </th>
    </tr>
    <tr v-for="week in calendar">
      <td
        class="vc__week"
        :class="getClass(week)"
        @mouseenter="enter(week)"
        @mouseleave="leave(week)"
        @click="click(week)">
        <div>{{ week.text }}</div>
      </td>
    </tr>
  </table>
</template>

<script>
import mixin from './mixin'
import {
  getStartDateOfWeek,
  getEndDateOfWeek,
  ONE_WEEK,
  getWeekOfYear,
  sort
} from '../utils.js'

function mmdd (date) {
  const mm = date.getMonth() + 1
  const dd = date.getDate()
  return `${(mm < 10 ? '0' : '') + mm}${(dd < 10 ? '0' : '') + dd}`
}

export default {
  name: 'calendar-week',

  mixins: [mixin],

  props: {
    month: {
      type: Date,
      required: true
    }
  },

  computed: {
    y ({ month }) {
      return month.getFullYear()
    },

    m ({ month }) {
      return month.getMonth() + 1
    },

    calendar ({ y, m, filter }) {
      const first = getStartDateOfWeek(new Date(y, m - 1)).getTime()
      const last = getStartDateOfWeek(new Date(y, m, 0)).getTime()
      const calendar = []
      for (let i = first; i <= last; i += ONE_WEEK) {
        const start = new Date(i)
        const end = getEndDateOfWeek(start)
        calendar.push({
          text: `第 ${getWeekOfYear(start)} 周 (${mmdd(start)} - ${mmdd(end)})`,
          date: start,
          enabled: filter(start)
        })
      }
      return calendar
    },

    _selected ({ selected }) {
      if (
        selected &&
        selected.start instanceof Date &&
        selected.end instanceof Date
      ) {
        const { start, end } = selected
        return {
          start: getStartDateOfWeek(start).getTime(),
          end: getStartDateOfWeek(end).getTime()
        }
      }
    },

    _pending ({ pending }) {
      if (pending[0] instanceof Date && pending[1] instanceof Date) {
        const sorted = sort(pending)
        return {
          start: getStartDateOfWeek(sorted[0]).getTime(),
          end: getStartDateOfWeek(sorted[1]).getTime()
        }
      }
    }
  }
}
</script>
