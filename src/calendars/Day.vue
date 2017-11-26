<template>
  <table class="vc__calendar-day">
    <tr>
      <th colspan="7" class="vc__title">
        <div>{{ y }} 年 {{ m }} 月</div>
      </th>
    </tr>
    <tr>
      <th v-for="name in dayNames" class="vc__day-name">
        <div>{{ name }}</div>
      </th>
    </tr>
    <tr v-for="week in calendar">
      <td
        v-for="day in week"
        class="vc__day"
        :class="getClass(day)"
        @mouseenter="enter(day)"
        @mouseleave="leave(day)"
        @click="click(day)">
        <div>{{ day.text }}</div>
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
  ONE_DAY,
  sort,
  trim
} from '../utils.js'

export default {
  name: 'calendar-day',

  mixins: [mixin],

  props: {
    month: {
      type: Date,
      required: true
    }
  },

  data () {
    this.dayNames = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
    return {}
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
      const last = getEndDateOfWeek(new Date(y, m, 0)).getTime()
      const calendar = []
      for (let i = first; i < last; i += ONE_WEEK) {
        const week = []
        for (let j = i, end = i + ONE_WEEK; j < end; j += ONE_DAY) {
          const date = new Date(j)
          week.push({
            text: date.getDate(),
            date,
            outside: date.getMonth() !== m - 1,
            enabled: filter(date)
          })
        }
        calendar.push(week)
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
          start: trim(start).getTime(),
          end: trim(end).getTime()
        }
      }
    },

    _pending ({ pending }) {
      if (pending[0] instanceof Date && pending[1] instanceof Date) {
        const sorted = sort(pending)
        return {
          start: trim(sorted[0]).getTime(),
          end: trim(sorted[1]).getTime()
        }
      }
    }
  }
}
</script>
