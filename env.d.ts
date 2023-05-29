/// <reference types="vite/client" />

interface Window {
	webkitIndexedDB?: IDBFactory;
	mozIndexedDB?: IDBFactory;
}
