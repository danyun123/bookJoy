import { defineStore } from "pinia";
import { getBookList, getHomeData } from "@/service/home";

interface bookListType {
	Biomedicine: any[];
	BusinessandManagement: any[];
	ComputerScience: any[];
	EarthSciences: any[];
	Economics: any[];
	Education: any[];
	Engineering: any[];
	Environment: any[];
	Geography: any[];
	History: any[];
	Laws: any[];
	LifeSciences: any[];
	Literature: any[];
	MaterialsScience: any[];
	Mathematics: any[];
	MedicineAndPublicHealth: any[];
	Philosophy: any[];
	Physics: any[];
	Psychology: any[];
	SocialSciences: any[];
	Statistics: any[];
	PoliticalScienceAndInternationalRelations: any[];
}

const useHome = defineStore("home", {
	state: () => ({
		hideHead: false,
		search_history: [] as string[],
		homeData: {},
		bookList: {} as bookListType,
		insideSearch: false,
		homeScrollTop: 0 as number
	}),
	actions: {
		async fetchHomeData() {
			const data = await getHomeData();
			this.homeData = data.data;
		},
		async fetchBookList() {
			const data = await getBookList();
			this.bookList = data.data;
		}
	}
});
export default useHome;
