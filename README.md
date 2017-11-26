# vue-calendars
一个极简的日历控件。

## 使用
```html
<day :month="now" :selected="selected" @click="select"></day>
```

```js
import { Day } from 'vue-calendars'

export default {
  data: {
    const now = new Date()
    return {
      now,
      selected: { start: now, end: now }
    }
  },

  methods: {
    select (date) {
      this.selected = { start: date, end: date }
    }
  },

  components: { Day }
}
```

## API
### Props
Prop | 类型 | 描述 | 默认值/必需
--- | --- | --- | ---
month(year) | Date | 日历展示的月份（在月日历中为年份） | 必需
filter | Function (Date => Boolean) | 过滤日历中可以选择的项 | `() => true`
selected | Object({ start: Date, end: Date }) | 设置选中项 |
pending | Array([ Date, Date ]) | 设置未决选中项 | `[]`

### Events
Event | 参数 | 描述
--- | --- | ---
click | date | 点击日历中某一项时触发
enter | date | 鼠标移入日历中某一项时触发
leave | date | 鼠标移出日历中某一项时触发

> ⚠️注意：事件参数提交的 date 对象为开始的时间点，即：选中一天时结果为该天 00:00:00，选中一周时结果为该周周一 00:00:00，选中一月时结果为该月 1 日 00:00:00。

## 示例
参考 examples 文件夹。
