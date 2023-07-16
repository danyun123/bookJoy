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

router.beforeEach((to) => {
	const token = localStorage.getItem("token");
	if (token) {
		// 检查 token 是否存在并且是否有效
		const parts = token.split(".");
		if (parts.length >= 2) {
			// 检查 base64 编码的字符串是否正确
			const payloadEncoded = parts[1];
			if (payloadEncoded.length % 4 === 0 && /^[\w+/=]+$/.test(payloadEncoded)) {
				// 解析 token 中的 payload 部分
				const payload = JSON.parse(atob(payloadEncoded));
				// 检查 token 是否过期
				if (payload.exp * 1000 < Date.now()) {
					localStorage.removeItem("token");
				}
			} else {
				// console.error("Invalid token: not a valid base64 string");
			}
		} else {
			console.error("Invalid token: not enough parts");
		}
	}

	// 下面的逻辑没有改变...
	if (to.path.startsWith("/login") && !token) return true;
	if (!token) return "/login";
	if (to.path.startsWith("/home") && !token) {
		return "/login";
	}
	if (to.path.startsWith("/login") && token) return false;
});
export default router;
