function getClass (type, current, span) {
  if (!span) return
  const { start, end } = span
  const result = {
    [`${type}`]: current >= start && current <= end,
    [`${type}-start`]: current === start,
    [`${type}-end`]: current === end
  }
  return result
}

export default {
  props: {
    filter: {
      type: Function,
      default () { return true }
    },

    selected: Object,

    pending: {
      type: Array,
      default () { return [] }
    }
  },

  methods: {
    getClass ({ date, enabled }) {
      const { _selected: selected, _pending: pending } = this
      const current = date.getTime()

      return Object.assign({
        disabled: !enabled
      }, getClass('selected', current, selected),
        getClass('pending', current, pending))
    },

    enter ({ date, enabled }) {
      if (enabled) {
        this.$emit('enter', new Date(date))
      }
    },

    leave ({ date, enabled }) {
      if (enabled) {
        this.$emit('leave', new Date(date))
      }
    },

    click ({ date, enabled }) {
      if (enabled) {
        this.$emit('click', new Date(date))
      }
    }
  }
}
