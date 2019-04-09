<template>
  <div :style="style" class="scroll-picker">
    <div class="flex-row flex">
      <div class="flex-item" v-for="(one, index) in currentData" :key="index">
        <div :id="`scroll-picker-${uuid}-${index}`"/>
      </div>
    </div>
  </div>
</template>

<script>
import Scroller from "./lib/scroller";

export default {
  name: "scroll-select",
  props: {
    data: Array,
    selectedIndex: {
      type: Number,
      default: 0
    },
    width: {
      type: String,
      default: "150px"
    },
    itemClass: {
      type: String,
      default: "scroller-item"
    }
  },

  data() {
    return {
      scroller: [],
      count: 0,
      uuid: "",
      currentData: [this.data],
      currentValue: []
    };
  },
  computed: {
    style() {
      return { width: this.width };
    }
  },
  mounted() {
    if (!this.data) return;
    if (this.data.length != 0) {
      if (this.selectedIndex > 0 && this.selectedIndex < this.data.length) {
        this.currentValue = [this.data[this.selectedIndex].value];
      } else {
        this.currentValue = [this.data[Math.round(this.data.length / 2)].value];
      }
    }
    this.uuid = Math.random()
      .toString(36)
      .substring(3, 8);
    this.$nextTick(() => {
      this.render(this.currentData, this.currentValue);
    });
  },
  methods: {
    getId(i) {
      return `#scroll-picker-${this.uuid}-${i}`;
    },
    render(data, value) {
      this.count = this.currentData.length;
      const _this = this;
      if (!data || !data.length) {
        return;
      }
      let count = this.currentData.length;
      // set first item as value
      if (value.length < count) {
        for (let i = 0; i < count; i++) {
          this.$set(_this.currentValue, i, data[i][0].value || data[i][0]);
        }
      }

      for (let i = 0; i < data.length; i++) {
        if (!document.querySelector(_this.getId(i))) {
          return;
        }

        _this.scroller[i] && _this.scroller[i].destroy();
        _this.scroller[i] = new Scroller(_this.getId(i), {
          data: data[i],
          defaultValue: value[i] || data[i][0].value,
          itemClass: _this.itemClass,
          onSelect(value) {
            _this.$set(_this.currentValue, i, value);
          }
        });
        if (_this.currentValue) {
          _this.scroller[i].select(value[i]);
        }
      }
    }
  },
  watch: {
    currentValue(val, oldVal) {
      this.$emit("input", val);
    }
  },
  beforeDestroy() {
    for (let i = 0; i < this.count; i++) {
      this.scroller[i] && this.scroller[i].destroy();
      this.scroller[i] = null;
    }
  }
};
</script>

<style lang="scss">
.flex {
  width: 100%;
  text-align: left;
  display: flex;
  box-align: center;
  align-items: center;
  .flex-item {
    flex: 1;
    -webkit-flex: 1;
    min-width: 20px;
    width: 0%;
    margin-left: 0;
    &:first-child {
      margin-left: 0 !important;
      margin-top: 0 !important;
    }
  }
}

.flex-row {
  box-direction: row;
  box-orient: horizontal;
  flex-direction: row;
}

@import "./scroll-picker.scss";
</style>

