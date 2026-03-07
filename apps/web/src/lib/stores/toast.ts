import { writable } from 'svelte/store';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
	id: string;
	type: ToastType;
	title: string;
	message?: string;
	duration?: number;
	action?: {
		label: string;
		onClick: () => void;
	};
}

function createToastStore() {
	const { subscribe, update } = writable<Toast[]>([]);

	function addToast(toast: Omit<Toast, 'id'>): string {
		const id = crypto.randomUUID();
		const newToast: Toast = {
			...toast,
			id,
			duration: toast.duration ?? 5000
		};

		update((toasts) => [...toasts, newToast]);

		if (newToast.duration && newToast.duration > 0) {
			setTimeout(() => {
				removeToast(id);
			}, newToast.duration);
		}

		return id;
	}

	function removeToast(id: string) {
		update((toasts) => toasts.filter((t) => t.id !== id));
	}

	function clearAll() {
		update(() => []);
	}

	return {
		subscribe,
		add: addToast,
		remove: removeToast,
		clear: clearAll,
		success: (title: string, message?: string) =>
			addToast({ type: 'success', title, message }),
		error: (title: string, message?: string) =>
			addToast({ type: 'error', title, message }),
		warning: (title: string, message?: string) =>
			addToast({ type: 'warning', title, message }),
		info: (title: string, message?: string) =>
			addToast({ type: 'info', title, message })
	};
}

export const toasts = createToastStore();
