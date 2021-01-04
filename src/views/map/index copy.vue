<template>
  <div class="map-main">
    <!-- <div class="center-disc box-inside">
      <radar :selected="selected"></radar>
    </div>-->
    <div
      v-loading="loading"
      element-loading-text="加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
      class="map-chart"
    >
      <echarts
        id="mapCharts"
        :chart-style="chartStyle"
        :option="option"
        @getChartInstance="getInstance"
      />
      <el-breadcrumb separator="/" class="bread">
        <el-breadcrumb-item v-for="(item, index) in areaRoute" :key="index">
          <a @click="mapClick(item)">{{ item.name }}</a>
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
  </div>
</template>

<script>
import echarts from "echarts";
var geojsonMerge = require("@mapbox/geojson-merge");
import gzMap from "../../assets/area/province/520000.json";
import china1 from "../../assets/area/china.json";
import areaData from "../../assets/area/area.json";
// import radar from "../mapItem/radar";
import Axios from "axios";
import { getAreaCodeType } from "@/utils/tools";
import { mapGetters } from "vuex";
import { CodeToText } from "element-china-area-data";
export default {
  // components: {
  //   radar
  // },
  props: {
    mapData: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  data() {
    return {
      instance: "",
      china1: "",
      gzMap: "",
      areaData: "",
      locationData: "",
      loading: false,
      areaRoute: [],
      areaType: ["province", "city", "county"],
      selected: {
        data: [],
        name: ""
      },
      chartStyle: {
        width: "100%",
        height: "100%"
      },
      parentStyle: {
        // clickable: true,
        itemStyle: {
          areaColor: "rgba(34,30,62,0.6)",
          borderColor: "rgba(80,71,139,0.6)",
          borderWidth: 0,
          shadowBlur: 10,
          shadowColor: "rgba(0, 0, 0, 0.8)",
          shadowOffsetX: -5,
          shadowOffsetY: 10
        }
      },
      childrenStyle: {
        clickable: true,
        // selected: true,
        itemStyle: {
          areaColor: "rgba(34,30,62,0)",
          borderColor: "rgba(80,71,139,1)",
          borderWidth: 1,
          shadowBlur: 10,
          shadowColor: "rgba(0, 0, 0, 1)",
          shadowOffsetX: 5,
          shadowOffsetY: 10
        },
        label: {
          show: true,
          color: "#55E5FF",
          fontSize: 14
        },
        emphasis: {
          show: false,
          label: {
            show: false,
            color: "#55E5FF",
            fontSize: 14
          },
          itemStyle: {
            areaColor: "rgba(246,205,97,1)",
            borderColor: "rgba(44,40,59,1)",
            borderWidth: 2,
            shadowBlur: 10,
            shadowColor: "rgba(0, 0, 0, 1)",
            shadowOffsetX: 5,
            shadowOffsetY: 10
          }
        }
      },
      option: {
        tooltip: {
          alwaysShowContent: true,
          triggerOn: "none",
          backgroundColor: "rgba(81,72,136,0.5)",
          borderColor: "#a9a2d2",
          borderWidth: 1,
          padding: 0,
          // enterable: true,
          transitionDuration: 0,
          textSyle: {
            width: 500
          },
          formatter: param => {
            let td = "";
            for (
              let index = 0;
              index < param.data.value[2].productList.length;
              index++
            ) {
              const element = param.data.value[2].productList[index];
              td += `<tr >
                              <td>
                              ${element.product}
                              </td>
                              <td>
                              ${
                                element.production && element.production != 0
                                  ? element.production
                                  : "-"
                              }
                              </td>
                              <td>
                               ${element.unit}
                              </td>
                            </tr>`;
            }
            return (
              `<div class="tool-box">
                      <div class="tool-box-title">${param.name}</div>
                      <div class="tool-box-content">
                         <table >
                          <thead>
                              <td>
                                产品或服务名称
                              </td>
                              <td>
                                生产量
                              </td>
                              <td>
                                单位
                              </td>
                          </thead>
                          <tbody>` +
              td +
              `</tbody>
                        </table>
                        <div class="tool-box-text">工业产值（万元）：${param.data.value[2].industrialOutputValue}</div>
                        <div class="tool-box-text">企业地址：${param.data.value[2].address}</div>
                        <div class="btn">
                        <a class="btn-content" href="/credit/detail?s=${param.name}">查看详情>></a>
                        </div>
                      </div>
                    </div>
                    `
            );
          }
        },
        geo: [
          {
            scaleLimit: {
              min: 5,
              max: 25
            },

            zoom: 15,
            roam: true,
            left: "20%",
            top: "15%",
            center: [100.713478, 26.578343],
            show: true,
            map: "china",
            label: {
              show: false,
              color: "#55E5FF",
              fontSize: 14
            },
            silent: false,
            itemStyle: {
              areaColor: "rgba(25,21,39,1)",
              borderColor: "rgba(44,40,59,1)",
              borderWidth: 2
            },
            emphasis: {
              label: {
                show: false
              },
              itemStyle: {
                areaColor: "rgba(25,21,39,1)",
                borderColor: "rgba(44,40,59,1)",
                borderWidth: 2
              }
            },
            regions: []
          }
        ],
        series: [
          {
            name: "scatterPointer",
            type: "effectScatter",
            coordinateSystem: "geo",
            data: this.mapData,
            symbolSize: 8,
            showEffectOn: "emphasis",
            rippleEffect: {
              color: "rgba(69, 36, 61, 1)",
              scale: 5
              // brushType: "stroke"
            },
            hoverAnimation: true,
            label: {
              formatter: "{b}",
              position: "right",
              show: false,
              color: "rgba(223,66,79,1)"
            },
            itemStyle: {
              color: "rgba(223,66,79,1)"
            },
            emphasis: {
              label: {
                formatter: "{b}",
                position: "right",
                show: true,
                color: "rgba(223,66,79,1)"
              },
              itemStyle: {
                color: "rgba(223,66,79,1)",
                borderColor: "rgba(127, 46, 65, 1)",
                borderWidth: 3
              }
            },
            zlevel: 3
          }
        ]
      }
    };
  },
  computed: {
    // ...mapGetters(["userInfo"]),
    isMatch() {
      return this.selected.name && this.instance;
    }
  },
  watch: {
    mapData: {
      handler(val) {
        this.selected =
          val && val.length > 0
            ? val[0]
            : {
                data: [],
                name: ""
              };
        this.option.series[0].data = val;
      },
      immediate: true
    },
    isMatch() {
      this.$nextTick(() => {
        this.instance.dispatchAction({
          type: "highlight",
          seriesName: "scatterPointer",
          name: this.selected.name
        });
        this.instance.dispatchAction({
          type: "showTip",
          seriesIndex: 0,
          name: this.selected.name
        });
      });
    }
  },
  async beforeCreate() {
    this.china1 = china1;
    this.gzMap = gzMap;
    this.areaData = areaData;
    // this.loading = true;
    // await Axios.get(
    //   `http://gz-region.casicloud.com/admin/area/china.json`
    // ).then(res => {
    //   this.china1 = res.data;
    // });
    // await Axios.get(
    //   `http://gz-region.casicloud.com/admin/area/province/520000.json`
    // ).then(res => {
    //   this.gzMap = res.data;
    // });
    // await Axios.get(`http://gz-region.casicloud.com/admin/area/area.json`).then(
    //   res => {
    //     this.areaData = res.data;
    //   }
    // );
    // await Axios.get(
    //   `http://gz-region.casicloud.com/admin/area/gz_location.json`
    // ).then(res => {
    //   this.locationData = res.data;
    //   this.loading = false;
    // });
    // this.mapClick({})

    console.log("china1", this.areaData);
    const maps = await geojsonMerge.merge([this.china1, this.gzMap]);
    await echarts.registerMap("china", maps);
    await this.setAreaData(this.areaData, {
      name: "贵州省",
      code: "520000"
    });
  },
  created() {
    // this.mapClick({ code: "520000", name: "贵州省" });
  },
  methods: {
    mapClick(region) {
      this.$emit("mapClick", region);
      // this.loading = true;
      // Axios.get(
      //   `/admin/area/${this.areaType[getAreaCodeType(region.code) - 1]}/${
      //     region.code
      //   }.json`
      // )
      //   .then(res => {
      //     const tmp = this.areaRoute.filter(i => i.code == region.code);
      //     // let type = region.type
      //     if (tmp && tmp.length > 0) {
      //       this.areaRoute = this.areaRoute.slice(
      //         0,
      //         this.areaRoute.findIndex(i => i.code == region.code) + 1
      //       );
      //     } else {
      //       this.areaRoute.push(region);
      //     }
      //     debugger;
      //     const areas = this.getArea(
      //       this.areaData,
      //       getAreaCodeType(region.code) - 1,
      //       region.code
      //     );
      //     if (
      //       areas.length > 0 &&
      //       areas[0].children &&
      //       getAreaCodeType(region.code) !== 1
      //     ) {
      //       this.setAreaData(areas[0].children, {
      //         name: region.name,
      //         code: region.code
      //       });
      //     } else {
      //       this.setAreaData(areas, { name: region.name, code: region.code });
      //     }
      this.setAreaData(this.areaData, {
        name: region.name,
        code: region.code
      });
      const maps = geojsonMerge.merge([this.china1, this.gzMap]);
      echarts.registerMap("china", maps);
      this.setZoom(0);
      this.setLocation(region.code);
      // this.loading = false;
      // })
      // .catch(err => {
      //   console.log("err", err);
      //   this.loading = false;
      // });
    },
    setZoom(level) {
      const data = [
        {
          zoom: 15,
          scaleLimit: {
            min: 5,
            max: 25
          }
        },
        {
          zoom: 25,
          scaleLimit: {
            min: 5,
            max: 45
          }
        },
        {
          zoom: 45,
          scaleLimit: {
            min: 5,
            max: 65
          }
        }
      ];
      this.option.geo[0].zoom = data[level].zoom;
      this.option.geo[0].scaleLimit = data[level].scaleLimit;
    },
    setLocation(code) {
      const tmp = Object.keys(this.locationData[0]).filter(i => i == code);
      if (tmp && tmp.length > 0) {
        this.option.geo[0].center = this.locationData[0][tmp[0]].center.map(
          (i, index) => {
            if (index == 0) {
              i = i - 1.5;
            }
            return i;
          }
        );
      }
    },
    getArea(areaData, level, code) {
      if (level == 0) {
        return areaData;
      } else if (level == 1) {
        return areaData.filter(item => item.value == code);
      } else {
        const area = areaData.filter(
          item => item.value.slice(0, 4) == code.slice(0, 4)
        );
        if (area && area.length > 0 && area[0].children) {
          return area[0].children.filter(i => i.value == code);
        }
      }
      return areaData;
    },
    setAreaData(area, parentData) {
      let region = [];
      if (parentData) {
        region = [{ ...parentData, ...this.parentStyle }];
      }
      area &&
        area.map(item => {
          region.push({
            name: item.label,
            code: item.value,
            ...this.childrenStyle
          });
        });
      console.log("region", region);
      this.option.geo[0].regions = region;
    },
    getInstance(instance) {
      this.instance = instance;

      instance.on("georoam", param => {
        this.instance.dispatchAction({
          type: "highlight",
          seriesName: "scatterPointer",
          name: this.selected.name
        });
        instance.dispatchAction({
          type: "showTip",
          seriesIndex: 0,
          name: this.selected.name
        });
      });
      instance.dispatchAction({
        type: "highlight",
        seriesName: "scatterPointer",
        name: this.selected.name
      });
      instance.on("mouseout", params => {
        if (this.selected.name == params.name) {
          instance.dispatchAction({
            type: "highlight",
            seriesName: "scatterPointer",
            name: params.name
          });
        }
      });

      instance.on("click", params => {
        console.log("paramsssssssssssssssss", params);
        if (params.seriesName == "scatterPointer") {
          instance.dispatchAction({
            type: "downplay",
            seriesName: "scatterPointer",
            name: this.selected.name
          });
          this.selected = params.data;
          instance.dispatchAction({
            type: "highlight",
            seriesName: "scatterPointer",
            name: params.name
          });
          instance.dispatchAction({
            type: "showTip",
            seriesIndex: 0,
            name: params.name
          });
        } else if (params.region.clickable) {
          console.log("parama", params.region.code.split("00"));
          if (params.region.code.split("00").length > 1) {
            this.mapClick(params.region);
          }
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.map-main {
  width: 100%;
  height: 100vh;
  background-color: rgba(25, 21, 39, 1);
}

.map-chart {
  height: 100%;
  width: 100%;
}
.box-inside {
  position: absolute;
  margin: 2% 0;
  background: url("../../assets/map/cndt_box_4.png") no-repeat;
  background-size: contain;
  width: 35.5%;
  height: 29%;
  min-width: 227px;
  min-height: 198px;
}
</style>
<style lang="scss">
.map-main {
  .tool-box {
    // min-width: 300px;
    // padding: 15px;
    // margin:20px
    .tool-box-title {
      text-align: center;
      font-size: 16px;
      line-height: 50px;
      // padding-bottom: 5px;
      border-bottom: 1px solid #a9a2d2;
    }
    .tool-box-text {
      margin: 5px 0;
    }
    .tool-box-content {
      padding: 10px;
      font-size: 14px;
      table {
        max-width: 700px;
        // width: 700px;
        table-layout: fixed;
        margin: auto;
        // table-layout: fixed;
        // background-color: rgba(255, 255, 255, 1);
        text-align: center;
        thead {
          border: 1px solid #eee;
        }
        td {
          // border:1px solid #eee;
          padding: 5px;
          text-align: center;
          background-color: rgba(81, 72, 136, 0.5);
          max-width: 200px;
          min-width: 100px;
          white-space: normal;
          word-break: break-all;
        }
      }
      .btn {
        text-align: right;
      }
      .btn-content {
        color: rgba(116, 216, 181, 1);
        cursor: pointer;
        pointer-events: all;
      }
    }
  }
  .bread {
    position: absolute;
    top: 35px;
    right: 1%;
    .el-breadcrumb__item {
      .el-breadcrumb__inner {
        color: #fff;
      }
      a {
        &:hover {
          cursor: pointer;
          // color: rgba(246, 205, 97, 1);
        }
        color: #fff;
      }
      font-size: 18px;
    }
  }
}
</style>
