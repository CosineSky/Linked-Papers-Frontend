<template>
	<div ref="graphContainer" style="width: 100%; height: 650px;"></div>
</template>

<script>
import { ref, onMounted, watch } from 'vue';
import { Network } from 'vis-network/peer';
import {router} from "../router";

export default {
	props: ['papers'],
	setup(props) {
		const graphContainer = ref(null);
		
		// 观察 props.papers 是否更新
		watch(() => props.papers, (newPapers) => {
			if (newPapers.length > 0) {
				initializeGraph(newPapers);
			}
		}, { immediate: true });
		
		const initializeGraph = (papersData) => {
			if (graphContainer.value && papersData.length > 0) {
				const nodes = papersData.map((paper) => ({
					id: paper.id,
					label: paper.title,
					title: paper.abstract,
				}));
				
				const edges = [];
				// papersData.forEach((paper) => {
				// 	paper.connections.forEach((connectedId) => {
				// 		edges.push({ from: paper.id, to: connectedId });
				// 	});
				// });
				for (let i = 0; i < papersData.length; i++) {
					for (let j = i + 1; j < papersData.length; j++) {
						edges.push({ from: papersData[i].id, to: papersData[j].id });
					}
				}
				
				const data = {
					nodes: nodes,
					edges: edges,
				};
				
				const options = {
					nodes: {
						shape: 'box',
						widthConstraint: {
							maximum: 200, // 限制最大宽度
						},
						font: {
							size: 14, // 字体大小
							face: 'consolas', // 字体
							align: 'center', // 标签居中
						},
					},

					physics: {
						enabled: true, // 开启物理引擎
						barnesHut: {
							gravitationalConstant: -500, // 引力常数，调整节点间的吸引力
							springLength: 666, // 弹簧长度，控制节点之间的间距
							springConstant: 0.04, // 弹簧常数，控制节点的弹性
						},
						solver: 'barnesHut', // 使用 barnesHut 算法来模拟物理
						timestep: 0.5, // 更新步长，影响节点的分散速度
					},
				};
				
				const network = new Network(graphContainer.value, data, options);
				
				network.on('click', function (event) {
					const { nodes, edges } = event;
					if (nodes.length > 0) {
						const nodeId = nodes[0];  // 获取点击的节点ID
						console.log('Clicked node ID:', nodeId);
						router.push("/paperDetail/" + nodeId)
					}
				});
				
				
			}
		};
		
		return { graphContainer };
	},
};
</script>
