import { createRouter, createWebHashHistory } from "vue-router";

const router = createRouter({
	history: createWebHashHistory(),
	routes: [
		{
			path: "/",
			redirect: "/home",
			meta: {
				displayTabbar: true
			}
		},
		{
			path: "/home",
			component: () => import("@/pages/home/index.vue"),
			meta: {
				displayTabbar: true
			},
			children: [
				{
					path: "search",
					component: () => import("@/pages/home/components/search_detail/index.vue"),
					meta: {
						displayTabbar: false
					}
				}
			]
		},
		{
			path: "/books/:category",
			component: () => import("@/pages/books/index.vue"),
			meta: {
				displayTabbar: false
			},
			children: [
				{
					path: ":filename",
					component: () => import("@/pages/books/index.vue"),
					meta: {
						displayTabbar: false
					}
				}
			]
		},
		{
			path: "/:pathMatch(.*)*",
			component: () => import("@/pages/404/index.vue"),
			meta: {
				displayTabbar: false
			}
		},
		{
			path: "/sortBook/:name",
			component: () => import("@/pages/all_slot_book/index.vue"),
			meta: {
				displayTabbar: false
			}
		},
		{
			path: "/bookDetail/:id",
			component: () => import("@/components/book_detail/index.vue"),
			meta: {
				displayTabbar: false
			}
		},
		{
			path: "/bookshelf",
			component: () => import("@/pages/bookshelf/index.vue"),
			meta: {
				displayTabbar: true
			}
		},
		{
			path: "/bookListen/:id",
			name: "bookListen",
			component: () => import("@/pages/listen_book/index.vue"),
			meta: {
				displayTabbar: false
			}
		},
		{
			path: "/own",
			component: () => import("@/pages/own/index.vue"),
			meta: {
				displayTabbar: true
			}
		},
		{
			path: "/login",
			component: () => import("@/pages/login/index.vue"),
			meta: {
				displayTabbar: false
			}
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
