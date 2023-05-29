import { createRouter, createWebHashHistory } from "vue-router";

const router = createRouter({
	history: createWebHashHistory(),
	routes: [
		{
			path: "/",
			redirect: "/home",
			meta: {
				hideTabbar: false
			}
		},
		{
			path: "/home",
			component: () => import("@/pages/home/index.vue"),
			meta: {
				hideTabbar: false
			},
			children: [
				{
					path: "search",
					component: () => import("@/pages/home/components/search_detail/index.vue"),
					meta: {
						hideTabbar: true
					}
				}
			]
		},
		{
			path: "/books/:category",
			component: () => import("@/pages/books/index.vue"),
			meta: {
				hideTabbar: true
			},
			children: [
				{
					path: ":filename",
					component: () => import("@/pages/books/index.vue"),
					meta: {
						hideTabbar: true
					}
				}
			]
		},
		{
			path: "/:pathMatch(.*)*",
			component: () => import("@/pages/404/index.vue"),
			meta: {
				hideTabbar: true
			}
		},
		{
			path: "/sortBook/:name",
			component: () => import("@/pages/all_slot_book/index.vue"),
			meta: {
				hideTabbar: true
			}
		},
		{
			path: "/bookDetail/:id",
			component: () => import("@/components/book_detail/index.vue"),
			meta: {
				hideTabbar: true
			}
		},
		{
			path: "/bookshelf",
			component: () => import("@/pages/bookshelf/index.vue"),
			meta: {
				hideTabbar: false
			}
		},
		{
			path: "/own",
			component: () => import("@/pages/own/index.vue"),
			meta: {
				hideTabbar: false
			}
		},
		{
			path: "/login",
			component: () => import("@/pages/login/index.vue"),
			meta: {
				hideTabbar: true
			}
		},
		{
			path: "/test",
			component: () => import("@/baseUI/bookmark/index.vue")
		}
	]
});

// router.beforeEach((to) => {
// 	const token = localCache.getCache("token");
// 	if (to.path.startsWith("/home") && !token) {
// 		return "/login";
// 	}
// 	if (to.path.startsWith("/login") && token) return false;
// });
export default router;
