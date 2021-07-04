<!-- 
	附件卡片
	author yjl
 -->
<template>
	<div class="file-card">
		<header>
			<!-- 附件名，如果已购买或可预览，则有hover动画 -->
			<div 
				class="name"
				:class="file.isBuy || file.previewUrl ? 'hover-active' : ''"
				@click="onclickReadFile">
				{{file.name}}
			</div>
			<span 
				class="status"
				:style="{
					'background-color': obj_fileStatus.bgColor
				}">
				{{obj_fileStatus.label}}
			</span>
		</header>
		<footer>
			<div style="color: var(--gray1);">{{type}}</div>
			<div class="score">
				<el-rate
					v-model="file.score"
					disabled
					show-score
					text-color="#ff9900"
					score-template="{value}">
				</el-rate>
			</div>
			<!-- 购买按键 -->
			<el-button 
				v-if="!file.isBuy" 
				size="mini" 
				type="primary"
				round
				@click="onclickBuy">
				{{file.price}}Aha点购买
			</el-button>
		</footer>
	</div>
</template>

<script>
import { postOrder,putOrder } from "@/api/api_order.js"
export default{
	props: {
		file: {
			type: Object,
			default: () => {}
		}
	},
	data() {
		return {
			type: "成功展示",
			buyed: false
		}
	},
	computed: {
		obj_fileStatus() {
			this.buyed
			if(this.file.isBuy) {
				return {
					label: "已购买",
					bgColor: "var(--green)"
				}
			}
			if(this.file.previewUrl) {
				return {
					label: "可预览",
					bgColor: "var(--origin1)"
				}
			}
			return {
				label: "不可预览",
				bgColor: "var(--gray2)"
			}
		}
	},
	created() {
		this.type = this.gData.garr_fileClassify.find(item => item.value === this.file.typeId).label
	},
	methods:{
		/**
		 * 点击阅读文件，判断是否已购买，是否可预览
		 */
		onclickReadFile()
		{
			if(this.file.isBuy) {
				this.$router.push(`/project/file/${this.file.id}`)
			}
		},
		/**
		 * 点击购买
		 */
		onclickBuy()
		{
			/* 查询个人余额 */
			const balance = this.gData.gUserInfo.ahaPoint + this.gData.gUserInfo.ahaCredit
			if(balance < this.file.price) {
				this.gConfirm("余额不足，请前往小程序充值！")
			}
			else {
				this.gConfirm(`确认支付${this.file.price}Aha点购买？您当前余额为: ${balance}`,async () => {
					this.gShowLoading()
					try {
						const orderId = 	(await postOrder({
											projectId: this.file.projectId,
											resourceIds: [this.file.id]
										})).data
						/* 支付 */
						await putOrder(orderId,"pay")
						this.gShowSucess("购买成功")
						this.$emit("payFile")
						this.buyed = true
					} catch(err) {
						console.log(err);
					}
					this.gHideLoading()
				})
			}
		}
	}
}
</script>

<style lang="stylus" scoped>
.file-card
	border-radius 8px
	box-shadow var(--shadow1)
	overflow hidden
	user-select none
	header
		background-color #f0f0f0
		display flex
		.name
			flex 1
			padding 5px 10px
			&.hover-active:hover
				cursor pointer
				color var(--origin2)
				text-decoration underline
		.status
			padding 0 10px
			font-size 14px
			color #FFFFFF
			display flex
			align-items center
	footer
		padding 10px
		display flex
		align-items center
		.score
			margin 0 10px
			flex 1
</style>
