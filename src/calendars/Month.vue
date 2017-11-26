<template>
  <table class="vc__calendar-month">
    <tr>
      <th colspan="4" class="vc__title">
        <div>{{ y }} 年</div>
      </th>
    </tr>
    <tr v-for="row in calendar">
      <td
        v-for="month in row"
        class="vc__month"
        :class="getClass(month)"
        @mouseenter="enter(month)"
        @mouseleave="leave(month)"
        @click="click(month)">
        <div>
          {{ month.text }} 月
        </div>
      </td>
    </tr>
  </table>
</template>

<script>
import mixin from './mixin'
import {
  sort,
  getStartDateOfMonth
} from '../utils'

export default {
  name: 'month-calendar',

  mixins: [mixin],

  props: {
    year: {
      type: Date,
      required: true
    }
  },

  computed: {
    y ({ year }) {
      return year.getFullYear()
    },

    calendar ({ y, filter }) {
      const calendar = []
      for (let i = 0; i < 3; i++) {
        const row = []
        for (let j = 0; j < 4; j++) {
          const m = i * 4 + j
          const date = new Date(y, m)
          row.push({
            text: m + 1,
            date,
            enabled: filter(date)
          })
        }
        calendar.push(row)
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
          start: getStartDateOfMonth(start).getTime(),
          end: getStartDateOfMonth(end).getTime()
        }
      }
    },

    _pending ({ pending }) {
      if (pending[0] instanceof Date && pending[1] instanceof Date) {
        const sorted = sort(pending)
        return {
          start: getStartDateOfMonth(sorted[0]).getTime(),
          end: getStartDateOfMonth(sorted[1]).getTime()
        }
      }
    }
  }
}
</script>
