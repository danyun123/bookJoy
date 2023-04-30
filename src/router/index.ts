import { createRouter, createWebHashHistory } from "vue-router";

const router = createRouter({
	history: createWebHashHistory(),
	routes: [
		{
			path: "/",
			redirect: "/home"
		},
		{
			path: "/home",
			component: () => import("@/pages/home/index.vue")
		},
		{
			path: "/books/:category",
			component: () => import("@/pages/books/index.vue"),
			children: [
				{
					path: ":filename",
					component: () => import("@/pages/books/index.vue"),
				}
			]
		},
		{
			path: "/:pathMatch(.*)*",
			component: () => import("@/pages/404/index.vue")
		},
	]
});

export default router;