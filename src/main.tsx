
// Diwali Theme Toggle
const isDiwaliMode = true; // Set to false after Diwali
if (isDiwaliMode) {
	document.body.classList.add('diwali-mode');
	const script = document.createElement('script');
	script.src = '/diwali-theme/diwali-theme.js';
	script.defer = true;
	document.head.appendChild(script);
}

createRoot(document.getElementById("root")!).render(<App />);
