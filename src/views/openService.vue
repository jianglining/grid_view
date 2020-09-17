<template>
  <div>
    <q-splitter v-model="splitterModel" style="height: 90vh">
      <template v-slot:before>
        <div class="q-pa-md">
          <div class="row" style="margin:10px">
            <!-- 搜索 -->
            <q-input
              label="网格节点搜索"
              style="width: 265px;margin-left: 0px"
              dense
              standout="bg-blue-6 text-white"
              v-model="search"
              input-class="text-right"
              class="q-ml-md"
              label-color="primary"
            >
              <template v-slot:append>
                <q-icon v-if="search === ''" name="search" />
                <q-icon v-else name="clear" class="cursor-pointer" @click="search = ''" />
              </template>
            </q-input>
          </div>
          <q-tree
            :nodes="simple"
            node-key="label"
            selected-color="primary"
            :selected.sync="selected"
            default-expand-all
          />
        </div>
      </template>

      <template v-slot:after>
        <div class="q-pa-md">
          <q-table
            :dense="$q.screen.lt.md"
            title="Treats"
            :data="data"
            :columns="columns"
            row-key="name"
          />
        </div>
      </template>
    </q-splitter>
  </div>
</template>
