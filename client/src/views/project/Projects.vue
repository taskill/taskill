<template>
  <div class="projects">
    <div class="projects__header text-right">
      <router-link to="/projects/new">
        <el-button type="success">
          Add Project
        </el-button>
      </router-link>
    </div>
    <div class="project__list">
      <el-table
        :data="projects"
        size="small"
      >
        <el-table-column type="index" />
        <el-table-column
          prop="title"
          title="Title"
        >
          <template slot-scope="scope">
            <span style="margin-right: 10px;">
              <router-link :to="`${scope.row.ownerUserName}/${scope.row.slug}`">
                {{ scope.row.title }}
              </router-link>
            </span>
            <el-tag
              v-if="scope.row.owner === user._id"
              size="mini"
              type="success"
            >
              owner
            </el-tag>
            <el-tag
              v-else
              size="mini"
            >
              member
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          width="80"
          prop="key"
          label="Key"
        />
        <el-table-column
          prop="summary"
          label="Summary"
        />
        <el-table-column
          width="100"
          align="center"
          prop="favorite"
          label="Favorite"
        >
          <template slot-scope="scope">
            <div class="favorite">
              <div
                class="favorite-toggle"
                @click="toggleFavorite(scope.row)"
              >
                <svg-icon
                  v-if="scope.row.favorite"
                  name="star"
                />
                <svg-icon
                  v-else
                  name="star-o"
                />
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="createdAt"
          label="Date"
          width="120"
        >
          <template slot-scope="scope">
            {{ new Date(scope.row.createdAt).toLocaleDateString() }}
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { Table, TableColumn, Tag, Button } from 'element-ui'
import { SvgIcon } from '@/components/ui/'
import { mapGetters } from 'vuex'

export default {
  name: 'Projects',

  components: {
    ElTable: Table,
    ElTableColumn: TableColumn,
    ElTag: Tag,
    ElButton: Button,
    SvgIcon
  },

  async asyncData ({ store }) {
    await store.dispatch('getProjects')
  },

  data () {
    return {

    }
  },

  computed: {
    ...mapGetters(['user', 'projects'])
  },

  methods: {
    toggleFavorite (project) {
      const id = project._id
      const body = {
        value: project.favorite = !project.favorite
      }
      this.$store.dispatch('toggleProjectFavorite', { id, body })
    }
  }

}
</script>

<style lang="scss">
.projects {
  &__header {
    margin-bottom: 10px;
  }
}
.favorite {
  display: flex;
  align-items: center;
  justify-content: center;
  svg {
    fill: $color-text;
    width: 14px;
    position: relative;
    top: -2px;
  }
}
</style>
