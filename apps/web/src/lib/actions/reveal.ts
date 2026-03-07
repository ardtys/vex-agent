export function reveal(node: HTMLElement, options: { delay?: number; threshold?: number } = {}) {
	const { delay = 0, threshold = 0.1 } = options;

	// Add initial styles
	node.style.opacity = '0';
	node.style.transform = 'translateY(24px)';
	node.style.transition = `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`;

	const observer = new IntersectionObserver(
		(entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					node.style.opacity = '1';
					node.style.transform = 'translateY(0)';
					observer.unobserve(node);
				}
			});
		},
		{ threshold }
	);

	observer.observe(node);

	return {
		destroy() {
			observer.disconnect();
		}
	};
}

export function stagger(node: HTMLElement, options: { staggerDelay?: number; baseDelay?: number } = {}) {
	const { staggerDelay = 100, baseDelay = 0 } = options;
	const children = Array.from(node.children) as HTMLElement[];

	children.forEach((child, index) => {
		child.style.opacity = '0';
		child.style.transform = 'translateY(24px)';
		child.style.transition = `opacity 0.6s ease ${baseDelay + index * staggerDelay}ms, transform 0.6s ease ${baseDelay + index * staggerDelay}ms`;
	});

	const observer = new IntersectionObserver(
		(entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					children.forEach((child) => {
						child.style.opacity = '1';
						child.style.transform = 'translateY(0)';
					});
					observer.unobserve(node);
				}
			});
		},
		{ threshold: 0.1 }
	);

	observer.observe(node);

	return {
		destroy() {
			observer.disconnect();
		}
	};
}
