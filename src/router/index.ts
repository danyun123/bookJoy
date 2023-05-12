import { createRouter, createWebHashHistory } from "vue-router";
import { localCache } from "@/utils/cache";

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
		}
	]
});

//导航守卫
//to(跳转到得位置)，from（从哪里跳转过来）
//返回值：返回值决定导航的路径（不返回或者返回undefined，默认跳转）
//例子：/=>/mian:to:/,from:/main
router.beforeEach((to, from) => {
	//只有登录成功（token）,才能进入到main页面
	const token = localCache.getCache("token");
	if (to.path.startsWith("/home") && !token) {
		return "/login";
	}
});
export default router;
