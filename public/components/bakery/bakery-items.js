/**
 * Bakery 3D items configuration
 *
 * 每项可选字段：
 *   src        - 3D 模型路径（必填）
 *   name       - 显示名称（必填）
 *   poster     - 可选。3D 加载前显示的占位图 URL
 *   thumbnail  - 可选。卡片上只显示这张图（不预加载 3D），点击后在弹窗里加载 3D
 *   scale      - 可选。模型缩放，如 "0.8 0.8 0.8" 表示 80%
 *   默认视角（可选）：
 *   cameraOrbit      - 默认 "45deg 75deg 2.5m"（水平角 俯仰角 距离）
 *   minCameraOrbit   - 卡片/弹窗最小轨道，如 "auto auto 1.5m"
 *   maxCameraOrbit   - 卡片/弹窗最大轨道，如 "auto auto 4m"
 *   modalMinCameraOrbit / modalMaxCameraOrbit - 仅弹窗的 min/max
 *
 * 添加新项：把 .glb 放到 assets/bakery/，运行 npm run compress-models，再在下面加一行。
 */

export const bakeryItems = [
  { src: 'assets/bakery/compressed/item1.glb', name: 'Bakery Item 1', thumbnail: '/assets/bakery/thumbs/item1.png' },
  { src: 'assets/bakery/compressed/item2.glb', name: 'Bakery Item 2', thumbnail: '/assets/bakery/thumbs/item2.png' },
  { src: 'assets/bakery/compressed/item3.glb', name: 'Bakery Item 3', thumbnail: '/assets/bakery/thumbs/item3.png' },
  { src: 'assets/bakery/compressed/item4.glb', name: 'Bakery Item 4', thumbnail: '/assets/bakery/thumbs/item4.png' },
  { src: 'assets/bakery/compressed/item5.glb', name: 'Bakery Item 5', thumbnail: '/assets/bakery/thumbs/item5.png' },
  { src: 'assets/bakery/compressed/item6.glb', name: 'Bakery Item 6', thumbnail: '/assets/bakery/thumbs/item6.png' },
  { src: 'assets/bakery/compressed/item7.glb', name: 'Bakery Item 7', thumbnail: '/assets/bakery/thumbs/item7.png' },
  { src: 'assets/bakery/compressed/item8.glb', name: 'Bakery Item 8', thumbnail: '/assets/bakery/thumbs/item8.png' },
  { src: 'assets/bakery/compressed/item9.glb', name: 'Bakery Item 9', thumbnail: '/assets/bakery/thumbs/item9.png' },
  { src: 'assets/bakery/compressed/item10.glb', name: 'Bakery Item 10', thumbnail: '/assets/bakery/thumbs/item10.png' },
  { src: 'assets/bakery/compressed/item11.glb', name: 'Bakery Item 11', thumbnail: '/assets/bakery/thumbs/item11.png', cameraOrbit: '15deg 62deg 2m' },
  { src: 'assets/bakery/compressed/item12.glb', name: 'Bakery Item 12', thumbnail: '/assets/bakery/thumbs/item12.png' },
  { src: 'assets/bakery/compressed/item13.glb', name: 'Bakery Item 13', thumbnail: '/assets/bakery/thumbs/item13.png' },
  { src: 'assets/bakery/compressed/item14.glb', name: 'Bakery Item 14', thumbnail: '/assets/bakery/thumbs/item14.png' },
  { src: 'assets/bakery/compressed/2e2d49493a6aa69b9e02d6cc9a921dde.glb', name: 'Bakery Item 15', thumbnail: '/assets/bakery/thumbs/2e2d49493a6aa69b9e02d6cc9a921dde.png', scale: '0.8 0.8 0.8' },
  { src: 'assets/bakery/compressed/5d9d6cad4f3f810623385845d6352d90.glb', name: 'Bakery Item 16', thumbnail: '/assets/bakery/thumbs/5d9d6cad4f3f810623385845d6352d90.png' },
  { src: 'assets/bakery/compressed/7eda1ac5f5c2538c300f095be5e80175.glb', name: 'Bakery Item 17', thumbnail: '/assets/bakery/thumbs/7eda1ac5f5c2538c300f095be5e80175.png' },
  { src: 'assets/bakery/compressed/f3294edf7b7429a03690b9e52f373567_1.glb', name: 'Bakery Item 18', thumbnail: '/assets/bakery/thumbs/f3294edf7b7429a03690b9e52f373567_1.png' },
  { src: 'assets/bakery/compressed/529f87fb53b72ab4695d0363cc19d786.glb', name: 'Bakery Item 19', thumbnail: '/assets/bakery/thumbs/529f87fb53b72ab4695d0363cc19d786.png' },
  { src: 'assets/bakery/compressed/6354e9888fc58f0c13dd2175b2eddeb6.glb', name: 'Bakery Item 20', thumbnail: '/assets/bakery/thumbs/6354e9888fc58f0c13dd2175b2eddeb6.png' },
  { src: 'assets/bakery/compressed/b3e5fa32173a4c876c45d467f1a83f68.glb', name: 'Bakery Item 21', thumbnail: '/assets/bakery/thumbs/b3e5fa32173a4c876c45d467f1a83f68.png' },
  { src: 'assets/bakery/compressed/e048003948f1b257b9b4c3b5412d8610.glb', name: 'Bakery Item 22', thumbnail: '/assets/bakery/thumbs/e048003948f1b257b9b4c3b5412d8610.png' },
  { src: 'assets/bakery/compressed/76dacfdc1335b714e8fa3567b7ebe807.glb', name: 'Bakery Item 23', thumbnail: '/assets/bakery/thumbs/76dacfdc1335b714e8fa3567b7ebe807.png' },
  { src: 'assets/bakery/compressed/4761612911167ec585e38971478786b7.glb', name: 'Bakery Item 24', thumbnail: '/assets/bakery/thumbs/4761612911167ec585e38971478786b7.png' },
  { src: 'assets/bakery/compressed/dd0222d0309f35e489440660ef9170b9.glb', name: 'Bakery Item 25', thumbnail: '/assets/bakery/thumbs/dd0222d0309f35e489440660ef9170b9.png' },
];
