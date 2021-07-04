<!-- 
	项目简介卡片
	author yjl
 -->
<template>
	<el-container class="project-card">
		<el-aside width="70px">
			<avatar :src="project.avatarUrl" size="50"></avatar>
			<!-- 获奖图标 -->
			<img class="medal" :src="`https://aha-public-1257019972.cos.ap-shanghai.myqcloud.com/icon/media/${project.awardLevel}.png`">
		</el-aside>
		<el-main>
			<h3>
				<router-link :to="`/project/${project.id}`">{{project.name}}</router-link>
				<div class="line"></div>
			</h3>
			<!-- 标签 -->
			<div class="tags">
				<aha-tags
					bgColor="var(--origin4)"
					Color="var(--font2)"
					:tags="project.tags | splitTags">
				</aha-tags>
			</div>
			<!-- 获奖 -->
			<footer v-if="project.awardLevel">
				<div class="prize">
					{{project.awardTime}},{{compName}},<strong>{{awardLevel}}</strong>
				</div>
				<div class="data">
					<i class="iconfont icon-eye"></i>
					<span>{{project.read}}</span>
					<i class="el-icon-star-off"></i>
					<span>{{project.collect}}</span>
				</div>
			</footer>
		</el-main>
	</el-container>
</template>

<script>
export default{
	props: {
		project: {
			type: Object,
			required: true
		},
		readed: {
			type: Boolean,
			default: false
		}
	},
	computed: {
		compName() {
			const comp = this.gData.garr_competitions.find(item => item.id === this.project.compId)
			if(comp) {
				return comp.name
			}
			return ""
		},
		awardLevel() {
			const level = this.gData.garr_prizeLevels.find(item => item.value === this.project.awardLevel)
			if(level) {
				return level.label
			}
			return ""
		}
	}
}
</script>

<style lang="stylus" scoped>
.project-card
	padding 10px 5px
	border-bottom var(--border1)
	&:hover
		background-color var(--white1)
	.medal
		margin-top 5px
		width 50px
	.el-main
		padding 0
		h3
			position relative
			margin-bottom 10px
			display inline-block
			&:hover
				color var(--origin1)
				.line
					width 100%
			.line
				position absolute
				left 50%
				transform translateX(-50%)
				height 2px
				width 0
				background-color var(--origin1)
				transition var(--hover-transition)
		footer
			display flex
			justify-content space-between
			.prize
				font-size 14px
			.data
				font-size 12px
				color var(--gray2)
				i
					margin-right 3px
				span
					margin-right 5px
</style>
