<template>
  <q-card class="main_content" >
    <q-card-section >

      <div class="row">

        <!-- 搜索 -->
        <q-input label="传感器类型搜索" style="width: 265px;margin-left: 0px" dense standout="bg-blue-6 text-white" v-model="search" input-class="text-right" class="q-ml-md" label-color="primary">
          <template v-slot:append>
            <q-icon v-if="search === ''" name="search"  />
            <q-icon v-else name="clear" class="cursor-pointer" @click="search = ''" />
          </template>
        </q-input>
      </div>

      <q-separator style="margin-top: 10px;"/>

      <q-splitter style="height: 83vh;" v-model="splitterModel">
        <template v-slot:before>
          <q-tree
            :nodes="simple"
            node-key="label"
            selected-color="primary"
            :selected.sync="selected"
            default-expand-all
          />
        </template>
        <template v-slot:after>

          <q-tabs
            v-model="tab"
            class="bg-grey-1"
            dense
            align="justify"
          >
            <q-tab class="text-orange" name="mails"  label="所有" />
            <q-tab class="text-cyan" name="alarms"  label="已添加" />
            <q-tab class="text-red" name="movies"  label="未添加" />
          </q-tabs>

          <div class="row" style="margin-left: 10px;">
            <q-card class="my-card">
              <q-img src="https://cdn.quasar.dev/img/chicken-salad.jpg"/>

              <q-card-section>
                <q-btn
                  fab
                  color="primary"
                  icon="place"
                  class="absolute"
                  style="top: 0; right: 12px; transform: translateY(-50%);"
                />

                <div class="row no-wrap items-center">
                  <div class="col text-h6 ellipsis">
                    10A入墙插座
                  </div>
                  <div class="col-auto text-grey text-caption q-pt-md row no-wrap items-center">
                    <q-icon name="place"/>
                    250 ft
                  </div>
                </div>

                <q-rating v-model="stars" :max="5" size="32px"/>
              </q-card-section>

              <q-card-section class="q-pt-none">
                <div class="text-subtitle1">
                  $・Italian, Cafe
                </div>
                <div class="text-caption text-grey">
                  Small plates, salads & sandwiches in an intimate setting.
                </div>
              </q-card-section>

              <q-separator/>

              <q-card-actions>
                <q-btn color="primary">
                  已添加
                </q-btn>
              </q-card-actions>
            </q-card>
            <q-card class="my-card">
              <q-img src="https://cdn.quasar.dev/img/chicken-salad.jpg"/>

              <q-card-section>
                <q-btn
                  fab
                  color="primary"
                  icon="place"
                  class="absolute"
                  style="top: 0; right: 12px; transform: translateY(-50%);"
                />

                <div class="row no-wrap items-center">
                  <div class="col text-h6 ellipsis">
                    10A入墙插座
                  </div>
                  <div class="col-auto text-grey text-caption q-pt-md row no-wrap items-center">
                    <q-icon name="place"/>
                    250 ft
                  </div>
                </div>

                <q-rating v-model="stars" :max="5" size="32px"/>
              </q-card-section>

              <q-card-section class="q-pt-none">
                <div class="text-subtitle1">
                  $・Italian, Cafe
                </div>
                <div class="text-caption text-grey">
                  Small plates, salads & sandwiches in an intimate setting.
                </div>
              </q-card-section>

              <q-separator/>

              <q-card-actions>
                <q-btn color="primary">
                  已添加
                </q-btn>
              </q-card-actions>
            </q-card>
            <q-card class="my-card">
              <q-img src="https://cdn.quasar.dev/img/chicken-salad.jpg"/>

              <q-card-section>
                <q-btn
                  fab
                  color="primary"
                  icon="place"
                  class="absolute"
                  style="top: 0; right: 12px; transform: translateY(-50%);"
                />

                <div class="row no-wrap items-center">
                  <div class="col text-h6 ellipsis">
                    10A入墙插座
                  </div>
                  <div class="col-auto text-grey text-caption q-pt-md row no-wrap items-center">
                    <q-icon name="place"/>
                    250 ft
                  </div>
                </div>

                <q-rating v-model="stars" :max="5" size="32px"/>
              </q-card-section>

              <q-card-section class="q-pt-none">
                <div class="text-subtitle1">
                  $・Italian, Cafe
                </div>
                <div class="text-caption text-grey">
                  Small plates, salads & sandwiches in an intimate setting.
                </div>
              </q-card-section>

              <q-separator/>

              <q-card-actions>
                <q-btn color="primary">
                  已添加
                </q-btn>
              </q-card-actions>
            </q-card>
            <q-card class="my-card">
              <q-img src="https://cdn.quasar.dev/img/chicken-salad.jpg"/>

              <q-card-section>
                <q-btn
                  fab
                  color="primary"
                  icon="place"
                  class="absolute"
                  style="top: 0; right: 12px; transform: translateY(-50%);"
                />

                <div class="row no-wrap items-center">
                  <div class="col text-h6 ellipsis">
                    10A入墙插座
                  </div>
                  <div class="col-auto text-grey text-caption q-pt-md row no-wrap items-center">
                    <q-icon name="place"/>
                    250 ft
                  </div>
                </div>

                <q-rating v-model="stars" :max="5" size="32px"/>
              </q-card-section>

              <q-card-section class="q-pt-none">
                <div class="text-subtitle1">
                  $・Italian, Cafe
                </div>
                <div class="text-caption text-grey">
                  Small plates, salads & sandwiches in an intimate setting.
                </div>
              </q-card-section>

              <q-separator/>

              <q-card-actions>
                <q-btn color="primary">
                  已添加
                </q-btn>
              </q-card-actions>
            </q-card>
            <q-card class="my-card">
              <q-img src="https://cdn.quasar.dev/img/chicken-salad.jpg"/>

              <q-card-section>
                <q-btn
                  fab
                  color="primary"
                  icon="place"
                  class="absolute"
                  style="top: 0; right: 12px; transform: translateY(-50%);"
                />

                <div class="row no-wrap items-center">
                  <div class="col text-h6 ellipsis">
                    10A入墙插座
                  </div>
                  <div class="col-auto text-grey text-caption q-pt-md row no-wrap items-center">
                    <q-icon name="place"/>
                    250 ft
                  </div>
                </div>

                <q-rating v-model="stars" :max="5" size="32px"/>
              </q-card-section>

              <q-card-section class="q-pt-none">
                <div class="text-subtitle1">
                  $・Italian, Cafe
                </div>
                <div class="text-caption text-grey">
                  Small plates, salads & sandwiches in an intimate setting.
                </div>
              </q-card-section>

              <q-separator/>

              <q-card-actions>
                <q-btn color="primary">
                  已添加
                </q-btn>
              </q-card-actions>
            </q-card>
            <q-card class="my-card">
              <q-img src="https://cdn.quasar.dev/img/chicken-salad.jpg"/>

              <q-card-section>
                <q-btn
                  fab
                  color="primary"
                  icon="place"
                  class="absolute"
                  style="top: 0; right: 12px; transform: translateY(-50%);"
                />

                <div class="row no-wrap items-center">
                  <div class="col text-h6 ellipsis">
                    10A入墙插座
                  </div>
                  <div class="col-auto text-grey text-caption q-pt-md row no-wrap items-center">
                    <q-icon name="place"/>
                    250 ft
                  </div>
                </div>

                <q-rating v-model="stars" :max="5" size="32px"/>
              </q-card-section>

              <q-card-section class="q-pt-none">
                <div class="text-subtitle1">
                  $・Italian, Cafe
                </div>
                <div class="text-caption text-grey">
                  Small plates, salads & sandwiches in an intimate setting.
                </div>
              </q-card-section>

              <q-separator/>

              <q-card-actions>
                <q-btn color="primary">
                  已添加
                </q-btn>
              </q-card-actions>
            </q-card>
            <q-card class="my-card">
              <q-img src="https://cdn.quasar.dev/img/chicken-salad.jpg"/>

              <q-card-section>
                <q-btn
                  fab
                  color="primary"
                  icon="place"
                  class="absolute"
                  style="top: 0; right: 12px; transform: translateY(-50%);"
                />

                <div class="row no-wrap items-center">
                  <div class="col text-h6 ellipsis">
                    10A入墙插座
                  </div>
                  <div class="col-auto text-grey text-caption q-pt-md row no-wrap items-center">
                    <q-icon name="place"/>
                    250 ft
                  </div>
                </div>

                <q-rating v-model="stars" :max="5" size="32px"/>
              </q-card-section>

              <q-card-section class="q-pt-none">
                <div class="text-subtitle1">
                  $・Italian, Cafe
                </div>
                <div class="text-caption text-grey">
                  Small plates, salads & sandwiches in an intimate setting.
                </div>
              </q-card-section>

              <q-separator/>

              <q-card-actions>
                <q-btn color="primary">
                  已添加
                </q-btn>
              </q-card-actions>
            </q-card>
            <q-card class="my-card">
              <q-img src="https://cdn.quasar.dev/img/chicken-salad.jpg"/>

              <q-card-section>
                <q-btn
                  fab
                  color="primary"
                  icon="place"
                  class="absolute"
                  style="top: 0; right: 12px; transform: translateY(-50%);"
                />

                <div class="row no-wrap items-center">
                  <div class="col text-h6 ellipsis">
                    10A入墙插座
                  </div>
                  <div class="col-auto text-grey text-caption q-pt-md row no-wrap items-center">
                    <q-icon name="place"/>
                    250 ft
                  </div>
                </div>

                <q-rating v-model="stars" :max="5" size="32px"/>
              </q-card-section>

              <q-card-section class="q-pt-none">
                <div class="text-subtitle1">
                  $・Italian, Cafe
                </div>
                <div class="text-caption text-grey">
                  Small plates, salads & sandwiches in an intimate setting.
                </div>
              </q-card-section>

              <q-separator/>

              <q-card-actions>
                <q-btn color="primary">
                  已添加
                </q-btn>
              </q-card-actions>
            </q-card>
            <q-card class="my-card">
              <q-img src="https://cdn.quasar.dev/img/chicken-salad.jpg"/>

              <q-card-section>
                <q-btn
                  fab
                  color="primary"
                  icon="place"
                  class="absolute"
                  style="top: 0; right: 12px; transform: translateY(-50%);"
                />

                <div class="row no-wrap items-center">
                  <div class="col text-h6 ellipsis">
                    10A入墙插座
                  </div>
                  <div class="col-auto text-grey text-caption q-pt-md row no-wrap items-center">
                    <q-icon name="place"/>
                    250 ft
                  </div>
                </div>

                <q-rating v-model="stars" :max="5" size="32px"/>
              </q-card-section>

              <q-card-section class="q-pt-none">
                <div class="text-subtitle1">
                  $・Italian, Cafe
                </div>
                <div class="text-caption text-grey">
                  Small plates, salads & sandwiches in an intimate setting.
                </div>
              </q-card-section>

              <q-separator/>

              <q-card-actions>
                <q-btn color="primary">
                  已添加
                </q-btn>
              </q-card-actions>
            </q-card>
            <q-card class="my-card">
              <q-img src="https://cdn.quasar.dev/img/chicken-salad.jpg"/>

              <q-card-section>
                <q-btn
                  fab
                  color="primary"
                  icon="place"
                  class="absolute"
                  style="top: 0; right: 12px; transform: translateY(-50%);"
                />

                <div class="row no-wrap items-center">
                  <div class="col text-h6 ellipsis">
                    10A入墙插座
                  </div>
                  <div class="col-auto text-grey text-caption q-pt-md row no-wrap items-center">
                    <q-icon name="place"/>
                    250 ft
                  </div>
                </div>

                <q-rating v-model="stars" :max="5" size="32px"/>
              </q-card-section>

              <q-card-section class="q-pt-none">
                <div class="text-subtitle1">
                  $・Italian, Cafe
                </div>
                <div class="text-caption text-grey">
                  Small plates, salads & sandwiches in an intimate setting.
                </div>
              </q-card-section>

              <q-separator/>

              <q-card-actions>
                <q-btn color="primary">
                  已添加
                </q-btn>
              </q-card-actions>
            </q-card>
            <q-card class="my-card">
              <q-img src="https://cdn.quasar.dev/img/chicken-salad.jpg"/>

              <q-card-section>
                <q-btn
                  fab
                  color="primary"
                  icon="place"
                  class="absolute"
                  style="top: 0; right: 12px; transform: translateY(-50%);"
                />

                <div class="row no-wrap items-center">
                  <div class="col text-h6 ellipsis">
                    10A入墙插座
                  </div>
                  <div class="col-auto text-grey text-caption q-pt-md row no-wrap items-center">
                    <q-icon name="place"/>
                    250 ft
                  </div>
                </div>

                <q-rating v-model="stars" :max="5" size="32px"/>
              </q-card-section>

              <q-card-section class="q-pt-none">
                <div class="text-subtitle1">
                  $・Italian, Cafe
                </div>
                <div class="text-caption text-grey">
                  Small plates, salads & sandwiches in an intimate setting.
                </div>
              </q-card-section>

              <q-separator/>

              <q-card-actions>
                <q-btn color="primary">
                  已添加
                </q-btn>
              </q-card-actions>
            </q-card>
            <q-card class="my-card">
              <q-img src="https://cdn.quasar.dev/img/chicken-salad.jpg"/>

              <q-card-section>
                <q-btn
                  fab
                  color="primary"
                  icon="place"
                  class="absolute"
                  style="top: 0; right: 12px; transform: translateY(-50%);"
                />

                <div class="row no-wrap items-center">
                  <div class="col text-h6 ellipsis">
                    10A入墙插座
                  </div>
                  <div class="col-auto text-grey text-caption q-pt-md row no-wrap items-center">
                    <q-icon name="place"/>
                    250 ft
                  </div>
                </div>

                <q-rating v-model="stars" :max="5" size="32px"/>
              </q-card-section>

              <q-card-section class="q-pt-none">
                <div class="text-subtitle1">
                  $・Italian, Cafe
                </div>
                <div class="text-caption text-grey">
                  Small plates, salads & sandwiches in an intimate setting.
                </div>
              </q-card-section>

              <q-separator/>

              <q-card-actions>
                <q-btn color="primary">
                  已添加
                </q-btn>
              </q-card-actions>
            </q-card>
          </div>

        </template>
      </q-splitter>

    </q-card-section>
  </q-card>
</template>
<script>
export default {
  data () {
    return {
      selected: null,
      splitterModel: 16,
      tab: 'mails',
      simple: [
        {
          label: '树',
          avatar: 'https://cdn.quasar.dev/img/boy-avatar.png',
          children: [
            {
              label: '节点 (with icon)',
              icon: 'restaurant_menu',
              children: [
                {
                  label: '节点'
                },
                {
                  label: '节点',
                  selectable: true
                }
              ]
            },
            {
              label: '节点(22)',
              icon: 'room_service',
              disabled: true,
              children: [
                { label: '节点' },
                { label: '节点' }
              ]
            },
            {
              label: '节点(with icon)',
              icon: 'photo',
              children: [
                {
                  label: '节点(with image)',
                  img: 'https://cdn.quasar.dev/img/logo_calendar_128px.png'
                },
                { label: '节点' },
                { label: '节点' }
              ]
            }
          ]
        }
      ]
    }
  }
}
</script>

<style lang="css" scoped>
  .my-card {
    margin: 8px;
    width: 100%;
    max-width: 250px;
  }
</style>
